import type { Metadata } from "next"
import DashboardOverview from "@/components/dashboard/overview"

export const metadata: Metadata = {
  title: "Dashboard - Puesto Bar",
  description: "Panel de administración principal de Puesto Bar",
}

export default function DashboardPage() {
  return <DashboardOverview />
}

