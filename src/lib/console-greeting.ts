import { copy, site } from "@/data";

/** Easter egg: uma mensagem para quem abre o console do navegador. Roda uma vez, na carga da página. */
export function printConsoleGreeting() {
  const { title, message } = copy.consoleGreeting;
  console.info(`%c${title}`, "font-size: 14px; font-weight: bold;");
  console.info(`${message} ${site.social.github}`);
}
