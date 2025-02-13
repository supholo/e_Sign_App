import { v4 as uuidv4 } from "uuid"

type Authorizer = {
  id: string
  name: string
  email: string
  role: string
  department: string
}

type CustomizationSettings = {
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    darkMode: boolean
  }
  branding: {
    logo: string
    companyName: string
    favicon: string
  }
  email: {
    headerImage: string
    footerText: string
    signature: string
  }
  security: {
    passwordStrength: number
    twoFactorAuth: boolean
    sessionTimeout: number
  }
}

type SubscriptionPlan = {
  id: string
  name: string
  price: number
  features: string[]
  isActive: boolean
}

type Department = {
  id: string
  name: string
  description: string
}

type Role = {
  id: string
  name: string
  permissions: string[]
}

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
  documentId?: string // Added documentId to Workflow
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
  type: "document" | "workflow" | "signature" | "user" | "template"
  action: string
  itemId: string
  itemName: string
  userId: string
  userName: string
  timestamp: string
}

export type AuditLog = {
  id: string
  type: "document" | "workflow" | "signature" | "user" | "template"
  action: string
  itemId: string
  itemName: string
  userId: string
  userName: string
  timestamp: string
  details: string
}

export type WorkflowCategory = {
  id: string
  name: string
  icon: string
  workflows: WorkflowTemplate[]
}

export type WorkflowTemplate = {
  id: string
  name: string
  description: string
  categoryId: string // Changed from 'category' to 'categoryId'
  steps: WorkflowStep[]
  isTemplate: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  status: "active" | "draft" | "archived"
}

export type Category = {
  id: string
  name: string
  icon: string
}

export type FlexiformTemplate = Template & {
  type: "flexiform"
  fields: FlexiformTemplateField[]
}

export type FlexiformTemplateField = TemplateField & {
  options?: string[]
}

export type SavedSignature = {
  id: string
  name: string
  data: string
  createdAt: string
}

export type EmailTemplate = {
  id: string
  name: string
  subject: string
  content: string
  variables: string[]
  createdAt: string
  updatedAt: string
}

export type CustomField = {
  id: string
  name: string
  type: "text" | "number" | "date" | "dropdown" | "checkbox"
  options?: string[] // For dropdown type
  required: boolean
}

export type AdvancedSettings = {
  id: string
  maxSignaturesPerDocument: number
  allowBulkUpload: boolean
  enableAuditTrail: boolean
  maxDocumentSize: number // in MB
  allowedFileTypes: string[]
}

export type PDFSettings = {
  id: string
  defaultPageSize: "A4" | "Letter" | "Legal"
  defaultOrientation: "portrait" | "landscape"
  enableAnnotations: boolean
  enableFormFilling: boolean
  watermarkText: string
  watermarkOpacity: number
}

export type CertificateSettings = {
  id: string
  issuer: string
  validityPeriod: number // in months
  keySize: number
  signatureAlgorithm: string
  useHardwareToken: boolean
}

export type DSCSettings = {
  id: string
  provider: string
  tokenType: "USB" | "Smart Card" | "Cloud"
  validityPeriod: number // in months
  autoRenewal: boolean
  notificationThreshold: number // in days
}

export type BrandingSettings = {
  id: string
  logoUrl: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  customCss: string
  emailTemplate: string
  landingPageContent: string
}

class MockDatabase {
  documents: Document[] = []
  workflows: Workflow[] = []
  signatures: Signature[] = []
  templates: Template[] = []
  recentActivities: RecentActivity[] = []
  auditLogs: AuditLog[] = []
  categories: Category[] = []
  workflowTemplates: WorkflowTemplate[] = []
  subscriptionPlans: SubscriptionPlan[] = []
  departments: Department[] = []
  roles: Role[] = []
  authorizers: Authorizer[] = []
  customizationSettings: CustomizationSettings = {
    theme: { primaryColor: "#000000", secondaryColor: "#ffffff", fontFamily: "Arial", darkMode: false },
    branding: { logo: "", companyName: "", favicon: "" },
    email: { headerImage: "", footerText: "", signature: "" },
    security: { passwordStrength: 8, twoFactorAuth: false, sessionTimeout: 30 },
  }
  private savedSignatures: SavedSignature[] = []
  private emailTemplates: EmailTemplate[] = []
  private customFields: CustomField[] = []
  private advancedSettings: AdvancedSettings = {
    id: "default",
    maxSignaturesPerDocument: 5,
    allowBulkUpload: true,
    enableAuditTrail: true,
    maxDocumentSize: 10,
    allowedFileTypes: [".pdf", ".doc", ".docx"],
  }
  private pdfSettings: PDFSettings = {
    id: "default",
    defaultPageSize: "A4",
    defaultOrientation: "portrait",
    enableAnnotations: true,
    enableFormFilling: true,
    watermarkText: "",
    watermarkOpacity: 0.5,
  }
  private certificateSettings: CertificateSettings = {
    id: "default",
    issuer: "Default CA",
    validityPeriod: 12,
    keySize: 2048,
    signatureAlgorithm: "SHA256withRSA",
    useHardwareToken: false,
  }
  private dscSettings: DSCSettings = {
    id: "default",
    provider: "Default DSC Provider",
    tokenType: "USB",
    validityPeriod: 24,
    autoRenewal: false,
    notificationThreshold: 30,
  }
  private brandingSettings: BrandingSettings = {
    id: "default",
    logoUrl: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    fontFamily: "Arial, sans-serif",
    customCss: "",
    emailTemplate: "",
    landingPageContent: "",
  }

  constructor() {
    this.initializeData()

    // Initialize subscription plans
    this.subscriptionPlans = [
      { id: "basic", name: "Basic", price: 9.99, features: ["10 documents/month", "Basic support"], isActive: false },
      {
        id: "pro",
        name: "Pro",
        price: 19.99,
        features: ["Unlimited documents", "Priority support", "Advanced analytics"],
        isActive: true,
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 49.99,
        features: ["Unlimited documents", "24/7 support", "Custom integrations", "Dedicated account manager"],
        isActive: false,
      },
    ]

    // Initialize departments
    this.departments = [
      { id: uuidv4(), name: "Human Resources", description: "Manages employee-related processes" },
      { id: uuidv4(), name: "Finance", description: "Handles financial operations and reporting" },
      { id: uuidv4(), name: "Legal", description: "Oversees legal matters and compliance" },
    ]

    // Initialize roles
    this.roles = [
      {
        id: uuidv4(),
        name: "Admin",
        permissions: [
          "create_document",
          "edit_document",
          "delete_document",
          "manage_users",
          "manage_workflows",
          "view_reports",
        ],
      },
      { id: uuidv4(), name: "Manager", permissions: ["create_document", "edit_document", "view_reports"] },
      { id: uuidv4(), name: "User", permissions: ["create_document", "edit_document"] },
    ]
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

    // Initialize categories
    this.categories = [
      { id: "hr", name: "Human Resources", icon: "Users" },
      { id: "legal", name: "Legal", icon: "Scale" },
      { id: "finance", name: "Finance", icon: "DollarSign" },
      { id: "system", name: "System", icon: "Settings" },
    ]

    this.categories = [
      {
        id: "hr",
        name: "Human Resources",
        icon: "Users",
        workflows: [
          {
            id: "onboarding",
            name: "Sample Workflow - Onboarding",
            description: "Employee onboarding process workflow",
            categoryId: "hr",
            steps: [
              {
                name: "Offer Letter",
                status: "pending",
                icon: "FileText",
                role: "HR Manager",
              },
              {
                name: "Appraisal Letter",
                status: "pending",
                icon: "FileCheck",
                role: "HR Manager",
              },
              {
                name: "Termination Letter",
                status: "pending",
                icon: "FileX",
                role: "HR Director",
              },
            ],
            isTemplate: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "system",
            status: "active",
          },
        ],
      },
      {
        id: "legal",
        name: "Legal",
        icon: "Scale",
        workflows: [],
      },
      {
        id: "finance",
        name: "Finance",
        icon: "DollarSign",
        workflows: [
          {
            id: "purchase-order",
            name: "Sample Workflow - Purchase Order",
            description: "Purchase order approval workflow",
            categoryId: "finance",
            steps: [
              {
                name: "Purchase Order",
                status: "pending",
                icon: "FileText",
                role: "Finance Manager",
              },
            ],
            isTemplate: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "system",
            status: "active",
          },
        ],
      },
      {
        id: "system",
        name: "System",
        icon: "Settings",
        workflows: [],
      },
    ]

    // Update the default workflow to use the system category
    this.workflowTemplates = [
      {
        id: uuidv4(),
        name: "Default Approval Workflow",
        description: "System default approval workflow",
        categoryId: "system",
        steps: [
          {
            name: "Draft",
            status: "pending",
            icon: "FileText",
            role: "Approver",
          },
          {
            name: "Review",
            status: "pending",
            icon: "Eye",
            role: "Reviewer",
          },
          {
            name: "Approve",
            status: "pending",
            icon: "UserCheck",
            role: "Approver",
          },
          {
            name: "Sign",
            status: "pending",
            icon: "CheckCircle",
            role: "Signer",
          },
        ],
        isTemplate: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
        status: "active",
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
    console.log("mockDb.addDocumentToWorkflow called with:", documentId, workflowId)
    const documentIndex = this.documents.findIndex((doc) => doc.id === documentId)
    const workflowTemplate = this.workflowTemplates.find((wf) => wf.id === workflowId)

    if (documentIndex !== -1 && workflowTemplate) {
      // Create a new workflow instance based on the template
      const newWorkflow: Workflow = {
        id: uuidv4(),
        name: workflowTemplate.name,
        status: "Active",
        creator: "Current User",
        createdDate: new Date().toISOString(),
        currentStep: 0,
        steps: workflowTemplate.steps.map((step) => ({ ...step, status: "pending" })),
        documentId: documentId,
      }
      this.workflows.push(newWorkflow)

      const updatedDocument = {
        ...this.documents[documentIndex],
        workflowId: newWorkflow.id,
        status: "In Workflow",
        currentStep: 0,
      }
      this.documents[documentIndex] = updatedDocument

      this.addRecentActivity({
        type: "document",
        action: "added_to_workflow",
        itemId: documentId,
        itemName: updatedDocument.name,
        userId: "current-user-id",
        userName: "Current User",
      })
      this.addAuditLog({
        type: "document",
        action: "added_to_workflow",
        itemId: documentId,
        itemName: updatedDocument.name,
        userId: "current-user-id",
        userName: "Current User",
        details: JSON.stringify({ documentId, workflowId: newWorkflow.id }),
      })
      console.log("Document updated in mockDb:", updatedDocument)
      return updatedDocument
    }

    console.error("Failed to add document to workflow in mockDb")
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


// Add new methods for workflow management
getWorkflowCategories()
: WorkflowCategory[]
{
  return this.categories
}

getWorkflowCategory(id: string)
: WorkflowCategory | undefined
{
  return this.categories.find((category) => category.id === id)
}

addWorkflowTemplate(
    categoryId: string,
    template: Omit<WorkflowTemplate, "id" | "createdAt" | "updatedAt">,
  )
: WorkflowTemplate | undefined
{
  const category = this.categories.find((c) => c.id === categoryId)
  if (!category) return undefined

  const newTemplate: WorkflowTemplate = {
    ...template,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "current-user-id",
    isTemplate: true,
    status: "active",
  }

  category.workflows.push(newTemplate)
  return newTemplate
}

updateWorkflowTemplate(
    categoryId: string,
    templateId: string,
    updates: Partial<WorkflowTemplate>,
  )
: WorkflowTemplate | undefined
{
  const category = this.categories.find((c) => c.id === categoryId)
  if (!category) return undefined

  const index = category.workflows.findIndex((w) => w.id === templateId)
  if (index === -1) return undefined

  category.workflows[index] = {
    ...category.workflows[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return category.workflows[index]
}

deleteWorkflowTemplate(categoryId: string, templateId: string)
: boolean
{
  const category = this.categories.find((c) => c.id === categoryId)
  if (!category) return false

  const initialLength = category.workflows.length
  category.workflows = category.workflows.filter((w) => w.id !== templateId)
  return category.workflows.length < initialLength
}

searchWorkflows(query: string)
: WorkflowTemplate[]
{
  const results: WorkflowTemplate[] = []
  this.categories.forEach((category) => {
    const matches = category.workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(query.toLowerCase()) ||
        workflow.description.toLowerCase().includes(query.toLowerCase()),
    )
    results.push(...matches)
  })
  return results
}

// Add methods for category management
getCategories()
: Category[]
{
  return this.categories
}

getCategoryById(id: string)
: Category | undefined
{
  return this.categories.find((category) => category.id === id)
}

addCategory(category: Omit<Category, "id">)
: Category
{
  const newCategory = { ...category, id: uuidv4() }
  this.categories.push(newCategory)
  return newCategory
}

updateCategory(id: string, updates: Partial<Category>)
: Category | undefined
{
  const index = this.categories.findIndex((category) => category.id === id)
  if (index !== -1) {
    this.categories[index] = { ...this.categories[index], ...updates }
    return this.categories[index]
  }
  return undefined
}

deleteCategory(id: string)
: boolean
{
  const initialLength = this.categories.length
  this.categories = this.categories.filter((category) => category.id !== id)
  return this.categories.length < initialLength
}

getWorkflowTemplates()
: WorkflowTemplate[]
{
  return this.workflowTemplates
}

getWorkflowTemplateById(id: string)
: WorkflowTemplate | undefined
{
  return this.workflowTemplates.find((template) => template.id === id)
}

addWorkflowTemplate(template: Omit<WorkflowTemplate, "id" | "createdAt" | "updatedAt">)
: WorkflowTemplate
{
  const newTemplate: WorkflowTemplate = {
    ...template,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "current-user-id",
    isTemplate: true,
    status: "active",
  }
  this.workflowTemplates.push(newTemplate)

  // Also add the new workflow to the appropriate category
  const category = this.categories.find((c) => c.id === template.categoryId)
  if (category) {
    category.workflows.push(newTemplate)
  }

  return newTemplate
}

updateWorkflowTemplate(id: string, updates: Partial<WorkflowTemplate>)
: WorkflowTemplate | undefined
{
  const index = this.workflowTemplates.findIndex((template) => template.id === id)
  if (index !== -1) {
    this.workflowTemplates[index] = {
      ...this.workflowTemplates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.workflowTemplates[index]
  }
  return undefined
}

deleteWorkflowTemplate(id: string)
: boolean
{
  const initialLength = this.workflowTemplates.length
  this.workflowTemplates = this.workflowTemplates.filter((template) => template.id !== id)
  return this.workflowTemplates.length < initialLength
}

// Subscription methods
getSubscriptionPlans()
: SubscriptionPlan[]
{
  return this.subscriptionPlans
}

updateSubscription(planId: string)
: SubscriptionPlan
{
  const plan = this.subscriptionPlans.find((p) => p.id === planId)
  if (!plan) throw new Error("Plan not found")
  this.subscriptionPlans = this.subscriptionPlans.map((p) => ({ ...p, isActive: p.id === planId }))
  return { ...plan, isActive: true }
}

// Department methods
getDepartments()
: Department[]
{
  return this.departments
}

createDepartment(department: Omit<Department, "id">)
: Department
{
  const newDepartment = { ...department, id: uuidv4() }
  this.departments.push(newDepartment)
  return newDepartment
}

updateDepartment(id: string, updates: Partial<Department>)
: Department
{
  const index = this.departments.findIndex((d) => d.id === id)
  if (index === -1) throw new Error("Department not found")
  this.departments[index] = { ...this.departments[index], ...updates }
  return this.departments[index]
}

deleteDepartment(id: string)
: void
{
  this.departments = this.departments.filter((d) => d.id !== id)
}

// Role methods
getRoles()
: Role[]
{
  return this.roles
}

createRole(role: Omit<Role, "id">)
: Role
{
  const newRole = { ...role, id: uuidv4() }
  this.roles.push(newRole)
  return newRole
}

updateRole(id: string, updates: Partial<Role>)
: Role
{
  const index = this.roles.findIndex((r) => r.id === id)
  if (index === -1) throw new Error("Role not found")
  this.roles[index] = { ...this.roles[index], ...updates }
  return this.roles[index]
}

deleteRole(id: string)
: void
{
  this.roles = this.roles.filter((r) => r.id !== id)
}

getAuthorizers()
: Authorizer[]
{
  return this.authorizers
}

createAuthorizer(authorizer: Omit<Authorizer, "id">)
: Authorizer
{
  const newAuthorizer = { ...authorizer, id: uuidv4() }
  this.authorizers.push(newAuthorizer)
  return newAuthorizer
}

updateAuthorizer(id: string, updates: Partial<Authorizer>)
: Authorizer
{
  const index = this.authorizers.findIndex((a) => a.id === id)
  if (index === -1) throw new Error("Authorizer not found")
  this.authorizers[index] = { ...this.authorizers[index], ...updates }
  return this.authorizers[index]
}

deleteAuthorizer(id: string)
: void
{
  this.authorizers = this.authorizers.filter((a) => a.id !== id)
}

getCustomizationSettings()
: CustomizationSettings
{
  return this.customizationSettings
}

updateCustomizationSettings(settings: CustomizationSettings)
: void
{
  this.customizationSettings = settings
}

createFlexiformTemplate(template: Omit<FlexiformTemplate, "id" | "createdAt">)
: FlexiformTemplate
{
  const newTemplate: FlexiformTemplate = {
    ...template,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }

  this.templates.push(newTemplate)

  this.addRecentActivity({
    type: "template",
    action: "created",
    itemId: newTemplate.id,
    itemName: newTemplate.name,
    userId: "current-user-id",
    userName: "Current User",
  })

  return newTemplate
}

getFlexiformTemplates()
: FlexiformTemplate[]
{
  return this.templates.filter((template): template is FlexiformTemplate => template.type === "flexiform")
}

updateFlexiformTemplate(id: string, updates: Partial<FlexiformTemplate>)
: FlexiformTemplate | undefined
{
  const index = this.templates.findIndex((template) => template.id === id && template.type === "flexiform")
  if (index !== -1) {
    this.templates[index] = { ...this.templates[index], ...updates }
    return this.templates[index] as FlexiformTemplate
  }
  return undefined
}

deleteFlexiformTemplate(id: string)
: boolean
{
  const initialLength = this.templates.length
  this.templates = this.templates.filter((template) => !(template.id === id && template.type === "flexiform"))
  return this.templates.length < initialLength
}

getSavedSignatures()
: SavedSignature[]
{
  return this.savedSignatures
}

saveSignature(signature: Omit<SavedSignature, "id" | "createdAt">)
: SavedSignature
{
  const newSignature: SavedSignature = {
    ...signature,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }
  this.savedSignatures.push(newSignature)
  return newSignature
}

deleteSavedSignature(id: string)
: boolean
{
  const initialLength = this.savedSignatures.length
  this.savedSignatures = this.savedSignatures.filter((sig) => sig.id !== id)
  return this.savedSignatures.length < initialLength
}

getEmailTemplates()
: EmailTemplate[]
{
  return this.emailTemplates
}

getEmailTemplateById(id: string)
: EmailTemplate | undefined
{
  return this.emailTemplates.find((template) => template.id === id)
}

createEmailTemplate(template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">)
: EmailTemplate
{
  const newTemplate: EmailTemplate = {
    ...template,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  this.emailTemplates.push(newTemplate)
  return newTemplate
}

updateEmailTemplate(id: string, updates: Partial<EmailTemplate>)
: EmailTemplate | undefined
{
  const index = this.emailTemplates.findIndex((template) => template.id === id)
  if (index !== -1) {
    this.emailTemplates[index] = {
      ...this.emailTemplates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.emailTemplates[index]
  }
  return undefined
}

deleteEmailTemplate(id: string)
: boolean
{
  const initialLength = this.emailTemplates.length
  this.emailTemplates = this.emailTemplates.filter((template) => template.id !== id)
  return this.emailTemplates.length < initialLength
}

// Custom Fields CRUD operations
getCustomFields()
: CustomField[]
{
  return this.customFields
}

getCustomFieldById(id: string)
: CustomField | undefined
{
  return this.customFields.find((field) => field.id === id)
}

createCustomField(field: Omit<CustomField, "id">)
: CustomField
{
  const newField = { ...field, id: uuidv4() }
  this.customFields.push(newField)
  return newField
}

updateCustomField(id: string, updates: Partial<CustomField>)
: CustomField | undefined
{
  const index = this.customFields.findIndex((field) => field.id === id)
  if (index !== -1) {
    this.customFields[index] = { ...this.customFields[index], ...updates }
    return this.customFields[index]
  }
  return undefined
}

deleteCustomField(id: string)
: boolean
{
  const initialLength = this.customFields.length
  this.customFields = this.customFields.filter((field) => field.id !== id)
  return this.customFields.length < initialLength
}

// Advanced Settings CRUD operations
getAdvancedSettings()
: AdvancedSettings
{
  return this.advancedSettings
}

updateAdvancedSettings(updates: Partial<AdvancedSettings>)
: AdvancedSettings
{
  this.advancedSettings = { ...this.advancedSettings, ...updates }
  return this.advancedSettings
}

// PDF Settings CRUD operations
getPDFSettings()
: PDFSettings
{
  return this.pdfSettings
}

updatePDFSettings(updates: Partial<PDFSettings>)
: PDFSettings
{
  this.pdfSettings = { ...this.pdfSettings, ...updates }
  return this.pdfSettings
}

// Certificate Settings CRUD operations
getCertificateSettings()
: CertificateSettings
{
  return this.certificateSettings
}

updateCertificateSettings(updates: Partial<CertificateSettings>)
: CertificateSettings
{
  this.certificateSettings = { ...this.certificateSettings, ...updates }
  return this.certificateSettings
}

// DSC Settings CRUD operations
getDSCSettings()
: DSCSettings
{
  return this.dscSettings
}

updateDSCSettings(updates: Partial<DSCSettings>)
: DSCSettings
{
  this.dscSettings = { ...this.dscSettings, ...updates }
  return this.dscSettings
}

getBrandingSettings()
: BrandingSettings
{
  return this.brandingSettings;
}

updateBrandingSettings(updates: Partial<BrandingSettings>)
: BrandingSettings
{
  this.brandingSettings = { ...this.brandingSettings, ...updates }
  return this.brandingSettings;
}
}

export const mockDb = new MockDatabase()

