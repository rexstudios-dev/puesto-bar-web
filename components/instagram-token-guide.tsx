"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, ExternalLink } from "lucide-react"

export default function InstagramTokenGuide() {
  const [token, setToken] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("paso1")

  const copyToken = () => {
    if (!token) return

    navigator.clipboard.writeText(token)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Guía para Obtener Token de Instagram</CardTitle>
        <CardDescription>Sigue estos pasos para conectar tu cuenta de Instagram con tu sitio web</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paso1" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="paso1">Paso 1</TabsTrigger>
            <TabsTrigger value="paso2">Paso 2</TabsTrigger>
            <TabsTrigger value="paso3">Paso 3</TabsTrigger>
            <TabsTrigger value="paso4">Paso 4</TabsTrigger>
          </TabsList>

          <TabsContent value="paso1" className="space-y-4">
            <h3 className="text-lg font-medium">Crear una Cuenta de Desarrollador de Facebook</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Ve a{" "}
                <a
                  href="https://developers.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline inline-flex items-center"
                >
                  developers.facebook.com <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>Inicia sesión con tu cuenta de Facebook (la que está conectada a tu Instagram)</li>
              <li>Haz clic en "Mis Aplicaciones" en la esquina superior derecha</li>
              <li>Haz clic en "Crear Aplicación"</li>
              <li>Selecciona "Consumidor" como tipo de aplicación</li>
              <li>Completa la información requerida y crea la aplicación</li>
            </ol>
            <div className="pt-4">
              <Button onClick={() => setActiveTab("paso2")}>Siguiente Paso</Button>
            </div>
          </TabsContent>

          <TabsContent value="paso2" className="space-y-4">
            <h3 className="text-lg font-medium">Configurar Instagram Basic Display</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                En el panel de tu aplicación, busca "Productos" y haz clic en "Configurar" junto a "Instagram Basic
                Display"
              </li>
              <li>Acepta los términos y condiciones</li>
              <li>
                En "Configuración de OAuth", añade las siguientes URLs:
                <ul className="list-disc pl-5 mt-2">
                  <li>
                    URL de redirección de OAuth válidas:{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      https://developers.facebook.com/tools/explorer/
                    </code>
                  </li>
                  <li>
                    URL de anulación de autorización:{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">https://www.yourwebsite.com/</code>
                  </li>
                  <li>
                    URL de devolución de datos:{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">https://www.yourwebsite.com/</code>
                  </li>
                </ul>
              </li>
              <li>Guarda los cambios</li>
            </ol>
            <div className="pt-4 flex gap-2">
              <Button variant="outline" onClick={() => setActiveTab("paso1")}>
                Anterior
              </Button>
              <Button onClick={() => setActiveTab("paso3")}>Siguiente Paso</Button>
            </div>
          </TabsContent>

          <TabsContent value="paso3" className="space-y-4">
            <h3 className="text-lg font-medium">Añadir Instagram a tu Aplicación</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>En la sección "Instagram Basic Display", haz clic en "Añadir o eliminar Instagram Test Users"</li>
              <li>Haz clic en "Añadir Instagram Test Users"</li>
              <li>Ingresa tu nombre de usuario de Instagram y haz clic en "Añadir"</li>
              <li>Vuelve a la página principal de "Instagram Basic Display"</li>
              <li>Haz clic en "Generar token de acceso de usuario"</li>
              <li>Inicia sesión con tu cuenta de Instagram cuando se te solicite</li>
              <li>Autoriza la aplicación para acceder a tu contenido de Instagram</li>
              <li>Copia el token de acceso generado</li>
            </ol>
            <div className="pt-4 flex gap-2">
              <Button variant="outline" onClick={() => setActiveTab("paso2")}>
                Anterior
              </Button>
              <Button onClick={() => setActiveTab("paso4")}>Siguiente Paso</Button>
            </div>
          </TabsContent>

          <TabsContent value="paso4" className="space-y-4">
            <h3 className="text-lg font-medium">Guardar y Usar el Token</h3>
            <p>Pega el token de acceso que obtuviste en el paso anterior:</p>
            <div className="flex gap-2">
              <Input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Pega tu token de Instagram aquí"
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyToken} disabled={!token}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mt-4">
              <h4 className="font-medium text-amber-800 mb-2">Importante:</h4>
              <ul className="list-disc pl-5 space-y-1 text-amber-700">
                <li>Este token expira después de 60 días</li>
                <li>Para un token de larga duración, debes convertirlo usando la API de Facebook</li>
                <li>Guarda este token en un lugar seguro</li>
                <li>Nunca compartas tu token con nadie</li>
              </ul>
            </div>

            <p className="mt-4">
              Para usar este token en tu sitio web, debes agregarlo como variable de entorno en tu proyecto:
            </p>
            <code className="block bg-gray-100 p-3 rounded font-mono text-sm">
              INSTAGRAM_ACCESS_TOKEN=tu_token_aquí
            </code>

            <div className="pt-4 flex gap-2">
              <Button variant="outline" onClick={() => setActiveTab("paso3")}>
                Anterior
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          Recuerda que necesitas una cuenta de Instagram profesional o de creador para usar esta funcionalidad.
        </p>
      </CardFooter>
    </Card>
  )
}

