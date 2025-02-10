"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, FileSignature } from "lucide-react"
import { RecentActivities } from "@/components/recent-activities"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

export function Dashboard() {
  const { dashboardData, refreshDashboardData } = useDashboardData()
  const { toast } = useToast()

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshDashboardData()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [refreshDashboardData])

  useEffect(() => {
    toast({
      title: "Dashboard Updated",
      description: "The dashboard data has been refreshed.",
    })
  }, [toast])

  const statusColors = {
    Draft: "bg-gray-500",
    "In Workflow": "bg-blue-500",
    "Pending for Sign": "bg-yellow-500",
    Signed: "bg-green-500",
  }

  const chartData = Object.entries(dashboardData.documentsByStatus).map(([status, count]) => ({
    status,
    count,
  }))

  return (
    <div className="space-y-4 animate-fade-in max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Documents",
            icon: FileText,
            value: dashboardData.totalDocuments,
            subValue: `${dashboardData.documentsByStatus["Signed"] || 0} signed documents`,
            color: "text-blue-600",
          },
          {
            title: "Active Workflows",
            icon: Clock,
            value: dashboardData.activeWorkflows.length,
            subValue: `${dashboardData.documentsByStatus["In Workflow"] || 0} documents in workflow`,
            color: "text-green-600",
          },
          {
            title: "Pending Signatures",
            icon: FileSignature,
            value: dashboardData.pendingSignatures.length,
            subValue: `${dashboardData.documentsByStatus["Pending for Sign"] || 0} documents awaiting signature`,
            color: "text-yellow-600",
          },
          {
            title: "Completion Rate",
            icon: CheckCircle,
            value: `${Math.round(((dashboardData.documentsByStatus["Signed"] || 0) / dashboardData.totalDocuments) * 100)}%`,
            subValue: null,
            color: "text-purple-600",
          },
        ].map((item, index) => (
          <Card
            key={index}
            className="card-neo card-hover animate-slide-in overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              {item.subValue && <p className="text-xs text-muted-foreground">{item.subValue}</p>}
              {item.title === "Completion Rate" && (
                <Progress
                  value={((dashboardData.documentsByStatus["Signed"] || 0) / dashboardData.totalDocuments) * 100}
                  className="mt-2"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="card-neo card-hover animate-slide-in md:col-span-4" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Document Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="status" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-neo card-hover animate-slide-in md:col-span-3" style={{ animationDelay: "0.5s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Documents</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px] pr-4">
              {dashboardData.recentDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between py-2 animate-fade-in border-b last:border-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full bg-opacity-10 ${statusColors[doc.status as keyof typeof statusColors]}`}
                    >
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.uploadedBy}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`${statusColors[doc.status as keyof typeof statusColors]}`}>
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="card-neo card-hover animate-slide-in" style={{ animationDelay: "0.6s" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivities />
        </CardContent>
      </Card>
    </div>
  )
}

