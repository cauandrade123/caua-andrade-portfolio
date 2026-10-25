import {
  Building2,
  Cloud,
  Code2,
  Container,
  Database,
  FileSpreadsheet,
  GitBranch,
  Github,
  HardDrive,
  Layers,
  Linkedin,
  Mail,
  Scissors,
  Server,
  Shield,
  Workflow,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/types";

// Record<IconName, ...> obriga o registro a cobrir todos os nomes de ICON_NAMES (src/types/common.ts).
const icons: Record<IconName, LucideIcon> = {
  Building2,
  Cloud,
  Code2,
  Container,
  Database,
  FileSpreadsheet,
  GitBranch,
  Github,
  HardDrive,
  Layers,
  Linkedin,
  Mail,
  Scissors,
  Server,
  Shield,
  Workflow,
};

type IconProps = Omit<LucideProps, "ref"> & { name: IconName };

export function Icon({ name, ...props }: IconProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" {...props} />;
}
