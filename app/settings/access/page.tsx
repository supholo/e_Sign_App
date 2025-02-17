"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { settingsApi } from "@/lib/api/settingsApi"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import type { Role } from "@/lib/models/settings"

const availablePermissions = [
  "create_document",
  "edit_document",
  "delete_document",
  "manage_users",
  "manage_workflows",
  "view_reports",
]

export default function AccessManagementPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [newRole, setNewRole] = useState({ name: "", permissions: [] as string[] })
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const fetchedRoles = await settingsApi.getRoles()
        setRoles(fetchedRoles)
      } catch (error) {
        console.error("Error fetching roles:", error)
        toast({
          title: "Error",
          description: "Failed to fetch roles. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchRoles()
  }, [user, toast])

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const createdRole = await settingsApi.createRole(newRole)
      setRoles([...roles, createdRole])
      setNewRole({ name: "", permissions: [] })
      toast({
        title: "Role Created",
        description: `${createdRole.name} has been created successfully.`,
      })
    } catch (error) {
      console.error("Error creating role:", error)
      toast({
        title: "Error",
        description: "Failed to create role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRole) return
    try {
      const updatedRole = await settingsApi.updateRole(editingRole.id, editingRole)
      setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)))
      setEditingRole(null)
      toast({
        title: "Role Updated",
        description: `${updatedRole.name} has been updated successfully.`,
      })
    } catch (error) {
      console.error("Error updating role:", error)
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRole = async (id: string) => {
    try {
      await settingsApi.deleteRole(id)
      setRoles(roles.filter((role) => role.id !== id))
      toast({
        title: "Role Deleted",
        description: "The role has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting role:", error)
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
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
        <h1 className="text-3xl font-bold">Access Management</h1>
        <p className="text-muted-foreground">Manage roles and permissions for your organization.</p>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Role</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permission-${permission}`}
                        checked={newRole.permissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewRole({ ...newRole, permissions: [...newRole.permissions, permission] })
                          } else {
                            setNewRole({ ...newRole, permissions: newRole.permissions.filter((p) => p !== permission) })
                          }
                        }}
                      />
                      <Label htmlFor={`permission-${permission}`}>{permission}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit">Create Role</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.permissions.join(", ")}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setEditingRole(role)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteRole(role.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {editingRole && (
          <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Role</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateRole} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Role Name</Label>
                  <Input
                    id="edit-name"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    {availablePermissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-permission-${permission}`}
                          checked={editingRole.permissions.includes(permission)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEditingRole({ ...editingRole, permissions: [...editingRole.permissions, permission] })
                            } else {
                              setEditingRole({
                                ...editingRole,
                                permissions: editingRole.permissions.filter((p) => p !== permission),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`edit-permission-${permission}`}>{permission}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button type="submit">Update Role</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  )
}

