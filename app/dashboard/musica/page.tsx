import type { Metadata } from "next"
import MusicManager from "@/components/dashboard/music-manager"

export const metadata: Metadata = {
  title: "Gestor de Música - Puesto Bar",
  description: "Configura la música de fondo del sitio web de Puesto Bar",
}

export default function MusicPage() {
  return <MusicManager />
}

