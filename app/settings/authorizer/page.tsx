"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { settingsApi } from "@/lib/api/settingsApi"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import type { Authorizer } from "@/lib/models/settings"

export default function AuthorizerPage() {
  const [authorizers, setAuthorizers] = useState<Authorizer[]>([])
  const [newAuthorizer, setNewAuthorizer] = useState<Omit<Authorizer, "id">>({
    name: "",
    email: "",
    role: "",
    department: "",
  })
  const [editingAuthorizer, setEditingAuthorizer] = useState<Authorizer | null>(null)
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const [fetchedAuthorizers, fetchedDepartments, fetchedRoles] = await Promise.all([
          settingsApi.getAuthorizers(),
          settingsApi.getDepartments(),
          settingsApi.getRoles(),
        ])
        setAuthorizers(fetchedAuthorizers)
        setDepartments(fetchedDepartments)
        setRoles(fetchedRoles)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user, toast])

  const handleCreateAuthorizer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const createdAuthorizer = await settingsApi.createAuthorizer(newAuthorizer)
      setAuthorizers([...authorizers, createdAuthorizer])
      setNewAuthorizer({ name: "", email: "", role: "", department: "" })
      toast({
        title: "Authorizer Created",
        description: `${createdAuthorizer.name} has been added as an authorizer.`,
      })
    } catch (error) {
      console.error("Error creating authorizer:", error)
      toast({
        title: "Error",
        description: "Failed to create authorizer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateAuthorizer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAuthorizer) return
    try {
      const updatedAuthorizer = await settingsApi.updateAuthorizer(editingAuthorizer.id, editingAuthorizer)
      setAuthorizers(authorizers.map((auth) => (auth.id === updatedAuthorizer.id ? updatedAuthorizer : auth)))
      setEditingAuthorizer(null)
      toast({
        title: "Authorizer Updated",
        description: `${updatedAuthorizer.name}'s information has been updated.`,
      })
    } catch (error) {
      console.error("Error updating authorizer:", error)
      toast({
        title: "Error",
        description: "Failed to update authorizer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAuthorizer = async (id: string) => {
    try {
      await settingsApi.deleteAuthorizer(id)
      setAuthorizers(authorizers.filter((auth) => auth.id !== id))
      toast({
        title: "Authorizer Deleted",
        description: "The authorizer has been removed successfully.",
      })
    } catch (error) {
      console.error("Error deleting authorizer:", error)
      toast({
        title: "Error",
        description: "Failed to delete authorizer. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return null // The Layout component will handle redirection
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Authorizers</h1>
        <p className="text-muted-foreground">Add, edit, or remove authorizers for document signing and approval.</p>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Authorizer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Authorizer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAuthorizer} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAuthorizer.name}
                  onChange={(e) => setNewAuthorizer({ ...newAuthorizer, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAuthorizer.email}
                  onChange={(e) => setNewAuthorizer({ ...newAuthorizer, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newAuthorizer.role}
                  onValueChange={(value) => setNewAuthorizer({ ...newAuthorizer, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newAuthorizer.department}
                  onValueChange={(value) => setNewAuthorizer({ ...newAuthorizer, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Add Authorizer</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authorizers.map((authorizer) => (
              <TableRow key={authorizer.id}>
                <TableCell>{authorizer.name}</TableCell>
                <TableCell>{authorizer.email}</TableCell>
                <TableCell>{roles.find((r) => r.id === authorizer.role)?.name}</TableCell>
                <TableCell>{departments.find((d) => d.id === authorizer.department)?.name}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setEditingAuthorizer(authorizer)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteAuthorizer(authorizer.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {editingAuthorizer && (
          <Dialog open={!!editingAuthorizer} onOpenChange={() => setEditingAuthorizer(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Authorizer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateAuthorizer} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingAuthorizer.name}
                    onChange={(e) => setEditingAuthorizer({ ...editingAuthorizer, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingAuthorizer.email}
                    onChange={(e) => setEditingAuthorizer({ ...editingAuthorizer, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editingAuthorizer.role}
                    onValueChange={(value) => setEditingAuthorizer({ ...editingAuthorizer, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select
                    value={editingAuthorizer.department}
                    onValueChange={(value) => setEditingAuthorizer({ ...editingAuthorizer, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Update Authorizer</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  )
}

