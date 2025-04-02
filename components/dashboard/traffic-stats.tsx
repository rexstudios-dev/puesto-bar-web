"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Users, Globe, Clock, Calendar, Smartphone, Monitor, BarChart4, PieChart, Map, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Datos simulados de tráfico web
const defaultTrafficData = {
  totalVisits: 12458,
  uniqueVisitors: 8723,
  pageViews: 35621,
  avgTimeOnSite: "2m 45s",
  bounceRate: "32.4%",
  newVisitors: "65.2%",
  returningVisitors: "34.8%",
  topPages: [
    { page: "Página principal", visits: 8245 },
    { page: "Menú", visits: 5632 },
    { page: "Ubicación", visits: 3421 },
    { page: "Nosotros", visits: 2187 },
    { page: "Instagram", visits: 1954 },
  ],
  trafficSources: [
    { source: "Búsqueda orgánica", percentage: 42.5 },
    { source: "Redes sociales", percentage: 28.7 },
    { source: "Directo", percentage: 18.3 },
    { source: "Referencias", percentage: 7.2 },
    { source: "Email", percentage: 3.3 },
  ],
  devices: [
    { device: "Móvil", percentage: 68.4 },
    { device: "Desktop", percentage: 24.7 },
    { device: "Tablet", percentage: 6.9 },
  ],
  locations: [
    { location: "Buenos Aires", visits: 7845 },
    { location: "CABA", visits: 2134 },
    { location: "Córdoba", visits: 876 },
    { location: "Rosario", visits: 543 },
    { location: "Mendoza", visits: 421 },
  ],
}

export default function TrafficStats() {
  const [timeRange, setTimeRange] = useState("7d")
  const [trafficData, setTrafficData] = useState(defaultTrafficData)
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleDateString())
  const { toast } = useToast()

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const loadTrafficData = () => {
      try {
        const savedData = localStorage.getItem("puestoBarTrafficData")
        const savedTimeRange = localStorage.getItem("puestoBarTrafficTimeRange")
        const savedLastUpdated = localStorage.getItem("puestoBarTrafficLastUpdated")

        if (savedData) setTrafficData(JSON.parse(savedData))
        if (savedTimeRange) setTimeRange(savedTimeRange)
        if (savedLastUpdated) setLastUpdated(savedLastUpdated)
      } catch (error) {
        console.error("Error loading traffic data:", error)
      }
    }

    loadTrafficData()
  }, [])

  // Guardar cambios cuando cambia el rango de tiempo
  useEffect(() => {
    localStorage.setItem("puestoBarTrafficTimeRange", timeRange)

    // Simular cambios en los datos según el rango de tiempo seleccionado
    const updatedData = { ...defaultTrafficData }

    if (timeRange === "30d") {
      updatedData.totalVisits = Math.round(defaultTrafficData.totalVisits * 3.7)
      updatedData.uniqueVisitors = Math.round(defaultTrafficData.uniqueVisitors * 3.2)
    } else if (timeRange === "90d") {
      updatedData.totalVisits = Math.round(defaultTrafficData.totalVisits * 8.5)
      updatedData.uniqueVisitors = Math.round(defaultTrafficData.uniqueVisitors * 7.1)
    } else if (timeRange === "1y") {
      updatedData.totalVisits = Math.round(defaultTrafficData.totalVisits * 24.3)
      updatedData.uniqueVisitors = Math.round(defaultTrafficData.uniqueVisitors * 18.7)
    }

    setTrafficData(updatedData)
    localStorage.setItem("puestoBarTrafficData", JSON.stringify(updatedData))

    const now = new Date().toLocaleDateString()
    setLastUpdated(now)
    localStorage.setItem("puestoBarTrafficLastUpdated", now)
  }, [timeRange])

  const exportData = () => {
    try {
      // Crear un objeto con los datos a exportar
      const exportObj = {
        timeRange,
        data: trafficData,
        exportDate: new Date().toISOString(),
      }

      // Convertir a JSON y crear un blob
      const dataStr = JSON.stringify(exportObj, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })

      // Crear un enlace de descarga
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `puesto-bar-traffic-${timeRange}-${new Date().toISOString().split("T")[0]}.json`

      // Simular clic y limpiar
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Datos exportados",
        description: "Los datos de tráfico se han exportado correctamente",
        variant: "default",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Error",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas de Tráfico</h1>
          <p className="text-gray-500 mt-1">Análisis del tráfico web y comportamiento de los usuarios</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Personalizar fechas
          </Button>

          <Button variant="outline" className="flex items-center gap-2" onClick={exportData}>
            <Download className="h-4 w-4" />
            Exportar datos
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
            7 días
          </Button>
          <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
            30 días
          </Button>
          <Button variant={timeRange === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("90d")}>
            90 días
          </Button>
          <Button variant={timeRange === "1y" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("1y")}>
            1 año
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          Datos actualizados: <span className="font-medium">{lastUpdated}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visitas Totales</CardTitle>
            <Globe className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.totalVisits.toLocaleString()}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <BarChart4 className="h-3 w-3 mr-1" />
              +15.2% desde el período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <BarChart4 className="h-3 w-3 mr-1" />
              +12.8% desde el período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.avgTimeOnSite}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <BarChart4 className="h-3 w-3 mr-1" />
              +0.5% desde el período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Rebote</CardTitle>
            <PieChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.bounceRate}</div>
            <p className="text-xs text-red-500 flex items-center mt-1">
              <BarChart4 className="h-3 w-3 mr-1" />
              +2.1% desde el período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-[500px]">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Fuentes
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Dispositivos
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Ubicaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Páginas Más Visitadas</CardTitle>
                <CardDescription>Las páginas con mayor tráfico en el sitio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficData.topPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <span className="text-gray-500">{page.visits.toLocaleString()} visitas</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visitantes</CardTitle>
                <CardDescription>Distribución de visitantes nuevos y recurrentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center">
                  <div className="w-[200px] h-[200px] rounded-full border-[30px] border-amber-500 relative">
                    <div
                      className="absolute inset-0 rounded-full border-[30px] border-t-gray-300 border-r-gray-300 border-b-gray-300 border-l-transparent"
                      style={{ transform: "rotate(115deg)" }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold">{trafficData.newVisitors}</span>
                      <span className="text-xs text-gray-500">Nuevos</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <span>Nuevos visitantes: {trafficData.newVisitors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                    <span>Recurrentes: {trafficData.returningVisitors}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Fuentes de Tráfico</CardTitle>
              <CardDescription>De dónde provienen los visitantes del sitio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficData.trafficSources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{source.source}</span>
                      <span>{source.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dispositivos</CardTitle>
              <CardDescription>Tipos de dispositivos utilizados para acceder al sitio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trafficData.devices.map((device, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="mb-4">
                      {device.device === "Móvil" ? (
                        <Smartphone className="h-12 w-12 text-amber-500" />
                      ) : device.device === "Desktop" ? (
                        <Monitor className="h-12 w-12 text-amber-500" />
                      ) : (
                        <Smartphone className="h-12 w-12 text-amber-500" />
                      )}
                    </div>
                    <div className="text-xl font-bold">{device.percentage}%</div>
                    <div className="text-gray-500">{device.device}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 h-4 bg-gray-100 rounded-full overflow-hidden flex">
                {trafficData.devices.map((device, index) => (
                  <div
                    key={index}
                    className="h-full"
                    style={{
                      width: `${device.percentage}%`,
                      backgroundColor: index === 0 ? "#F59E0B" : index === 1 ? "#D97706" : "#B45309",
                    }}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ubicaciones Principales</CardTitle>
              <CardDescription>Regiones geográficas de los visitantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficData.locations.map((location, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium">{location.location}</span>
                    </div>
                    <span className="text-gray-500">{location.visits.toLocaleString()} visitas</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Mapa de calor de visitantes (en desarrollo)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

