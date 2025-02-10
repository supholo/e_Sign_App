"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Eye, PenTool } from "lucide-react"
import { mockDb, type Signature, type Document } from "@/lib/mock-db"
import { SignatureDialog } from "@/components/signature-dialog"

export default function Signatures() {
  const [searchTerm, setSearchTerm] = useState("")
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null)

  useEffect(() => {
    const fetchSignatures = () => {
      const filteredDocuments = mockDb.getFilteredDocuments("signature")
      const updatedSignatures = mockDb.getSignatures().filter((sig) => {
        const document = filteredDocuments.find((doc) => doc.id === sig.documentId)
        return document && document.status === "Pending for Sign"
      })
      setSignatures(updatedSignatures)
      setDocuments(filteredDocuments)
    }
    fetchSignatures()
    const intervalId = setInterval(fetchSignatures, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const filteredSignatures = signatures.filter((sig) => {
    const document = documents.find((doc) => doc.id === sig.documentId)
    return (
      document?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleUpdateSignature = (updatedSignature: Signature) => {
    const updated = mockDb.updateSignature(updatedSignature.id, updatedSignature)
    if (updated) {
      setSignatures(mockDb.getSignatures().filter((sig) => sig.status === "Pending"))
      setDocuments(mockDb.getDocuments())
      setSelectedSignature(null)
    }
  }

  return (
    <Layout>
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
                          {document?.name}
                        </div>
                      </TableCell>
                      <TableCell>{sig.assignedTo}</TableCell>
                      <TableCell>
                        <Badge variant="warning">{sig.status}</Badge>
                      </TableCell>
                      <TableCell>{sig.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedSignature(sig)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedSignature(sig)}>
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
      <SignatureDialog
        signature={selectedSignature}
        document={selectedSignature ? documents.find((doc) => doc.id === selectedSignature.documentId) : null}
        open={!!selectedSignature}
        onOpenChange={() => setSelectedSignature(null)}
        onUpdateSignature={handleUpdateSignature}
      />
    </Layout>
  )
}

