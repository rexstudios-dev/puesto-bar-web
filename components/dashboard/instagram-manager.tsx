"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Save, Upload, Trash2, Image, Film, RefreshCw, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getSiteConfig, saveSiteConfig } from "@/lib/store"

// Datos predeterminados para las imágenes
const defaultPosts = [
  { id: 1, filename: "post1.jpg", preview: "/img/instagram/post1.jpg" },
  { id: 2, filename: "post2.jpg", preview: "/img/instagram/post2.jpg" },
  { id: 3, filename: "post3.jpg", preview: "/img/instagram/post3.jpg" },
  { id: 4, filename: "post4.jpg", preview: "/img/instagram/post4.jpg" },
]

const defaultStories = [
  { id: 1, filename: "story1.jpg", preview: "/img/instagram/story1.jpg" },
  { id: 2, filename: "story2.jpg", preview: "/img/instagram/story2.jpg" },
  { id: 3, filename: "story3.jpg", preview: "/img/instagram/story3.jpg" },
]

export default function InstagramManager() {
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [contentChanged, setContentChanged] = useState(false)
  const { toast } = useToast()

  // Estado para las imágenes de Instagram
  const [posts, setPosts] = useState(defaultPosts)
  const [stories, setStories] = useState(defaultStories)

  // Cargar imágenes guardadas al iniciar
  useEffect(() => {
    const config = getSiteConfig()

    if (config.instagramPosts && config.instagramPosts.length > 0) {
      setPosts(config.instagramPosts)
    }

    if (config.instagramStories && config.instagramStories.length > 0) {
      setStories(config.instagramStories)
    }

    setContentChanged(false)
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "post" | "story") => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    // Simular carga de archivos
    setTimeout(() => {
      const newFiles = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        filename: file.name,
        preview: URL.createObjectURL(file),
      }))

      if (type === "post") {
        const updatedPosts = [...posts, ...newFiles]
        setPosts(updatedPosts)
        setContentChanged(true)
      } else {
        const updatedStories = [...stories, ...newFiles]
        setStories(updatedStories)
        setContentChanged(true)
      }

      setUploading(false)

      toast({
        title: "Archivos subidos",
        description: `${files.length} ${type === "post" ? "publicaciones" : "historias"} subidas correctamente`,
        variant: "default",
      })
    }, 1500)
  }

  const deleteFile = (id: number, type: "post" | "story") => {
    if (type === "post") {
      const updatedPosts = posts.filter((post) => post.id !== id)
      setPosts(updatedPosts)
      setContentChanged(true)
    } else {
      const updatedStories = stories.filter((story) => story.id !== id)
      setStories(updatedStories)
      setContentChanged(true)
    }

    toast({
      title: "Archivo eliminado",
      description: "El archivo ha sido eliminado correctamente",
      variant: "default",
    })
  }

  const saveChanges = async () => {
    setSaving(true)

    try {
      // Guardar en el almacén central
      saveSiteConfig({
        instagramPosts: posts,
        instagramStories: stories,
      })

      // Marcar como no cambiado después de guardar
      setContentChanged(false)

      // Mostrar diálogo de éxito
      setShowSuccessDialog(true)
    } catch (err) {
      console.error("Error saving instagram content:", err)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar los cambios",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const restoreDefaultImages = () => {
    setPosts(defaultPosts)
    setStories(defaultStories)
    setContentChanged(true)

    toast({
      title: "Imágenes restauradas",
      description: "Se han restaurado las imágenes predeterminadas",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestor de Instagram</h1>
          <p className="text-gray-500 mt-1">Administra las imágenes de Instagram que se muestran en el sitio</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={restoreDefaultImages}>
            <RefreshCw className="h-4 w-4" />
            Restaurar predeterminados
          </Button>

          <Button onClick={saveChanges} disabled={saving || !contentChanged} className="flex items-center gap-2">
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

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid grid-cols-2 w-[300px]">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Publicaciones
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            Historias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Publicaciones de Instagram</CardTitle>
              <CardDescription>Administra las imágenes que aparecen en la sección de publicaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Subir nuevas publicaciones</h3>
                  <div>
                    <input
                      type="file"
                      id="post-upload"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "post")}
                    />
                    <label htmlFor="post-upload">
                      <Button variant="outline" className="flex items-center gap-2" disabled={uploading} asChild>
                        <span>
                          <Upload className="h-4 w-4" />
                          {uploading ? "Subiendo..." : "Subir imágenes"}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Las imágenes deben ser cuadradas (1:1) y tener un tamaño mínimo de 600x600 píxeles.
                </p>
                <p className="text-sm text-gray-500">Se recomienda usar el formato JPG para mejor compatibilidad.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {posts.map((post) => (
                  <div key={post.id} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border">
                      <img
                        src={post.preview || "/placeholder.svg"}
                        alt={post.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => deleteFile(post.id, "post")}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{post.filename}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-500">
                Las imágenes se guardarán en la carpeta /public/img/instagram/ con los nombres post1.jpg, post2.jpg,
                etc.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="stories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historias de Instagram</CardTitle>
              <CardDescription>Administra las imágenes que aparecen en la sección de historias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Subir nuevas historias</h3>
                  <div>
                    <input
                      type="file"
                      id="story-upload"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "story")}
                    />
                    <label htmlFor="story-upload">
                      <Button variant="outline" className="flex items-center gap-2" disabled={uploading} asChild>
                        <span>
                          <Upload className="h-4 w-4" />
                          {uploading ? "Subiendo..." : "Subir imágenes"}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Las imágenes deben tener una relación de aspecto 9:16 y un tamaño mínimo de 450x800 píxeles.
                </p>
                <p className="text-sm text-gray-500">Se recomienda usar el formato JPG para mejor compatibilidad.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stories.map((story) => (
                  <div key={story.id} className="relative group">
                    <div className="aspect-[9/16] rounded-md overflow-hidden border">
                      <img
                        src={story.preview || "/placeholder.svg"}
                        alt={story.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => deleteFile(story.id, "story")}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{story.filename}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-500">
                Las imágenes se guardarán en la carpeta /public/img/instagram/ con los nombres story1.jpg, story2.jpg,
                etc.
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
              Las imágenes de Instagram se han guardado correctamente y ya están visibles en la página principal.
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

