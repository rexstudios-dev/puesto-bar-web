"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Save, Palette, Layout, Type, Image, Database, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getSiteConfig, saveSiteConfig } from "@/lib/store"

export default function AppearanceEditor() {
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { toast } = useToast()

  // Estado para los colores del tema
  const [colors, setColors] = useState({
    primaryColor: "#B45309",
    secondaryColor: "#F59E0B",
    accentColor: "#D97706",
    backgroundColor: "#F9F5F0",
    textColor: "#1F2937",
  })

  // Cargar colores guardados al iniciar
  useEffect(() => {
    const config = getSiteConfig()
    setColors({
      primaryColor: config.primaryColor || "#B45309",
      secondaryColor: config.secondaryColor || "#F59E0B",
      accentColor: config.accentColor || "#D97706",
      backgroundColor: config.backgroundColor || "#F9F5F0",
      textColor: config.textColor || "#1F2937",
    })
  }, [])

  const handleColorChange = (colorName: string, value: string) => {
    setColors((prev) => ({
      ...prev,
      [colorName]: value,
    }))
  }

  const saveAppearance = async () => {
    setSaving(true)

    try {
      // Guardar en el almacén central
      saveSiteConfig({
        primaryColor: colors.primaryColor,
        secondaryColor: colors.secondaryColor,
        accentColor: colors.accentColor,
        backgroundColor: colors.backgroundColor,
        textColor: colors.textColor,
      })

      // Mostrar diálogo de éxito
      setShowSuccessDialog(true)
    } catch (err) {
      console.error("Error saving appearance:", err)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar los cambios",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const syncWithDatabase = async () => {
    setSyncing(true)

    try {
      // Simular sincronización con base de datos
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Sincronización completada",
        description: "Los datos se han sincronizado correctamente con la base de datos",
        variant: "default",
      })
    } catch (err) {
      console.error("Error syncing with database:", err)
      toast({
        title: "Error",
        description: "Ocurrió un error al sincronizar con la base de datos",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const restoreDefaultColors = () => {
    const defaultColors = {
      primaryColor: "#B45309",
      secondaryColor: "#F59E0B",
      accentColor: "#D97706",
      backgroundColor: "#F9F5F0",
      textColor: "#1F2937",
    }

    setColors(defaultColors)

    toast({
      title: "Colores restaurados",
      description: "Se han restaurado los colores predeterminados",
      variant: "default",
    })
  }

  // Función para crear un selector de color con popover
  const ColorPicker = ({
    color,
    onChange,
    label,
  }: {
    color: string
    onChange: (value: string) => void
    label: string
  }) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex gap-3 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <div
                className="h-10 w-10 rounded-md border cursor-pointer shadow-sm"
                style={{ backgroundColor: color }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {[
                    "#B45309",
                    "#B91C1C",
                    "#4F46E5",
                    "#047857",
                    "#1E40AF",
                    "#F59E0B",
                    "#EF4444",
                    "#6366F1",
                    "#10B981",
                    "#3B82F6",
                    "#F97316",
                    "#FB7185",
                    "#A78BFA",
                    "#34D399",
                    "#60A5FA",
                    "#FBBF24",
                    "#FCA5A5",
                    "#C4B5FD",
                    "#6EE7B7",
                    "#93C5FD",
                    "#F9F5F0",
                    "#FFFFFF",
                    "#1F2937",
                    "#111827",
                    "#000000",
                  ].map((c) => (
                    <div
                      key={c}
                      className={`h-6 w-6 rounded-md cursor-pointer border ${color === c ? "ring-2 ring-offset-2 ring-amber-500" : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => onChange(c)}
                    />
                  ))}
                </div>
                <div>
                  <input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="w-full h-8" />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Input type="text" value={color} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de Apariencia</h1>
          <p className="text-gray-500 mt-1">Personaliza los colores, fuentes y estilos del sitio web</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={restoreDefaultColors}>
            <RefreshCw className="h-4 w-4" />
            Restaurar predeterminados
          </Button>

          <Button variant="outline" className="flex items-center gap-2" onClick={syncWithDatabase} disabled={syncing}>
            <Database className="h-4 w-4" />
            {syncing ? "Sincronizando..." : "Sincronizar con BD"}
          </Button>

          <Button onClick={saveAppearance} disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colores" className="w-full">
        <TabsList className="grid grid-cols-4 w-[500px]">
          <TabsTrigger value="colores" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colores
          </TabsTrigger>
          <TabsTrigger value="tipografia" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Tipografía
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="imagenes" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Imágenes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Colores del Tema</CardTitle>
              <CardDescription>Personaliza los colores principales del sitio web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ColorPicker
                    color={colors.primaryColor}
                    onChange={(value) => handleColorChange("primaryColor", value)}
                    label="Color Primario"
                  />

                  <ColorPicker
                    color={colors.secondaryColor}
                    onChange={(value) => handleColorChange("secondaryColor", value)}
                    label="Color Secundario"
                  />

                  <ColorPicker
                    color={colors.accentColor}
                    onChange={(value) => handleColorChange("accentColor", value)}
                    label="Color de Acento"
                  />
                </div>

                <div className="space-y-4">
                  <ColorPicker
                    color={colors.backgroundColor}
                    onChange={(value) => handleColorChange("backgroundColor", value)}
                    label="Color de Fondo"
                  />

                  <ColorPicker
                    color={colors.textColor}
                    onChange={(value) => handleColorChange("textColor", value)}
                    label="Color de Texto"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Vista previa</h3>
                <div className="p-6 rounded-lg border" style={{ backgroundColor: colors.backgroundColor }}>
                  <div className="text-xl font-bold mb-2" style={{ color: colors.textColor }}>
                    Puesto Bar
                  </div>
                  <div className="text-sm mb-4" style={{ color: colors.textColor }}>
                    Café, comida y tragos en San Vicente
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: colors.primaryColor }}
                    >
                      Botón Primario
                    </button>
                    <button
                      className="px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: colors.secondaryColor }}
                    >
                      Botón Secundario
                    </button>
                    <button className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: colors.accentColor }}>
                      Botón Acento
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-500">
                Los cambios de color se aplicarán a todo el sitio web cuando guardes los cambios.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tipografia" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipografía</CardTitle>
              <CardDescription>Personaliza las fuentes y estilos de texto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuente principal</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="Inter">Inter (Actual)</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Lato">Lato</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuente de títulos</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="Inter">Inter (Actual)</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Merriweather">Merriweather</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Abril Fatface">Abril Fatface</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño de fuente base</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="14px">14px</option>
                      <option value="16px" selected>
                        16px (Actual)
                      </option>
                      <option value="18px">18px</option>
                      <option value="20px">20px</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Espaciado entre líneas</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="1.2">Compacto (1.2)</option>
                      <option value="1.5" selected>
                        Normal (1.5) (Actual)
                      </option>
                      <option value="1.8">Espaciado (1.8)</option>
                      <option value="2.0">Muy espaciado (2.0)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso de títulos</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="500">Medium (500)</option>
                      <option value="600">Semibold (600)</option>
                      <option value="700" selected>
                        Bold (700) (Actual)
                      </option>
                      <option value="800">Extrabold (800)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Vista previa</h3>
                <div className="p-6 rounded-lg border bg-white">
                  <h1 className="text-3xl font-bold mb-3">Puesto Bar</h1>
                  <h2 className="text-xl font-semibold mb-3">Café, Comida y Tragos</h2>
                  <p className="mb-3">
                    Este es un texto de ejemplo para mostrar cómo se verá el contenido principal del sitio. La
                    tipografía es importante para la legibilidad y la estética general.
                  </p>
                  <p className="text-sm">
                    Este es un texto más pequeño, como el que se utilizaría en pies de página o notas.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-500">
                La configuración de tipografía requiere que se vuelva a compilar el sitio para aplicar algunos cambios.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout</CardTitle>
              <CardDescription>Personaliza la disposición de los elementos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ancho máximo del contenido</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="1280px">1280px</option>
                      <option value="1400px" selected>
                        1400px (Actual)
                      </option>
                      <option value="1536px">1536px</option>
                      <option value="100%">Ancho completo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Espaciado entre secciones</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="40px">Compacto (40px)</option>
                      <option value="60px">Normal (60px)</option>
                      <option value="80px" selected>
                        Espaciado (80px) (Actual)
                      </option>
                      <option value="100px">Muy espaciado (100px)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Borde redondeado</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="0px">Sin redondeo (0px)</option>
                      <option value="4px">Suave (4px)</option>
                      <option value="8px" selected>
                        Medio (8px) (Actual)
                      </option>
                      <option value="12px">Redondeado (12px)</option>
                      <option value="16px">Muy redondeado (16px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diseño de navegación</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="centered" selected>
                        Centrado (Actual)
                      </option>
                      <option value="left">Alineado a la izquierda</option>
                      <option value="right">Alineado a la derecha</option>
                      <option value="split">Dividido</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Vista previa de layout</h3>
                <div className="h-[300px] border rounded-lg overflow-hidden bg-white">
                  <div className="h-12 bg-amber-700 flex items-center justify-center">
                    <div className="w-3/4 max-w-5xl flex justify-between">
                      <div className="text-white font-bold">Puesto Bar</div>
                      <div className="flex gap-4">
                        <div className="text-white text-sm">Inicio</div>
                        <div className="text-white text-sm">Menú</div>
                        <div className="text-white text-sm">Nosotros</div>
                        <div className="text-white text-sm">Contacto</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center p-6">
                    <div className="w-3/4 max-w-5xl">
                      <div className="h-48 bg-gray-100 rounded-lg mb-4"></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 bg-gray-100 rounded-lg"></div>
                        <div className="h-24 bg-gray-100 rounded-lg"></div>
                        <div className="h-24 bg-gray-100 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-500">
                Los cambios en el layout pueden afectar la visualización en diferentes dispositivos.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="imagenes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Imágenes</CardTitle>
              <CardDescription>Personaliza las imágenes principales del sitio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de hero</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="mb-4">
                      <div className="relative w-full h-40 bg-gray-100 mb-2 overflow-hidden rounded-md">
                        <img src="/img/instagram/hero.jpg" alt="Hero actual" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm text-gray-500">Imagen actual</p>
                    </div>
                    <Button variant="outline">Cambiar imagen</Button>
                    <p className="mt-2 text-xs text-gray-500">Recomendado: 1920x1080 píxeles, JPG o PNG</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="relative w-32 h-32 bg-amber-600 rounded-md flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">P</span>
                      </div>
                    </div>
                    <Button variant="outline">Subir logo</Button>
                    <p className="mt-2 text-xs text-gray-500">Recomendado: 512x512 píxeles, PNG con transparencia</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="relative w-8 h-8 bg-amber-600 rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                    </div>
                    <Button variant="outline">Subir favicon</Button>
                    <p className="mt-2 text-xs text-gray-500">Recomendado: 32x32 píxeles, PNG o ICO</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estilo de imagen</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-2">
                      <div className="aspect-video bg-gray-100 mb-2 rounded overflow-hidden">
                        <img
                          src="/placeholder.svg?height=120&width=200"
                          alt="Sin filtro"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-center">Sin filtro</p>
                    </div>
                    <div className="border rounded-lg p-2">
                      <div className="aspect-video bg-gray-100 mb-2 rounded overflow-hidden">
                        <img
                          src="/placeholder.svg?height=120&width=200"
                          alt="Filtro sepia"
                          className="w-full h-full object-cover sepia"
                        />
                      </div>
                      <p className="text-xs text-center">Sepia</p>
                    </div>
                    <div className="border rounded-lg p-2">
                      <div className="aspect-video bg-gray-100 mb-2 rounded overflow-hidden">
                        <img
                          src="/placeholder.svg?height=120&width=200"
                          alt="Filtro escala de grises"
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                      <p className="text-xs text-center">Escala de grises</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-500">
                Las imágenes se optimizarán automáticamente al subirlas para mejorar el rendimiento del sitio.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación de guardado */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">¡Cambios guardados!</DialogTitle>
            <DialogDescription className="text-center">
              Los cambios de apariencia se han guardado correctamente y ya están aplicados en el sitio web.
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

