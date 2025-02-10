"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { PlusCircle, GripVertical, Trash2, Save } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type WorkflowStep = {
  id: string
  name: string
  role: string
  dueDate: Date | null
}

type AddWorkflowDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddWorkflow: (name: string, steps: WorkflowStep[]) => void
}

export function AddWorkflowDialog({ open, onOpenChange, onAddWorkflow }: AddWorkflowDialogProps) {
  const [activeTab, setActiveTab] = useState("builder")
  const [workflowName, setWorkflowName] = useState("")
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [templates, setTemplates] = useState<{ name: string; steps: WorkflowStep[] }[]>([])

  const addStep = () => {
    setSteps([...steps, { id: Date.now().toString(), name: "", role: "Approver", dueDate: null }])
  }

  const updateStep = (id: string, field: keyof WorkflowStep, value: string | Date | null) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, [field]: value } : step)))
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newSteps = Array.from(steps)
    const [reorderedItem] = newSteps.splice(result.source.index, 1)
    newSteps.splice(result.destination.index, 0, reorderedItem)

    setSteps(newSteps)
  }

  const saveTemplate = () => {
    if (workflowName && steps.length > 0) {
      setTemplates([...templates, { name: workflowName, steps }])
    }
  }

  const loadTemplate = (templateSteps: WorkflowStep[]) => {
    setSteps(templateSteps)
  }

  const handleAddWorkflow = () => {
    if (workflowName && steps.length > 0) {
      onAddWorkflow(workflowName, steps)
      setWorkflowName("")
      setSteps([])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="builder">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Enter workflow name"
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Workflow Steps</Label>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="steps">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {steps.map((step, index) => (
                          <Draggable key={step.id} draggableId={step.id} index={index}>
                            {(provided) => (
                              <Card ref={provided.innerRef} {...provided.draggableProps} className="mb-2">
                                <CardContent className="flex items-center p-4">
                                  <div {...provided.dragHandleProps} className="mr-2">
                                    <GripVertical className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <Input
                                    value={step.name}
                                    onChange={(e) => updateStep(step.id, "name", e.target.value)}
                                    placeholder="Step name"
                                    className="mr-2"
                                  />
                                  <Select
                                    value={step.role}
                                    onValueChange={(value) => updateStep(step.id, "role", value)}
                                  >
                                    <SelectTrigger className="w-[180px] mr-2">
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Approver">Approver</SelectItem>
                                      <SelectItem value="Reviewer">Reviewer</SelectItem>
                                      <SelectItem value="Signer">Signer</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <DatePicker
                                    date={step.dueDate}
                                    onDateChange={(date) => updateStep(step.id, "dueDate", date)}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeStep(step.id)}
                                    className="ml-auto"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <Button onClick={addStep} variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between">
              <Button onClick={saveTemplate} variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save as Template
              </Button>
              <Button onClick={handleAddWorkflow}>Create Workflow</Button>
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <div className="space-y-4 py-4">
              <h3 className="text-lg font-medium">{workflowName || "Untitled Workflow"}</h3>
              {steps.map((step, index) => (
                <Card key={step.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{step.name || "Unnamed Step"}</p>
                        <p className="text-sm text-gray-500">{step.role}</p>
                      </div>
                    </div>
                    {step.dueDate && <Badge variant="outline">Due: {step.dueDate.toLocaleDateString()}</Badge>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <Separator className="my-4" />
        <div>
          <h4 className="mb-2 text-sm font-medium">Saved Templates</h4>
          <div className="flex space-x-2 overflow-x-auto">
            {templates.map((template, index) => (
              <Button key={index} variant="outline" onClick={() => loadTemplate(template.steps)}>
                {template.name}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

