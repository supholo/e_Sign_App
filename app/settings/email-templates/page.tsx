"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { mockDb, type EmailTemplate } from "@/lib/mock-db"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { EmailTemplateForm } from "@/components/email-template-form"
import { EmailTemplatePreview } from "@/components/email-template-preview"

export default function EmailTemplates() {
  const [searchTerm, setSearchTerm] = useState("")
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    const fetchTemplates = () => {
      setTemplates(mockDb.getEmailTemplates())
    }
    fetchTemplates()
  }, [])

  const handleCreateTemplate = (template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate = mockDb.createEmailTemplate(template)
    setTemplates([...templates, newTemplate])
    setIsFormOpen(false)
    toast({
      title: "Success",
      description: "Email template created successfully.",
    })
  }

  const handleUpdateTemplate = (id: string, updates: Partial<EmailTemplate>) => {
    const updatedTemplate = mockDb.updateEmailTemplate(id, updates)
    if (updatedTemplate) {
      setTemplates(templates.map((t) => (t.id === id ? updatedTemplate : t)))
      setSelectedTemplate(null)
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Email template updated successfully.",
      })
    }
  }

  const handleDeleteTemplate = (id: string) => {
    if (mockDb.deleteEmailTemplate(id)) {
      setTemplates(templates.filter((t) => t.id !== id))
      toast({
        title: "Success",
        description: "Email template deleted successfully.",
      })
    }
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Manage your email templates for various events and notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Variables</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.subject}</TableCell>
                    <TableCell>{template.variables.join(", ")}</TableCell>
                    <TableCell>{new Date(template.updatedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTemplate(template)
                            setIsPreviewOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTemplate(template)
                            setIsFormOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedTemplate ? "Edit Email Template" : "Create Email Template"}</DialogTitle>
          </DialogHeader>
          <EmailTemplateForm
            template={selectedTemplate}
            onSubmit={(template) => {
              if (selectedTemplate) {
                handleUpdateTemplate(selectedTemplate.id, template)
              } else {
                handleCreateTemplate(template)
              }
            }}
            onCancel={() => {
              setSelectedTemplate(null)
              setIsFormOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Email Template Preview</DialogTitle>
          </DialogHeader>
          {selectedTemplate && <EmailTemplatePreview template={selectedTemplate} />}
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

