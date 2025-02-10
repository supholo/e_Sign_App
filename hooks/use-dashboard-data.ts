"use client"

import { useState, useEffect } from "react"
import { mockDb, type Document, type Workflow, type Signature } from "@/lib/mock-db"

export type DashboardData = {
  totalDocuments: number
  documentsByStatus: Record<string, number>
  recentDocuments: Document[]
  activeWorkflows: Workflow[]
  pendingSignatures: Signature[]
}

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalDocuments: 0,
    documentsByStatus: {},
    recentDocuments: [],
    activeWorkflows: [],
    pendingSignatures: [],
  })

  const fetchDashboardData = () => {
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

    setDashboardData({
      totalDocuments: documents.length,
      documentsByStatus,
      recentDocuments: documents.slice(0, 5),
      activeWorkflows: workflows.filter((wf) => wf.status === "Active"),
      pendingSignatures: signatures.filter((sig) => sig.status === "Pending"),
    })
  }

  useEffect(() => {
    fetchDashboardData()
  }, [mockDb]) // Added mockDb as a dependency

  return { dashboardData, refreshDashboardData: fetchDashboardData }
}

