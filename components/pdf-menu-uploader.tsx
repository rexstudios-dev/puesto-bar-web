"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Check, AlertCircle, FileSpreadsheet } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function PDFMenuUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Aceptar PDF o Excel
      if (
        selectedFile.type !== "application/pdf" &&
        selectedFile.type !== "application/vnd.ms-excel" &&
        selectedFile.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setError("Por favor selecciona un archivo PDF o Excel (xls, xlsx)")
        return
      }

      setFile(selectedFile)
      setError(null)
      setSuccess(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Modificar para simular la actualización sin depender de la API
  const uploadPDF = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo PDF o Excel primero")
      return
    }

    setIsUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 5
          if (newProgress >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return newProgress
        })
      }, 200)

      // Simular tiempo de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearInterval(progressInterval)
      setProgress(100)

      // Datos de ejemplo para el menú
      const demoMenu = {
        cafeteria: [
          { name: "Espresso", description: "70 ml", price: "$2,500" },
          { name: "Cortado", description: "70 ml", price: "$2,500" },
          { name: "Americano", description: "140 ml", price: "$2,500" },
          { name: "Lágrima", description: "140 ml", price: "$2,900" },
          { name: "Flat White", description: "240 ml", price: "$4,000" },
        ],
        comidas: [
          { name: "Medialunas", description: "", price: "$2,500" },
          { name: "Medialunas con jamón y queso", description: "", price: "$2,900" },
          {
            name: "Avocado toast",
            description: "Palta, huevos revueltos, tomate y pan de semillas tostado",
            price: "$8,500",
          },
        ],
        postres: [
          { name: "Chocotorta de Nutella", description: "", price: "$6,500" },
          { name: "Flan cremoso", description: "De dulce de leche con crema y dulce de leche", price: "$5,300" },
        ],
        bebidas: [
          { name: "Jugo Exprimido de Naranja", description: "", price: "$4,000" },
          { name: "Limonada", description: "Con menta y jengibre (jarra)", price: "$4,500" },
        ],
        vinos: [
          { name: "Alta Vista premium", description: "Malbec", price: "$13,300" },
          { name: "Festivo, Monteviejo", description: "Malbec", price: "$15,600" },
        ],
      }

      // Guardar los datos en localStorage
      localStorage.setItem("puestoBarMenu", JSON.stringify(demoMenu))
      localStorage.setItem("puestoBarLastUpdate", new Date().toISOString())

      // También guardar en el localStorage del dashboard
      localStorage.setItem("puestoBarDashboardMenu", JSON.stringify(demoMenu))
      localStorage.setItem("puestoBarDashboardMenuLastUpdate", new Date().toISOString())

      setSuccess(true)
      setShowSuccessDialog(true)
    } catch (err) {
      console.error("Error uploading file:", err)
      setError("Ocurrió un error al procesar el archivo. Por favor intenta de nuevo.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Actualizar Menú desde Archivo</CardTitle>
        <CardDescription>
          Sube un PDF o Excel de tu menú para actualizar automáticamente los precios y elementos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              file ? "border-green-300 bg-green-50" : "border-gray-300 hover:bg-gray-50"
            }`}
            onClick={handleUploadClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center">
                {file.type.includes("pdf") ? (
                  <FileText className="h-10 w-10 text-green-500 mb-2" />
                ) : (
                  <FileSpreadsheet className="h-10 w-10 text-green-500 mb-2" />
                )}
                <p className="text-sm font-medium text-green-600">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Haz clic para seleccionar un PDF o Excel de tu menú</p>
                <p className="text-xs text-gray-400 mt-1">O arrastra y suelta un archivo aquí</p>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-gray-500">Procesando archivo... {progress}%</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 flex items-start">
              <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>¡Menú actualizado correctamente!</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={uploadPDF} disabled={!file || isUploading} className="w-full">
          {isUploading ? "Procesando..." : "Actualizar Precios y Productos"}
        </Button>
      </CardFooter>

      {/* Diálogo de confirmación de actualización */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">¡Menú actualizado!</DialogTitle>
            <DialogDescription className="text-center">
              Los precios y productos se han actualizado correctamente y ya están visibles en la página principal.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                // Recargar la página después de cerrar el diálogo
                window.location.reload()
              }}
            >
              Aceptar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

