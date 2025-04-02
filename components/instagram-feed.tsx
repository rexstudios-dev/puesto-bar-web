"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import Image from "next/image"
import { Instagram, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

interface InstagramPost {
  id: string
  imageUrl: string
  caption: string
  likes: number
  timestamp: string
  permalink: string
}

interface InstagramStory {
  id: string
  imageUrl: string
  timestamp: string
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [stories, setStories] = useState<InstagramStory[]>([])
  const [loading, setLoading] = useState(true)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch Instagram data using a proxy approach
  useEffect(() => {
    const fetchInstagramData = async () => {
      setLoading(true)

      try {
        // Simulating a fetch from a proxy service that scrapes Instagram
        // In a real implementation, you would use a service like Proxycurl, Apify, or a custom proxy
        setTimeout(() => {
          // Simulated data - in a real implementation this would come from the proxy service
          setPosts(generateInstagramPosts())
          setStories(generateInstagramStories())
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching Instagram data:", error)
        // Fallback to generated data
        setPosts(generateInstagramPosts())
        setStories(generateInstagramStories())
        setLoading(false)
      }
    }

    fetchInstagramData()
  }, [])

  // Auto-advance stories
  useEffect(() => {
    if (stories.length === 0 || isPaused) return

    // Clear any existing timer
    if (storyTimerRef.current) {
      clearTimeout(storyTimerRef.current)
    }

    // Set a new timer
    storyTimerRef.current = setTimeout(() => {
      setCurrentStoryIndex((prevIndex) => (prevIndex === stories.length - 1 ? 0 : prevIndex + 1))
    }, 5000) // 5 seconds per story

    // Cleanup
    return () => {
      if (storyTimerRef.current) {
        clearTimeout(storyTimerRef.current)
      }
    }
  }, [currentStoryIndex, stories.length, isPaused])

  // Generate realistic Instagram posts
  const generateInstagramPosts = (): InstagramPost[] => {
    // Imágenes personalizadas para publicaciones - REEMPLAZA ESTAS URLS CON TUS PROPIAS IMÁGENES
    const customImages = [
      "/img/instagram/post1.jpg", // Reemplaza con tus propias imágenes
      "/img/instagram/post2.jpg",
      "/img/instagram/post3.jpg",
      "/img/instagram/post4.jpg",
    ]

    const captions = [
      "Disfruta de nuestro café de especialidad ☕ #cafe #especialidad #puesto",
      "Nuevos tragos para esta temporada 🍰 #postres #dulce #puesto",
      "Nuestros cócteles de autor 🍹 #cocktails #bartender #puesto",
      "Ven a disfrutar de nuestras noches de música en vivo 🎵 #musica #envivo #puesto",
    ]

    return Array.from({ length: 8 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 14)) // Random date within last 2 weeks

      return {
        id: `post-${i + 1}`,
        // Usar imagen personalizada si está disponible, o fallback a placeholder
        imageUrl: customImages[i] || `/placeholder.svg?height=${600 + i * 10}&width=${600 + i * 10}`,
        caption: captions[i % captions.length],
        likes: Math.floor(Math.random() * 100) + 20,
        timestamp: date.toISOString(),
        permalink: "https://instagram.com/puesto.sanvicente",
      }
    })
  }

  // Generate realistic Instagram stories
  const generateInstagramStories = (): InstagramStory[] => {
    // Imágenes personalizadas para historias - REEMPLAZA ESTAS URLS CON TUS PROPIAS IMÁGENES
    const customStoryImages = [
      "/img/instagram/story1.jpg", // Reemplaza con tus propias imágenes
      "/img/instagram/story2.jpg",
      "/img/instagram/story3.jpg",
      "/img/instagram/story4.jpg",
      "/img/instagram/story5.jpg",
    ]

    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date()
      date.setHours(date.getHours() - Math.floor(Math.random() * 24)) // Random time within last 24 hours

      return {
        id: `story-${i + 1}`,
        // Usar imagen personalizada si está disponible, o fallback a placeholder
        imageUrl: customStoryImages[i] || `/placeholder.svg?height=${800 + i * 10}&width=${450 + i * 5}`,
        timestamp: date.toISOString(),
      }
    })
  }

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    return date.toLocaleDateString()
  }

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

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
            </div>
          ) : (
            <>
              {/* Instagram Stories */}
              {stories.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-amber-800 mb-4">Historias</h3>
                  <div className="relative max-w-sm mx-auto h-[600px] bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                    {/* Story Image */}
                    <Image
                      src={stories[currentStoryIndex].imageUrl || "/story1.jpg"}
                      alt="Instagram Story"
                      fill
                      className="object-cover"
                    />

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

                    {/* Story Header */}
                    <div className="absolute top-4 left-0 right-0 flex items-center px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center text-white">
                          <Instagram size={16} />
                        </div>
                        <div className="text-white">
                          <p className="text-sm font-medium">puesto.sanvicente</p>
                          <p className="text-xs opacity-80">{formatTimestamp(stories[currentStoryIndex].timestamp)}</p>
                        </div>
                      </div>
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
              )}

              {/* Instagram Posts */}
              <div>
                <h3 className="text-xl font-semibold text-amber-800 mb-4">Publicaciones Recientes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {posts.map((post, index) => (
                    <motion.a
                      key={post.id}
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-square rounded-lg overflow-hidden group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Image
                        src={post.imageUrl || "/placeholder.svg"}
                        alt={post.caption}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-white text-sm line-clamp-2">{post.caption}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-white/80 text-xs">{post.likes} likes</span>
                          <span className="text-white/80 text-xs">{formatTimestamp(post.timestamp)}</span>
                        </div>
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
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}

