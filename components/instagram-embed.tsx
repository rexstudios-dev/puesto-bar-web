"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram } from "lucide-react"
import Image from "next/image"

export default function InstagramEmbed() {
  const [loading, setLoading] = useState(true)

  // Simular carga de contenido
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Datos de ejemplo para mostrar
  const posts = [
    {
      id: "1",
      imageUrl: "/placeholder.svg?height=600&width=600",
      caption: "Disfruta de nuestro café de especialidad ☕",
      likes: 45,
      date: "2 días",
    },
    {
      id: "2",
      imageUrl: "/placeholder.svg?height=600&width=600",
      caption: "Nuevos postres para esta temporada 🍰",
      likes: 67,
      date: "5 días",
    },
    {
      id: "3",
      imageUrl: "/placeholder.svg?height=600&width=600",
      caption: "Nuestros cócteles de autor 🍹",
      likes: 38,
      date: "1 semana",
    },
    {
      id: "4",
      imageUrl: "/placeholder.svg?height=600&width=600",
      caption: "Ven a disfrutar de nuestras noches de música en vivo 🎵",
      likes: 52,
      date: "2 semanas",
    },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Instagram className="h-6 w-6 text-amber-900" />
        <h2 className="text-2xl font-bold text-amber-900">@puesto.sanvicente</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden group">
              <CardContent className="p-0 relative">
                <div className="aspect-square relative">
                  <Image
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.caption}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-white text-sm line-clamp-2">{post.caption}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white/80 text-xs">{post.likes} likes</span>
                    <span className="text-white/80 text-xs">{post.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <a
          href="https://instagram.com/puesto.sanvicente"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-full transition-colors"
        >
          <Instagram size={18} />
          Seguir en Instagram
        </a>
      </div>
    </div>
  )
}

