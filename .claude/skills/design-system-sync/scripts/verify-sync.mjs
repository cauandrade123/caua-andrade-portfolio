// Confere se os blocos :root e .dark de um CSS correspondem aos tokens de cor do JSON
// (tolerância de 1/255 por canal, por causa do arredondamento HSL).
// Uso: node verify-sync.mjs <tokens.json> <index.css>
import { readFile } from "node:fs/promises";

const [tokensFile, cssFile] = process.argv.slice(2);
if (!tokensFile || !cssFile) {
  console.error("Uso: node verify-sync.mjs <tokens.json> <index.css>");
  process.exit(1);
}

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

function hexToRgb(hex) {
  let digits = hex.replace("#", "");
  if (digits.length === 3) digits = [...digits].map((digit) => digit + digit).join("");
  return [0, 2, 4].map((index) => parseInt(digits.slice(index, index + 2), 16));
}

function hslToRgb(h, s, l) {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lightness - chroma / 2;
  const [r, g, b] = [[chroma, x, 0], [x, chroma, 0], [0, chroma, x], [0, x, chroma], [x, 0, chroma], [chroma, 0, x]][Math.floor((h % 360) / 60)];
  return [r + m, g + m, b + m].map((channel) => Math.round(channel * 255));
}

function block(css, selector) {
  const match = css.match(new RegExp(`${selector.replace(".", "\\.")}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`bloco ${selector} não encontrado em ${cssFile}`);
  return Object.fromEntries(
    [...match[1].matchAll(/--([a-z0-9-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*;/g)].map(([, name, h, s, l]) => [name, hslToRgb(+h, +s, +l)]),
  );
}

const read = async (file) => (await readFile(file, "utf8")).replace(/^﻿/, "");
const tokens = JSON.parse(await read(tokensFile));
const css = await read(cssFile);

let failures = 0;
let checked = 0;
try {
  for (const [theme, selector] of [["light", ":root"], ["dark", ".dark"]]) {
    const actual = block(css, selector);
    for (const [rawName, spec] of Object.entries({ ...tokens.colors, ...(tokens.scales ?? {}) })) {
      const name = kebab(rawName);
      const expected = hexToRgb(typeof spec === "string" ? spec : spec[theme]);
      const found = actual[name];
      checked += 1;
      if (!found) {
        failures += 1;
        console.log(`FALHA ${theme} --${name}: ausente em ${selector}`);
      } else if (found.some((channel, index) => Math.abs(channel - expected[index]) > 1)) {
        failures += 1;
        console.log(`FALHA ${theme} --${name}: esperado rgb(${expected}), CSS gera rgb(${found})`);
      }
    }
  }
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
}

console.log(failures ? `${failures} divergência(s) em ${checked} tokens` : `CSS em sincronia com os tokens (${checked} verificados)`);
process.exitCode = failures ? 1 : 0;
