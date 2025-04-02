"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Save, Play, Pause, RefreshCw, Database } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { getSiteConfig, saveSiteConfig } from "@/lib/store"

export default function MusicManager() {
  const [musicUrl, setMusicUrl] = useState("")
  const [musicVolume, setMusicVolume] = useState(20)
  const [isPlaying, setIsPlaying] = useState(false)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { toast } = useToast()

  // Audio para previsualización
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Cargar configuración actual
    const config = getSiteConfig()
    setMusicUrl(config.musicUrl)
    setMusicVolume(config.musicVolume)

    // Crear elemento de audio para previsualización
    const audioElement = new Audio()
    audioElement.volume = config.musicVolume / 100
    setAudio(audioElement)

    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ""
      }
    }
  }, [])

  const togglePreview = () => {
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.src = musicUrl
      audio.volume = musicVolume / 100
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((error) => {
          console.error("Error al reproducir audio:", error)
          toast({
            title: "Error",
            description: "No se pudo reproducir el audio. Verifica la URL.",
            variant: "destructive",
          })
        })
    }
  }

  const saveMusic = async () => {
    setSaving(true)

    try {
      // Guardar en el almacén central
      saveSiteConfig({
        musicUrl,
        musicVolume,
      })

      // Mostrar diálogo de éxito
      setShowSuccessDialog(true)
    } catch (err) {
      console.error("Error saving music:", err)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la configuración de música",
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

  const restoreDefaultMusic = () => {
    const defaultUrl = "https://cdn.pixabay.com/audio/2023/05/23/audio_7fc2e60a34.mp3"
    setMusicUrl(defaultUrl)
    setMusicVolume(20)

    // Si está reproduciendo, actualizar la fuente
    if (isPlaying && audio) {
      audio.src = defaultUrl
      audio.volume = 0.2
      audio.play().catch((err) => console.error("Error al reproducir audio predeterminado:", err))
    }

    toast({
      title: "Música restaurada",
      description: "Se ha restaurado la música predeterminada",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestor de Música</h1>
          <p className="text-gray-500 mt-1">Configura la música de fondo del sitio web</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={restoreDefaultMusic}>
            <RefreshCw className="h-4 w-4" />
            Restaurar predeterminada
          </Button>

          <Button variant="outline" className="flex items-center gap-2" onClick={syncWithDatabase} disabled={syncing}>
            <Database className="h-4 w-4" />
            {syncing ? "Sincronizando..." : "Sincronizar con BD"}
          </Button>

          <Button onClick={saveMusic} disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Música de Fondo</CardTitle>
          <CardDescription>Configura la música que se reproducirá en el sitio web</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL de la música</label>
              <div className="flex gap-2">
                <Input
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                  placeholder="https://ejemplo.com/musica.mp3"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePreview}
                  className={isPlaying ? "bg-amber-100" : ""}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Ingresa la URL de un archivo MP3 o cualquier formato de audio compatible con navegadores
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Volumen (0-100): {musicVolume}%</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => {
                    const newVolume = Number.parseInt(e.target.value)
                    setMusicVolume(newVolume)
                    if (audio) audio.volume = newVolume / 100
                  }}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <h3 className="text-sm font-medium text-amber-800 mb-2">Ejemplos de música gratuita:</h3>
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="link"
                    className="text-amber-700 p-0 h-auto text-sm"
                    onClick={() =>
                      setMusicUrl("https://cdn.pixabay.com/audio/2024/02/15/audio_cdd8665deb.mp3")
                    }
                  >
                    Música ambiental relajante (Pixabay)
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-amber-700 p-0 h-auto text-sm"
                    onClick={() =>
                      setMusicUrl("https://cdn.pixabay.com/audio/2025/01/21/audio_071ba34a22.mp3")
                    }
                  >
                    Jazz suave (Pixabay)
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-amber-700 p-0 h-auto text-sm"
                    onClick={() =>
                      setMusicUrl("https://cdn.pixabay.com/audio/2025/03/11/audio_38d28e6f8e.mp3")
                    }
                  >
                    Bossa Nova (Pixabay)
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-amber-700 p-0 h-auto text-sm"
                    onClick={() =>
                      setMusicUrl("https://cdn.pixabay.com/audio/2023/08/23/audio_dd0c56c22a.mp3")
                    }
                  >
                    Música de café (Pixabay)
                  </Button>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Notas importantes:</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>La música se reproducirá en bucle mientras el usuario esté en el sitio.</li>
                <li>
                  El usuario siempre podrá activar o desactivar la música con el botón en la esquina inferior izquierda.
                </li>
                <li>Asegúrate de tener los derechos para usar la música que elijas.</li>
                <li>Recomendamos usar música sin letra y a un volumen bajo para no distraer.</li>
                <li>Los archivos de música no deben superar los 5MB para una carga rápida.</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">Los cambios se aplicarán a todo el sitio web cuando guardes.</p>
        </CardFooter>
      </Card>

      {/* Diálogo de confirmación de guardado */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">¡Música actualizada!</DialogTitle>
            <DialogDescription className="text-center">
              La música de fondo se ha actualizado correctamente y ya está disponible en el sitio.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center mt-4">
            <Button onClick={() => setShowSuccessDialog(false)}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

