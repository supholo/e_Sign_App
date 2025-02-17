"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Eye, Trash2, Upload, Download, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { documentsApi } from "@/lib/api/documentsApi"
import type { Document } from "@/lib/models/document"
import AddToWorkflowDialog from "@/components/add-to-workflow-dialog"
import { useAuth } from "@/hooks/useAuth"

interface DocumentListProps {
  documents: Document[]
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>
}

export function DocumentList({ documents, setDocuments }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [newDocumentName, setNewDocumentName] = useState("")
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null)
  const [newAccountNumber, setNewAccountNumber] = useState("")
  const [newBranchName, setNewBranchName] = useState("")
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newDocumentType, setNewDocumentType] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [showAddToWorkflowDialog, setShowAddToWorkflowDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const { user } = useAuth()

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newDocumentName && newDocumentFile) {
      try {
        const newDocument = await documentsApi.addDocument({
          name: newDocumentName,
          status: "Draft",
          uploadedBy: "Current User",
          date: new Date().toISOString().split("T")[0],
          size: `${(newDocumentFile.size / 1024 / 1024).toFixed(2)} MB`,
          url: URL.createObjectURL(newDocumentFile), // This would be different for a real API
          accountNumber: newAccountNumber,
          branchName: newBranchName,
          customerName: newCustomerName,
          documentType: newDocumentType,
          amount: Number.parseFloat(newAmount),
        })

        setDocuments([...documents, newDocument])
        setShowUploadDialog(false)
        resetForm()
        toast({
          title: "Document uploaded",
          description: `${newDocumentName} has been successfully uploaded.`,
        })
      } catch (error) {
        console.error("Error uploading document:", error)
        toast({
          title: "Error",
          description: "Failed to upload document. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const success = await documentsApi.deleteDocument(id)
      if (success) {
        setDocuments(documents.filter((doc) => doc.id !== id))
        toast({
          title: "Document deleted",
          description: "The document has been successfully deleted.",
        })
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setNewDocumentName("")
    setNewDocumentFile(null)
    setNewAccountNumber("")
    setNewBranchName("")
    setNewCustomerName("")
    setNewDocumentType("")
    setNewAmount("")
  }

  const handleAddToWorkflow = async (documentId: string, workflowId: string) => {
    try {
      const updatedDocument = await documentsApi.addDocumentToWorkflow(documentId, workflowId)
      if (updatedDocument) {
        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) => (doc.id === updatedDocument.id ? updatedDocument : doc)),
        )
        setShowAddToWorkflowDialog(false)
        setSelectedDocument(null)
        toast({
          title: "Success",
          description: `${updatedDocument.name} has been added to the workflow.`,
        })
      }
    } catch (error) {
      console.error("Error adding document to workflow:", error)
      toast({
        title: "Error",
        description: "Failed to add document to workflow. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <CardDescription>A list of all documents in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Branch Name</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.status === "Signed"
                          ? "success"
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
                  <TableCell>{doc.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" disabled={doc.status !== "Signed"}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedDocument(doc)
                          setShowAddToWorkflowDialog(true)
                        }}
                        disabled={doc.status === "In Workflow" || doc.status === "Signed"}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                        disabled={doc.status === "In Workflow" || doc.status === "Signed"}
                      >
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

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a new document to the system.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="documentName" className="text-right">
                  Name
                </Label>
                <Input
                  id="documentName"
                  value={newDocumentName}
                  onChange={(e) => setNewDocumentName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="documentFile" className="text-right">
                  File
                </Label>
                <Input
                  id="documentFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setNewDocumentFile(e.target.files ? e.target.files[0] : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountNumber" className="text-right">
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branchName" className="text-right">
                  Branch Name
                </Label>
                <Input
                  id="branchName"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerName" className="text-right">
                  Customer Name
                </Label>
                <Input
                  id="customerName"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="documentType" className="text-right">
                  Document Type
                </Label>
                <Input
                  id="documentType"
                  value={newDocumentType}
                  onChange={(e) => setNewDocumentType(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
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
      <AddToWorkflowDialog
        open={showAddToWorkflowDialog}
        onOpenChange={setShowAddToWorkflowDialog}
        onAddToWorkflow={handleAddToWorkflow}
        document={selectedDocument}
      />
    </div>
  )
}

