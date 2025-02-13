"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EmailTemplate } from "@/lib/mock-db"

interface EmailTemplatePreviewProps {
  template: EmailTemplate
}

export function EmailTemplatePreview({ template }: EmailTemplatePreviewProps) {
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>(
    Object.fromEntries(template.variables.map((v) => [v, ""])),
  )

  const replaceVariables = (content: string) => {
    return content.replace(/\{\{(\w+)\}\}/g, (_, variable) => previewVariables[variable] || `{{${variable}}}`)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {template.variables.map((variable) => (
          <div key={variable}>
            <Label htmlFor={variable}>{variable}</Label>
            <Input
              id={variable}
              value={previewVariables[variable]}
              onChange={(e) => setPreviewVariables({ ...previewVariables, [variable]: e.target.value })}
              placeholder={`Enter value for ${variable}`}
            />
          </div>
        ))}
      </div>
      <div className="border rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">Subject: {replaceVariables(template.subject)}</h3>
        <div dangerouslySetInnerHTML={{ __html: replaceVariables(template.content) }} />
      </div>
      <div className="flex justify-end">
        <Button variant="outline">Send Test Email</Button>
      </div>
    </div>
  )
}

