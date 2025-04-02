import type { Metadata } from "next"
import HeroEditor from "@/components/dashboard/hero-editor"

export const metadata: Metadata = {
  title: "Editor de Hero - Puesto Bar",
  description: "Configura la sección Hero del sitio web de Puesto Bar",
}

export default function HeroPage() {
  return <HeroEditor />
}

