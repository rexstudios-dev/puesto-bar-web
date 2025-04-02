"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coffee, Utensils, Wine, Cake, Beer } from "lucide-react"
import MenuModal from "@/components/menu-modal"

// Define menu item type
interface MenuItem {
  name: string
  description: string
  price: string
}

// Define menu categories
interface MenuCategories {
  cafeteria: MenuItem[]
  comidas: MenuItem[]
  postres: MenuItem[]
  bebidas: MenuItem[]
  vinos: MenuItem[]
  otros?: MenuItem[]
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState("cafeteria")
  const [menuData, setMenuData] = useState<MenuCategories | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  // Cargar datos del menú desde localStorage (si existen)
  useEffect(() => {
    setLoading(true)

    try {
      // Intentar cargar desde localStorage primero
      const savedMenu = localStorage.getItem("puestoBarMenu")
      const lastUpdateTime = localStorage.getItem("puestoBarLastUpdate")

      // También intentar cargar desde el dashboard
      const dashboardMenu = localStorage.getItem("puestoBarDashboardMenu")
      const dashboardLastUpdate = localStorage.getItem("puestoBarDashboardMenuLastUpdate")

      // Priorizar el menú del dashboard si existe
      if (dashboardMenu && dashboardLastUpdate) {
        setMenuData(JSON.parse(dashboardMenu))
        const date = new Date(dashboardLastUpdate)
        setLastUpdate(
          date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        )
      } else if (savedMenu) {
        setMenuData(JSON.parse(savedMenu))
        if (lastUpdateTime) {
          const date = new Date(lastUpdateTime)
          setLastUpdate(
            date.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          )
        }
      } else {
        // Si no hay datos en localStorage, usar datos de respaldo
        setMenuData(fallbackMenuData)
      }
    } catch (err) {
      console.error("Error loading menu data:", err)
      setError("No se pudieron cargar los datos del menú")
      setMenuData(fallbackMenuData)
    } finally {
      setLoading(false)
    }
  }, [])

  const menuCategories = [
    { id: "cafeteria", label: "Cafetería", icon: <Coffee className="h-5 w-5" /> },
    { id: "comidas", label: "Comidas", icon: <Utensils className="h-5 w-5" /> },
    { id: "postres", label: "Postres", icon: <Cake className="h-5 w-5" /> },
    { id: "bebidas", label: "Bebidas", icon: <Beer className="h-5 w-5" /> },
    { id: "vinos", label: "Vinos", icon: <Wine className="h-5 w-5" /> },
  ]

  // Datos de respaldo en caso de que no haya datos en localStorage
  const fallbackMenuData: MenuCategories = {
    cafeteria: [
      { name: "Espresso", description: "70 ml", price: "$2,500" },
      { name: "Cortado", description: "70 ml", price: "$2,500" },
      { name: "Americano", description: "140 ml", price: "$2,500" },
      { name: "Lágrima", description: "140 ml", price: "$2,900" },
      { name: "Flat White", description: "240 ml", price: "$4,000" },
      { name: "Cappuccino", description: "240 ml", price: "$4,000" },
      { name: "Latte", description: "350 ml", price: "$4,200" },
      { name: "Latte Vainilla", description: "350 ml", price: "$4,500" },
      { name: "Latte Caramel", description: "350 ml", price: "$4,500" },
      { name: "Iced Latte", description: "400 ml (consultar sabores)", price: "$4,500" },
      { name: "Expreso Martini", description: "200 ml", price: "$6,900" },
      { name: "Expreso Baileys", description: "330 ml", price: "$6,900" },
    ],
    comidas: [
      { name: "Medialunas", description: "", price: "$2,500" },
      { name: "Medialunas con jamón y queso", description: "", price: "$2,900" },
      {
        name: "Avocado toast",
        description: "Palta, huevos revueltos, tomate y pan de semillas tostado",
        price: "$8,500",
      },
      {
        name: "Wrap de pollo crispy",
        description: "Hojas verdes, tomates asados, aderezo caesar, parmesano y pepinillos",
        price: "$12,800",
      },
      {
        name: "Hamburguesa casera",
        description: "Provoleta, panceta ahumada, cebolla asada, lechuga, salsa tártara y papas fritas",
        price: "$12,800",
      },
      {
        name: "Ojo de bife",
        description: "Envuelto en panceta con papines al horno, cebolla crispy y chimichurri",
        price: "$18,900",
      },
      {
        name: "Trucha",
        description: "En croute de almendras y maní, coliflor asada y hojas verdes",
        price: "$20,800",
      },
      {
        name: "Milanesa de bife de chorizo",
        description: "Con provoleta fundida, bucatini Divella con crema y huevo frito",
        price: "$17,900",
      },
    ],
    postres: [
      { name: "Chocotorta de Nutella", description: "", price: "$6,500" },
      {
        name: "Flan cremoso",
        description: "De dulce de leche con crema y dulce de leche",
        price: "$5,300",
      },
      {
        name: "Pavlova",
        description: "Con crema de limón, duraznos y ciruelas",
        price: "$5,300",
      },
      {
        name: "Apple crumble",
        description: "Tibio con helado de vainilla y toffe",
        price: "$7,200",
      },
      { name: "Volcán de chocolate", description: "Con helado de crema", price: "$8,500" },
      { name: "Cheesecake", description: "De frutas rojas o maracuyá", price: "$6,500" },
    ],
    bebidas: [
      { name: "Jugo Exprimido de Naranja", description: "", price: "$4,000" },
      { name: "Limonada", description: "Con menta y jengibre (jarra)", price: "$4,500" },
      { name: "Limonada Maracuyá", description: "(jarra)", price: "$5,500" },
      { name: "Gin tonic Beefeater", description: "", price: "$6,900" },
      { name: "Gin tonic Bombay", description: "", price: "$8,900" },
      { name: "Mojito", description: "Ron, menta, azúcar y lima", price: "$6,900" },
      { name: "Aperol Spritz", description: "", price: "$5,900" },
      { name: "Negroni", description: "Gin, campari y vermú rosso", price: "$6,900" },
      { name: "Cerveza Heineken", description: "Pinta", price: "$5,900" },
    ],
    vinos: [
      { name: "Alta Vista premium", description: "Malbec", price: "$13,300" },
      { name: "Festivo, Monteviejo", description: "Malbec", price: "$15,600" },
      { name: "El Enemigo", description: "Malbec", price: "$37,800" },
      { name: "Luigi Bosca", description: "Pinot Noir", price: "$21,400" },
      { name: "Chandon Extra Brut", description: "Espumante", price: "$21,000" },
      { name: "Chandon Brut Nature", description: "Espumante", price: "$21,000" },
      { name: "Baron B Extra Brut", description: "Espumante", price: "$40,000" },
      { name: "Vino por Copa Tinto", description: "Alta Vista", price: "$4,900" },
      { name: "Vino por Copa Blanco", description: "Santa Julia", price: "$4,200" },
    ],
  }

  const renderMenuItems = (items: MenuItem[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="flex justify-between group"
          >
            <div className="flex-1">
              <h3 className="text-lg font-medium text-amber-900 group-hover:text-amber-600 transition-colors">
                {item.name}
              </h3>
              {item.description && <p className="text-gray-600 text-sm mt-1">{item.description}</p>}
            </div>
            <div className="text-amber-800 font-medium">{item.price}</div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <section id="menu" ref={ref} className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2 text-center">Nuestro Menú</h2>
          <p className="text-center text-gray-700 mb-4 max-w-2xl mx-auto">
            Descubre nuestra selección de café de especialidad, platos elaborados con ingredientes frescos y bebidas
            para todos los gustos.
          </p>

          {lastUpdate && <p className="text-center text-amber-600 text-sm mb-8">Última actualización: {lastUpdate}</p>}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-6">
                  <p>{error}</p>
                </div>
              )}

              <Tabs defaultValue="cafeteria" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                  {menuCategories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                      {category.icon}
                      <span className="hidden md:inline">{category.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                  <TabsContent value="cafeteria" className="mt-0">
                    <h3 className="text-2xl font-semibold text-amber-800 mb-6">Cafetería</h3>
                    {menuData && renderMenuItems(menuData.cafeteria)}
                  </TabsContent>

                  <TabsContent value="comidas" className="mt-0">
                    <h3 className="text-2xl font-semibold text-amber-800 mb-6">Comidas</h3>
                    {menuData && renderMenuItems(menuData.comidas)}
                  </TabsContent>

                  <TabsContent value="postres" className="mt-0">
                    <h3 className="text-2xl font-semibold text-amber-800 mb-6">Postres</h3>
                    {menuData && renderMenuItems(menuData.postres)}
                  </TabsContent>

                  <TabsContent value="bebidas" className="mt-0">
                    <h3 className="text-2xl font-semibold text-amber-800 mb-6">Bebidas</h3>
                    {menuData && renderMenuItems(menuData.bebidas)}
                  </TabsContent>

                  <TabsContent value="vinos" className="mt-0">
                    <h3 className="text-2xl font-semibold text-amber-800 mb-6">Vinos</h3>
                    {menuData && renderMenuItems(menuData.vinos)}
                  </TabsContent>
                </div>
              </Tabs>

              <div className="text-center mt-10">
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver menú completo
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Modal para mostrar el menú completo */}
      <MenuModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  )
}

