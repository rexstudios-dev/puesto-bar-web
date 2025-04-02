import type { Metadata } from "next"
import AppearanceEditor from "@/components/dashboard/appearance-editor"

export const metadata: Metadata = {
  title: "Editor de Apariencia - Puesto Bar",
  description: "Personalizar la apariencia del sitio web de Puesto Bar",
}

export default function AppearancePage() {
  return <AppearanceEditor />
}

