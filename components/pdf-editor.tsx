"use client"

import { useState, useRef } from "react"
import { Document, Page } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  Type,
  Square,
  FilePenLineIcon as Signature,
  Calendar,
  Save,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type FieldType = "text" | "checkbox" | "signature" | "date"

interface Field {
  id: string
  type: FieldType
  x: number
  y: number
  label: string
  required: boolean
}

export function PDFEditor() {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [fields, setFields] = useState<Field[]>([])
  const [selectedField, setSelectedField] = useState<Field | null>(null)
  const [activeFieldType, setActiveFieldType] = useState<FieldType | null>(null)
  const [pdfFile, setPdfFile] = useState<Uint8Array | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const fieldTypes = [
    { type: "text" as FieldType, icon: Type, label: "Text Field" },
    { type: "checkbox" as FieldType, icon: Square, label: "Checkbox" },
    { type: "signature" as FieldType, icon: Signature, label: "Signature" },
    { type: "date" as FieldType, icon: Calendar, label: "Date" },
  ]

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!activeFieldType || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    const newField: Field = {
      id: `field-${Date.now()}`,
      type: activeFieldType,
      x,
      y,
      label: `${activeFieldType.charAt(0).toUpperCase() + activeFieldType.slice(1)} Field`,
      required: false,
    }

    setFields([...fields, newField])
    setActiveFieldType(null)
  }

  const handleFieldClick = (field: Field, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedField(field)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer
        setPdfFile(new Uint8Array(arrayBuffer))
      }
      reader.onerror = (error) => {
        console.error("Error reading file:", error)
        toast({
          title: "Error",
          description: "Failed to read the PDF file. Please try again.",
          variant: "destructive",
        })
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <div className="flex h-full">
      <div className="w-64 border-r p-4 space-y-4">
        <div className="space-y-2">
          <Label>Add Field</Label>
          <div className="grid grid-cols-2 gap-2">
            {fieldTypes.map(({ type, icon: Icon, label }) => (
              <TooltipProvider key={type}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeFieldType === type ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setActiveFieldType(type)}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={() => setScale(scale - 0.1)}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="icon" onClick={() => setScale(scale + 0.1)}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageNumber(Math.min(pageNumber + 1, numPages))}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {selectedField && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Field Properties</h3>
            <div className="space-y-2">
              <Label htmlFor="fieldLabel">Label</Label>
              <Input
                id="fieldLabel"
                value={selectedField.label}
                onChange={(e) =>
                  setFields(fields.map((f) => (f.id === selectedField.id ? { ...f, label: e.target.value } : f)))
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="required"
                checked={selectedField.required}
                onChange={(e) =>
                  setFields(fields.map((f) => (f.id === selectedField.id ? { ...f, required: e.target.checked } : f)))
                }
              />
              <Label htmlFor="required">Required</Label>
            </div>
          </div>
        )}

        <div className="space-y-2 border-t pt-4">
          <Button className="w-full" onClick={() => console.log("Save template")}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
          <Label htmlFor="pdf-upload" className="w-full">
            <Button variant="outline" className="w-full" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </span>
            </Button>
          </Label>
          <Input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div
          ref={containerRef}
          className="relative inline-block bg-white shadow-lg"
          onClick={handleContainerClick}
          style={{ cursor: activeFieldType ? "crosshair" : "default" }}
        >
          {pdfFile ? (
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => {
                console.error("Error loading PDF:", error)
                toast({
                  title: "Error",
                  description: "Failed to load the PDF. Please try uploading again or use a different file.",
                  variant: "destructive",
                })
              }}
              loading={<div className="p-4">Loading PDF...</div>}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                loading={<div>Loading page...</div>}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          ) : (
            <div className="p-4 text-center">
              <p>No PDF uploaded. Please upload a PDF to start editing.</p>
            </div>
          )}

          {fields.map((field) => (
            <div
              key={field.id}
              className={`absolute p-2 border-2 rounded cursor-move ${
                selectedField?.id === field.id ? "border-primary bg-primary/10" : "border-gray-400 bg-white/80"
              }`}
              style={{
                left: field.x,
                top: field.y,
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => handleFieldClick(field, e)}
            >
              {field.type === "text" && <Type className="h-4 w-4" />}
              {field.type === "checkbox" && <Square className="h-4 w-4" />}
              {field.type === "signature" && <Signature className="h-4 w-4" />}
              {field.type === "date" && <Calendar className="h-4 w-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

