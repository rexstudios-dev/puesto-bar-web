"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Save, RefreshCw, Upload, ArrowDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

// Valores predeterminados para la sección Hero
const defaultHeroSettings = {
  title: "Puesto Bar",
  subtitle: "Café, comida y tragos en San Vicente, Buenos Aires",
  buttonText: "Ver Menú",
  buttonLink: "#menu",
  showStatusBadge: true,
  backgroundImage: "/img/instagram/hero.jpg",
  overlayOpacity: 50, // 0-100
  showScrollIndicator: true,
}

export default function HeroEditor() {
  const [heroSettings, setHeroSettings] = useState(defaultHeroSettings)
  const [saving, setSaving] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { toast } = useToast()

  // Cargar configuración guardada
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("puestoBarHeroSettings")
      if (savedSettings) {
        setHeroSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error("Error loading hero settings:", error)
    }
  }, [])

  const handleInputChange = (key: keyof typeof heroSettings, value: string | boolean | number) => {
    setHeroSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]
    setSelectedFile(file)

    // Crear URL para previsualización
    const objectUrl = URL.createObjectURL(file)
    setPreviewImage(objectUrl)

    // Limpiar URL cuando el componente se desmonte
    return () => URL.revokeObjectURL(objectUrl)
  }

  const saveSettings = async () => {
    setSaving(true)

    try {
      // En un escenario real, aquí subiríamos la imagen al servidor
      // Por ahora, simulamos que la imagen se sube correctamente
      if (selectedFile) {
        // Simular subida de imagen
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // En un escenario real, la URL vendría del servidor
        // Aquí simplemente usamos la previsualización
        if (previewImage) {
          handleInputChange("backgroundImage", previewImage)
        }
      }

      // Guardar configuración en localStorage
      localStorage.setItem("puestoBarHeroSettings", JSON.stringify(heroSettings))
      localStorage.setItem("puestoBarHeroLastUpdate", new Date().toISOString())

      // Mostrar diálogo de éxito
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Error saving hero settings:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const restoreDefaults = () => {
    setHeroSettings(defaultHeroSettings)
    setSelectedFile(null)
    setPreviewImage(null)

    toast({
      title: "Configuración restaurada",
      description: "Se han restaurado los valores predeterminados",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de Hero</h1>
          <p className="text-gray-500 mt-1">Personaliza la sección principal del sitio</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={restoreDefaults}>
            <RefreshCw className="h-4 w-4" />
            Restaurar predeterminados
          </Button>

          <Button onClick={saveSettings} disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contenido</CardTitle>
            <CardDescription>Edita el texto y opciones de la sección Hero</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                value={heroSettings.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Título principal"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subtítulo</label>
              <Textarea
                value={heroSettings.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                placeholder="Subtítulo descriptivo"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Texto del botón</label>
              <Input
                value={heroSettings.buttonText}
                onChange={(e) => handleInputChange("buttonText", e.target.value)}
                placeholder="Texto del botón"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Enlace del botón</label>
              <Input
                value={heroSettings.buttonLink}
                onChange={(e) => handleInputChange("buttonLink", e.target.value)}
                placeholder="#section o /page"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="text-sm font-medium">Mostrar badge de estado</h3>
                <p className="text-xs text-gray-500">Muestra si el local está abierto o cerrado</p>
              </div>
              <Switch
                checked={heroSettings.showStatusBadge}
                onCheckedChange={(checked) => handleInputChange("showStatusBadge", checked)}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="text-sm font-medium">Mostrar indicador de scroll</h3>
                <p className="text-xs text-gray-500">Muestra una flecha hacia abajo</p>
              </div>
              <Switch
                checked={heroSettings.showScrollIndicator}
                onCheckedChange={(checked) => handleInputChange("showScrollIndicator", checked)}
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Opacidad del overlay ({heroSettings.overlayOpacity}%)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heroSettings.overlayOpacity}
                  onChange={(e) => handleInputChange("overlayOpacity", Number.parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="w-8 text-center">{heroSettings.overlayOpacity}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imagen de fondo</CardTitle>
            <CardDescription>Cambia la imagen de fondo de la sección Hero</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="mb-4">
                <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={previewImage || heroSettings.backgroundImage || "/placeholder.svg"}
                    alt="Background preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: heroSettings.overlayOpacity / 100 }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="background-upload"
                />
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <label htmlFor="background-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                    Subir nueva imagen
                  </label>
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">Recomendado: 1920x1080 píxeles, JPG o PNG</p>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-medium mb-3">Vista previa</h3>
              <div className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={previewImage || heroSettings.backgroundImage || "/placeholder.svg"}
                  alt="Hero preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black" style={{ opacity: heroSettings.overlayOpacity / 100 }}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                  <h1 className="text-3xl font-bold mb-2">{heroSettings.title}</h1>
                  <p className="mb-4">{heroSettings.subtitle}</p>
                  <button className="px-4 py-2 bg-amber-600 rounded-full">{heroSettings.buttonText}</button>

                  {heroSettings.showStatusBadge && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500/80 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                      <span>Abierto ahora</span>
                    </div>
                  )}

                  {heroSettings.showScrollIndicator && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <ArrowDown className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 px-6 py-4">
            <p className="text-sm text-gray-500">
              La imagen de hero es lo primero que ven tus visitantes, elige una de buena calidad.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Diálogo de confirmación de guardado */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">¡Cambios guardados!</DialogTitle>
            <DialogDescription className="text-center">
              La configuración de la sección Hero se ha guardado correctamente y ya está visible en la página principal.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setShowSuccessDialog(false)}>Aceptar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

