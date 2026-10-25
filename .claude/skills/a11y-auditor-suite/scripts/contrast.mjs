// Calcula a razão de contraste WCAG dos pares de tokens (claro e escuro) e dos pares usados
// pelas seções, com as escalas gray-* e blue-* e texto semitransparente (ex.: branco a 70%).
// Texto precisa de ≥ 4,5:1; componentes de UI (anel de foco, borda de campo) de ≥ 3:1.
// Uso: node contrast.mjs <tokens.json>   (mesmo formato da skill design-system-sync)
import { readFile } from "node:fs/promises";

const file = process.argv[2];
if (!file) {
  console.error("Uso: node contrast.mjs <tokens.json>");
  process.exit(1);
}

const TEXT = 4.5;
const UI = 3;
const INFO = 0;

// [primeiro plano, fundo, mínimo, descrição]. Mínimo 0 = só informativo (filete decorativo).
const pairs = [
  ["foreground", "background", TEXT, "texto principal"],
  ["cardForeground", "card", TEXT, "texto em card"],
  ["popoverForeground", "popover", TEXT, "texto em popover"],
  ["secondaryForeground", "secondary", TEXT, "texto em superfície secundária"],
  ["mutedForeground", "background", TEXT, "texto secundário"],
  ["mutedForeground", "muted", TEXT, "texto secundário em superfície discreta"],
  ["accentForeground", "accent", TEXT, "texto em realce"],
  ["primaryForeground", "primary", TEXT, "texto em botão primário"],
  ["destructiveForeground", "destructive", TEXT, "texto em botão destrutivo"],
  ["primary", "background", UI, "primary como ícone ou superfície (texto usa o token link)"],
  ["link", "background", TEXT, "link"],
  ["destructive", "background", TEXT, "texto de erro"],
  ["ring", "background", UI, "anel de foco"],
  ["input", "background", UI, "borda de campo"],
  ["border", "background", INFO, "filete decorativo (informativo)"],
];

// [primeiro plano, fundo, mínimo, descrição, opacidade do primeiro plano]. Rodam nos dois temas.
const sectionPairs = [
  // Informativos: combinações do site original que as seções não usam mais.
  ["gray-400", "background", INFO, "cinza-400 no fundo (não usado)"],
  ["gray-400", "gray-100", INFO, "cinza-400 em cinza-100 (não usado)"],
  ["gray-500", "gray-100", INFO, "cinza-500 em cinza-100 (não usado)"],
  ["blue-light", "blue-medium", INFO, "eyebrow blue-light a 80% (contato, antes)", 0.8],
  ["primaryForeground", "blue-medium", INFO, "rótulo branco a 50% (contato, antes)", 0.5],
  // Em uso.
  ["gray-500", "background", TEXT, "cinza-500 no fundo"],
  ["gray-500", "gray-50", TEXT, "cinza-500 em cinza-50"],
  ["gray-600", "background", TEXT, "cinza-600 no fundo"],
  ["gray-600", "gray-50", TEXT, "cinza-600 em cinza-50"],
  ["gray-600", "gray-100", TEXT, "cinza-600 em cinza-100"],
  ["gray-700", "background", TEXT, "cinza-700 no fundo"],
  ["gray-700", "gray-50", TEXT, "cinza-700 em cinza-50"],
  ["link", "background", TEXT, "link/eyebrow no fundo"],
  ["link", "gray-50", TEXT, "link em cinza-50 (certificações)"],
  // Blocos navy (hero, stacks, contato, footer): iguais nos dois temas.
  ["primaryForeground", "surface-navy", TEXT, "branco no navy"],
  ["primaryForeground", "surface-navy", TEXT, "eyebrow branco a 80% no navy", 0.8],
  ["primaryForeground", "surface-navy", TEXT, "menu branco a 75% no navy", 0.75],
  ["primaryForeground", "surface-navy", TEXT, "texto branco a 70% no navy", 0.7],
  ["primaryForeground", "surface-navy-raised", TEXT, "texto branco a 70% em card navy", 0.7],
  ["glow", "surface-navy", UI, "ícone e linha glow no navy"],
  // "Como funciona" do case: janela de API, selos e etapas fora de foco (opacity-70 sobre texto a 80%).
  ["glow", "surface-navy-raised", TEXT, "comando glow na janela"],
  ["primaryForeground", "surface-navy-raised", TEXT, "linhas brancas a 80% na janela", 0.8],
  ["blue-dark", "glow", TEXT, "selo de destaque (navy em glow)"],
  ["primaryForeground", "surface-navy", TEXT, "título de etapa fora de foco", 0.7],
  ["primaryForeground", "surface-navy", TEXT, "texto de etapa fora de foco", 0.56],
  // R10: dica "arraste para o lado" da pilha e notificações da hero.
  ["primaryForeground", "surface-navy", TEXT, "dica da pilha, branco a 50%", 0.5],
  ["surface-navy", "glow", TEXT, "ícone grafite no quadrado âmbar"],
  ["ring-navy", "surface-navy", UI, "anel de foco no navy"],
  ["ring-navy", "surface-navy-raised", UI, "anel de foco em card navy"],
  ["primaryForeground", "blue-medium", TEXT, "descrição branca a 70% (contato)", 0.7],
  ["primaryForeground", "blue-medium", TEXT, "copyright branco a 60% (rodapé)", 0.6],
];

function toRgb(hex) {
  let digits = hex.replace("#", "");
  if (digits.length === 3) digits = [...digits].map((digit) => digit + digit).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(digits)) throw new Error(`cor hex inválida: ${hex}`);
  return [0, 2, 4].map((index) => parseInt(digits.slice(index, index + 2), 16));
}

function luminance(rgb) {
  const linear = (channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = rgb.map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const blend = (foreground, background, alpha) => foreground.map((channel, index) => channel * alpha + background[index] * (1 - alpha));

const ratio = (foreground, background, alpha = 1) => {
  const effective = alpha === 1 ? foreground : blend(foreground, background, alpha);
  const [lighter, darker] = [luminance(effective), luminance(background)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
};

const tokens = JSON.parse((await readFile(file, "utf8")).replace(/^﻿/, ""));
const pick = (name, theme) => {
  const spec = tokens.colors?.[name] ?? tokens.scales?.[name];
  if (!spec) throw new Error(`token "${name}" ausente`);
  return toRgb(typeof spec === "string" ? spec : spec[theme]);
};

let failures = 0;

function report(title, list, theme) {
  console.log(`\n${title}`);
  for (const [foreground, background, minimum, label, alpha = 1] of list) {
    const value = ratio(pick(foreground, theme), pick(background, theme), alpha);
    const ok = value >= minimum;
    if (!ok) failures += 1;
    const mark = minimum === INFO ? "info " : ok ? "ok   " : "FALHA";
    const need = minimum === INFO ? "     " : `(mín. ${minimum})`;
    console.log(`  ${mark} ${value.toFixed(2).padStart(5)}:1 ${need}  ${label}  [${foreground} / ${background}]`);
  }
}

try {
  report("TOKENS · CLARO", pairs, "light");
  report("TOKENS · ESCURO", pairs, "dark");
  if (tokens.scales) {
    report("SEÇÕES (escalas gray/blue) · CLARO", sectionPairs, "light");
    report("SEÇÕES (escalas gray/blue) · ESCURO", sectionPairs, "dark");
  }
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
}

console.log(failures ? `\n${failures} par(es) abaixo do mínimo` : "\nTodos os pares passam");
process.exitCode = failures ? 1 : 0;
