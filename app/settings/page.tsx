"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockDb, type Workflow, type WorkflowStep } from "@/lib/mock-db"
import { Plus, Edit, Trash2 } from "lucide-react"
import AddWorkflowDialog from "@/components/AddWorkflowDialog"

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null)
  const [newWorkflowName, setNewWorkflowName] = useState("")
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([])

  useEffect(() => {
    setWorkflows(mockDb.getWorkflows())
  }, [])

  const handleAddWorkflow = (name: string, steps: WorkflowStep[]) => {
    const newWorkflow = mockDb.addWorkflow({
      name,
      status: "Active",
      creator: "Current User",
      createdDate: new Date().toISOString().split("T")[0],
      currentStep: 0,
      steps,
    })

    setWorkflows(mockDb.getWorkflows())
    setShowWorkflowDialog(false)
    setWorkflowSteps([])
  }

  const handleUpdateWorkflow = () => {
    if (editingWorkflow && newWorkflowName && workflowSteps.length > 0) {
      const updatedWorkflow = mockDb.updateWorkflow(editingWorkflow.id, {
        name: newWorkflowName,
        steps: workflowSteps,
      })

      if (updatedWorkflow) {
        setWorkflows(mockDb.getWorkflows())
        setShowWorkflowDialog(false)
        setEditingWorkflow(null)
        setNewWorkflowName("")
        setWorkflowSteps([])
      }
    }
  }

  const handleDeleteWorkflow = (id: string) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      mockDb.deleteWorkflow(id)
      setWorkflows(mockDb.getWorkflows())
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <Switch
                    id="sms-notifications"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Management</CardTitle>
                <CardDescription>Create, update, and delete workflow templates.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button onClick={() => setShowWorkflowDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Workflow
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Steps</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell>{workflow.name}</TableCell>
                        <TableCell>{workflow.steps.map((step) => step.name).join(", ")}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingWorkflow(workflow)
                                setNewWorkflowName(workflow.name)
                                setWorkflowSteps(workflow.steps)
                                setShowWorkflowDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteWorkflow(workflow.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AddWorkflowDialog
        open={showWorkflowDialog}
        onOpenChange={setShowWorkflowDialog}
        onAddWorkflow={handleAddWorkflow}
      />
    </Layout>
  )
}

