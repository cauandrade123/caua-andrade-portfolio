import { siteSchema } from "@/types";

export const site = siteSchema.parse({
  name: "Cauã Andrade",
  role: "Desenvolvedor Back-end",
  url: "https://cauaandradeconde.com.br",
  email: "cauaandradeconde@gmail.com",
  social: {
    github: "https://github.com/cauandrade123",
    linkedin: "https://www.linkedin.com/in/cauaandradedev/",
  },
});
