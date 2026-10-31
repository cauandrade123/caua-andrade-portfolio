import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// Fonte display (nome e títulos grandes). Só o eixo de peso; o token é `font-display`.
import "@fontsource-variable/bricolage-grotesque/wght.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { printConsoleGreeting } from "./lib/console-greeting";
import "./index.css";

printConsoleGreeting();

const root = document.getElementById("root");
if (!root) throw new Error("Elemento #root ausente no index.html.");

createRoot(root).render(<App />);
