"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown, Coffee, Utensils, Wine } from "lucide-react"
import { getSiteConfig } from "@/lib/store"

// Definir elementos flotantes con valores fijos para evitar problemas de hidratación
const floatingElements = [
  { icon: "coffee", x: 20, y: 30, size: 40, rotate: 120, opacity: 0.2, animationDuration: 25, delay: 0 },
  { icon: "utensils", x: -15, y: 50, size: 35, rotate: 75, opacity: 0.18, animationDuration: 20, delay: 2 },
  { icon: "wine", x: 5, y: 70, size: 45, rotate: 210, opacity: 0.22, animationDuration: 30, delay: 1 },
  { icon: "coffee", x: -25, y: 20, size: 30, rotate: 180, opacity: 0.15, animationDuration: 22, delay: 3 },
  { icon: "utensils", x: 30, y: 40, size: 38, rotate: 90, opacity: 0.2, animationDuration: 28, delay: 1.5 },
  { icon: "wine", x: -10, y: 60, size: 42, rotate: 135, opacity: 0.17, animationDuration: 26, delay: 2.5 },
  { icon: "coffee", x: 15, y: 80, size: 32, rotate: 225, opacity: 0.19, animationDuration: 24, delay: 0.5 },
  { icon: "utensils", x: -20, y: 35, size: 36, rotate: 45, opacity: 0.21, animationDuration: 27, delay: 1.8 },
  { icon: "wine", x: 25, y: 55, size: 33, rotate: 270, opacity: 0.16, animationDuration: 23, delay: 3.2 },
  { icon: "coffee", x: 0, y: 25, size: 37, rotate: 315, opacity: 0.23, animationDuration: 29, delay: 0.8 },
  { icon: "utensils", x: -30, y: 75, size: 34, rotate: 150, opacity: 0.19, animationDuration: 21, delay: 2.2 },
  { icon: "wine", x: 10, y: 45, size: 39, rotate: 240, opacity: 0.2, animationDuration: 25, delay: 1.2 },
  { icon: "coffee", x: -5, y: 65, size: 31, rotate: 30, opacity: 0.17, animationDuration: 26, delay: 2.8 },
  { icon: "utensils", x: 20, y: 15, size: 43, rotate: 180, opacity: 0.22, animationDuration: 22, delay: 0.3 },
  { icon: "wine", x: -15, y: 85, size: 36, rotate: 90, opacity: 0.18, animationDuration: 28, delay: 1.7 },
]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  const [time, setTime] = useState(new Date())
  const [isClient, setIsClient] = useState(false)
  const [heroSettings, setHeroSettings] = useState({
    title: "Puesto Bar",
    subtitle: "Café, comida y tragos en San Vicente, Buenos Aires",
    buttonText: "Ver Menú",
    buttonLink: "#menu",
    showStatusBadge: true,
    backgroundImage: "/img/instagram/hero.jpg",
    overlayOpacity: 50,
    showScrollIndicator: true,
  })

  useEffect(() => {
    // Marcar que estamos en el cliente
    setIsClient(true)

    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // Cargar configuración
    const config = getSiteConfig()
    if (config.heroContent) {
      setHeroSettings(config.heroContent)
    }

    // Escuchar cambios en la configuración
    const handleConfigChange = (event: CustomEvent) => {
      const newConfig = event.detail
      if (newConfig.heroContent) {
        setHeroSettings(newConfig.heroContent)
      }
    }

    window.addEventListener("siteConfigChanged", handleConfigChange as EventListener)

    return () => {
      clearInterval(timer)
      window.removeEventListener("siteConfigChanged", handleConfigChange as EventListener)
    }
  }, [])

  const isOpen = () => {
    const hour = time.getHours()
    const day = time.getDay()

    // Lunes a Jueves: 8:00 - 23:00
    if (day >= 1 && day <= 4) {
      return hour >= 8 && hour < 23
    }
    // Viernes y Sábados: 8:00 - 01:00
    else if (day === 5 || day === 6) {
      return hour >= 8 || hour < 1
    }
    // Domingos: 9:00 - 22:00
    else {
      return hour >= 9 && hour < 22
    }
  }

  // Renderizar el icono según el tipo
  const renderIcon = (type: string, size: number) => {
    switch (type) {
      case "coffee":
        return <Coffee size={size} />
      case "utensils":
        return <Utensils size={size} />
      case "wine":
        return <Wine size={size} />
      default:
        return <Coffee size={size} />
    }
  }

  return (
    <section id="home" ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroSettings.backgroundImage}')` }}
        />
        <div className="absolute inset-0 bg-black" style={{ opacity: heroSettings.overlayOpacity / 100 }} />
      </motion.div>

      {/* Floating Elements - Solo renderizar en el cliente para evitar problemas de hidratación */}
      {isClient && (
        <div className="absolute inset-0 z-10 overflow-hidden">
          {floatingElements.map((element, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20"
              initial={{
                x: `${element.x}%`,
                y: `${element.y}%`,
                rotate: element.rotate,
                opacity: element.opacity,
              }}
              animate={{
                y: [`${element.y}%`, `${element.y - 20}%`],
                rotate: element.rotate + 180,
              }}
              transition={{
                duration: element.animationDuration,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: element.delay,
              }}
            >
              {renderIcon(element.icon, element.size)}
            </motion.div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ opacity }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{heroSettings.title}</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">{heroSettings.subtitle}</p>

          {/* Status Badge - Solo mostrar en el cliente */}
          {isClient && heroSettings.showStatusBadge && (
            <div className="flex justify-center mb-8">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isOpen() ? "bg-green-500/80" : "bg-red-500/80"}`}
              >
                <span
                  className={`h-3 w-3 rounded-full ${isOpen() ? "bg-green-300 animate-pulse" : "bg-red-300"}`}
                ></span>
                <span className="text-white font-medium">{isOpen() ? "Abierto ahora" : "Cerrado ahora"}</span>
                <span className="text-white/80 text-sm">
                  {time.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          )}

          <motion.a
            href={heroSettings.buttonLink}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {heroSettings.buttonText}
          </motion.a>
        </motion.div>
      </div>

      {heroSettings.showScrollIndicator && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <a href="#about" className="text-white">
            <ArrowDown size={32} />
          </a>
        </motion.div>
      )}
    </section>
  )
}

