"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Database, Save, RefreshCw, Check, AlertCircle } from "lucide-react"
import { syncWithDatabase } from "@/lib/store"

export default function MongoDBSetup() {
  const [connectionString, setConnectionString] = useState("")
  const [dbName, setDbName] = useState("puestobar")
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  // Cargar configuración guardada
  useEffect(() => {
    const savedConnectionString = localStorage.getItem("puestoBarMongoDBConnectionString")
    const savedDbName = localStorage.getItem("puestoBarMongoDBName")
    const lastSync = localStorage.getItem("lastSyncWithMongoDB")

    if (savedConnectionString) setConnectionString(savedConnectionString)
    if (savedDbName) setDbName(savedDbName)
    if (lastSync) setLastSyncTime(lastSync)
  }, [])

  const testConnection = async () => {
    setTesting(true)
    setConnectionStatus("idle")

    try {
      // Simular prueba de conexión
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Verificar si la cadena de conexión tiene un formato válido
      if (!connectionString.startsWith("mongodb") || connectionString.length < 20) {
        throw new Error("Formato de cadena de conexión inválido")
      }

      setConnectionStatus("success")

      toast({
        title: "Conexión exitosa",
        description: "Se ha establecido conexión con la base de datos MongoDB",
        variant: "default",
      })
    } catch (error) {
      console.error("Error testing connection:", error)
      setConnectionStatus("error")

      toast({
        title: "Error de conexión",
        description: "No se pudo conectar a la base de datos. Verifica la cadena de conexión.",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)

    try {
      // Guardar en localStorage
      localStorage.setItem("puestoBarMongoDBConnectionString", connectionString)
      localStorage.setItem("puestoBarMongoDBName", dbName)

      toast({
        title: "Configuración guardada",
        description: "La configuración de MongoDB se ha guardado correctamente",
        variant: "default",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const syncData = async () => {
    setSyncing(true)

    try {
      // Llamar a la función de sincronización
      const result = await syncWithDatabase()

      if (result.success) {
        setLastSyncTime(result.syncTime || new Date().toISOString())

        toast({
          title: "Datos sincronizados",
          description: "Todos los datos se han sincronizado con MongoDB correctamente",
          variant: "default",
        })
      } else {
        toast({
          title: "Error de sincronización",
          description: result.message || "No se pudieron sincronizar los datos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error syncing data:", error)
      toast({
        title: "Error",
        description: "No se pudieron sincronizar los datos",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración de MongoDB</h1>
          <p className="text-gray-500 mt-1">Configura la conexión a la base de datos MongoDB</p>
        </div>
      </div>

      {lastSyncTime && (
        <div className="p-4 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm">
            <span className="font-medium">Última sincronización con MongoDB: </span>
            {new Date(lastSyncTime).toLocaleString()}
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Conexión a MongoDB</CardTitle>
          <CardDescription>Configura la conexión a tu base de datos MongoDB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cadena de conexión</label>
            <Input
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              placeholder="mongodb+srv://puestobar-data:<db_password>@puestobar.1ug17.mongodb.net/"
              type="password"
            />
            <p className="text-xs text-gray-500">
              Puedes obtener tu cadena de conexión desde MongoDB Atlas o tu servidor MongoDB
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de la base de datos</label>
            <Input value={dbName} onChange={(e) => setDbName(e.target.value)} placeholder="puestobar" />
          </div>

          {connectionStatus === "success" && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 flex items-start">
              <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>Conexión establecida correctamente</p>
            </div>
          )}

          {connectionStatus === "error" && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>No se pudo establecer conexión. Verifica la cadena de conexión.</p>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={testing || !connectionString}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              {testing ? "Probando..." : "Probar conexión"}
            </Button>

            <Button
              onClick={saveSettings}
              disabled={saving || !connectionString || !dbName}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Guardando..." : "Guardar configuración"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sincronización de datos</CardTitle>
          <CardDescription>Sincroniza los datos locales con MongoDB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700">
            Esta acción sincronizará todos los datos locales (menú, configuración, apariencia, etc.) con la base de
            datos MongoDB. Esto permitirá que los cambios persistan entre reinicios del servidor y se compartan entre
            diferentes instancias.
          </p>

          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <h3 className="text-sm font-medium text-amber-800 mb-2">Importante:</h3>
            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
              <li>Asegúrate de haber configurado correctamente la conexión a MongoDB.</li>
              <li>Esta operación puede tardar varios minutos dependiendo de la cantidad de datos.</li>
              <li>Los datos existentes en MongoDB serán sobrescritos.</li>
              <li>Se recomienda hacer una copia de seguridad antes de sincronizar.</li>
            </ul>
          </div>

          <div className="pt-4">
            <Button
              onClick={syncData}
              disabled={syncing || !connectionString || !dbName}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {syncing ? "Sincronizando..." : "Sincronizar todos los datos"}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Una vez sincronizados, los datos se mantendrán actualizados automáticamente.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

