"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Search, Plus, Users, Scale, DollarSign, FileText, Settings, ChevronDown } from "lucide-react"
import { mockDb, type Category, type WorkflowTemplate } from "@/lib/mock-db"
import { CreateWorkflowDialog } from "@/components/create-workflow-dialog"
import { WorkflowStepsDialog } from "@/components/workflow-steps-dialog"
import { cn } from "@/lib/utils"

export function WorkflowManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showStepsDialog, setShowStepsDialog] = useState(false)

  useEffect(() => {
    const fetchData = () => {
      setCategories(mockDb.getCategories())
      setWorkflows(mockDb.getWorkflowTemplates())
    }
    fetchData()
  }, [])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleCreateWorkflow = (workflow: Omit<WorkflowTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newWorkflow = mockDb.addWorkflowTemplate(workflow)
    setWorkflows((prevWorkflows) => {
      const updatedWorkflows = prevWorkflows.filter((w) => w.id !== newWorkflow.id)
      return [...updatedWorkflows, newWorkflow]
    })
    setShowCreateDialog(false)
  }

  const handleUpdateWorkflow = (workflowId: string, updates: Partial<WorkflowTemplate>) => {
    const updatedWorkflow = mockDb.updateWorkflowTemplate(workflowId, updates)
    if (updatedWorkflow) {
      setWorkflows(workflows.map((w) => (w.id === workflowId ? updatedWorkflow : w)))
      setSelectedWorkflow(null)
    }
  }

  const handleDeleteWorkflow = (workflowId: string) => {
    if (mockDb.deleteWorkflowTemplate(workflowId)) {
      setWorkflows(workflows.filter((w) => w.id !== workflowId))
      setSelectedWorkflow(null)
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "hr":
        return <Users className="h-4 w-4" />
      case "legal":
        return <Scale className="h-4 w-4" />
      case "finance":
        return <DollarSign className="h-4 w-4" />
      case "system":
        return <Settings className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredWorkflows = workflows.filter(
    (workflow) =>
      (workflow.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (workflow.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Workflows</h1>
          <p className="text-muted-foreground">Create and manage workflow templates</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {["Create/Edit Workflows", "Upload Document Templates", "Activate Workflow"].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full w-8 h-8 text-sm font-medium",
                  index + 1 === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </div>
              <span className={cn("ml-2", index + 1 === 1 ? "text-primary font-medium" : "text-muted-foreground")}>
                {step}
              </span>
              {index < 2 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create/Edit Workflows and Activities</CardTitle>
          <CardDescription>
            A workflow is a categorized list like Human Resources, Finance or Legal while activities are specific tasks
            such as Employee Onboarding within Human Resources, Purchase Orders/Invoices within Finance, or NDA's in
            Legal. An activity can have one or more documents associated with it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflow..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Workflow
            </Button>
          </div>

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleCategory(category.id)}>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedCategories.includes(category.id) ? "rotate-0" : "-rotate-90",
                    )}
                  />
                  {getCategoryIcon(category.id)}
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {filteredWorkflows.filter((w) => w.categoryId === category.id).length}
                  </Badge>
                </div>

                {expandedCategories.includes(category.id) && (
                  <div className="pl-6 space-y-2">
                    {filteredWorkflows
                      .filter((workflow) => workflow.categoryId === category.id)
                      .map((workflow) => (
                        <div
                          key={workflow.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{workflow.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedWorkflow(workflow)
                                setShowStepsDialog(true)
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CreateWorkflowDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        categories={categories}
        onCreateWorkflow={handleCreateWorkflow}
      />

      <WorkflowStepsDialog
        open={showStepsDialog}
        onOpenChange={setShowStepsDialog}
        workflow={selectedWorkflow || null}
        onUpdateWorkflow={handleUpdateWorkflow}
        onDeleteWorkflow={handleDeleteWorkflow}
      />
    </div>
  )
}

