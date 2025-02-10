"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Search, Eye, Send, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockDb, type Document } from "@/lib/mock-db"

export function DocumentList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [newDocumentName, setNewDocumentName] = useState("")
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchDocuments = () => {
      setDocuments(mockDb.getDocuments())
    }

    fetchDocuments()
    const intervalId = setInterval(fetchDocuments, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (newDocumentName && newDocumentFile) {
      const newDocument = mockDb.addDocument({
        name: newDocumentName,
        status: "Draft",
        uploadedBy: "Current User",
        date: new Date().toISOString().split("T")[0],
        size: `${(newDocumentFile.size / 1024 / 1024).toFixed(2)} MB`,
        url: URL.createObjectURL(newDocumentFile),
        accountNumber: "N/A",
        branchName: "N/A",
        customerName: "N/A",
        documentType: "N/A",
      })
      setDocuments([...documents, newDocument])
      setShowUploadModal(false)
      setNewDocumentName("")
      setNewDocumentFile(null)
    }
  }

  const handleDelete = (id: string) => {
    if (mockDb.deleteDocument(id)) {
      setDocuments(documents.filter((doc) => doc.id !== id))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>Upload a new document to the system.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newDocumentName}
                    onChange={(e) => setNewDocumentName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    File
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setNewDocumentFile(e.target.files ? e.target.files[0] : null)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Upload</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Branch Name</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc, index) => (
                <TableRow key={doc.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">{doc.date}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.status === "Signed"
                          ? "default"
                          : doc.status === "Pending for Sign"
                            ? "warning"
                            : doc.status === "In Workflow"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.accountNumber}</TableCell>
                  <TableCell>{doc.branchName}</TableCell>
                  <TableCell>{doc.customerName}</TableCell>
                  <TableCell>{doc.documentType}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

