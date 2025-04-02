import type { Metadata } from "next"
import InstagramManager from "@/components/dashboard/instagram-manager"

export const metadata: Metadata = {
  title: "Gestor de Instagram - Puesto Bar",
  description: "Gestionar las imágenes y contenido de Instagram",
}

export default function InstagramPage() {
  return <InstagramManager />
}

