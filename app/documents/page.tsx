"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Eye, Download, Plus, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import dynamic from "next/dynamic"
import { mockDb, type Document, type Workflow } from "@/lib/mock-db"

const PDFViewer = dynamic(() => import("@/components/pdf-viewer"), { ssr: false })

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("")
  const [showAddToWorkflowDialog, setShowAddToWorkflowDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [newDocumentName, setNewDocumentName] = useState("")
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null)
  const [newAccountNumber, setNewAccountNumber] = useState("")
  const [newBranchName, setNewBranchName] = useState("")
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newDocumentType, setNewDocumentType] = useState("")
  const [newAmount, setNewAmount] = useState("")

  useEffect(() => {
    const fetchData = () => {
      setDocuments(mockDb.getDocuments())
      setWorkflows(mockDb.getWorkflows())
    }
    fetchData()
    const intervalId = setInterval(fetchData, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddToWorkflow = () => {
    if (selectedDocument && selectedWorkflow) {
      const updatedDocument = mockDb.addDocumentToWorkflow(selectedDocument.id, selectedWorkflow)
      if (updatedDocument) {
        setDocuments(mockDb.getDocuments())
        setShowAddToWorkflowDialog(false)
        setSelectedDocument(null)
        setSelectedWorkflow("")
        toast({
          title: "Document added to workflow",
          description: `${updatedDocument.name} has been added to the workflow.`,
        })
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newDocumentName && newDocumentFile) {
      const tempUrl = `/temp/${Date.now()}-${newDocumentName}`

      const newDocument = mockDb.addDocument({
        name: newDocumentName,
        status: "Draft",
        uploadedBy: "Current User",
        date: new Date().toISOString().split("T")[0],
        size: `${(newDocumentFile.size / 1024 / 1024).toFixed(2)} MB`,
        url: tempUrl,
        accountNumber: newAccountNumber,
        branchName: newBranchName,
        customerName: newCustomerName,
        documentType: newDocumentType,
        amount: Number.parseFloat(newAmount),
      })

      setDocuments(mockDb.getDocuments())
      setShowUploadDialog(false)
      setNewDocumentName("")
      setNewDocumentFile(null)
      setNewAccountNumber("")
      setNewBranchName("")
      setNewCustomerName("")
      setNewDocumentType("")
      setNewAmount("")
      toast({
        title: "Document uploaded",
        description: `${newDocumentName} has been successfully uploaded.`,
      })
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <Button onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedDocument(doc)
                            setShowPreviewDialog(true)
                          }}
                        >
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Dialog open={showAddToWorkflowDialog} onOpenChange={setShowAddToWorkflowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Workflow</DialogTitle>
            <DialogDescription>Select a workflow to add this document to.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workflow" className="text-right">
                Workflow
              </Label>
              <Select onValueChange={setSelectedWorkflow} value={selectedWorkflow}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a workflow" />
                </SelectTrigger>
                <SelectContent>
                  {workflows.map((workflow) => (
                    <SelectItem key={workflow.id} value={workflow.id.toString()}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddToWorkflow}>Add to Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4 h-[600px]">{selectedDocument && <PDFViewer url={selectedDocument.url} />}</div>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

