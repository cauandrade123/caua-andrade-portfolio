import js from "@eslint/jsCC;
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// Arquivos isentos das regras de JSX abaixo. A lista está vazia porque todo o código já passa nelas;
// arquivo novo não deve entrar aqui.
const legacyFiles = [];

const jsxRules = {
  "no-restricted-syntax": [
    "error",
    {
      selector: 'JSXAttribute[name.name="style"]',
      message: "Sem estilo inline. Use classes Tailwind com tokens (veja .claude/rules/ui.md).",
    },
    {
      selector: "JSXText[value=/\\S/]",
      message: "Sem texto literal em JSX. Mova o texto para src/data (veja .claude/rules/architecture.md).",
    },
  ],
};

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, jsxA11y.flatConfigs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
    },
  },
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/components/ui/**", ...legacyFiles],
    rules: jsxRules,
  },
  {
    // shadcn vendorizado: exporta variantes junto com componentes por design.
    files: ["src/components/ui/**"],
    rules: { "react-refresh/only-export-components": "off" },
  },
);
