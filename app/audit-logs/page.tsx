"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { auditLogsApi } from "@/lib/api/auditLogsApi"
import type { AuditLog } from "@/lib/models/auditLog"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import { useToast } from "@/components/ui/use-toast"

export default function AuditLogs() {
  console.log("AuditLogs component rendering")
  const [searchTerm, setSearchTerm] = useState("")
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    console.log("AuditLogs useEffect running")
    const fetchAuditLogs = async () => {
      if (!user) {
        console.log("No user, skipping fetch")
        return
      }
      try {
        console.log("Fetching audit logs")
        setIsLoading(true)
        const logs = await auditLogsApi.getAuditLogs()
        console.log("Audit logs fetched:", logs)
        setAuditLogs(logs)
      } catch (error) {
        console.error("Error fetching audit logs:", error)
        toast({
          title: "Error",
          description: "Failed to fetch audit logs. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuditLogs()
  }, [user, toast])

  console.log("Filtering logs")
  const filteredLogs = auditLogs.filter(
    (log) =>
      log.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    console.log("Rendering loading state")
    return <Loading />
  }

  if (!user) {
    console.log("No user, rendering null")
    return null // The Layout component will handle redirection
  }

  console.log("Rendering audit logs table")
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search audit logs..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell>{log.userName}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.itemName}</TableCell>
                <TableCell>
                  <details>
                    <summary>View Details</summary>
                    <pre className="text-xs mt-2 p-2 bg-gray-100 rounded">{log.details}</pre>
                  </details>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

