import type { Metadata } from "next"
import PDFMenuUploader from "@/components/pdf-menu-uploader"

export const metadata: Metadata = {
  title: "Admin - Puesto Bar",
  description: "Panel de administración para Puesto Bar",
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center">Panel de Administración</h1>

        <div className="max-w-5xl mx-auto space-y-12">
          <PDFMenuUploader />
        </div>
      </div>
    </div>
  )
}

