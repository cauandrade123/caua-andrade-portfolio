// Valida src/data contra os schemas zod: cada módulo de dados faz `.parse()` ao ser importado.
// O app ainda não importa esses módulos, então o `vite build` sozinho não os executaria.
// Uso: node scripts/validate-data.mjs [entrada]   (padrão: src/data/index.ts)
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const entry = process.argv[2] ?? "src/data/index.ts";
const dir = await mkdtemp(join(tmpdir(), "validate-data-"));
const outfile = join(dir, "data.mjs");

try {
  await build({
    entryPoints: [entry],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile,
    logLevel: "silent",
    alias: { "@": "./src" },
  });
  const data = await import(pathToFileURL(outfile).href);
  console.log(`Dados válidos: ${Object.keys(data).join(", ")}`);
} catch (error) {
  const detail = error?.issues ? JSON.stringify(error.issues, null, 2) : (error?.message ?? error);
  console.error(`Dados inválidos:\n${detail}`);
  process.exitCode = 1;
} finally {
  await rm(dir, { recursive: true, force: true });
}
