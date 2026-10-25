import { siDocker, siExpress, siJavascript, siMysql, siNodedotjs, type SimpleIcon } from "simple-icons";
import { cn } from "@/lib/utils";
import type { BrandName } from "@/types";

// Registro dos logos que os dados podem pedir pelo nome (mesmas chaves de BRAND_NAMES).
const registry: Record<BrandName, SimpleIcon> = {
  nodedotjs: siNodedotjs,
  javascript: siJavascript,
  express: siExpress,
  mysql: siMysql,
  docker: siDocker,
};

type BrandIconProps = {
  name: BrandName;
  className?: string;
};

/** Logo de marca em uma cor só (herda `currentColor`). Decorativo: o nome da tecnologia vai ao lado ou em `sr-only`. */
export function BrandIcon({ name, className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("fill-current", className)}>
      <path d={registry[name].path} />
    </svg>
  );
}
