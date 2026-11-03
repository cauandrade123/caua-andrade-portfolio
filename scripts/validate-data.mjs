// Valida src/data contra os schemas zod: cada módulo de dados faz `.parse()` ao ser importado.
// O app ainda não importa esses módulos, então o `vite build` sozinho não os executaria.
// Uso: node scripts/validate-data.mjs [entrada]   (padrão: src/data/index.ts)
import { loadData } from "./load-data.mjs";

try {
  const data = await loadData(process.argv[2]);
  console.log(`Dados válidos: ${Object.keys(data).join(", ")}`);
} catch (error) {
  const detail = error?.issues ? JSON.stringify(error.issues, null, 2) : (error?.message ?? error);
  console.error(`Dados inválidos:\n${detail}`);
  process.exitCode = 1;
}
