"use client"

import { useEffect, useState } from "react"
import { Activity, FileText, GitBranch, UserCheck, User } from "lucide-react"
import { recentActivitiesApi } from "@/lib/api/recentActivitiesApi"
import type { RecentActivity } from "@/lib/models/recentActivity"

export function RecentActivities() {
  const [activities, setActivities] = useState<RecentActivity[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const fetchedActivities = await recentActivitiesApi.getRecentActivities()
        setActivities(fetchedActivities.slice(0, 6)) // Only take the last 6 entries
      } catch (error) {
        console.error("Error fetching recent activities:", error)
      }
    }

    fetchActivities()
    const intervalId = setInterval(fetchActivities, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "workflow":
        return <GitBranch className="h-4 w-4 text-green-500" />
      case "signature":
        return <UserCheck className="h-4 w-4 text-yellow-500" />
      case "user":
        return <User className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          <div className="bg-primary/10 p-2 rounded-full">{getIcon(activity.type)}</div>
          <div>
            <p className="text-sm font-medium">
              {activity.userName} {activity.action} {activity.itemName}
            </p>
            <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

