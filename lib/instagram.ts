import { cache } from "react"

interface InstagramMedia {
  id: string
  media_type: string
  media_url: string
  permalink: string
  thumbnail_url?: string
  timestamp: string
  caption?: string
}

interface InstagramStory {
  id: string
  media_type: string
  media_url: string
  timestamp: string
}

// Simplificar las funciones para que no dependan de Instagram API
export const fetchInstagramPosts = cache(async () => {
  try {
    // Datos de ejemplo para cuando no hay acceso a Instagram
    return [
      {
        id: "1",
        media_type: "IMAGE",
        media_url: "/placeholder.svg?height=600&width=600",
        permalink: "https://instagram.com/puesto.sanvicente",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        caption: "Disfruta de nuestro café de especialidad ☕",
      },
      {
        id: "2",
        media_type: "IMAGE",
        media_url: "/placeholder.svg?height=600&width=600",
        permalink: "https://instagram.com/puesto.sanvicente",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        caption: "Nuevos postres para esta temporada 🍰",
      },
      {
        id: "3",
        media_type: "IMAGE",
        media_url: "/placeholder.svg?height=600&width=600",
        permalink: "https://instagram.com/puesto.sanvicente",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        caption: "Nuestros cócteles de autor 🍹",
      },
      {
        id: "4",
        media_type: "IMAGE",
        media_url: "/placeholder.svg?height=600&width=600",
        permalink: "https://instagram.com/puesto.sanvicente",
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        caption: "Ven a disfrutar de nuestras noches de música en vivo 🎵",
      },
    ]
  } catch (error) {
    console.error("Error fetching Instagram posts:", error)
    return []
  }
})

export const fetchInstagramStories = cache(async () => {
  try {
    // Datos de ejemplo para cuando no hay acceso a Instagram
    return [
      {
        id: "story-1",
        media_type: "IMAGE",
        media_url: "/placeholder.svg?height=800&width=450",
        timestamp: new Date().toISOString(),
      },
      {
        id: "story-2",
        media_type: "IMAGE",
        media_url: "/placeholder.svg?height=800&width=450",
        timestamp: new Date().toISOString(),
      },
      {
        id: "story-3",
        media_type: "IMAGE",
        media_url: "/placeholder.svg?height=800&width=450",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  } catch (error) {
    console.error("Error fetching Instagram stories:", error)
    return []
  }
})

