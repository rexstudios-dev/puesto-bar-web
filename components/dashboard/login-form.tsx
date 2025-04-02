"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Lock, User, AlertCircle } from "lucide-react"

export default function DashboardLoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      //en produccion la mejor opcion es usar la api para menos vulnerabilidad 
      if (username === "puesto-bar@admin.com" && password === "ARDSMI") {
        // Guardar estado de autenticación en localStorage
        localStorage.setItem("puestoBarDashboardAuth", "true")
        localStorage.setItem("puestoBarDashboardAuthTime", new Date().toISOString())

        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al panel de administración",
          variant: "default",
        })

        // Redirigir al dashboard
        router.push("/dashboard")
      } else {
        setError("Credenciales incorrectas")
      }
    } catch (err) {
      console.error("Error en login:", err)
      setError("Ocurrió un error al intentar iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Acceso Administrativo</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para acceder al panel de administración principal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-10"
                  required
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verificando..." : "Acceder"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Este panel es exclusivo para el administrador principal
          <br />
          <span className="text-amber-600 font-medium">Usuario: admin / Contraseña: admin123</span>
        </p>
      </CardFooter>
    </Card>
  )
}

