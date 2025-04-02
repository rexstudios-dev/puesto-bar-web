"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { getSiteConfig } from "@/lib/store"

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
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

  useEffect(() => {
    // Cargar configuración
    const config = getSiteConfig()
    if (config.aboutContent) {
      setAboutContent(config.aboutContent)
    }

    // Escuchar cambios en la configuración
    const handleConfigChange = (event: CustomEvent) => {
      const newConfig = event.detail
      if (newConfig.aboutContent) {
        setAboutContent(newConfig.aboutContent)
      }
    }

    window.addEventListener("siteConfigChanged", handleConfigChange as EventListener)

    return () => {
      window.removeEventListener("siteConfigChanged", handleConfigChange as EventListener)
    }
  }, [])

  return (
    <section id="about" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6">{aboutContent.title}</h2>
          <p className="text-lg text-gray-700 mb-8">{aboutContent.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-amber-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-amber-800 mb-3">{aboutContent.feature1Title}</h3>
              <p className="text-gray-700">{aboutContent.feature1Description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-amber-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-amber-800 mb-3">{aboutContent.feature2Title}</h3>
              <p className="text-gray-700">{aboutContent.feature2Description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-amber-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-amber-800 mb-3">{aboutContent.feature3Title}</h3>
              <p className="text-gray-700">{aboutContent.feature3Description}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

