"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { DocumentList } from "@/components/document-list"
import { documentsApi } from "@/lib/api/documentsApi"
import type { Document } from "@/lib/models/document"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import { useToast } from "@/components/ui/use-toast"
import ErrorBoundary from "@/components/error-boundary"

function DocumentsContent() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const fetchedDocuments = await documentsApi.getDocuments()
        setDocuments(fetchedDocuments)
        setError(null)
      } catch (err) {
        setError("Failed to fetch documents. Please try again.")
        console.error("Error fetching documents:", err)
        toast({
          title: "Error",
          description: "Failed to fetch documents. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [user, toast])

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return null // The Layout component will handle redirection
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <DocumentList documents={documents} setDocuments={setDocuments} />
      )}
    </div>
  )
}

export default function Documents() {
  return (
    <Layout>
      <ErrorBoundary>
        <DocumentsContent />
      </ErrorBoundary>
    </Layout>
  )
}

