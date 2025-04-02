"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Trash2, Download, Image, FileText, FilePlus2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  date: string
}

export default function FileUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("images")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<UploadedFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Cargar archivos guardados
  useEffect(() => {
    const savedFiles = localStorage.getItem("puestoBarFiles")
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles))
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)
    setProgress(0)

    // Simular progreso de carga
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Simular carga
    setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)

      const newFiles: UploadedFile[] = Array.from(e.target.files!).map((file) => {
        const isImage = file.type.startsWith("image/")
        return {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          date: new Date().toISOString(),
        }
      })

      setFiles((prev) => {
        const updated = [...prev, ...newFiles]
        localStorage.setItem("puestoBarFiles", JSON.stringify(updated))
        return updated
      })

      setUploading(false)
      setProgress(0)

      toast({
        title: "Archivos subidos",
        description: `Se han subido ${newFiles.length} archivos correctamente.`,
        variant: "default",
      })

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 2000)
  }

  const confirmDeleteFile = (file: UploadedFile) => {
    setFileToDelete(file)
    setShowDeleteDialog(true)
  }

  const deleteFile = () => {
    if (!fileToDelete) return

    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileToDelete.id)
      localStorage.setItem("puestoBarFiles", JSON.stringify(updated))
      return updated
    })

    setShowDeleteDialog(false)
    setFileToDelete(null)

    toast({
      title: "Archivo eliminado",
      description: "El archivo ha sido eliminado correctamente.",
      variant: "default",
    })
  }

  const filteredFiles = files.filter((file) => {
    if (activeTab === "images") {
      return file.type.startsWith("image/")
    } else if (activeTab === "documents") {
      return (
        file.type.includes("pdf") ||
        file.type.includes("word") ||
        file.type.includes("excel") ||
        file.type.includes("text")
      )
    }
    return true
  })

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <Image className="h-5 w-5 text-blue-500" />
    } else if (type.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (type.includes("word")) {
      return <FileText className="h-5 w-5 text-blue-600" />
    } else if (type.includes("excel")) {
      return <FileText className="h-5 w-5 text-green-600" />
    }
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestor de Archivos</h1>
          <p className="text-gray-500 mt-1">Sube y gestiona imágenes y documentos para tu sitio web</p>
        </div>

        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Subiendo..." : "Subir archivos"}
          </Button>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-right text-gray-500">{progress}%</p>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Archivos</CardTitle>
          <CardDescription>Gestiona todos los archivos subidos para tu sitio web</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="images" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Imágenes
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <FilePlus2 className="h-4 w-4" />
                Todos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="mt-0">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Image className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No hay imágenes subidas</p>
                  <Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                    Subir imágenes
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="group relative border rounded-md overflow-hidden">
                      <div className="aspect-square">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={file.url || "/placeholder.svg"}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            {getFileIcon(file.type)}
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => confirmDeleteFile(file)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No hay documentos subidos</p>
                  <Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                    Subir documentos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="flex border rounded-md p-3 group relative">
                      <div className="flex-shrink-0 mr-3">{getFileIcon(file.type)}</div>
                      <div className="flex-grow min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {new Date(file.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center ml-2 gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => confirmDeleteFile(file)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              {files.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FilePlus2 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No hay archivos subidos</p>
                  <Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                    Subir archivos
                  </Button>
                </div>
              ) : (
                <div className="overflow-hidden border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nombre
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tipo
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tamaño
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Fecha
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {files.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getFileIcon(file.type)}
                              <div className="ml-2 truncate max-w-[200px]">{file.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {file.type.split("/").pop()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(file.date).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => confirmDeleteFile(file)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar el archivo "{fileToDelete?.name}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteFile}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

