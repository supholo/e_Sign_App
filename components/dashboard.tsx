"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { RecentActivities } from "@/components/recent-activities"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download } from "lucide-react"
import { dashboardApi } from "@/lib/api/dashboardApi"
import type { DashboardData } from "@/lib/models/dashboard"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const data = await dashboardApi.getDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, toast])

  if (isLoading) {
    return <Loading />
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>
  }

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

  const documentStatuses = [
    {
      label: "Pending",
      count: dashboardData.statusCounts.pending,
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      label: "Drafts",
      count: dashboardData.statusCounts.drafts,
      icon: FileText,
      color: "bg-gray-500",
    },
    {
      label: "Completed",
      count: dashboardData.statusCounts.completed,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Declined",
      count: dashboardData.statusCounts.declined,
      icon: XCircle,
      color: "bg-red-500",
    },
    {
      label: "Recalled",
      count: dashboardData.statusCounts.recalled,
      icon: RotateCcw,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="space-y-4 animate-fade-in max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Dashboard Overview</h1>

      {/* Document Status Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {documentStatuses.map((status, index) => (
          <Card
            key={status.label}
            className="card-neo card-hover animate-slide-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <status.icon className={`h-8 w-8 mb-2 ${status.color} text-white rounded-full p-1.5`} />
              <div className="text-2xl font-bold">{status.count}</div>
              <div className="text-sm text-muted-foreground">{status.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Tabs */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <Tabs defaultValue="my-signatures">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="my-signatures" className="relative">
                  My Signatures
                  <Badge className="ml-2 bg-primary text-primary-foreground">0</Badge>
                </TabsTrigger>
                <TabsTrigger value="waiting-for-others">
                  Waiting for Others
                  <Badge className="ml-2 bg-primary text-primary-foreground">0</Badge>
                </TabsTrigger>
                <TabsTrigger value="shared-with-me">
                  Shared With Me
                  <Badge className="ml-2 bg-primary text-primary-foreground">0</Badge>
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search..." />
                </div>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="my-signatures">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Document No</TableHead>
                    <TableHead>Reference No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No Data Available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="waiting-for-others">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Document No</TableHead>
                    <TableHead>Reference No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No Data Available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="shared-with-me">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Document No</TableHead>
                    <TableHead>Reference No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No Data Available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Original Dashboard Content */}
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

