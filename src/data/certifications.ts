import { certificationsSchema } from "@/types";

export const certifications = certificationsSchema.parse([
  {
    id: "azure-ai-900",
    title: "Microsoft Azure AI Fundamentals",
    description:
      "Certificação que valida o conhecimento em conceitos fundamentais de inteligência artificial e machine learning na plataforma Azure. Abrange serviços cognitivos, visão computacional, processamento de linguagem natural e princípios de IA responsável.",
    issuer: "Microsoft",
    year: 2026,
    credentialId: "AI-900",
    domain: "Inteligência Artificial",
    credentialUrl:
      "https://learn.microsoft.com/api/credentials/share/pt-br/CauAndradeCond-4822/CF002D7D8DAF3171?sharingId=E7D20FD6D1254346",
  },
]);
