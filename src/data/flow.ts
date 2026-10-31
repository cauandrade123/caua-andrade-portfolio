import { flowSchema } from "@/types";

// Diagrama da seção Stacks (até o R8 ficava na hero): o caminho de uma requisição, do cliente ao banco de dados.
export const flow = flowSchema.parse({
  nodes: [
    { id: "cliente", label: "Cliente", caption: "Navegador", desktop: { x: 10, y: 62 }, mobile: { x: 93, y: 12 } },
    { id: "gateway", label: "API Gateway", caption: "Autenticação JWT", desktop: { x: 36, y: 38 }, mobile: { x: 90, y: 38 } },
    { id: "servico", label: "Serviço", caption: "Node.js", desktop: { x: 63, y: 66 }, mobile: { x: 94, y: 64 } },
    { id: "banco", label: "Banco de dados", caption: "SQL", desktop: { x: 90, y: 40 }, mobile: { x: 91, y: 88 } },
  ],
  links: [
    { from: "cliente", to: "gateway" },
    { from: "gateway", to: "servico" },
    { from: "servico", to: "banco" },
  ],
});
