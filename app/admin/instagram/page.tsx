import type { Metadata } from "next"
import InstagramTokenGuide from "@/components/instagram-token-guide"

export const metadata: Metadata = {
  title: "Configuración de Instagram - Puesto Bar",
  description: "Guía para configurar la integración con Instagram",
}

export default function InstagramSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center">Configuración de Instagram</h1>

        <div className="max-w-5xl mx-auto space-y-12">
          <InstagramTokenGuide />
        </div>
      </div>
    </div>
  )
}

