"use client"

import { useState, useEffect, useCallback } from "react"
import { mockDb, type Document, type Workflow, type Signature } from "@/lib/mock-db"

export type DashboardData = {
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

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalDocuments: 0,
    documentsByStatus: {},
    recentDocuments: [],
    activeWorkflows: [],
    pendingSignatures: [],
    statusCounts: {
      pending: 0,
      drafts: 0,
      completed: 0,
      declined: 0,
      recalled: 0,
    },
  })

  const fetchDashboardData = useCallback(() => {
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

    // Calculate status counts
    const statusCounts = {
      pending: documents.filter((doc) => doc.status === "Pending for Sign").length,
      drafts: documents.filter((doc) => doc.status === "Draft").length,
      completed: documents.filter((doc) => doc.status === "Signed").length,
      declined: documents.filter((doc) => doc.status === "Declined").length,
      recalled: documents.filter((doc) => doc.status === "Recalled").length,
    }

    setDashboardData({
      totalDocuments: documents.length,
      documentsByStatus,
      recentDocuments: documents.slice(0, 5),
      activeWorkflows: workflows.filter((wf) => wf.status === "Active"),
      pendingSignatures: signatures.filter((sig) => sig.status === "Pending"),
      statusCounts,
    })
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return { dashboardData, refreshDashboardData: fetchDashboardData }
}

