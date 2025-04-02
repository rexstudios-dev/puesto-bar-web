"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Coffee, Globe, TrendingUp, Calendar, Clock } from "lucide-react"

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    visitorsToday: 245,
    totalVisits: 12458,
    menuItems: 48,
    lastMenuUpdate: "15/03/2025",
  })

  // Cargar datos guardados
  useEffect(() => {
    // Intentar cargar estadísticas guardadas
    const savedStats = localStorage.getItem("puestoBarDashboardStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }

    // Contar ítems del menú si hay datos guardados
    const savedMenu = localStorage.getItem("puestoBarDashboardMenu")
    if (savedMenu) {
      try {
        const menuData = JSON.parse(savedMenu)
        let itemCount = 0

        // Contar todos los ítems en todas las categorías
        Object.values(menuData).forEach((items: any[]) => {
          itemCount += items.length
        })

        // Actualizar el contador de ítems
        setStats((prev) => ({
          ...prev,
          menuItems: itemCount,
        }))

        // Obtener fecha de última actualización
        const lastUpdate = localStorage.getItem("puestoBarDashboardMenuLastUpdate")
        if (lastUpdate) {
          setStats((prev) => ({
            ...prev,
            lastMenuUpdate: new Date(lastUpdate).toLocaleDateString(),
          }))
        }
      } catch (error) {
        console.error("Error counting menu items:", error)
      }
    }

    // Simular incremento de visitantes (solo para demo)
    const interval = setInterval(() => {
      setStats((prev) => {
        const newStats = {
          ...prev,
          visitorsToday: prev.visitorsToday + Math.floor(Math.random() * 3),
        }
        localStorage.setItem("puestoBarDashboardStats", JSON.stringify(newStats))
        return newStats
      })
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bienvenido al panel de administración principal de Puesto Bar</p>
      </div>

      {/* Actualizar las tarjetas para usar los datos dinámicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Hoy</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visitorsToday}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.2% desde ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visitas Totales</CardTitle>
            <Globe className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits.toLocaleString()}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ítems en Menú</CardTitle>
            <Coffee className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.menuItems}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Última actualización: {stats.lastMenuUpdate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hora Actual</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date().toLocaleTimeString()}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="actividad" className="w-full">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="actividad">Actividad Reciente</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="tareas">Tareas Pendientes</TabsTrigger>
        </TabsList>

        <TabsContent value="actividad" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones realizadas en el panel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Actualización de precios</p>
                    <p className="text-sm text-gray-500">Se actualizaron 12 precios en el menú</p>
                    <p className="text-xs text-gray-400 mt-1">Hace 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                    <Coffee className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Nuevo ítem añadido</p>
                    <p className="text-sm text-gray-500">Se añadió "Cappuccino Especial" al menú</p>
                    <p className="text-xs text-gray-400 mt-1">Hace 5 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Cambio de apariencia</p>
                    <p className="text-sm text-gray-500">Se actualizaron los colores del sitio</p>
                    <p className="text-xs text-gray-400 mt-1">Ayer a las 15:30</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Inicio de sesión</p>
                    <p className="text-sm text-gray-500">Administrador inició sesión</p>
                    <p className="text-xs text-gray-400 mt-1">Ayer a las 09:15</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas Generales</CardTitle>
              <CardDescription>Resumen de las métricas principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Tráfico del sitio</span>
                    <span className="text-sm text-gray-500">12,458 visitas</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Tasa de rebote</span>
                    <span className="text-sm text-gray-500">32.4%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "32.4%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Tiempo promedio en el sitio</span>
                    <span className="text-sm text-gray-500">2m 45s</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Visitantes móviles</span>
                    <span className="text-sm text-gray-500">68.4%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "68.4%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tareas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tareas Pendientes</CardTitle>
              <CardDescription>Acciones que requieren atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Actualizar precios del menú de cafetería</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Subir nuevas fotos para la sección de Instagram</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Revisar textos de la sección "Nosotros"</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Actualizar horarios de atención</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Cambiar música de fondo del sitio</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

