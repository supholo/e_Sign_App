"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { mockDb } from "@/lib/mock-db"
import { toast } from "@/components/ui/use-toast"

type Department = {
  id: string
  name: string
  description: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [newDepartment, setNewDepartment] = useState({ name: "", description: "" })
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  useEffect(() => {
    const fetchDepartments = async () => {
      const fetchedDepartments = await mockDb.getDepartments()
      setDepartments(fetchedDepartments)
    }
    fetchDepartments()
  }, [])

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const createdDepartment = await mockDb.createDepartment(newDepartment)
      setDepartments([...departments, createdDepartment])
      setNewDepartment({ name: "", description: "" })
      toast({
        title: "Department Created",
        description: `${createdDepartment.name} has been created successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create department. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDepartment) return
    try {
      const updatedDepartment = await mockDb.updateDepartment(editingDepartment.id, editingDepartment)
      setDepartments(departments.map((dept) => (dept.id === updatedDepartment.id ? updatedDepartment : dept)))
      setEditingDepartment(null)
      toast({
        title: "Department Updated",
        description: `${updatedDepartment.name} has been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update department. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDepartment = async (id: string) => {
    try {
      await mockDb.deleteDepartment(id)
      setDepartments(departments.filter((dept) => dept.id !== id))
      toast({
        title: "Department Deleted",
        description: "The department has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Departments</h1>
        <p className="text-muted-foreground">Create and manage departments in your organization.</p>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Department</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                />
              </div>
              <Button type="submit">Create Department</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setEditingDepartment(department)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteDepartment(department.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {editingDepartment && (
          <Dialog open={!!editingDepartment} onOpenChange={() => setEditingDepartment(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Department</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateDepartment} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Department Name</Label>
                  <Input
                    id="edit-name"
                    value={editingDepartment.name}
                    onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editingDepartment.description}
                    onChange={(e) => setEditingDepartment({ ...editingDepartment, description: e.target.value })}
                  />
                </div>
                <Button type="submit">Update Department</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  )
}

