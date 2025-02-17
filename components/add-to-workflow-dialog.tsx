"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { documentsApi } from "@/lib/api/documentsApi"
import type { Document } from "@/lib/models/document"

interface AddToWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToWorkflow: (documentId: string, workflowId: string) => void
  document: Document | null
}

export default function AddToWorkflowDialog({
  open,
  onOpenChange,
  onAddToWorkflow,
  document,
}: AddToWorkflowDialogProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [workflows, setWorkflows] = useState<{ id: string; name: string; categoryId: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      // Replace these with actual API calls when available
      const fetchedCategories = await documentsApi.getCategories()
      const fetchedWorkflows = await documentsApi.getWorkflowTemplates()
      setCategories(fetchedCategories)
      setWorkflows(fetchedWorkflows)
    }
    fetchData()
  }, [])

  const filteredWorkflows = selectedCategory
    ? workflows.filter((workflow) => workflow.categoryId === selectedCategory)
    : []

  const handleAddToWorkflow = () => {
    if (selectedWorkflow && document) {
      onAddToWorkflow(document.id, selectedWorkflow)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Workflow</DialogTitle>
          <DialogDescription>Select a category and workflow to add this document to.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="workflow" className="text-right">
              Workflow
            </Label>
            <Select onValueChange={setSelectedWorkflow} value={selectedWorkflow}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a workflow" />
              </SelectTrigger>
              <SelectContent>
                {filteredWorkflows.map((workflow) => (
                  <SelectItem key={workflow.id} value={workflow.id}>
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
  )
}

