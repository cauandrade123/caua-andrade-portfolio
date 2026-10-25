import { stacksSchema } from "@/types";

export const stacks = stacksSchema.parse([
  {
    id: "back-end",
    title: "Back-end",
    items: [
      { name: "Node.js", icon: "Server", description: "Runtime JavaScript" },
      { name: "JavaScript", icon: "Code2", description: "Linguagem principal" },
      { name: "Express", icon: "Workflow", description: "Web framework" },
    ],
  },
  {
    id: "cloud-e-infra",
    title: "Cloud & Infra",
    items: [
      { name: "AWS", icon: "Cloud", description: "Lambda, ECS, S3, RDS" },
      { name: "Azure", icon: "Layers", description: "App Service, Azure SQL Database, Azure AI (Foundry)" },
      { name: "Docker", icon: "Container", description: "Containerização" },
      { name: "CI/CD", icon: "GitBranch", description: "GitHub Actions" },
    ],
  },
  {
    id: "banco-de-dados",
    title: "Banco de dados",
    items: [
      { name: "MySQL", icon: "Database", description: "Banco relacional" },
      { name: "SQL Server", icon: "HardDrive", description: "Banco da Microsoft" },
    ],
  },
  {
    id: "praticas",
    title: "Práticas",
    items: [
      { name: "Clean Code", icon: "Shield", description: "Código limpo" },
      { name: "REST API", icon: "Workflow", description: "Design de APIs" },
      { name: "Git", icon: "GitBranch", description: "Versionamento" },
    ],
  },
]);
