import { contactSchema } from "@/types";

export const contactLinks = contactSchema.parse([
  {
    id: "email",
    label: "Email",
    value: "cauaandradeconde@gmail.com",
    href: "mailto:cauaandradeconde@gmail.com",
    icon: "Mail",
    external: false,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "/in/cauaandradedev",
    href: "https://www.linkedin.com/in/cauaandradedev/",
    icon: "Linkedin",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: "cauandrade123",
    href: "https://github.com/cauandrade123",
    icon: "Github",
    external: true,
  },
]);
