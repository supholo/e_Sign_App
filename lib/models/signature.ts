export interface Signature {
  id: string
  documentId: string
  assignedTo: string
  status: "Pending" | "Signed"
  dueDate: string
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

