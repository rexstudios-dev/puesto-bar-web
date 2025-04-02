import type { Metadata } from "next"
import PriceEditor from "@/components/price-editor"

export const metadata: Metadata = {
  title: "Editar Precios - Puesto Bar",
  description: "Panel para editar los precios del menú",
}

export default function PricesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center">Editar Precios del Menú</h1>

        <div className="max-w-5xl mx-auto space-y-12">
          <PriceEditor />
        </div>
      </div>
    </div>
  )
}

