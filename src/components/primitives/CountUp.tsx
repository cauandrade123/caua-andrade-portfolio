import { useCountUp } from "@/lib/use-count-up";

type CountUpProps = {
  value: number;
  /** Começa a contar quando vira verdadeiro. */
  start: boolean;
  className?: string;
};

/** Número que conta até o valor. O leitor de tela recebe só o valor final, sem os intermediários. */
export function CountUp({ value, start, className }: CountUpProps) {
  const current = useCountUp(value, { start });

  return (
    <span className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {current}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
