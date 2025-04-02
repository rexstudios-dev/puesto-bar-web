import type { Metadata } from "next"
import ContentEditor from "@/components/dashboard/content-editor"

export const metadata: Metadata = {
  title: "Editor de Contenido - Puesto Bar",
  description: "Editar el contenido del sitio web de Puesto Bar",
}

export default function ContentPage() {
  return <ContentEditor />
}

