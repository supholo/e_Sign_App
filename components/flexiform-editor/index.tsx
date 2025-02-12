"use client"

import { useState } from "react"
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, type DragEndEvent } from "@dnd-kit/core"
import { DocumentFields } from "./document-fields"
import { PdfViewer } from "./pdf-viewer"
import { DocumentProperties } from "./document-properties"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { mockDb } from "@/lib/mock-db"
import type { FormField, FlexiformTemplate } from "@/lib/types"

export function FlexiformEditor() {
  const [fields, setFields] = useState<FormField[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [documentName, setDocumentName] = useState<string>("")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)

    const { active, over } = event
    if (!over) return

    // If dropping on the PDF viewer
    if (over.id === "pdf-viewer") {
      const fieldType = active.id as string
      const newField: FormField = {
        id: `field-${Date.now()}`,
        type: fieldType,
        x: event.delta.x,
        y: event.delta.y,
        width: 150,
        height: 30,
        required: false,
        label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      }
      setFields((prev) => [...prev, newField])
    }
  }

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id === fieldId) {
          return { ...field, ...updates }
        }
        return field
      }),
    )
  }

  const handleFieldDelete = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId))
    setSelectedField(null)
  }

  const handleSaveTemplate = async () => {
    if (!documentName || !pdfFile) {
      toast({
        title: "Error",
        description: "Please provide a document name and upload a PDF file.",
        variant: "destructive",
      })
      return
    }

    try {
      const template: Omit<FlexiformTemplate, "id" | "createdAt"> = {
        name: documentName,
        fields,
        pdfUrl: URL.createObjectURL(pdfFile), // In a real app, you'd upload this to storage
        type: "flexiform",
      }

      const savedTemplate = await mockDb.createFlexiformTemplate(template)
      toast({
        title: "Success",
        description: "Template saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-[250px_1fr_300px] gap-6 h-[calc(100vh-12rem)]">
        <Card className="p-4 overflow-y-auto">
          <DocumentFields />
        </Card>

        <Card className="relative overflow-hidden">
          <PdfViewer
            file={pdfFile}
            onFileChange={setPdfFile}
            fields={fields}
            selectedField={selectedField}
            onFieldSelect={setSelectedField}
            onFieldUpdate={handleFieldUpdate}
          />
        </Card>

        <Card className="p-4 overflow-y-auto">
          <DocumentProperties
            documentName={documentName}
            onDocumentNameChange={setDocumentName}
            selectedField={selectedField}
            onFieldUpdate={handleFieldUpdate}
            onFieldDelete={handleFieldDelete}
            onSave={handleSaveTemplate}
          />
        </Card>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-primary/10 border-2 border-primary rounded-md p-2 pointer-events-none">
            {activeId.charAt(0).toUpperCase() + activeId.slice(1)} Field
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

