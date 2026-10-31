// As exceções de `style` abaixo são MotionValues do framer-motion, que só entram pelo prop style.
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { flow } from "@/data";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type LayoutName = "desktop" | "mobile";
type Point = { x: number; y: number };
type PointerProps = { pointerX: MotionValue<number>; pointerY: MotionValue<number> };

const LAYOUTS: Record<LayoutName, { width: number; height: number }> = {
  desktop: { width: 1200, height: 300 },
  mobile: { width: 360, height: 720 },
};

const NODE = { width: 156, height: 58 };
const FAR = -10000;
const REACH = 320;

function linkPath(from: Point, to: Point, layout: LayoutName) {
  if (layout === "desktop") {
    const middle = (from.x + to.x) / 2;
    return `M ${from.x} ${from.y} C ${middle} ${from.y}, ${middle} ${to.y}, ${to.x} ${to.y}`;
  }
  const middle = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x} ${middle}, ${to.x} ${middle}, ${to.x} ${to.y}`;
}

/** 0 longe do ponto, 1 em cima dele. */
const nearness = (target: Point, radius: number) => ([px, py]: number[]) => Math.max(0, 1 - Math.hypot(px - target.x, py - target.y) / radius);

/** Deslocamento de até 8 unidades em direção ao cursor, em um eixo. */
const pullAlong = (target: Point, axis: "x" | "y") => ([px, py]: number[]) => {
  const dx = px - target.x;
  const dy = py - target.y;
  const distance = Math.hypot(dx, dy) || 1;
  const strength = Math.max(0, 1 - distance / REACH) * 8;
  return ((axis === "x" ? dx : dy) / distance) * strength;
};

type NodeShapeProps = PointerProps & {
  label: string;
  caption: string;
  position: Point;
  showLabels: boolean;
};

function NodeShape({ label, caption, position, showLabels, pointerX, pointerY }: NodeShapeProps) {
  const glow = useTransform([pointerX, pointerY], nearness(position, REACH));
  const x = useSpring(useTransform([pointerX, pointerY], pullAlong(position, "x")), { stiffness: 140, damping: 18 });
  const y = useSpring(useTransform([pointerX, pointerY], pullAlong(position, "y")), { stiffness: 140, damping: 18 });

  return (
    <g transform={`translate(${position.x} ${position.y})`}>
      {/* eslint-disable-next-line no-restricted-syntax -- MotionValue */}
      <motion.g style={{ x, y }}>
        {showLabels ? (
          <>
            <motion.rect
              x={-NODE.width / 2 - 6}
              y={-NODE.height / 2 - 6}
              width={NODE.width + 12}
              height={NODE.height + 12}
              rx={22}
              className="fill-none stroke-glow"
              // eslint-disable-next-line no-restricted-syntax -- MotionValue
              style={{ opacity: glow }}
            />
            <rect x={-NODE.width / 2} y={-NODE.height / 2} width={NODE.width} height={NODE.height} rx={16} className="fill-surface-raised stroke-primary-foreground/20" />
            <text x={0} y={-3} textAnchor="middle" className="fill-primary-foreground text-base font-medium">
              {label}
            </text>
            <text x={0} y={16} textAnchor="middle" className="fill-primary-foreground/60 text-sm">
              {caption}
            </text>
          </>
        ) : (
          <>
            {/* eslint-disable-next-line no-restricted-syntax -- MotionValue */}
            <motion.circle r={14} className="fill-none stroke-glow" style={{ opacity: glow }} />
            <circle r={8} className="fill-surface-raised stroke-primary-foreground/30" />
          </>
        )}
      </motion.g>
    </g>
  );
}

type LinkShapeProps = PointerProps & {
  id: string;
  d: string;
  middle: Point;
  index: number;
  animated: boolean;
};

function LinkShape({ id, d, middle, index, animated, pointerX, pointerY }: LinkShapeProps) {
  const near = useTransform([pointerX, pointerY], nearness(middle, REACH));
  const opacity = useTransform(near, [0, 1], [0.4, 1]);
  const duration = 3.6 + index * 0.6;

  return (
    <g>
      {/* eslint-disable-next-line no-restricted-syntax -- MotionValue */}
      <motion.path id={id} d={d} className="fill-none stroke-glow" strokeWidth={2} strokeLinecap="round" strokeDasharray="3 8" style={{ opacity }} />
      {animated
        ? [0, 1].map((packet) => (
            <g key={packet} opacity={0}>
              <circle r={9} className="fill-glow/20" />
              <circle r={3.5} className="fill-glow" />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.88;1"
                dur={`${duration}s`}
                begin={`${index * 0.9 + packet * (duration / 2)}s`}
                repeatCount="indefinite"
              />
              <animateMotion
                dur={`${duration}s`}
                begin={`${index * 0.9 + packet * (duration / 2)}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.4 0 0.2 1"
              >
                <mpath href={`#${id}`} />
              </animateMotion>
            </g>
          ))
        : null}
    </g>
  );
}

type GraphProps = PointerProps & {
  layout: LayoutName;
  running: boolean;
  animated: boolean;
};

function Graph({ layout, running, animated, pointerX, pointerY }: GraphProps) {
  const { width, height } = LAYOUTS[layout];
  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");

  const positions = new Map<string, Point>(
    flow.nodes.map((node) => [node.id, { x: (node[layout].x / 100) * width, y: (node[layout].y / 100) * height }]),
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !animated) return;
    if (running) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [running, animated]);

  return (
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full">
      {flow.links.map((link, index) => {
        const from = positions.get(link.from);
        const to = positions.get(link.to);
        if (!from || !to) return null;
        return (
          <LinkShape
            key={`${link.from}-${link.to}`}
            id={`${uid}-link-${index}`}
            d={linkPath(from, to, layout)}
            middle={{ x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }}
            index={index}
            animated={animated}
            pointerX={pointerX}
            pointerY={pointerY}
          />
        );
      })}
      {flow.nodes.map((node) => {
        const position = positions.get(node.id);
        if (!position) return null;
        return (
          <NodeShape
            key={node.id}
            label={node.label}
            caption={node.caption}
            position={position}
            showLabels={layout === "desktop"}
            pointerX={pointerX}
            pointerY={pointerY}
          />
        );
      })}
    </svg>
  );
}

type DataFlowProps = {
  className?: string;
};

/**
 * Diagrama decorativo do caminho de uma requisição (cliente, gateway, serviço, banco).
 * Pacotes percorrem as conexões e, com mouse, os nós se aproximam do cursor.
 * Fica parado com movimento reduzido e pausa quando sai da tela.
 */
export function DataFlow({ className }: DataFlowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const running = useInView(rootRef, { margin: "120px" });
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pointerX = useMotionValue(FAR);
  const pointerY = useMotionValue(FAR);
  const animated = !reduceMotion;

  useEffect(() => {
    const root = rootRef.current;
    const area = root?.parentElement;
    if (!root || !area || !animated || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (event: PointerEvent) => {
      const svg = root.querySelector("svg");
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scale = rect.width / svg.viewBox.baseVal.width;
      pointerX.set((event.clientX - rect.left) / scale);
      pointerY.set((event.clientY - rect.top) / scale);
    };
    const leave = () => {
      pointerX.set(FAR);
      pointerY.set(FAR);
    };

    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);
    return () => {
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
    };
  }, [animated, pointerX, pointerY]);

  return (
    <div ref={rootRef} aria-hidden="true" className={cn("pointer-events-none", className)}>
      <Graph layout={isDesktop ? "desktop" : "mobile"} running={running} animated={animated} pointerX={pointerX} pointerY={pointerY} />
    </div>
  );
}
