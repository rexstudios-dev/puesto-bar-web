"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Save, Home, MapPin, Info, RefreshCw, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getSiteConfig, saveSiteConfig } from "@/lib/store"

export default function ContentEditor() {
  const [saving, setSaving] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [contentChanged, setContentChanged] = useState(false)
  const { toast } = useToast()

  // Estado para el contenido de las secciones
  const [heroContent, setHeroContent] = useState({
    title: "Puesto Bar",
    subtitle: "Café, comida y tragos en San Vicente, Buenos Aires",
    buttonText: "Ver Menú",
    buttonLink: "#menu",
    showStatusBadge: true,
    backgroundImage: "/img/instagram/hero.jpg",
    overlayOpacity: 50,
    showScrollIndicator: true,
  })

  const [aboutContent, setAboutContent] = useState({
    title: "Bienvenidos a Puesto Bar",
    description:
      "En el corazón de San Vicente, Puesto Bar es un espacio donde la pasión por el café de especialidad se encuentra con la gastronomía de calidad. Desde nuestros desayunos artesanales hasta nuestros cócteles de autor, cada experiencia está pensada para deleitar tus sentidos.",
    feature1Title: "Café de Especialidad",
    feature1Description: "Seleccionamos los mejores granos para ofrecerte una experiencia única en cada taza.",
    feature2Title: "Cocina Artesanal",
    feature2Description: "Platos preparados con ingredientes frescos y técnicas que resaltan los sabores naturales.",
    feature3Title: "Tragos de Autor",
    feature3Description: "Nuestra barra ofrece creaciones únicas y clásicos reinventados para todos los gustos.",
  })

  const [locationContent, setLocationContent] = useState({
    title: "Ubicación",
    subtitle: "Visítanos y disfruta de la experiencia Puesto Bar",
    address: "Av. Libertador Gral San Martín 30, San Vicente, Buenos Aires, Argentina",
    hours: "Lunes a Jueves: 8:00 - 23:00\nViernes y Sábados: 8:00 - 01:00\nDomingos: 9:00 - 22:00",
    instagram: "@puesto.sanvicente",
  })

  // Cargar contenido guardado al iniciar
  useEffect(() => {
    const config = getSiteConfig()

    if (config.heroContent) {
      setHeroContent(config.heroContent)
    }

    if (config.aboutContent) {
      setAboutContent(config.aboutContent)
    }

    if (config.locationContent) {
      setLocationContent(config.locationContent)
    }

    setContentChanged(false)
  }, [])

  const saveContent = async () => {
    setSaving(true)

    try {
      // Guardar en el almacén central
      saveSiteConfig({
        heroContent,
        aboutContent,
        locationContent,
      })

      // Marcar como no cambiado después de guardar
      setContentChanged(false)

      // Mostrar diálogo de éxito
      setShowSuccessDialog(true)
    } catch (err) {
      console.error("Error saving content:", err)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el contenido",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const restoreDefaultContent = () => {
    const config = getSiteConfig()

    setHeroContent({
      title: "Puesto Bar",
      subtitle: "Café, comida y tragos en San Vicente, Buenos Aires",
      buttonText: "Ver Menú",
      buttonLink: "#menu",
      showStatusBadge: true,
      backgroundImage: "/img/instagram/hero.jpg",
      overlayOpacity: 50,
      showScrollIndicator: true,
    })

    setAboutContent({
      title: "Bienvenidos a Puesto Bar",
      description:
        "En el corazón de San Vicente, Puesto Bar es un espacio donde la pasión por el café de especialidad se encuentra con la gastronomía de calidad. Desde nuestros desayunos artesanales hasta nuestros cócteles de autor, cada experiencia está pensada para deleitar tus sentidos.",
      feature1Title: "Café de Especialidad",
      feature1Description: "Seleccionamos los mejores granos para ofrecerte una experiencia única en cada taza.",
      feature2Title: "Cocina Artesanal",
      feature2Description: "Platos preparados con ingredientes frescos y técnicas que resaltan los sabores naturales.",
      feature3Title: "Tragos de Autor",
      feature3Description: "Nuestra barra ofrece creaciones únicas y clásicos reinventados para todos los gustos.",
    })

    setLocationContent({
      title: "Ubicación",
      subtitle: "Visítanos y disfruta de la experiencia Puesto Bar",
      address: "Av. Libertador Gral San Martín 30, San Vicente, Buenos Aires, Argentina",
      hours: "Lunes a Jueves: 8:00 - 23:00\nViernes y Sábados: 8:00 - 01:00\nDomingos: 9:00 - 22:00",
      instagram: "@puesto.sanvicente",
    })

    setContentChanged(true)

    toast({
      title: "Contenido restaurado",
      description: "Se ha restaurado el contenido predeterminado",
      variant: "default",
    })
  }

  // Función para actualizar el contenido del hero
  const updateHeroContent = (key: keyof typeof heroContent, value: any) => {
    setHeroContent((prev) => ({ ...prev, [key]: value }))
    setContentChanged(true)
  }

  // Función para actualizar el contenido de about
  const updateAboutContent = (key: keyof typeof aboutContent, value: string) => {
    setAboutContent((prev) => ({ ...prev, [key]: value }))
    setContentChanged(true)
  }

  // Función para actualizar el contenido de location
  const updateLocationContent = (key: keyof typeof locationContent, value: string) => {
    setLocationContent((prev) => ({ ...prev, [key]: value }))
    setContentChanged(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de Contenido</h1>
          <p className="text-gray-500 mt-1">Edita los textos y contenidos de las diferentes secciones del sitio</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={restoreDefaultContent}>
            <RefreshCw className="h-4 w-4" />
            Restaurar predeterminados
          </Button>

          <Button onClick={saveContent} disabled={saving || !contentChanged} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {contentChanged && (
        <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>Hay cambios sin guardar. Haz clic en "Guardar cambios" para aplicarlos.</p>
        </div>
      )}

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Nosotros
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ubicación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sección Hero</CardTitle>
              <CardDescription>Edita el contenido de la sección principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <Input
                  value={heroContent.title}
                  onChange={(e) => updateHeroContent("title", e.target.value)}
                  placeholder="Título principal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <Input
                  value={heroContent.subtitle}
                  onChange={(e) => updateHeroContent("subtitle", e.target.value)}
                  placeholder="Subtítulo descriptivo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto del botón</label>
                <Input
                  value={heroContent.buttonText}
                  onChange={(e) => updateHeroContent("buttonText", e.target.value)}
                  placeholder="Texto del botón principal"
                />
              </div>

              <div className="mt-6 p-6 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Vista previa</h3>
                <div className="p-6 border rounded-lg bg-white">
                  <h1 className="text-3xl font-bold text-amber-900 mb-2">{heroContent.title}</h1>
                  <p className="text-gray-700 mb-4">{heroContent.subtitle}</p>
                  <button className="bg-amber-600 text-white px-4 py-2 rounded-full">{heroContent.buttonText}</button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sección Nosotros</CardTitle>
              <CardDescription>Edita el contenido de la sección "Nosotros"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <Input
                  value={aboutContent.title}
                  onChange={(e) => updateAboutContent("title", e.target.value)}
                  placeholder="Título de la sección"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <Textarea
                  value={aboutContent.description}
                  onChange={(e) => updateAboutContent("description", e.target.value)}
                  placeholder="Descripción principal"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Característica 1</label>
                  <Input
                    value={aboutContent.feature1Title}
                    onChange={(e) => updateAboutContent("feature1Title", e.target.value)}
                    placeholder="Título"
                    className="mb-2"
                  />
                  <Textarea
                    value={aboutContent.feature1Description}
                    onChange={(e) => updateAboutContent("feature1Description", e.target.value)}
                    placeholder="Descripción"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Característica 2</label>
                  <Input
                    value={aboutContent.feature2Title}
                    onChange={(e) => updateAboutContent("feature2Title", e.target.value)}
                    placeholder="Título"
                    className="mb-2"
                  />
                  <Textarea
                    value={aboutContent.feature2Description}
                    onChange={(e) => updateAboutContent("feature2Description", e.target.value)}
                    placeholder="Descripción"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Característica 3</label>
                  <Input
                    value={aboutContent.feature3Title}
                    onChange={(e) => updateAboutContent("feature3Title", e.target.value)}
                    placeholder="Título"
                    className="mb-2"
                  />
                  <Textarea
                    value={aboutContent.feature3Description}
                    onChange={(e) => updateAboutContent("feature3Description", e.target.value)}
                    placeholder="Descripción"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sección Ubicación</CardTitle>
              <CardDescription>Edita el contenido de la sección de ubicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <Input
                  value={locationContent.title}
                  onChange={(e) => updateLocationContent("title", e.target.value)}
                  placeholder="Título de la sección"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <Input
                  value={locationContent.subtitle}
                  onChange={(e) => updateLocationContent("subtitle", e.target.value)}
                  placeholder="Subtítulo descriptivo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <Input
                  value={locationContent.address}
                  onChange={(e) => updateLocationContent("address", e.target.value)}
                  placeholder="Dirección completa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horarios</label>
                <Textarea
                  value={locationContent.hours}
                  onChange={(e) => updateLocationContent("hours", e.target.value)}
                  placeholder="Horarios de atención"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <Input
                  value={locationContent.instagram}
                  onChange={(e) => updateLocationContent("instagram", e.target.value)}
                  placeholder="Usuario de Instagram"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación de guardado */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">¡Cambios guardados!</DialogTitle>
            <DialogDescription className="text-center">
              El contenido se ha guardado correctamente y ya está visible en la página principal.
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

