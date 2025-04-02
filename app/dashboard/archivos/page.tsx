import type { Metadata } from "next"
import FileUploader from "@/components/dashboard/file-uploader"

export const metadata: Metadata = {
  title: "Gestor de Archivos - Puesto Bar",
  description: "Sube y gestiona archivos para el sitio web de Puesto Bar",
}

export default function FilesPage() {
  return <FileUploader />
}

