import type { Document, Workflow, Signature } from "../mock-db"

export interface DashboardData {
  totalDocuments: number
  documentsByStatus: Record<string, number>
  recentDocuments: Document[]
  activeWorkflows: Workflow[]
  pendingSignatures: Signature[]
  statusCounts: {
    pending: number
    drafts: number
    completed: number
    declined: number
    recalled: number
  }
}

