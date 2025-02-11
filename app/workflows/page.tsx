"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Search, Eye, FileText } from "lucide-react"
import { WorkflowDialog } from "@/components/workflow-dialog"
import { mockDb, type Workflow, type Document } from "@/lib/mock-db"

export default function Workflows() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    const fetchData = () => {
      const allDocuments = mockDb.getDocuments()
      const documentsInWorkflow = allDocuments.filter((doc) => doc.workflowId && doc.status !== "Signed")
      setDocuments(documentsInWorkflow)
      setWorkflows(mockDb.getWorkflows())
    }
    fetchData()
    const intervalId = setInterval(fetchData, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const filteredDocuments = documents.filter(
    (doc) =>
      (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.status.toLowerCase().includes(searchTerm.toLowerCase())) &&
      doc.status !== "Signed",
  )

  const handleUpdateWorkflow = (updatedWorkflow: Workflow) => {
    const updated = mockDb.updateWorkflow(updatedWorkflow.id, updatedWorkflow)
    if (updated) {
      setWorkflows(mockDb.getWorkflows())
      setSelectedWorkflow(updated)
      setDocuments(mockDb.getDocuments().filter((doc) => doc.workflowId))
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workflows</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents in workflow..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Documents in Workflow</CardTitle>
            <CardDescription>A list of all documents currently in a workflow.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[300px]">Document Name</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[140px]">Account Number</TableHead>
                    <TableHead className="w-[140px]">Branch Name</TableHead>
                    <TableHead className="w-[140px]">Customer Name</TableHead>
                    <TableHead className="w-[140px]">Document Type</TableHead>
                    <TableHead className="w-[120px] text-right">Amount</TableHead>
                    <TableHead className="w-[200px]">Workflow</TableHead>
                    <TableHead className="w-[140px]">Current Step</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => {
                    const workflow = workflows.find((wf) => wf.id === document.workflowId)
                    return (
                      <TableRow key={document.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium truncate max-w-[200px]">{document.name}</span>
                              <span className="text-xs text-muted-foreground">{document.date}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              document.status === "Signed"
                                ? "success"
                                : document.status === "Pending for Sign"
                                  ? "warning"
                                  : document.status === "In Workflow"
                                    ? "secondary"
                                    : "outline"
                            }
                            className="whitespace-nowrap"
                          >
                            {document.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{document.accountNumber}</TableCell>
                        <TableCell>
                          <span className="truncate block max-w-[120px]">{document.branchName}</span>
                        </TableCell>
                        <TableCell>
                          <span className="truncate block max-w-[120px]">{document.customerName}</span>
                        </TableCell>
                        <TableCell>
                          <span className="truncate block max-w-[120px]">{document.documentType}</span>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {document.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="bg-primary/10 p-1.5 rounded-full">
                              <Clock className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="truncate max-w-[150px]">{workflow ? workflow.name : "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="whitespace-nowrap font-normal">
                            {workflow ? workflow.steps[document.currentStep ?? 0]?.name || "N/A" : "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedWorkflow(workflow || null)
                              setSelectedDocument(document)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileText className="h-8 w-8 mb-2" />
                          <span className="text-sm">No documents found in workflow</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <WorkflowDialog
        workflow={selectedWorkflow}
        document={selectedDocument}
        open={!!selectedWorkflow && !!selectedDocument}
        onOpenChange={() => {
          setSelectedWorkflow(null)
          setSelectedDocument(null)
        }}
        onUpdateWorkflow={handleUpdateWorkflow}
      />
    </Layout>
  )
}

