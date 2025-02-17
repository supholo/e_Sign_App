"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { FileText, Plus, Search, Eye, Copy, Trash2 } from "lucide-react"
import { PDFEditor } from "@/components/pdf-editor"
import { templatesApi } from "@/lib/api/templatesApi"
import type { Template } from "@/lib/models/template"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import { useToast } from "@/components/ui/use-toast"

export default function Templates() {
  const [activeTab, setActiveTab] = useState("editor")
  const [templateName, setTemplateName] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const fetchedTemplates = await templatesApi.getTemplates()
        setTemplates(fetchedTemplates)
      } catch (error) {
        console.error("Error fetching templates:", error)
        toast({
          title: "Error",
          description: "Failed to fetch templates. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [user, toast])

  const handleCreateTemplate = async () => {
    try {
      const newTemplate = await templatesApi.createTemplate({
        name: templateName,
        type: documentType,
        createdAt: new Date().toISOString(),
        fields: [],
        pdfUrl: "",
      })
      setTemplates([...templates, newTemplate])
      toast({
        title: "Success",
        description: "Template created successfully.",
      })
    } catch (error) {
      console.error("Error creating template:", error)
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    try {
      await templatesApi.deleteTemplate(id)
      setTemplates(templates.filter((template) => template.id !== id))
      toast({
        title: "Success",
        description: "Template deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting template:", error)
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return null // The Layout component will handle redirection
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Templates</h1>
          <div className="flex space-x-2">
            <Button onClick={handleCreateTemplate}>
              <Plus className="mr-2 h-4 w-4" /> Create Template
            </Button>
            <Button asChild>
              <Link href="/templates/create-flexiform">
                <Plus className="mr-2 h-4 w-4" /> Create Flexiform
              </Link>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Template Editor</TabsTrigger>
            <TabsTrigger value="list">Template Library</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Template</CardTitle>
                <CardDescription>Design a new document template with custom fields</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input
                      id="templateName"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Add document types here */}
                        <SelectItem value="loan">Loan Agreement</SelectItem>
                        <SelectItem value="account">Account Opening Form</SelectItem>
                        <SelectItem value="kyc">KYC Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="border rounded-lg h-[600px] bg-white">
                  <PDFEditor />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Template Library</CardTitle>
                    <CardDescription>Manage your document templates</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{template.name}</h3>
                              <p className="text-sm text-muted-foreground">{template.type}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                          <span>{template.fields.length} Fields</span>
                          <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

