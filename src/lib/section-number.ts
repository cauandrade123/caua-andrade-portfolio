import { nav } from "@/data";

const order = [...nav.map((item) => item.href.slice(1)), "contact"];

/** Número de exibição da seção ("01", "02"...), derivado da ordem do menu. */
export function sectionNumber(id: string) {
  const position = order.indexOf(id);
  return position === -1 ? undefined : String(position + 1).padStart(2, "0");
}
