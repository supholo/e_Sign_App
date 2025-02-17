import { config } from "../config"
import { mockDb } from "../mock-db"
import type { Signature } from "@/lib/models/signature"
import { simulateApiDelay } from "@/lib/utils/mockApiUtils"

export const signaturesApi = {
  async getSignatures(): Promise<Signature[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/signatures`)
      if (!response.ok) {
        throw new Error("Failed to fetch signatures")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.getSignatures()
    }
  },

  async getSignatureById(id: string): Promise<Signature | undefined> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/signatures/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch signature")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.getSignatureById(id)
    }
  },

  async updateSignature(id: string, updates: Partial<Signature>): Promise<Signature | undefined> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/signatures/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update signature")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.updateSignature(id, updates)
    }
  },

  async addSignature(signature: Omit<Signature, "id">): Promise<Signature> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/signatures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signature),
      })
      if (!response.ok) {
        throw new Error("Failed to add signature")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.addSignature(signature)
    }
  },
}

