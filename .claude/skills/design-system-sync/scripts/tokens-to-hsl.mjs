// Converte tokens de cor (hex, rgb(), hsl()) em triplas HSL para src/index.css
// e em entradas de theme.extend.colors para tailwind.config.ts.
// Uso: node tokens-to-hsl.mjs <tokens.json> [--format css|tailwind|all]
// Formato do JSON de entrada: veja ../token-map.md
import { readFile } from "node:fs/promises";

const [file, ...flags] = process.argv.slice(2);
const formatFlag = flags.indexOf("--format");
const format = formatFlag === -1 ? "all" : flags[formatFlag + 1];

if (!file || !["css", "tailwind", "all"].includes(format)) {
  console.error("Uso: node tokens-to-hsl.mjs <tokens.json> [--format css|tailwind|all]");
  process.exit(1);
}

const round = (value) => String(Math.round(value * 10) / 10);
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

function rgbToHsl([r, g, b]) {
  const [red, green, blue] = [r, g, b].map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return [0, 0, lightness * 100];
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue;
  if (max === red) hue = ((green - blue) / delta) % 6;
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;
  return [(hue * 60 + 360) % 360, saturation * 100, lightness * 100];
}

function parseColor(input) {
  const value = String(input).trim().toLowerCase();

  const hex = value.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    let digits = hex[1];
    if (digits.length === 3 || digits.length === 4) digits = [...digits].map((digit) => digit + digit).join("");
    if (digits.length !== 6 && digits.length !== 8) throw new Error(`hex inválido: ${input}`);
    const [r, g, b] = [0, 2, 4].map((index) => parseInt(digits.slice(index, index + 2), 16));
    const alpha = digits.length === 8 ? parseInt(digits.slice(6, 8), 16) / 255 : 1;
    return { hsl: rgbToHsl([r, g, b]), alpha };
  }

  const fn = value.match(/^(rgb|hsl)a?\(([^)]+)\)$/);
  if (fn) {
    const parts = fn[2].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) throw new Error(`cor inválida: ${input}`);
    const numbers = parts.slice(0, 3).map((part) => parseFloat(part));
    if (numbers.some(Number.isNaN)) throw new Error(`cor inválida: ${input}`);
    const alpha = parts[3] === undefined ? 1 : parseFloat(parts[3]) / (parts[3].endsWith("%") ? 100 : 1);
    return { hsl: fn[1] === "rgb" ? rgbToHsl(numbers) : numbers, alpha };
  }

  throw new Error(`formato de cor não suportado: ${input}`);
}

function toTriple(name, theme, input) {
  const { hsl, alpha } = parseColor(input);
  if (alpha !== 1) console.error(`aviso: alpha de "${name}" (${theme}) ignorado; use opacidade na classe (ex.: bg-${kebab(name)}/10)`);
  const [h, s, l] = hsl;
  return `${round(h)} ${round(s)}% ${round(l)}%`;
}

let tokens;
try {
  // O PowerShell 5.1 grava UTF-8 com BOM; JSON.parse não aceita.
  tokens = JSON.parse((await readFile(file, "utf8")).replace(/^﻿/, ""));
} catch (error) {
  console.error(`Não foi possível ler ${file}: ${error.message}`);
  process.exit(1);
}

const light = {};
const dark = {};
try {
  for (const [rawName, spec] of Object.entries(tokens.colors ?? {})) {
    const name = kebab(rawName);
    const pair = typeof spec === "string" ? { light: spec, dark: spec } : spec;
    if (!pair.light) throw new Error(`token "${rawName}" sem valor "light"`);
    if (!pair.dark) console.error(`aviso: "${rawName}" sem valor "dark"; reutilizando o claro`);
    light[name] = toTriple(rawName, "light", pair.light);
    dark[name] = toTriple(rawName, "dark", pair.dark ?? pair.light);
  }
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
}

// Escalas (ex.: gray-50, blue-dark): mesmo formato, string única ou { light, dark }.
try {
  for (const [rawName, spec] of Object.entries(tokens.scales ?? {})) {
    const name = kebab(rawName);
    const pair = typeof spec === "string" ? { light: spec, dark: spec } : spec;
    light[name] = toTriple(rawName, "light", pair.light);
    dark[name] = toTriple(rawName, "dark", pair.dark ?? pair.light);
  }
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
}

const colorNames = new Set(Object.keys(tokens.colors ?? {}).map(kebab));

const block = (selector, vars, extra = []) =>
  [`${selector} {`, ...Object.entries(vars).map(([name, triple]) => `  --${name}: ${triple};`), ...extra, "}"].join("\n");

const output = [];

if (format === "css" || format === "all") {
  output.push("/* src/index.css (dentro de @layer base) */");
  output.push(block(":root", light, tokens.radius ? [`  --radius: ${tokens.radius};`] : []));
  output.push("");
  output.push(block(".dark", dark));
}

if (format === "tailwind" || format === "all") {
  const names = Object.keys(light).filter((name) => colorNames.has(name));
  const bases = new Set(names.filter((name) => names.includes(`${name}-foreground`)));
  const lines = names
    .filter((name) => !(name.endsWith("-foreground") && bases.has(name.slice(0, -"-foreground".length))))
    .map((name) =>
      bases.has(name)
        ? `${name}: { DEFAULT: "hsl(var(--${name}))", foreground: "hsl(var(--${name}-foreground))" },`
        : `"${name}": "hsl(var(--${name}))",`,
    );
  if (output.length) output.push("");
  output.push("// tailwind.config.ts (theme.extend.colors)");
  output.push(...lines);
}

console.log(output.join("\n"));
