import { config } from "../config"
import { mockDb } from "../mock-db"
import type { Template } from "../models/template"
import { simulateApiDelay } from "@/lib/utils/mockApiUtils"

export const templatesApi = {
  async getTemplates(): Promise<Template[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/templates`)
      if (!response.ok) {
        throw new Error("Failed to fetch templates")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.getTemplates()
    }
  },

  async createTemplate(template: Omit<Template, "id">): Promise<Template> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      })
      if (!response.ok) {
        throw new Error("Failed to create template")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.addTemplate(template)
    }
  },

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/templates/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update template")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.updateTemplate(id, updates)
    }
  },

  async deleteTemplate(id: string): Promise<boolean> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/templates/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete template")
      }
      return true
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.deleteTemplate(id)
    }
  },
}

