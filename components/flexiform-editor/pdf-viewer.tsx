"use client"

import { useCallback, useState } from "react"
import { Document, Page } from "react-pdf"
import { useDroppable } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Upload } from "lucide-react"
import type { FormField } from "@/lib/types"
import cn from "classnames"

interface PdfViewerProps {
  file: File | null
  onFileChange: (file: File | null) => void
  fields: FormField[]
  selectedField: FormField | null
  onFieldSelect: (field: FormField | null) => void
  onFieldUpdate: (fieldId: string, updates: Partial<FormField>) => void
}

export function PdfViewer({ file, onFileChange, fields, selectedField, onFieldSelect, onFieldUpdate }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)

  const { setNodeRef } = useDroppable({
    id: "pdf-viewer",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileChange(file)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const handleFieldClick = (field: FormField, e: React.MouseEvent) => {
    e.stopPropagation()
    onFieldSelect(field)
  }

  const handleFieldDrag = useCallback(
    (fieldId: string, deltaX: number, deltaY: number) => {
      onFieldUpdate(fieldId, {
        x: deltaX,
        y: deltaY,
      })
    },
    [onFieldUpdate],
  )

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span>{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="icon" onClick={() => setScale((prev) => Math.min(prev + 0.1, 2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <Input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
          <Button variant="outline" onClick={() => document.getElementById("pdf-upload")?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload PDF
          </Button>
        </div>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-auto relative bg-muted/20">
        {file ? (
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess} className="mx-auto">
            <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
            {fields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  "absolute border-2 rounded cursor-move bg-white/50 backdrop-blur-sm",
                  selectedField?.id === field.id ? "border-primary" : "border-gray-400",
                )}
                style={{
                  left: field.x,
                  top: field.y,
                  width: field.width,
                  height: field.height,
                }}
                onClick={(e) => handleFieldClick(field, e)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", field.id)
                  onFieldSelect(field)
                }}
                onDrag={(e) => {
                  if (e.clientX === 0 && e.clientY === 0) return // Ignore invalid drag events
                  handleFieldDrag(field.id, e.clientX, e.clientY)
                }}
              >
                <div className="p-2 text-xs truncate">{field.label}</div>
              </div>
            ))}
          </Document>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Upload a PDF to get started
          </div>
        )}
      </div>
    </div>
  )
}

