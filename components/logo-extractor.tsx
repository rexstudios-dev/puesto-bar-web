"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download } from "lucide-react"

export default function LogoExtractor() {
  const [file, setFile] = useState<File | null>(null)
  const [extractedLogos, setExtractedLogos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const extractLogos = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo PDF primero")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", file)

      // Send the file to our API endpoint
      const response = await fetch("/api/extract-logos", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al extraer los logos")
      }

      const data = await response.json()
      setExtractedLogos(data.logos)
    } catch (err) {
      console.error("Error extracting logos:", err)
      setError("Ocurrió un error al extraer los logos. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const downloadAllLogos = () => {
    // Create a zip file with all logos
    // This is a simplified example - in a real app you'd use a library like JSZip
    alert("Esta función descargará todos los logos en un archivo ZIP")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Extractor de Logos</CardTitle>
        <CardDescription>Sube un archivo PDF del menú para extraer automáticamente los logos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleUploadClick}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-1">
              {file ? file.name : "Haz clic para seleccionar un archivo PDF"}
            </p>
            <p className="text-xs text-gray-400">O arrastra y suelta un archivo aquí</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          <Button onClick={extractLogos} disabled={!file || loading} className="w-full">
            {loading ? "Extrayendo logos..." : "Extraer Logos"}
          </Button>
        </div>

        {extractedLogos.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Logos Extraídos ({extractedLogos.length})</h3>
              <Button variant="outline" size="sm" onClick={downloadAllLogos}>
                <Download className="h-4 w-4 mr-2" />
                Descargar Todos
              </Button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {extractedLogos.map((logo, index) => (
                <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
                  <img
                    src={logo || "/placeholder.svg"}
                    alt={`Logo ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={logo}
                      download={`logo-${index + 1}.svg`}
                      className="text-white p-2 rounded-full bg-amber-600 hover:bg-amber-700"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

