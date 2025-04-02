import type { Metadata } from "next"
import TrafficStats from "@/components/dashboard/traffic-stats"

export const metadata: Metadata = {
  title: "Estadísticas de Tráfico - Puesto Bar",
  description: "Análisis del tráfico web de Puesto Bar",
}

export default function UsersPage() {
  return <TrafficStats />
}

