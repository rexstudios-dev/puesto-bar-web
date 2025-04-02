import { NextResponse } from "next/server"
import { organizeMenuByCategory } from "@/lib/google-drive"

// Datos de respaldo para cuando no hay acceso a Google Drive
const fallbackMenuData = [
  {
    name: "Espresso",
    description: "70 ml",
    price: "$2,500",
    category: "cafeteria",
  },
  {
    name: "Cortado",
    description: "70 ml",
    price: "$2,500",
    category: "cafeteria",
  },
  {
    name: "Americano",
    description: "140 ml",
    price: "$2,500",
    category: "cafeteria",
  },
  {
    name: "Lágrima",
    description: "140 ml",
    price: "$2,900",
    category: "cafeteria",
  },
  {
    name: "Flat White",
    description: "240 ml",
    price: "$4,000",
    category: "cafeteria",
  },
  {
    name: "Cappuccino",
    description: "240 ml",
    price: "$4,000",
    category: "cafeteria",
  },
  {
    name: "Medialunas",
    description: "",
    price: "$2,500",
    category: "comidas",
  },
  {
    name: "Medialunas con jamón y queso",
    description: "",
    price: "$2,900",
    category: "comidas",
  },
  {
    name: "Avocado toast",
    description: "Palta, huevos revueltos, tomate y pan de semillas tostado",
    price: "$8,500",
    category: "comidas",
  },
  {
    name: "Chocotorta de Nutella",
    description: "",
    price: "$6,500",
    category: "postres",
  },
  {
    name: "Flan cremoso",
    description: "De dulce de leche con crema y dulce de leche",
    price: "$5,300",
    category: "postres",
  },
  {
    name: "Jugo Exprimido de Naranja",
    description: "",
    price: "$4,000",
    category: "bebidas",
  },
  {
    name: "Limonada",
    description: "Con menta y jengibre (jarra)",
    price: "$4,500",
    category: "bebidas",
  },
  {
    name: "Alta Vista premium",
    description: "Malbec",
    price: "$13,300",
    category: "vinos",
  },
  {
    name: "Festivo, Monteviejo",
    description: "Malbec",
    price: "$15,600",
    category: "vinos",
  },
]

export async function GET() {
  try {
    // Organizar los datos de respaldo por categoría
    const organizedMenu = organizeMenuByCategory(fallbackMenuData)

    return NextResponse.json(organizedMenu)
  } catch (error) {
    console.error("Error in menu API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

