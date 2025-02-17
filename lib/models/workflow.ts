export interface Workflow {
  id: string
  name: string
  status: "Active" | "Completed"
  creator: string
  createdDate: string
  currentStep: number
  steps: WorkflowStep[]
  documentId?: string
}

export interface WorkflowStep {
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

export interface Document {
  id: string
  name: string
  status: "Draft" | "In Workflow" | "Pending for Sign" | "Signed" | "Declined" | "Recalled"
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

