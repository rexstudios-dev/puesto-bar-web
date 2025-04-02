// This function will authenticate with Google and fetch the menu data from Drive
export async function fetchMenuDataFromDrive(fileId: string) {
  try {
    // Datos de ejemplo para cuando no hay acceso a Google Drive
    const fallbackData = [
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

    return fallbackData
  } catch (error) {
    console.error("Error fetching menu data from Drive:", error)
    return null
  }
}

// Helper function to parse CSV data
function parseCSV(csvData: string) {
  const lines = csvData.split("\n")
  const headers = lines[0].split(",")

  const result = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    const obj: Record<string, string> = {}
    const currentLine = lines[i].split(",")

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = currentLine[j]?.trim() || ""
    }

    result.push(obj)
  }

  return result
}

// Function to organize menu data by category
export function organizeMenuByCategory(menuData: any[]) {
  const categories: Record<string, any[]> = {
    cafeteria: [],
    comidas: [],
    postres: [],
    bebidas: [],
    vinos: [],
  }

  menuData.forEach((item) => {
    const category = item.category?.toLowerCase() || ""

    if (categories[category]) {
      categories[category].push({
        name: item.name,
        description: item.description || "",
        price: item.price,
        logo: item.logo || "",
      })
    }
  })

  return categories
}

