"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import Image from "next/image"
import { Instagram, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { getSiteConfig } from "@/lib/store"

export default function InstagramFeedStatic() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [posts, setPosts] = useState([
    {
      id: "1",
      imageUrl: "/img/instagram/post1.jpg",
      caption: "Disfruta de nuestro café de especialidad ☕",
      likes: 45,
      date: "2 días",
    },
    {
      id: "2",
      imageUrl: "/img/instagram/post2.jpg",
      caption: "Nuevos postres para esta temporada 🍰",
      likes: 67,
      date: "5 días",
    },
    {
      id: "3",
      imageUrl: "/img/instagram/post3.jpg",
      caption: "Nuestros cócteles de autor 🍹",
      likes: 38,
      date: "1 semana",
    },
    {
      id: "4",
      imageUrl: "/img/instagram/post4.jpg",
      caption: "Ven a disfrutar de nuestras noches de música en vivo 🎵",
      likes: 52,
      date: "2 semanas",
    },
  ])
  const [stories, setStories] = useState([
    {
      id: "1",
      imageUrl: "/img/instagram/story1.jpg",
      date: "Hoy",
    },
    {
      id: "2",
      imageUrl: "/img/instagram/story2.jpg",
      date: "Hoy",
    },
    {
      id: "3",
      imageUrl: "/img/instagram/story3.jpg",
      date: "Ayer",
    },
  ])

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    // Cargar configuración
    const config = getSiteConfig()

    if (config.instagramPosts && config.instagramPosts.length > 0) {
      const formattedPosts = config.instagramPosts.map((post) => ({
        id: post.id.toString(),
        imageUrl: post.preview || "/placeholder.svg",
        caption: post.filename || "Instagram post",
        likes: Math.floor(Math.random() * 100) + 20,
        date: "Reciente",
      }))
      setPosts(formattedPosts)
    }

    if (config.instagramStories && config.instagramStories.length > 0) {
      const formattedStories = config.instagramStories.map((story) => ({
        id: story.id.toString(),
        imageUrl: story.preview || "/placeholder.svg",
        date: "Reciente",
      }))
      setStories(formattedStories)
    }

    // Escuchar cambios en la configuración
    const handleConfigChange = (event: CustomEvent) => {
      const newConfig = event.detail

      if (newConfig.instagramPosts && newConfig.instagramPosts.length > 0) {
        const formattedPosts = newConfig.instagramPosts.map((post) => ({
          id: post.id.toString(),
          imageUrl: post.preview || "/placeholder.svg",
          caption: post.filename || "Instagram post",
          likes: Math.floor(Math.random() * 100) + 20,
          date: "Reciente",
        }))
        setPosts(formattedPosts)
      }

      if (newConfig.instagramStories && newConfig.instagramStories.length > 0) {
        const formattedStories = newConfig.instagramStories.map((story) => ({
          id: story.id.toString(),
          imageUrl: story.preview || "/placeholder.svg",
          date: "Reciente",
        }))
        setStories(formattedStories)
      }
    }

    window.addEventListener("siteConfigChanged", handleConfigChange as EventListener)

    return () => {
      window.removeEventListener("siteConfigChanged", handleConfigChange as EventListener)
    }
  }, [])

  const nextStory = () => {
    setCurrentStoryIndex((prevIndex) => (prevIndex === stories.length - 1 ? 0 : prevIndex + 1))
  }

  const prevStory = () => {
    setCurrentStoryIndex((prevIndex) => (prevIndex === 0 ? stories.length - 1 : prevIndex - 1))
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  return (
    <section id="instagram" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Instagram className="h-6 w-6 text-amber-900" />
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 text-center">@puesto.sanvicente</h2>
          </div>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Síguenos en Instagram para estar al día con nuestras novedades, eventos y promociones.
          </p>

          {/* Instagram Stories */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Historias</h3>
            <div className="relative max-w-sm mx-auto h-[600px] bg-gray-100 rounded-xl overflow-hidden shadow-lg">
              {/* Story Image */}
              {stories.length > 0 && (
                <Image
                  src={stories[currentStoryIndex].imageUrl || "/placeholder.svg?height=800&width=450"}
                  alt="Instagram Story"
                  fill
                  className="object-cover"
                />
              )}

              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
                {stories.map((_, index) => (
                  <div key={index} className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                    <div
                      className={`h-full bg-white ${index === currentStoryIndex && !isPaused ? "animate-progress" : ""} ${
                        index < currentStoryIndex ? "w-full" : index > currentStoryIndex ? "w-0" : ""
                      }`}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
                <button
                  onClick={prevStory}
                  className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                  aria-label="Previous story"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={togglePause}
                  className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                  aria-label={isPaused ? "Play" : "Pause"}
                >
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>

                <button
                  onClick={nextStory}
                  className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                  aria-label="Next story"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Instagram Posts */}
          <div>
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Publicaciones Recientes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {posts.map((post, index) => (
                <motion.a
                  key={post.id}
                  href="https://instagram.com/puesto.sanvicente"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-square rounded-lg overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Image
                    src={post.imageUrl || "/placeholder.svg?height=600&width=600"}
                    alt={post.caption}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-sm line-clamp-2">{post.caption}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="text-center mt-8">
              <a
                href="https://instagram.com/puesto.sanvicente"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-full transition-colors"
              >
                <Instagram size={18} />
                Ver más en Instagram
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

