// Modificar la API para que funcione sin variables de entorno
import { NextResponse } from "next/server"

// Datos de respaldo para cuando no hay acceso a Instagram
const fallbackPosts = [
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

const fallbackStories = [
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

export async function GET() {
  try {
    return NextResponse.json({
      posts: fallbackPosts,
      stories: fallbackStories,
    })
  } catch (error) {
    console.error("Error in Instagram API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

