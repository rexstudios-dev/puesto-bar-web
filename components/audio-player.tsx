"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

export default function AudioPlayer() {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationDismissed, setNotificationDismissed] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Solo ejecutar en el cliente
  useEffect(() => {
    // Crear el elemento de audio
    const audioElement = document.createElement("audio")
    audioElement.id = "background-music"
    audioElement.loop = true
    audioElement.volume = 0.2 // Volumen bajo (20%)

    // Añadir múltiples fuentes para mejor compatibilidad
    const sourceM4A = document.createElement("source")
    sourceM4A.src = "/audio/ambient-electronic.m4a"
    sourceM4A.type = "audio/mp4"

    const sourceMP3 = document.createElement("source")
    sourceMP3.src = "/audio/ambient-electronic.mp3"
    sourceMP3.type = "audio/mpeg"

    audioElement.appendChild(sourceM4A)
    audioElement.appendChild(sourceMP3)

    document.body.appendChild(audioElement)
    audioRef.current = audioElement

    // Intentar reproducir automáticamente
    const playPromise = audioElement.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Reproducción automática exitosa")
          // Mostrar notificación
          setShowNotification(true)

          // Ocultar notificación después de 8 segundos
          setTimeout(() => {
            if (!notificationDismissed) {
              setShowNotification(false)
            }
          }, 8000)
        })
        .catch((error) => {
          console.error("Reproducción automática fallida:", error)
          // No mostrar notificación si falla la reproducción
        })
    }

    // Limpiar al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        document.body.removeChild(audioRef.current)
        audioRef.current = null
      }
    }
  }, [notificationDismissed])

  const dismissNotification = () => {
    setShowNotification(false)
    setNotificationDismissed(true)
  }

  if (!showNotification) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-amber-800/90 text-white rounded-lg shadow-lg p-3 px-4 flex items-center gap-3 max-w-sm">
      <div className="flex-1">
        <p className="text-sm">Estás escuchando música ambiental de Puesto Bar</p>
      </div>
      <button onClick={dismissNotification} className="text-white/80 hover:text-white" aria-label="Cerrar notificación">
        <X size={18} />
      </button>
    </div>
  )
}

