import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Puesto Bar - San Vicente, Buenos Aires",
  description: "Café, comida y tragos en San Vicente, Buenos Aires, Argentina",
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Añadir metaetiqueta para permitir autoplay en algunos navegadores */}
        <meta name="theme-color" content="#f9f5f0" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'