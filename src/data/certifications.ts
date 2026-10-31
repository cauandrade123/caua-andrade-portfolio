import { certificationsSchema } from "@/types";

// Cada certificação pode ser ligada ou desligada no site com `show` (padrão: true).
export const certifications = certificationsSchema.parse([
  {
    id: "azure-ai-900",
    title: "Microsoft Azure AI Fundamentals",
    // Texto escolhido pelo usuário em 31/10/2026 (volta a versão longa; a curta da segunda crítica está em
    // docs/design/alternatives.md).
    description:
      "Certificação que valida o conhecimento em conceitos fundamentais de inteligência artificial e machine learning na plataforma Azure. Abrange serviços cognitivos, visão computacional, processamento de linguagem natural e princípios de IA responsável.",
    issuer: "Microsoft",
    year: 2026,
    credentialId: "AI-900",
    badge: "azure-ai-900",
    domain: "Inteligência Artificial",
    credentialUrl:
      "https://learn.microsoft.com/api/credentials/share/pt-br/CauAndradeCond-4822/CF002D7D8DAF3171?sharingId=E7D20FD6D1254346",
  },
  // Informada pelo usuário em 27/10/2026: está estudando para a DP-900. Sem data de prova prevista.
  // Pré-cadastrada e escondida. Para aparecer no site, troque `show: false` por `show: true`.
  {
    id: "azure-dp-900",
    show: false,
    title: "Microsoft Azure Data Fundamentals",
    description:
      "Fundamentos de dados no Azure: dados relacionais e não relacionais, cargas de trabalho analíticas e os serviços de dados da plataforma.",
    issuer: "Microsoft",
    status: "in-progress",
    credentialId: "DP-900",
    domain: "Dados",
  },
]);
