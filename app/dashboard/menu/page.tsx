import type { Metadata } from "next"
import MenuEditor from "@/components/dashboard/menu-editor"

export const metadata: Metadata = {
  title: "Editor de Menú - Puesto Bar",
  description: "Editar el menú y precios de Puesto Bar",
}

export default function MenuEditorPage() {
  return <MenuEditor />
}

