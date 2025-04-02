import type { Metadata } from "next"
import MongoDBSetup from "@/components/mongodb-setup"

export const metadata: Metadata = {
  title: "Configuración de MongoDB - Puesto Bar",
  description: "Configura la conexión a la base de datos MongoDB para Puesto Bar",
}

export default function MongoDBPage() {
  return <MongoDBSetup />
}

