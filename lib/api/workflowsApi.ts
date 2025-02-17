import { config } from "../config"
import { mockDb } from "../mock-db"
import type { Workflow, Document } from "@/lib/models/workflow"
import { simulateApiDelay } from "@/lib/utils/mockApiUtils"

export const workflowsApi = {
  async getWorkflows(): Promise<Workflow[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/workflows`)
      if (!response.ok) {
        throw new Error("Failed to fetch workflows")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.getWorkflows()
    }
  },

  async getWorkflowById(id: string): Promise<Workflow | undefined> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/workflows/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch workflow")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.getWorkflowById(id)
    }
  },

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow | undefined> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/workflows/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update workflow")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.updateWorkflow(id, updates)
    }
  },

  async moveWorkflowToNextStep(documentId: string): Promise<Document | undefined> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/documents/${documentId}/move-to-next-step`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error("Failed to move workflow to next step")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.moveWorkflowToNextStep(documentId)
    }
  },
}

