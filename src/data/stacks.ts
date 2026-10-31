import { caseTechSchema, stacksSchema } from "@/types";

// Descrição só onde diz algo que o nome não diz (serviços usados, ferramenta de CI). `logo` quando existe
// logo livre (simple-icons/Devicon); senão, o ícone do lucide em `icon`.
export const stacks = stacksSchema.parse([
  {
    id: "back-end",
    title: "Back-end",
    items: [
      { name: "Node.js", logo: "nodedotjs", icon: "Server" },
      { name: "JavaScript", logo: "javascript", icon: "Code2" },
      // O logo do Express é só o nome escrito e não lê a 16 px: fica o ícone.
      { name: "Express", icon: "Workflow" },
      { name: "Python", logo: "python", icon: "Code2" },
      { name: "FastAPI", logo: "fastapi", icon: "Workflow" },
    ],
  },
  {
    id: "cloud-e-infra",
    title: "Cloud & Infra",
    items: [
      { name: "AWS", logo: "aws", icon: "Cloud", description: "Lambda, ECS, S3, RDS" },
      { name: "Azure", logo: "azure", icon: "Layers", description: "App Service, SQL, AI Foundry" },
      { name: "Docker", logo: "docker", icon: "Container" },
      { name: "CI/CD", logo: "githubactions", icon: "GitBranch", description: "GitHub Actions" },
    ],
  },
  {
    id: "banco-de-dados",
    title: "Banco de dados",
    items: [
      { name: "MySQL", logo: "mysql", icon: "Database" },
      { name: "PostgreSQL", logo: "postgresql", icon: "Database" },
      { name: "SQL Server", icon: "HardDrive" },
    ],
  },
  {
    id: "praticas",
    title: "Práticas",
    items: [
      { name: "Clean Code", icon: "Shield" },
      { name: "REST API", icon: "Workflow" },
      { name: "Git", logo: "git", icon: "GitBranch" },
    ],
  },
]);

// Pílulas dos cases que não estão na seção Stacks: sem isso, apareciam só com o nome, ao lado de outras com logo.
// Excel não tem logo livre (a Microsoft tirou as marcas do simple-icons) e RBAC é prática: ícone do lucide.
export const caseTech = caseTechSchema.parse([
  { name: "Electron", logo: "electron", icon: "Layers" },
  { name: "Puppeteer", logo: "puppeteer", icon: "Workflow" },
  { name: "JWT", logo: "jsonwebtokens", icon: "Shield" },
  { name: "Excel", icon: "FileSpreadsheet" },
  { name: "RBAC", icon: "Shield" },
]);
