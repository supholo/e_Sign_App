"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { mockDb, type CustomField } from "@/lib/mock-db"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

export default function CustomFieldsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingField, setEditingField] = useState<CustomField | null>(null)
  const [newField, setNewField] = useState<Omit<CustomField, "id">>({
    name: "",
    type: "text",
    required: false,
    options: [],
  })

  useEffect(() => {
    setCustomFields(mockDb.getCustomFields())
  }, [])

  const handleCreateField = () => {
    const createdField = mockDb.createCustomField(newField)
    setCustomFields([...customFields, createdField])
    setIsDialogOpen(false)
    setNewField({ name: "", type: "text", required: false, options: [] })
    toast({
      title: "Success",
      description: "Custom field created successfully.",
    })
  }

  const handleUpdateField = () => {
    if (editingField) {
      const updatedField = mockDb.updateCustomField(editingField.id, editingField)
      if (updatedField) {
        setCustomFields(customFields.map((field) => (field.id === updatedField.id ? updatedField : field)))
        setIsDialogOpen(false)
        setEditingField(null)
        toast({
          title: "Success",
          description: "Custom field updated successfully.",
        })
      }
    }
  }

  const handleDeleteField = (id: string) => {
    if (mockDb.deleteCustomField(id)) {
      setCustomFields(customFields.filter((field) => field.id !== id))
      toast({
        title: "Success",
        description: "Custom field deleted successfully.",
      })
    }
  }

  const filteredFields = customFields.filter((field) => field.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Custom Fields</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Field
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search custom fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Custom Fields</CardTitle>
            <CardDescription>Manage your custom fields for documents and workflows.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell>{field.name}</TableCell>
                    <TableCell>{field.type}</TableCell>
                    <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingField(field)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteField(field.id)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingField ? "Edit Custom Field" : "Add Custom Field"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                value={editingField ? editingField.name : newField.name}
                onChange={(e) =>
                  editingField
                    ? setEditingField({ ...editingField, name: e.target.value })
                    : setNewField({ ...newField, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="type">Field Type</Label>
              <Select
                value={editingField ? editingField.type : newField.type}
                onValueChange={(value: CustomField["type"]) =>
                  editingField
                    ? setEditingField({ ...editingField, type: value })
                    : setNewField({ ...newField, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(editingField?.type === "dropdown" || newField.type === "dropdown") && (
              <div>
                <Label htmlFor="options">Options (comma-separated)</Label>
                <Input
                  id="options"
                  value={editingField ? editingField.options?.join(", ") : newField.options?.join(", ")}
                  onChange={(e) => {
                    const options = e.target.value.split(",").map((option) => option.trim())
                    editingField ? setEditingField({ ...editingField, options }) : setNewField({ ...newField, options })
                  }}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={editingField ? editingField.required : newField.required}
                onCheckedChange={(checked) =>
                  editingField
                    ? setEditingField({ ...editingField, required: checked })
                    : setNewField({ ...newField, required: checked })
                }
              />
              <Label htmlFor="required">Required</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingField ? handleUpdateField : handleCreateField}>
                {editingField ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

