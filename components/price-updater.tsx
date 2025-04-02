"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Save, RefreshCw } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  category: string
  price: string
}

export default function PriceUpdater() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchMenuItems = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/menu")

      if (!response.ok) {
        throw new Error("Failed to fetch menu data")
      }

      const data = await response.json()

      // Flatten the categories into a single array of items
      const allItems: MenuItem[] = []
      Object.entries(data).forEach(([category, items]: [string, any[]]) => {
        items.forEach((item, index) => {
          allItems.push({
            id: `${category}-${index}`,
            name: item.name,
            category,
            price: item.price.replace("$", ""),
          })
        })
      })

      setItems(allItems)
    } catch (err) {
      console.error("Error fetching menu items:", err)
      setError("No se pudieron cargar los elementos del menú")
    } finally {
      setLoading(false)
    }
  }

  const handlePriceChange = (id: string, newPrice: string) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, price: newPrice } : item)))
  }

  const saveChanges = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare the data for the Google Sheet
      // This is a simplified example - in a real implementation,
      // you would need to format the data according to your sheet structure
      const values = items.map((item) => [item.name, item.category, item.price])

      // Send the data to our API endpoint
      const response = await fetch("/api/update-prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spreadsheetId: process.env.NEXT_PUBLIC_MENU_SPREADSHEET_ID,
          range: "Menu!A2:C",
          values,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar los cambios")
      }

      setSuccess("Los precios se han actualizado correctamente")
    } catch (err) {
      console.error("Error saving changes:", err)
      setError("Ocurrió un error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Actualizar Precios</CardTitle>
        <CardDescription>Actualiza los precios del menú y sincronízalos con Google Sheets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={fetchMenuItems} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Cargando..." : "Cargar elementos del menú"}
            </Button>

            <Button onClick={saveChanges} disabled={saving || items.length === 0} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4">
              <p>{success}</p>
            </div>
          )}

          {items.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="capitalize">{item.category}</TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={item.price}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

