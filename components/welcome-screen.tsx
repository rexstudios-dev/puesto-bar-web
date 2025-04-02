"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Coffee, Music } from "lucide-react"
import { getSiteConfig } from "@/lib/store"

export default function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [config, setConfig] = useState(getSiteConfig())
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Crear el elemento de audio
    const audioElement = document.createElement("audio")
    audioElement.id = "background-music"
    audioElement.loop = true
    audioElement.volume = config.musicVolume / 100
    audioElement.src = config.musicUrl

    document.body.appendChild(audioElement)
    audioRef.current = audioElement

    // SIEMPRE mostrar la pantalla de bienvenida al cargar la página
    // a menos que esté desactivada en la configuración
    setIsVisible(config.showWelcomeScreen)

    // Escuchar cambios en la configuración
    const handleConfigChange = (event: CustomEvent) => {
      const newConfig = event.detail
      setConfig(newConfig)

      if (audioRef.current) {
        audioRef.current.src = newConfig.musicUrl
        audioRef.current.volume = newConfig.musicVolume / 100
      }
    }

    window.addEventListener("siteConfigChanged", handleConfigChange as EventListener)

    // Limpiar al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        document.body.removeChild(audioRef.current)
        audioRef.current = null
      }
      window.removeEventListener("siteConfigChanged", handleConfigChange as EventListener)
    }
  }, [config.showWelcomeScreen, config.musicUrl, config.musicVolume])

  const handleEnter = () => {
    // Reproducir música cuando el usuario hace clic
    if (audioRef.current) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error al reproducir audio:", error)
        })
      }
    }

    // Ocultar la pantalla de bienvenida
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-amber-900 bg-opacity-95 z-50 flex flex-col items-center justify-center text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center max-w-md px-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Coffee className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">{config.siteName}</h1>
            <p className="mb-8 text-amber-100">
              Te invitamos a disfrutar de nuestra experiencia completa con música ambiental que complementa la atmósfera
              de nuestro espacio.
            </p>

            <button
              onClick={handleEnter}
              className="bg-white text-amber-900 hover:bg-amber-100 transition-colors py-3 px-8 rounded-full font-medium flex items-center gap-2 mx-auto"
            >
              <Music className="h-5 w-5" />
              Entrar con música
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className="mt-4 text-amber-200 hover:text-white transition-colors py-2 px-4 rounded-full mx-auto block"
            >
              Entrar sin música
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

