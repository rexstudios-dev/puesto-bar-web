"use client"

import { useState, useRef, useEffect } from "react"
import { Music, VolumeX } from "lucide-react"
import { getSiteConfig } from "@/lib/store"

export default function MusicButton() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [config, setConfig] = useState(getSiteConfig())
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Buscar el elemento de audio existente o crear uno nuevo
    const existingAudio = document.getElementById("background-music") as HTMLAudioElement

    if (existingAudio) {
      audioRef.current = existingAudio
    } else {
      // Si no existe, crear uno nuevo (esto no debería ocurrir normalmente)
      const audioElement = document.createElement("audio")
      audioElement.id = "background-music"
      audioElement.loop = true
      audioElement.volume = config.musicVolume / 100
      audioElement.src = config.musicUrl

      document.body.appendChild(audioElement)
      audioRef.current = audioElement
    }

    // Escuchar cambios en la configuración
    const handleConfigChange = (event: CustomEvent) => {
      const newConfig = event.detail
      setConfig(newConfig)
    }

    window.addEventListener("siteConfigChanged", handleConfigChange as EventListener)

    // Limpiar al desmontar (pero no eliminar el elemento si ya existía)
    return () => {
      window.removeEventListener("siteConfigChanged", handleConfigChange as EventListener)
    }
  }, [config.musicUrl, config.musicVolume])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setShowNotification(false)
    } else {
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            setShowNotification(true)

            // Ocultar notificación después de 5 segundos
            setTimeout(() => {
              setShowNotification(false)
            }, 5000)
          })
          .catch((error) => {
            console.error("Error al reproducir audio:", error)
            setIsPlaying(false)
          })
      }
    }
  }

  return (
    <>
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 left-6 z-50 bg-amber-800/90 text-white rounded-full shadow-lg p-3 hover:bg-amber-700 transition-colors"
        aria-label={isPlaying ? "Silenciar música" : "Reproducir música"}
      >
        {isPlaying ? <VolumeX size={20} /> : <Music size={20} />}
      </button>

      {showNotification && (
        <div className="fixed bottom-20 left-6 z-50 bg-amber-800/90 text-white rounded-lg shadow-lg p-2 px-3 text-sm max-w-[200px]">
          Música ambiental activada
        </div>
      )}
    </>
  )
}

