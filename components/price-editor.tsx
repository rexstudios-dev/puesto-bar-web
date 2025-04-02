"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coffee, Utensils, Wine, Cake, Beer, Save, RefreshCw, Check, AlertCircle } from "lucide-react"

// Define menu item type
interface MenuItem {
  name: string
  description: string
  price: string
  category: string
}

export default function PriceEditor() {
  const [menuData, setMenuData] = useState<Record<string, MenuItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("cafeteria")

  // Cargar datos del menú
  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Intentar cargar desde localStorage primero
      const savedMenu = localStorage.getItem("puestoBarMenu")

      if (savedMenu) {
        setMenuData(JSON.parse(savedMenu))
      } else {
        // Si no hay datos en localStorage, cargar datos de respaldo
        setMenuData(fallbackMenuData)
      }
    } catch (err) {
      console.error("Error loading menu data:", err)
      setError("No se pudieron cargar los datos del menú")
      setMenuData(fallbackMenuData)
    } finally {
      setLoading(false)
    }
  }

  const saveMenuData = () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Guardar en localStorage
      localStorage.setItem("puestoBarMenu", JSON.stringify(menuData))
      localStorage.setItem("puestoBarLastUpdate", new Date().toISOString())

      setSuccess("Los precios se han actualizado correctamente")

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error("Error saving menu data:", err)
      setError("Ocurrió un error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  const handlePriceChange = (category: string, index: number, newPrice: string) => {
    setMenuData((prevData) => {
      const newData = { ...prevData }
      newData[category][index].price = newPrice
      return newData
    })
  }

  const handleNameChange = (category: string, index: number, newName: string) => {
    setMenuData((prevData) => {
      const newData = { ...prevData }
      newData[category][index].name = newName
      return newData
    })
  }

  const handleDescriptionChange = (category: string, index: number, newDescription: string) => {
    setMenuData((prevData) => {
      const newData = { ...prevData }
      newData[category][index].description = newDescription
      return newData
    })
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
  }

  const removeItem = (category: string, index: number) => {
    setMenuData((prevData) => {
      const newData = { ...prevData }
      newData[category].splice(index, 1)
      return newData
    })
  }

  const menuCategories = [
    { id: "cafeteria", label: "Cafetería", icon: <Coffee className="h-4 w-4" /> },
    { id: "comidas", label: "Comidas", icon: <Utensils className="h-4 w-4" /> },
    { id: "postres", label: "Postres", icon: <Cake className="h-4 w-4" /> },
    { id: "bebidas", label: "Bebidas", icon: <Beer className="h-4 w-4" /> },
    { id: "vinos", label: "Vinos", icon: <Wine className="h-4 w-4" /> },
  ]

  // Datos de respaldo
  const fallbackMenuData = {
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Editor de Precios</CardTitle>
        <CardDescription>Actualiza los precios, nombres y descripciones de los ítems del menú</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={loadMenuData} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Recargar datos
            </Button>

            <Button onClick={saveMenuData} disabled={saving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 flex items-start">
              <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{success}</p>
            </div>
          )}

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
                  <Button variant="outline" size="sm" onClick={() => addNewItem(category.id)} className="text-xs">
                    Añadir ítem
                  </Button>
                </div>

                <div className="space-y-4">
                  {menuData[category.id]?.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-start border-b pb-4">
                      <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <Input
                          value={item.name}
                          onChange={(e) => handleNameChange(category.id, index, e.target.value)}
                        />
                      </div>

                      <div className="col-span-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleDescriptionChange(category.id, index, e.target.value)}
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                        <Input
                          value={item.price}
                          onChange={(e) => handlePriceChange(category.id, index, e.target.value)}
                        />
                      </div>

                      <div className="col-span-1 pt-7">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(category.id, index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Los cambios se guardarán localmente y estarán disponibles inmediatamente en el menú público.
        </p>
      </CardFooter>
    </Card>
  )
}

