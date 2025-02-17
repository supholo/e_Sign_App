"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EmailTemplate } from "@/lib/mock-db"
import { useQuill } from "@/hooks/use-quill"

interface EmailTemplateFormProps {
  template?: EmailTemplate | null
  onSubmit: (template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function EmailTemplateForm({ template, onSubmit, onCancel }: EmailTemplateFormProps) {
  const [name, setName] = useState(template?.name || "")
  const [subject, setSubject] = useState(template?.subject || "")
  const [content, setContent] = useState(template?.content || "")
  const [variables, setVariables] = useState(template?.variables.join(", ") || "")

  const { quillRef, quillInstance } = useQuill()

  useEffect(() => {
    if (quillInstance && content) {
      quillInstance.root.innerHTML = content
    }
  }, [quillInstance, content])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      subject,
      content: quillInstance ? quillInstance.root.innerHTML : content,
      variables: variables.split(",").map((v) => v.trim()),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Template Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <div ref={quillRef} className="h-64 mb-4" />
      </div>
      <div>
        <Label htmlFor="variables">Variables (comma-separated)</Label>
        <Input id="variables" value={variables} onChange={(e) => setVariables(e.target.value)} />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}

