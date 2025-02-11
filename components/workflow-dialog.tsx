"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Bell,
  FileText,
  Eye,
  Download,
  Send,
  History,
  Lock,
  ArrowRight,
} from "lucide-react"
import { mockDb, type Workflow, type Document } from "@/lib/mock-db"

type WorkflowDialogProps = {
  workflow: Workflow | null
  document: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateWorkflow: (updatedWorkflow: Workflow) => void
}

export function WorkflowDialog({ workflow, document, open, onOpenChange, onUpdateWorkflow }: WorkflowDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showMoveStateDialog, setShowMoveStateDialog] = useState(false)

  if (!workflow || !document) return null

  const currentStep = workflow.steps[document.currentStep ?? 0]
  const completedSteps = document.currentStep ?? 0
  const progress = ((document.currentStep ?? 0) / workflow.steps.length) * 100
  const isWorkflowCompleted = workflow.status === "Completed"

  const handleMoveState = () => {
    const updatedDocument = mockDb.moveWorkflowToNextStep(document.id)
    if (updatedDocument) {
      const updatedWorkflow = mockDb.getWorkflowById(workflow.id)
      if (updatedWorkflow) {
        onUpdateWorkflow(updatedWorkflow)
      }
    }
    setShowMoveStateDialog(false)
  }

  const isMoveToNextStateDisabled = document.status === "Pending for Sign" || isWorkflowCompleted

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{workflow.name}</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Document: {document.name} | Created by {workflow.creator} on {workflow.createdDate}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                {["overview", "timeline", "document"].map((tab, index) => (
                  <React.Fragment key={tab}>
                    {index > 0 && (
                      <div
                        className={`h-[2px] w-8 mt-4 ${index <= ["overview", "timeline", "document"].indexOf(activeTab) ? "bg-primary" : "bg-gray-200"}`}
                      />
                    )}
                    <Button
                      variant={activeTab === tab ? "default" : "outline"}
                      className={`rounded-full ${activeTab === tab ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Button>
                  </React.Fragment>
                ))}
              </div>
              <Badge
                variant={
                  workflow.status === "Completed"
                    ? "default"
                    : workflow.status === "In Progress"
                      ? "secondary"
                      : "outline"
                }
                className="text-sm"
              >
                {workflow.status}
              </Badge>
            </div>

            {activeTab === "overview" && (
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-500">
                  {completedSteps} of {workflow.steps.length} steps completed
                </p>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Step</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentStep && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`rounded-full p-2 mr-3 bg-blue-100 text-blue-600`}>
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{currentStep.name}</p>
                            {currentStep.assignee && (
                              <p className="text-xs text-gray-500">Assigned to {currentStep.assignee.name}</p>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Remind
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Workflow Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Steps:</span>
                        <span className="text-sm font-medium">{workflow.steps.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Completed Steps:</span>
                        <span className="text-sm font-medium">{completedSteps}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Remaining Steps:</span>
                        <span className="text-sm font-medium">{workflow.steps.length - completedSteps}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Document:</span>
                        <span className="text-sm font-medium">{workflow.documentName}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Button
                  onClick={() => setShowMoveStateDialog(true)}
                  disabled={isMoveToNextStateDisabled}
                  className="w-full"
                >
                  Move to Next State
                </Button>
                {isMoveToNextStateDisabled && (
                  <p className="text-sm text-gray-500 mt-2">
                    {document.status === "Pending for Sign"
                      ? "Cannot move to next state while document is pending for signature."
                      : "Workflow is completed."}
                  </p>
                )}
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-6">
                {workflow.steps.map((step, index) => (
                  <div key={step.name} className="flex items-start">
                    <div
                      className={`rounded-full p-2 mr-4 ${
                        index < (document.currentStep ?? 0)
                          ? "bg-green-100 text-green-600"
                          : index === (document.currentStep ?? 0)
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {index < (document.currentStep ?? 0) ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : index === (document.currentStep ?? 0) ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{step.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {index < (document.currentStep ?? 0)
                              ? `Completed ${step.completedAt}`
                              : index === (document.currentStep ?? 0)
                                ? "In Progress"
                                : "Pending"}
                          </p>
                          <p className="text-xs text-gray-500">Role: {step.role}</p>
                        </div>
                        {step.assignee && (
                          <div className="flex items-center ml-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={step.assignee.avatar} alt={step.assignee.name} />
                              <AvatarFallback>{step.assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-2">
                              <p className="text-sm font-medium">{step.assignee.name}</p>
                              <p className="text-xs text-gray-500">{step.assignee.email}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "document" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">{workflow.documentName}</span>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button variant="outline" size="sm" disabled={!isWorkflowCompleted}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </span>
                        </TooltipTrigger>
                        {!isWorkflowCompleted && (
                          <TooltipContent>
                            <p>Download will be available once all steps are completed</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Document Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Account Number:</span>
                        <span className="text-sm">{document.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Branch Name:</span>
                        <span className="text-sm">{document.branchName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Customer Name:</span>
                        <span className="text-sm">{document.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Document Type:</span>
                        <span className="text-sm">{document.documentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Amount:</span>
                        <span className="text-sm">
                          {document.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Size:</span>
                        <span className="text-sm">{document.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Last Modified:</span>
                        <span className="text-sm">{document.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className="text-sm">
                          {isWorkflowCompleted ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" /> Signed
                            </span>
                          ) : (
                            <span className="text-yellow-600 flex items-center">
                              <Clock className="h-4 w-4 mr-1" /> Pending Signatures
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Document History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {workflow.steps
                        .filter((step) => step.status === "completed")
                        .map((step, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <History className="h-4 w-4 mr-2 text-gray-500" />
                            <span>
                              {step.name} completed by {step.assignee?.name} on {step.completedAt}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                {!isWorkflowCompleted && (
                  <div className="flex items-center justify-center p-4 bg-yellow-50 rounded-lg">
                    <Lock className="h-5 w-5 text-yellow-500 mr-2" />
                    <p className="text-sm text-yellow-700">
                      This document is locked for editing until all signatures are collected.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <Separator className="my-6" />
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Next Action</h4>
            {currentStep && currentStep.assignee ? (
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      {currentStep.name} - Awaiting action from {currentStep.assignee.name}
                    </p>
                    <p className="text-xs text-gray-500">{currentStep.assignee.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4 whitespace-nowrap">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No pending actions at this time.</p>
            )}
          </div>
          <div className="mt-6">
            <Button
              onClick={() => setShowMoveStateDialog(true)}
              disabled={isMoveToNextStateDisabled}
              className="w-full"
            >
              Move to Next State
            </Button>
            {isMoveToNextStateDisabled && (
              <p className="text-sm text-gray-500 mt-2">
                {document.status === "Pending for Sign"
                  ? "Cannot move to next state while document is pending for signature."
                  : "Workflow is completed."}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showMoveStateDialog} onOpenChange={setShowMoveStateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Next State</DialogTitle>
            <DialogDescription>Are you sure you want to move this workflow to the next state?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowMoveStateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMoveState}>
              <ArrowRight className="mr-2 h-4 w-4" /> Move
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

