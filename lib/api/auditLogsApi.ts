import { config } from "../config"
import { mockDb } from "../mock-db"
import type { AuditLog } from "../models/auditLog"
import { simulateApiDelay } from "@/lib/utils/mockApiUtils"

export const auditLogsApi = {
  async getAuditLogs(): Promise<AuditLog[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/audit-logs`)
      if (!response.ok) {
        throw new Error("Failed to fetch audit logs")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.getAuditLogs()
    }
  },
}

