"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Trash2, Save } from "lucide-react"
import type { FormField } from "@/lib/types"

interface DocumentPropertiesProps {
  documentName: string
  onDocumentNameChange: (name: string) => void
  selectedField: FormField | null
  onFieldUpdate: (fieldId: string, updates: Partial<FormField>) => void
  onFieldDelete: (fieldId: string) => void
  onSave: () => void
}

export function DocumentProperties({
  documentName,
  onDocumentNameChange,
  selectedField,
  onFieldUpdate,
  onFieldDelete,
  onSave,
}: DocumentPropertiesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold mb-4">Document Properties</h2>
        <div className="space-y-2">
          <Label htmlFor="documentName">Document Name</Label>
          <Input
            id="documentName"
            value={documentName}
            onChange={(e) => onDocumentNameChange(e.target.value)}
            placeholder="Enter document name"
          />
        </div>
      </div>

      <Separator />

      {selectedField ? (
        <div>
          <h2 className="font-semibold mb-4">Field Properties</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fieldLabel">Label</Label>
              <Input
                id="fieldLabel"
                value={selectedField.label}
                onChange={(e) => onFieldUpdate(selectedField.id, { label: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldWidth">Width (px)</Label>
              <Input
                id="fieldWidth"
                type="number"
                value={selectedField.width}
                onChange={(e) => onFieldUpdate(selectedField.id, { width: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldHeight">Height (px)</Label>
              <Input
                id="fieldHeight"
                type="number"
                value={selectedField.height}
                onChange={(e) => onFieldUpdate(selectedField.id, { height: Number(e.target.value) })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="required">Required Field</Label>
              <Switch
                id="required"
                checked={selectedField.required}
                onCheckedChange={(checked) => onFieldUpdate(selectedField.id, { required: checked })}
              />
            </div>

            <Button variant="destructive" className="w-full" onClick={() => onFieldDelete(selectedField.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Field
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Select a field to edit its properties</div>
      )}

      <Separator />

      <Button className="w-full" onClick={onSave}>
        <Save className="h-4 w-4 mr-2" />
        Save Template
      </Button>
    </div>
  )
}

