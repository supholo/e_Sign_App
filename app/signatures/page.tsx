"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, FileText, PenTool } from "lucide-react"
import { signaturesApi } from "@/lib/api/signaturesApi"
import { documentsApi } from "@/lib/api/documentsApi"
import type { Document, Signature } from "@/lib/models/signature"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import { useToast } from "@/components/ui/use-toast"
import ErrorBoundary from "@/components/error-boundary"

function SignaturesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const [fetchedSignatures, fetchedDocuments] = await Promise.all([
          signaturesApi.getSignatures(),
          documentsApi.getDocuments(),
        ])
        setSignatures(fetchedSignatures)
        setDocuments(fetchedDocuments)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch signatures and documents. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  const filteredSignatures = signatures.filter((sig) => {
    const document = documents.find((doc) => doc.id === sig.documentId)
    return (
      document?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleUpdateSignature = async (updatedSignature: Signature) => {
    try {
      const updated = await signaturesApi.updateSignature(updatedSignature.id, updatedSignature)
      if (updated) {
        const newSignatures = await signaturesApi.getSignatures()
        const newDocuments = await documentsApi.getDocuments()
        setSignatures(newSignatures.filter((sig) => sig.status === "Pending"))
        setDocuments(newDocuments)
        setSelectedSignature(null)
        setSelectedDocument(null)
        toast({
          title: "Success",
          description: "Signature updated successfully.",
        })
      }
    } catch (error) {
      console.error("Error updating signature:", error)
      // handleError(error) // Removed as toast already handles error display
      toast({
        title: "Error",
        description: "Failed to update signature. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return null // The Layout component will handle redirection
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Signatures</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search signatures..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Signatures</CardTitle>
          <CardDescription>Documents awaiting signature.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSignatures.map((sig) => {
                const document = documents.find((doc) => doc.id === sig.documentId)
                return (
                  <TableRow key={sig.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                        {document?.name || "Unknown Document"}
                      </div>
                    </TableCell>
                    <TableCell>{sig.assignedTo}</TableCell>
                    <TableCell>
                      <Badge variant={sig.status === "Pending" ? "warning" : "success"}>{sig.status}</Badge>
                    </TableCell>
                    <TableCell>{sig.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSignature(sig)
                            setSelectedDocument(document || null)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSignature(sig)
                            setSelectedDocument(document || null)
                          }}
                        >
                          <PenTool className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Signatures() {
  return (
    <Layout>
      <ErrorBoundary>
        <SignaturesContent />
      </ErrorBoundary>
    </Layout>
  )
}

