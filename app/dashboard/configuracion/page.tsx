import type { Metadata } from "next"
import SiteSettings from "@/components/dashboard/site-settings"

export const metadata: Metadata = {
  title: "Configuración - Puesto Bar",
  description: "Configuración general del sitio web de Puesto Bar",
}

export default function SettingsPage() {
  return <SiteSettings />
}

