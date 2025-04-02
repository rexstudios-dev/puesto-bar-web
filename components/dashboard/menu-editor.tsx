"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Save, Coffee, Utensils, Wine, Cake, Beer, Plus, Trash2, AlertCircle, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Define menu item type
interface MenuItem {
  name: string
  description: string
  price: string
  category: string
}

// Datos de respaldo
const defaultMenuData = {
  cafeteria: [
    { name: "Espresso", description: "70 ml", price: "$2,500", category: "cafeteria" },
    { name: "Cortado", description: "70 ml", price: "$2,500", category: "cafeteria" },
    { name: "Americano", description: "140 ml", price: "$2,500", category: "cafeteria" },
    { name: "Lágrima", description: "140 ml", price: "$2,900", category: "cafeteria" },
    { name: "Flat White", description: "240 ml", price: "$4,000", category: "cafeteria" },
  ],
  comidas: [
    { name: "Medialunas", description: "", price: "$2,500", category: "comidas" },
    { name: "Medialunas con jamón y queso", description: "", price: "$2,900", category: "comidas" },
    {
      name: "Avocado toast",
      description: "Palta, huevos revueltos, tomate y pan de semillas tostado",
      price: "$8,500",
      category: "comidas",
    },
  ],
  postres: [
    { name: "Chocotorta de Nutella", description: "", price: "$6,500", category: "postres" },
    {
      name: "Flan cremoso",
      description: "De dulce de leche con crema y dulce de leche",
      price: "$5,300",
      category: "postres",
    },
  ],
  bebidas: [
    { name: "Jugo Exprimido de Naranja", description: "", price: "$4,000", category: "bebidas" },
    { name: "Limonada", description: "Con menta y jengibre (jarra)", price: "$4,500", category: "bebidas" },
  ],
  vinos: [
    { name: "Alta Vista premium", description: "Malbec", price: "$13,300", category: "vinos" },
    { name: "Festivo, Monteviejo", description: "Malbec", price: "$15,600", category: "vinos" },
  ],
}

export default function MenuEditor() {
  const [menuData, setMenuData] = useState<Record<string, MenuItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("cafeteria")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [menuChanged, setMenuChanged] = useState(false)
  const { toast } = useToast()

  // Cargar datos del menú
  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    setLoading(true)

    try {
      // Intentar cargar desde localStorage
      const savedMenu = localStorage.getItem("puestoBarDashboardMenu")
      const lastUpdateTime = localStorage.getItem("puestoBarDashboardMenuLastUpdate")

      if (savedMenu) {
        const parsedMenu = JSON.parse(savedMenu)
        setMenuData(parsedMenu)
        setMenuChanged(false)

        if (lastUpdateTime) {
          toast({
            title: "Menú cargado",
            description: `Última actualización: ${new Date(lastUpdateTime).toLocaleString()}`,
            variant: "default",
          })
        }
      } else {
        // Si no hay datos guardados, usar los predeterminados
        setMenuData(defaultMenuData)
      }
    } catch (err) {
      console.error("Error loading menu data:", err)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del menú",
        variant: "destructive",
      })
      setMenuData(defaultMenuData)
    } finally {
      setLoading(false)
    }
  }

  const saveMenuData = async () => {
    setSaving(true)

    try {
      // Guardar en localStorage
      localStorage.setItem("puestoBarDashboardMenu", JSON.stringify(menuData))
      localStorage.setItem("puestoBarDashboardMenuLastUpdate", new Date().toISOString())

      // También guardar en el localStorage público para que se muestre en el sitio
      localStorage.setItem("puestoBarMenu", JSON.stringify(menuData))
      localStorage.setItem("puestoBarLastUpdate", new Date().toISOString())

      // Marcar como no cambiado después de guardar
      setMenuChanged(false)

      // Mostrar diálogo de éxito
      setShowSuccessDialog(true)
    } catch (err) {
      console.error("Error saving menu data:", err)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar los cambios",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const restoreDefaultMenu = () => {
    setMenuData(defaultMenuData)
    setMenuChanged(true)

    // Eliminar datos guardados
    localStorage.removeItem("puestoBarDashboardMenu")
    localStorage.removeItem("puestoBarDashboardMenuLastUpdate")

    toast({
      title: "Menú restaurado",
      description: "Se han restaurado los valores predeterminados del menú",
      variant: "default",
    })
  }

  const handlePriceChange = (category: string, index: number, newPrice: string) => {
    setMenuData((prevData) => {
      const newData = { ...prevData }
      newData[category][index].price = newPrice
      return newData
    })
    setMenuChanged(true)
  }

  const handleNameChange = (category: string, index: number, newName: string) => {
    setMenuData((prevData) => {
      const newData = { ...prevData }
      newData[category][index].name = newName
      return newData
    })
    setMenuChanged(true)
  }

  const handleDescriptionChange = (category: string, index: number, newDescription: string) => {
    setMenuData((prevData) => {
      const newData = { ...prevData }
      newData[category][index].description = newDescription
      return newData
    })
    setMenuChanged(true)
  }

  const addNewItem = (category: string) => {
    setMenuData((prevData) => {
      const newData = { ...prevData }
      newData[category].push({
        name: "Nuevo ítem",
        description: "",
        price: "$0",
        category,
      })
      return newData
    })
    setMenuChanged(true)
  }

  const removeItem = (category: string, index: number) => {
    setMenuData((prevData) => {
      const newData = { ...prevData }
      newData[category].splice(index, 1)
      return newData
    })
    setMenuChanged(true)
  }

  const menuCategories = [
    { id: "cafeteria", label: "Cafetería", icon: <Coffee className="h-4 w-4" /> },
    { id: "comidas", label: "Comidas", icon: <Utensils className="h-4 w-4" /> },
    { id: "postres", label: "Postres", icon: <Cake className="h-4 w-4" /> },
    { id: "bebidas", label: "Bebidas", icon: <Beer className="h-4 w-4" /> },
    { id: "vinos", label: "Vinos", icon: <Wine className="h-4 w-4" /> },
  ]

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de Menú</h1>
          <p className="text-gray-500 mt-1">Actualiza los precios, nombres y descripciones de los ítems del menú</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={restoreDefaultMenu} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Restaurar predeterminados
          </Button>

          <Button onClick={saveMenuData} disabled={saving || !menuChanged} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {menuChanged && (
        <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>Hay cambios sin guardar. Haz clic en "Guardar cambios" para aplicarlos.</p>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="cafeteria" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              {menuCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {menuCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-amber-800">{category.label}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addNewItem(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Añadir ítem
                  </Button>
                </div>

                <div className="space-y-6">
                  {menuData[category.id]?.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 p-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{item.name || "Nuevo ítem"}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(category.id, index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                          <Input
                            value={item.name}
                            onChange={(e) => handleNameChange(category.id, index, e.target.value)}
                            placeholder="Nombre del ítem"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleDescriptionChange(category.id, index, e.target.value)}
                            placeholder="Descripción del ítem"
                            rows={2}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                          <Input
                            value={item.price}
                            onChange={(e) => handlePriceChange(category.id, index, e.target.value)}
                            placeholder="$0"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-4">
          <p className="text-sm text-gray-500">
            Los cambios se guardarán permanentemente cuando hagas clic en "Guardar cambios".
          </p>
        </CardFooter>
      </Card>

      {/* Diálogo de confirmación de guardado */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">¡Cambios guardados!</DialogTitle>
            <DialogDescription className="text-center">
              Los cambios en el menú se han guardado correctamente y ya están visibles en la página principal.
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

