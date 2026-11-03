// Carrega src/data no Node: o esbuild empacota o TypeScript (com o alias `@`) e cada módulo faz `.parse()` ao
// ser importado, então um dado inválido lança o erro do zod. Usado pelo validate-data e pelo seo-build.
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

export async function loadData(entry = "src/data/index.ts") {
  const dir = await mkdtemp(join(tmpdir(), "load-data-"));
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
    return await import(pathToFileURL(outfile).href);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
