import { config } from "../config"
import { mockDb } from "../mock-db"
import type { Document } from "../models/document"
import { simulateApiDelay } from "@/lib/utils/mockApiUtils"

export const documentsApi = {
  async getDocuments(): Promise<Document[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/documents`)
      if (!response.ok) {
        throw new Error("Failed to fetch documents")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.getDocuments()
    }
  },

  async addDocument(document: Omit<Document, "id">): Promise<Document> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(document),
      })
      if (!response.ok) {
        throw new Error("Failed to add document")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.addDocument(document)
    }
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/documents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update document")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.updateDocument(id, updates)
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/documents/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete document")
      }
      return true
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.deleteDocument(id)
    }
  },

  async addDocumentToWorkflow(documentId: string, workflowId: string): Promise<Document | undefined> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/documents/${documentId}/workflow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflowId }),
      })
      if (!response.ok) {
        throw new Error("Failed to add document to workflow")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.addDocumentToWorkflow(documentId, workflowId)
    }
  },

  getCategories: async (): Promise<{ id: string; name: string }[]> => {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/categories`)
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.getCategories()
    }
  },

  getWorkflowTemplates: async (): Promise<{ id: string; name: string; categoryId: string }[]> => {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/workflow-templates`)
      if (!response.ok) {
        throw new Error("Failed to fetch workflow templates")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.getWorkflowTemplates()
    }
  },
}

