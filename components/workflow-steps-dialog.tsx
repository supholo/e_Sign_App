"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import type { WorkflowTemplate, WorkflowStep } from "@/lib/mock-db"

interface WorkflowStepsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflow: WorkflowTemplate | null
  onUpdateWorkflow: (categoryId: string, workflowId: string, updates: Partial<WorkflowTemplate>) => void
  onDeleteWorkflow: (categoryId: string, workflowId: string) => void
}

export function WorkflowStepsDialog({
  open,
  onOpenChange,
  workflow,
  onUpdateWorkflow,
  onDeleteWorkflow,
}: WorkflowStepsDialogProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [newStepName, setNewStepName] = useState("")
  const [newStepRole, setNewStepRole] = useState("")

  useEffect(() => {
    if (workflow) {
      setSteps(workflow.steps)
    }
  }, [workflow])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(steps)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSteps(items)
  }

  const handleAddStep = () => {
    if (newStepName && newStepRole) {
      setSteps([
        ...steps,
        {
          name: newStepName,
          role: newStepRole,
          status: "pending",
          icon: "FileText",
        },
      ])
      setNewStepName("")
      setNewStepRole("")
    }
  }

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (workflow) {
      onUpdateWorkflow(workflow.category, workflow.id, { steps })
      onOpenChange(false)
    }
  }

  const handleDelete = () => {
    if (workflow) {
      onDeleteWorkflow(workflow.category, workflow.id)
      onOpenChange(false)
    }
  }

  if (!workflow) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Workflow Steps</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{workflow.name}</h3>
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
            </div>
            <Badge variant={workflow.status === "active" ? "default" : "secondary"}>{workflow.status}</Badge>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="stepName">Step Name</Label>
                <Input
                  id="stepName"
                  value={newStepName}
                  onChange={(e) => setNewStepName(e.target.value)}
                  placeholder="Enter step name"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="stepRole">Role</Label>
                <Select value={newStepRole} onValueChange={setNewStepRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approver">Approver</SelectItem>
                    <SelectItem value="Reviewer">Reviewer</SelectItem>
                    <SelectItem value="Signer">Signer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="mt-8"
                variant="outline"
                onClick={handleAddStep}
                disabled={!newStepName || !newStepRole}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="steps">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {steps.map((step, index) => (
                      <Draggable key={`${step.name}-${index}`} draggableId={`${step.name}-${index}`} index={index}>
                        {(provided) => (
                          <Card ref={provided.innerRef} {...provided.draggableProps} className="mb-2">
                            <CardContent className="flex items-center p-4">
                              <div {...provided.dragHandleProps} className="cursor-move mr-2">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{step.name}</p>
                                <p className="text-sm text-muted-foreground">{step.role}</p>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveStep(index)}>
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
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="destructive" onClick={handleDelete}>
              Delete Workflow
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

