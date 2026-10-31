import { caseTech, stacks } from "@/data";
import type { StackItem } from "@/types";

const byName = new Map([...stacks.flatMap((category) => category.items), ...caseTech].map((item) => [item.name, item]));

/** Tecnologia pelo nome (seção Stacks ou `caseTech`), para reaproveitar logo e ícone. `undefined` quando não existe. */
export function findStackItem(name: string): StackItem | undefined {
  return byName.get(name);
}
