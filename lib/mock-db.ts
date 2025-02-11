import { v4 as uuidv4 } from "uuid"

export type Document = {
  id: string
  name: string
  status: "Draft" | "In Workflow" | "Pending for Sign" | "Signed" | "Declined" | "Recalled" // Added new statuses
  uploadedBy: string
  date: string
  size: string
  url: string
  workflowId?: string
  accountNumber: string
  branchName: string
  customerName: string
  documentType: string
  amount: number
  currentStep?: number
}

export type Workflow = {
  id: string
  name: string
  status: "Active" | "Completed"
  creator: string
  createdDate: string
  currentStep: number
  steps: WorkflowStep[]
}

export type WorkflowStep = {
  name: string
  status: "completed" | "current" | "pending"
  icon: string
  role: string
  assignee?: {
    name: string
    email: string
    avatar: string
  }
  completedAt?: string
}

export type Signature = {
  id: string
  documentId: string
  assignedTo: string
  status: "Pending" | "Signed"
  dueDate: string
}

export type Template = {
  id: string
  name: string
  type: string
  createdAt: string
  fields: TemplateField[]
  pdfUrl: string
}

export type TemplateField = {
  id: string
  type: "text" | "checkbox" | "signature" | "date"
  x: number
  y: number
  label: string
  required: boolean
  page: number
}

export type RecentActivity = {
  id: string
  type: "document" | "workflow" | "signature" | "user"
  action: string
  itemId: string
  itemName: string
  userId: string
  userName: string
  timestamp: string
}

export type AuditLog = {
  id: string
  type: "document" | "workflow" | "signature" | "user"
  action: string
  itemId: string
  itemName: string
  userId: string
  userName: string
  timestamp: string
  details: string
}

class MockDatabase {
  documents: Document[] = []
  workflows: Workflow[] = []
  signatures: Signature[] = []
  templates: Template[] = []
  recentActivities: RecentActivity[] = []
  auditLogs: AuditLog[] = []

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    this.documents = [
      {
        id: uuidv4(),
        name: "Contract Agreement.pdf",
        status: "Draft",
        uploadedBy: "John Doe",
        date: "2023-05-01",
        size: "2.5 MB",
        url: "/temp/sample.pdf",
        accountNumber: "1234567890",
        branchName: "Main Branch",
        customerName: "Alice Johnson",
        documentType: "Contract",
        amount: 10000,
      },
      {
        id: uuidv4(),
        name: "NDA Document.pdf",
        status: "Draft",
        uploadedBy: "Jane Smith",
        date: "2023-04-28",
        size: "1.2 MB",
        url: "/temp/sample.pdf",
        accountNumber: "0987654321",
        branchName: "Downtown Branch",
        customerName: "Bob Williams",
        documentType: "NDA",
        amount: 5000,
      },
      {
        id: uuidv4(),
        name: "Project Proposal.pdf",
        status: "Draft",
        uploadedBy: "Mike Johnson",
        date: "2023-04-25",
        size: "3.7 MB",
        url: "/temp/sample.pdf",
        accountNumber: "5678901234",
        branchName: "Corporate Branch",
        customerName: "Charlie Brown",
        documentType: "Proposal",
        amount: 25000,
      },
    ]

    this.workflows = [
      {
        id: uuidv4(),
        name: "Default Approval Workflow",
        status: "Active",
        creator: "System",
        createdDate: "2023-05-01",
        currentStep: 0,
        steps: [
          {
            name: "Draft",
            status: "pending",
            icon: "FileText",
            role: "Approver",
            assignee: { name: "Alice Johnson", email: "alice@example.com", avatar: "/placeholder-avatar.jpg" },
          },
          {
            name: "Review",
            status: "pending",
            icon: "Eye",
            role: "Reviewer",
            assignee: { name: "Bob Smith", email: "bob@example.com", avatar: "/placeholder-avatar.jpg" },
          },
          {
            name: "Approve",
            status: "pending",
            icon: "UserCheck",
            role: "Approver",
            assignee: { name: "Charlie Brown", email: "charlie@example.com", avatar: "/placeholder-avatar.jpg" },
          },
          {
            name: "Sign",
            status: "pending",
            icon: "CheckCircle",
            role: "Signer",
            assignee: { name: "David Wilson", email: "david@example.com", avatar: "/placeholder-avatar.jpg" },
          },
        ],
      },
    ]
  }

  getDocuments(): Document[] {
    return this.documents
  }

  getDocumentById(id: string): Document | undefined {
    return this.documents.find((doc) => doc.id === id)
  }

  addDocument(document: Omit<Document, "id">): Document {
    const newDocument = { ...document, id: uuidv4() }
    this.documents.push(newDocument)
    this.addRecentActivity({
      type: "document",
      action: "created",
      itemId: newDocument.id,
      itemName: newDocument.name,
      userId: "current-user-id", // Replace with actual user ID when authentication is implemented
      userName: "Current User", // Replace with actual user name when authentication is implemented
    })
    this.addAuditLog({
      type: "document",
      action: "created",
      itemId: newDocument.id,
      itemName: newDocument.name,
      userId: "current-user-id",
      userName: "Current User",
      details: JSON.stringify(newDocument),
    })
    return newDocument
  }

  updateDocument(id: string, updates: Partial<Document>): Document | undefined {
    const index = this.documents.findIndex((doc) => doc.id === id)
    if (index !== -1) {
      this.documents[index] = { ...this.documents[index], ...updates }
      this.addRecentActivity({
        type: "document",
        action: "updated",
        itemId: id,
        itemName: this.documents[index].name,
        userId: "current-user-id",
        userName: "Current User",
      })
      this.addAuditLog({
        type: "document",
        action: "updated",
        itemId: id,
        itemName: this.documents[index].name,
        userId: "current-user-id",
        userName: "Current User",
        details: JSON.stringify(updates),
      })
      return this.documents[index]
    }
    return undefined
  }

  deleteDocument(id: string): boolean {
    const initialLength = this.documents.length
    const documentToDelete = this.documents.find((doc) => doc.id === id)
    this.documents = this.documents.filter((doc) => doc.id !== id)
    if (this.documents.length < initialLength && documentToDelete) {
      this.addRecentActivity({
        type: "document",
        action: "deleted",
        itemId: id,
        itemName: documentToDelete.name,
        userId: "current-user-id",
        userName: "Current User",
      })
      this.addAuditLog({
        type: "document",
        action: "deleted",
        itemId: id,
        itemName: documentToDelete.name,
        userId: "current-user-id",
        userName: "Current User",
        details: JSON.stringify(documentToDelete),
      })
    }
    return this.documents.length < initialLength
  }

  getWorkflows(): Workflow[] {
    return this.workflows
  }

  getWorkflowById(id: string): Workflow | undefined {
    return this.workflows.find((workflow) => workflow.id === id)
  }

  addWorkflow(workflow: Omit<Workflow, "id">): Workflow {
    const newWorkflow = { ...workflow, id: uuidv4() }
    this.workflows.push(newWorkflow)
    this.addRecentActivity({
      type: "workflow",
      action: "created",
      itemId: newWorkflow.id,
      itemName: newWorkflow.name,
      userId: "current-user-id",
      userName: "Current User",
    })
    this.addAuditLog({
      type: "workflow",
      action: "created",
      itemId: newWorkflow.id,
      itemName: newWorkflow.name,
      userId: "current-user-id",
      userName: "Current User",
      details: JSON.stringify(newWorkflow),
    })
    return newWorkflow
  }

  updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | undefined {
    const index = this.workflows.findIndex((workflow) => workflow.id === id)
    if (index !== -1) {
      this.workflows[index] = { ...this.workflows[index], ...updates }
      this.addRecentActivity({
        type: "workflow",
        action: "updated",
        itemId: id,
        itemName: this.workflows[index].name,
        userId: "current-user-id",
        userName: "Current User",
      })
      this.addAuditLog({
        type: "workflow",
        action: "updated",
        itemId: id,
        itemName: this.workflows[index].name,
        userId: "current-user-id",
        userName: "Current User",
        details: JSON.stringify(updates),
      })
      return this.workflows[index]
    }
    return undefined
  }

  deleteWorkflow(id: string): boolean {
    const initialLength = this.workflows.length
    const workflowToDelete = this.workflows.find((workflow) => workflow.id === id)
    this.workflows = this.workflows.filter((workflow) => workflow.id !== id)
    if (this.workflows.length < initialLength && workflowToDelete) {
      this.addRecentActivity({
        type: "workflow",
        action: "deleted",
        itemId: id,
        itemName: workflowToDelete.name,
        userId: "current-user-id",
        userName: "Current User",
      })
      this.addAuditLog({
        type: "workflow",
        action: "deleted",
        itemId: id,
        itemName: workflowToDelete.name,
        userId: "current-user-id",
        userName: "Current User",
        details: JSON.stringify(workflowToDelete),
      })
    }
    return this.workflows.length < initialLength
  }

  getSignatures(): Signature[] {
    return this.signatures
  }

  getSignatureById(id: string): Signature | undefined {
    return this.signatures.find((signature) => signature.id === id)
  }

  addSignature(signature: Omit<Signature, "id">): Signature {
    const newSignature = { ...signature, id: uuidv4() }
    this.signatures.push(newSignature)
    this.addRecentActivity({
      type: "signature",
      action: "created",
      itemId: newSignature.id,
      itemName: `Signature for document ${newSignature.documentId}`,
      userId: "current-user-id",
      userName: "Current User",
    })
    this.addAuditLog({
      type: "signature",
      action: "created",
      itemId: newSignature.id,
      itemName: `Signature for document ${newSignature.documentId}`,
      userId: "current-user-id",
      userName: "Current User",
      details: JSON.stringify(newSignature),
    })
    return newSignature
  }

  updateSignature(id: string, updates: Partial<Signature>): Signature | undefined {
    const index = this.signatures.findIndex((signature) => signature.id === id)
    if (index !== -1) {
      this.signatures[index] = { ...this.signatures[index], ...updates }
      if (updates.status === "Signed") {
        const documentIndex = this.documents.findIndex((doc) => doc.id === this.signatures[index].documentId)
        if (documentIndex !== -1) {
          this.documents[documentIndex].status = "Signed"
        }
      }
      this.addRecentActivity({
        type: "signature",
        action: "updated",
        itemId: id,
        itemName: `Signature for document ${this.signatures[index].documentId}`,
        userId: "current-user-id",
        userName: "Current User",
      })
      this.addAuditLog({
        type: "signature",
        action: "updated",
        itemId: id,
        itemName: `Signature for document ${this.signatures[index].documentId}`,
        userId: "current-user-id",
        userName: "Current User",
        details: JSON.stringify(updates),
      })
      return this.signatures[index]
    }
    return undefined
  }

  deleteSignature(id: string): boolean {
    const initialLength = this.signatures.length
    const signatureToDelete = this.signatures.find((signature) => signature.id === id)
    this.signatures = this.signatures.filter((signature) => signature.id !== id)
    if (this.signatures.length < initialLength && signatureToDelete) {
      this.addRecentActivity({
        type: "signature",
        action: "deleted",
        itemId: id,
        itemName: `Signature for document ${signatureToDelete.documentId}`,
        userId: "current-user-id",
        userName: "Current User",
      })
      this.addAuditLog({
        type: "signature",
        action: "deleted",
        itemId: id,
        itemName: `Signature for document ${signatureToDelete.documentId}`,
        userId: "current-user-id",
        userName: "Current User",
        details: JSON.stringify(signatureToDelete),
      })
    }
    return this.signatures.length < initialLength
  }

  getFilteredDocuments(filter?: string): Document[] {
    switch (filter) {
      case "workflow":
        return this.documents.filter((doc) => doc.workflowId)
      case "signature":
        return this.documents.filter((doc) => doc.status === "Pending for Sign")
      default:
        return this.documents
    }
  }

  addDocumentToWorkflow(documentId: string, workflowId: string): Document | undefined {
    const documentIndex = this.documents.findIndex((doc) => doc.id === documentId)
    const workflow = this.workflows.find((wf) => wf.id === workflowId)

    if (documentIndex !== -1 && workflow) {
      this.documents[documentIndex].workflowId = workflowId
      this.documents[documentIndex].status = "In Workflow"
      this.documents[documentIndex].currentStep = 0
      workflow.steps[0].status = "current"
      this.addRecentActivity({
        type: "document",
        action: "added_to_workflow",
        itemId: documentId,
        itemName: this.documents[documentIndex].name,
        userId: "current-user-id",
        userName: "Current User",
      })
      this.addAuditLog({
        type: "document",
        action: "added_to_workflow",
        itemId: documentId,
        itemName: this.documents[documentIndex].name,
        userId: "current-user-id",
        userName: "Current User",
        details: JSON.stringify({ documentId, workflowId }),
      })
      return this.documents[documentIndex]
    }

    return undefined
  }

  moveWorkflowToNextStep(documentId: string): Document | undefined {
    const document = this.documents.find((doc) => doc.id === documentId)
    if (!document || !document.workflowId) return undefined

    const workflow = this.workflows.find((wf) => wf.id === document.workflowId)
    if (!workflow) return undefined

    const currentStepIndex = document.currentStep ?? 0
    if (currentStepIndex >= workflow.steps.length - 1) return undefined

    workflow.steps[currentStepIndex].status = "completed"
    workflow.steps[currentStepIndex].completedAt = new Date().toISOString()

    document.currentStep = currentStepIndex + 1
    workflow.steps[document.currentStep].status = "current"

    if (workflow.steps[document.currentStep].name === "Sign") {
      document.status = "Pending for Sign"
      this.addSignature({
        documentId: document.id,
        assignedTo: workflow.steps[document.currentStep].assignee?.name,
        status: "Pending",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      })
    } else if (workflow.steps[document.currentStep].name === "Approve") {
      document.status = "In Workflow"
    }

    if (document.currentStep === workflow.steps.length - 1) {
      workflow.status = "Completed"
    }

    this.addRecentActivity({
      type: "workflow",
      action: "step_completed",
      itemId: workflow.id,
      itemName: workflow.name,
      userId: "current-user-id",
      userName: "Current User",
    })
    this.addAuditLog({
      type: "workflow",
      action: "step_completed",
      itemId: workflow.id,
      itemName: workflow.name,
      userId: "current-user-id",
      userName: "Current User",
      details: JSON.stringify({
        documentId,
        workflowId: workflow.id,
        completedStep: currentStepIndex,
        newStep: document.currentStep,
      }),
    })

    return document
  }

  getTemplates(): Template[] {
    return this.templates
  }

  getTemplateById(id: string): Template | undefined {
    return this.templates.find((template) => template.id === id)
  }

  addTemplate(template: Omit<Template, "id">): Template {
    const newTemplate = { ...template, id: uuidv4() }
    this.templates.push(newTemplate)
    this.addRecentActivity({
      type: "template",
      action: "created",
      itemId: newTemplate.id,
      itemName: newTemplate.name,
      userId: "current-user-id",
      userName: "Current User",
    })
    this.addAuditLog({
      type: "template",
      action: "created",
      itemId: newTemplate.id,
      itemName: newTemplate.name,
      userId: "current-user-id",
      userName: "Current User",
      details: JSON.stringify(newTemplate),
    })
    return newTemplate
  }

  updateTemplate(id: string, updates: Partial<Template>): Template | undefined {
    const index = this.templates.findIndex((template) => template.id === id)
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates }
      this.addRecentActivity({
        type: "template",
        action: "updated",
        itemId: id,
        itemName: this.templates[index].name,
        userId: "current-user-id",
        userName: "Current User",
      })
      this.addAuditLog({
        type: "template",
        action: "updated",
        itemId: id,
        itemName: this.templates[index].name,
        userId: "current-user-id",
        userName: "Current User",
        details: JSON.stringify(updates),
      })
      return this.templates[index]
    }
    return undefined
  }

  deleteTemplate(id: string): boolean {
    const initialLength = this.templates.length
    const templateToDelete = this.templates.find((template) => template.id === id)
    this.templates = this.templates.filter((template) => template.id !== id)
    if (this.templates.length < initialLength && templateToDelete) {
      this.addRecentActivity({
        type: "template",
        action: "deleted",
        itemId: id,
        itemName: templateToDelete.name,
        userId: "current-user-id",
        userName: "Current User",
      })
      this.addAuditLog({
        type: "template",
        action: "deleted",
        itemId: id,
        itemName: templateToDelete.name,
        userId: "current-user-id",
        userName: "Current User",
        details: JSON.stringify(templateToDelete),
      })
    }
    return this.templates.length < initialLength
  }

  addRecentActivity(activity: Omit<RecentActivity, "id" | "timestamp">): RecentActivity {
    const newActivity: RecentActivity = {
      ...activity,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    }
    this.recentActivities.unshift(newActivity)
    this.recentActivities = this.recentActivities.slice(0, 100) // Keep only the last 100 activities
    return newActivity
  }

  getRecentActivities(): RecentActivity[] {
    return this.recentActivities
  }

  addAuditLog(log: Omit<AuditLog, "id" | "timestamp">): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    }
    this.auditLogs.unshift(newLog)
    return newLog
  }

  getAuditLogs(): AuditLog[] {
    return this.auditLogs
  }
}

export const mockDb = new MockDatabase()

