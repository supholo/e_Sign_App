"use client"

import { useState } from "react"
import { Document, Page } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PDFViewerProps {
  url: string
}

export default function PDFViewer({ url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  // Ensure the URL is absolute
  const pdfUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`

  return (
    <div className="flex flex-col items-center">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="max-h-[500px] overflow-auto"
        error={<div>Failed to load PDF file.</div>}
        loading={<div>Loading PDF...</div>}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div className="flex items-center justify-between w-full mt-4">
        <Button onClick={() => setPageNumber((page) => Math.max(page - 1, 1))} disabled={pageNumber <= 1}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <Button
          onClick={() => setPageNumber((page) => Math.min(page + 1, numPages || 1))}
          disabled={pageNumber >= (numPages || 1)}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

