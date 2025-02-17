import { config } from "../config"
import { mockDb } from "../mock-db"
import type { DashboardData } from "../models/dashboard"
import { simulateApiDelay } from "@/lib/utils/mockApiUtils"

export const dashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/dashboard`)
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()

      // Use mockDb
      const documents = mockDb.getDocuments()
      const workflows = mockDb.getWorkflows()
      const signatures = mockDb.getSignatures()

      const documentsByStatus = documents.reduce(
        (acc, doc) => {
          acc[doc.status] = (acc[doc.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const statusCounts = {
        pending: documents.filter((doc) => doc.status === "Pending for Sign").length,
        drafts: documents.filter((doc) => doc.status === "Draft").length,
        completed: documents.filter((doc) => doc.status === "Signed").length,
        declined: documents.filter((doc) => doc.status === "Declined").length,
        recalled: documents.filter((doc) => doc.status === "Recalled").length,
      }

      return {
        totalDocuments: documents.length,
        documentsByStatus,
        recentDocuments: documents.slice(0, 5),
        activeWorkflows: workflows.filter((wf) => wf.status === "Active"),
        pendingSignatures: signatures.filter((sig) => sig.status === "Pending"),
        statusCounts,
      }
    }
  },
}

