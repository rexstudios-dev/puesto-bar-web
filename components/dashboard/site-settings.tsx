"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Save, Globe, Music, Bell, Mail, Shield, Key, RefreshCw, Database } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getSiteConfig, saveSiteConfig, syncWithDatabase } from "@/lib/store"

// Valores predeterminados para las configuraciones
const defaultGeneralSettings = {
  siteName: "Puesto Bar",
  siteDescription: "Café, comida y tragos en San Vicente, Buenos Aires",
  contactEmail: "info@puestobar.com",
  phoneNumber: "+54 11 1234-5678",
  address: "Av. Libertador Gral San Martín 30, San Vicente, Buenos Aires, Argentina",
  googleMapsUrl: "https://goo.gl/maps/example",
  timezone: "America/Argentina/Buenos_Aires",
}

const defaultMediaSettings = {
  enableBackgroundMusic: true,
  showWelcomeScreen: true,
  autoplayMusic: true,
  defaultMusicVolume: 20,
  customMusicUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3",
  enableInstagramFeed: true,
  enableAutoImageOptimization: true,
}

const defaultSecuritySettings = {
  enableLoginNotifications: true,
  requireStrongPasswords: true,
  sessionTimeout: 24, // horas
  allowedIPs: "",
  twoFactorAuth: false,
}

const defaultNotificationSettings = {
  emailNotifications: true,
  loginAlerts: true,
  contentUpdateAlerts: true,
  trafficReports: "weekly", // daily, weekly, monthly
  emailRecipients: "admin@puestobar.com",
}

export default function SiteSettings() {
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState<boolean | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const { toast } = useToast()

  // Estados para las diferentes configuraciones
  const [generalSettings, setGeneralSettings] = useState(defaultGeneralSettings)
  const [mediaSettings, setMediaSettings] = useState(defaultMediaSettings)
  const [securitySettings, setSecuritySettings] = useState(defaultSecuritySettings)
  const [notificationSettings, setNotificationSettings] = useState(defaultNotificationSettings)

  // Cargar configuraciones guardadas al iniciar
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Cargar configuración desde el store centralizado
        const config = getSiteConfig()

        // Actualizar estados con los valores guardados
        setGeneralSettings({
          siteName: config.siteName || defaultGeneralSettings.siteName,
          siteDescription: config.siteDescription || defaultGeneralSettings.siteDescription,
          contactEmail: config.contactEmail || defaultGeneralSettings.contactEmail,
          phoneNumber: config.phoneNumber || defaultGeneralSettings.phoneNumber,
          address: config.address || defaultGeneralSettings.address,
          googleMapsUrl: config.googleMapsUrl || defaultGeneralSettings.googleMapsUrl,
          timezone: config.timezone || defaultGeneralSettings.timezone,
        })

        setMediaSettings({
          ...defaultMediaSettings,
          enableBackgroundMusic: config.enableBackgroundMusic,
          showWelcomeScreen: config.showWelcomeScreen,
          autoplayMusic: config.autoplayMusic,
          defaultMusicVolume: config.musicVolume,
          customMusicUrl: config.musicUrl,
          enableInstagramFeed: config.enableInstagramFeed,
        })

        // Cargar última sincronización
        const lastSync = localStorage.getItem("lastSyncWithMongoDB")
        if (lastSync) {
          setLastSyncTime(lastSync)
        }

        toast({
          title: "Configuración cargada",
          description: "Se ha cargado la configuración guardada",
        })
      } catch (error) {
        console.error("Error loading settings:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las configuraciones guardadas",
          variant: "destructive",
        })
      }
    }

    loadSettings()
  }, [toast])

  const saveSettings = async () => {
    setSaving(true)

    try {
      // Guardar en el almacén central
      saveSiteConfig({
        // Configuración general
        siteName: generalSettings.siteName,
        siteDescription: generalSettings.siteDescription,
        contactEmail: generalSettings.contactEmail,
        phoneNumber: generalSettings.phoneNumber,
        address: generalSettings.address,
        googleMapsUrl: generalSettings.googleMapsUrl,
        timezone: generalSettings.timezone,

        // Configuración multimedia
        enableBackgroundMusic: mediaSettings.enableBackgroundMusic,
        showWelcomeScreen: mediaSettings.showWelcomeScreen,
        autoplayMusic: mediaSettings.autoplayMusic,
        musicVolume: mediaSettings.defaultMusicVolume,
        musicUrl: mediaSettings.customMusicUrl,
        enableInstagramFeed: mediaSettings.enableInstagramFeed,
      })

      // Mostrar diálogo de éxito
      setShowSuccessDialog(true)
    } catch (err) {
      console.error("Error saving settings:", err)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const syncWithMongoDB = async () => {
    setSyncing(true)
    setSyncSuccess(null)

    try {
      // Llamar a la función de sincronización
      const result = await syncWithDatabase()

      if (result.success) {
        setSyncSuccess(true)
        setLastSyncTime(result.syncTime || new Date().toISOString())

        toast({
          title: "Sincronización completada",
          description: result.message || "Los datos se han sincronizado correctamente con MongoDB",
        })
      } else {
        setSyncSuccess(false)

        toast({
          title: "Error de sincronización",
          description: result.message || "No se pudieron sincronizar los datos con MongoDB",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error syncing with database:", err)
      setSyncSuccess(false)

      toast({
        title: "Error",
        description: "Ocurrió un error al sincronizar con la base de datos",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const restoreDefaults = () => {
    // Restaurar valores predeterminados
    setGeneralSettings(defaultGeneralSettings)
    setMediaSettings(defaultMediaSettings)
    setSecuritySettings(defaultSecuritySettings)
    setNotificationSettings(defaultNotificationSettings)

    toast({
      title: "Configuración restaurada",
      description: "Se han restaurado los valores predeterminados",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-500 mt-1">Administra la configuración general del sitio web</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={restoreDefaults}>
            <RefreshCw className="h-4 w-4" />
            Restaurar predeterminados
          </Button>

          <Button variant="outline" className="flex items-center gap-2" onClick={syncWithMongoDB} disabled={syncing}>
            <Database className="h-4 w-4" />
            {syncing ? "Sincronizando..." : "Sincronizar con MongoDB"}
          </Button>

          <Button onClick={saveSettings} disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {lastSyncTime && (
        <div
          className={`p-4 rounded-md ${syncSuccess === false ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}
        >
          <p className="text-sm">
            <span className="font-medium">Última sincronización con MongoDB: </span>
            {new Date(lastSyncTime).toLocaleString()}
          </p>
        </div>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 w-[500px]">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Multimedia
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Información básica del sitio web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre del sitio</label>
                  <Input
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción del sitio</label>
                  <Input
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email de contacto</label>
                  <Input
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Número de teléfono</label>
                  <Input
                    value={generalSettings.phoneNumber}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phoneNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Dirección</label>
                  <Textarea
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">URL de Google Maps</label>
                  <Input
                    value={generalSettings.googleMapsUrl}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, googleMapsUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Zona horaria</label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                  >
                    <option value="America/Argentina/Buenos_Aires">Argentina (Buenos Aires)</option>
                    <option value="America/Santiago">Chile (Santiago)</option>
                    <option value="America/Montevideo">Uruguay (Montevideo)</option>
                    <option value="America/Sao_Paulo">Brasil (São Paulo)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Multimedia</CardTitle>
              <CardDescription>Opciones para música, imágenes y contenido multimedia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Música de fondo</h3>
                    <p className="text-sm text-gray-500">Habilitar música de fondo en el sitio</p>
                  </div>
                  <Switch
                    checked={mediaSettings.enableBackgroundMusic}
                    onCheckedChange={(checked) =>
                      setMediaSettings({ ...mediaSettings, enableBackgroundMusic: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Pantalla de bienvenida</h3>
                    <p className="text-sm text-gray-500">Mostrar pantalla de bienvenida al cargar el sitio</p>
                  </div>
                  <Switch
                    checked={mediaSettings.showWelcomeScreen}
                    onCheckedChange={(checked) => setMediaSettings({ ...mediaSettings, showWelcomeScreen: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Reproducción automática</h3>
                    <p className="text-sm text-gray-500">Intentar reproducir música automáticamente</p>
                  </div>
                  <Switch
                    checked={mediaSettings.autoplayMusic}
                    onCheckedChange={(checked) => setMediaSettings({ ...mediaSettings, autoplayMusic: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">URL de música de fondo</label>
                  <Input
                    value={mediaSettings.customMusicUrl}
                    onChange={(e) => setMediaSettings({ ...mediaSettings, customMusicUrl: e.target.value })}
                    placeholder="https://ejemplo.com/musica.mp3"
                  />
                  <p className="text-xs text-gray-500">
                    Ingresa la URL de un archivo MP3 o cualquier formato de audio compatible con navegadores
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Volumen predeterminado (0-100)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={mediaSettings.defaultMusicVolume}
                      onChange={(e) =>
                        setMediaSettings({ ...mediaSettings, defaultMusicVolume: Number.parseInt(e.target.value) })
                      }
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{mediaSettings.defaultMusicVolume}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Feed de Instagram</h3>
                    <p className="text-sm text-gray-500">Mostrar feed de Instagram en el sitio</p>
                  </div>
                  <Switch
                    checked={mediaSettings.enableInstagramFeed}
                    onCheckedChange={(checked) => setMediaSettings({ ...mediaSettings, enableInstagramFeed: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Optimización automática de imágenes</h3>
                    <p className="text-sm text-gray-500">Optimizar automáticamente las imágenes subidas</p>
                  </div>
                  <Switch
                    checked={mediaSettings.enableAutoImageOptimization}
                    onCheckedChange={(checked) =>
                      setMediaSettings({ ...mediaSettings, enableAutoImageOptimization: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>Opciones de seguridad y acceso al panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Notificaciones de inicio de sesión</h3>
                    <p className="text-sm text-gray-500">Recibir notificaciones cuando alguien inicie sesión</p>
                  </div>
                  <Switch
                    checked={securitySettings.enableLoginNotifications}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, enableLoginNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Requerir contraseñas fuertes</h3>
                    <p className="text-sm text-gray-500">Exigir contraseñas con letras, números y símbolos</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireStrongPasswords}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, requireStrongPasswords: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tiempo de expiración de sesión (horas)</label>
                  <Input
                    type="number"
                    min="1"
                    max="168"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({ ...securitySettings, sessionTimeout: Number.parseInt(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    IPs permitidas (separadas por coma, dejar en blanco para todas)
                  </label>
                  <Textarea
                    value={securitySettings.allowedIPs}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, allowedIPs: e.target.value })}
                    placeholder="Ej: 192.168.1.1, 10.0.0.1"
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Autenticación de dos factores</h3>
                    <p className="text-sm text-gray-500">Requerir código adicional al iniciar sesión</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Cambiar contraseña
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>Opciones para recibir alertas y notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Notificaciones por email</h3>
                    <p className="text-sm text-gray-500">Recibir notificaciones por correo electrónico</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Alertas de inicio de sesión</h3>
                    <p className="text-sm text-gray-500">Recibir alertas cuando alguien inicie sesión</p>
                  </div>
                  <Switch
                    checked={notificationSettings.loginAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, loginAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Alertas de actualización de contenido</h3>
                    <p className="text-sm text-gray-500">Recibir alertas cuando se actualice el contenido</p>
                  </div>
                  <Switch
                    checked={notificationSettings.contentUpdateAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, contentUpdateAlerts: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Informes de tráfico</label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={notificationSettings.trafficReports}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, trafficReports: e.target.value })
                    }
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="never">Nunca</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Destinatarios de email (separados por coma)</label>
                  <div className="flex gap-2">
                    <Input
                      value={notificationSettings.emailRecipients}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, emailRecipients: e.target.value })
                      }
                      placeholder="Ej: admin@puestobar.com, gerente@puestobar.com"
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Enviar email de prueba
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación de guardado */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">¡Cambios guardados!</DialogTitle>
            <DialogDescription className="text-center">
              La configuración se ha guardado correctamente y los cambios ya están aplicados al sitio.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setShowSuccessDialog(false)}>Aceptar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

