import { config } from "../config"
import { mockDb } from "../mock-db"
import type { RecentActivity } from "../models/recentActivity"
import { simulateApiDelay } from "@/lib/utils/mockApiUtils"

export const recentActivitiesApi = {
  async getRecentActivities(): Promise<RecentActivity[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/recent-activities`)
      if (!response.ok) {
        throw new Error("Failed to fetch recent activities")
      }
      return await response.json()
    } else {
      // Simulate API delay
      await simulateApiDelay()
      return mockDb.getRecentActivities()
    }
  },
}

