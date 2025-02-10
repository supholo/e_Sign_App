import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"
import type React from "react" // Added import for React

type Step = {
  name: string
  status: "completed" | "current" | "pending"
  icon: React.ElementType
}

type WorkflowLifecycleProps = {
  name: string
  status: string
  currentStep: number
  steps: Step[]
}

export function WorkflowLifecycle({ name, status, currentStep, steps }: WorkflowLifecycleProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Badge variant={status === "Completed" ? "default" : status === "In Progress" ? "secondary" : "outline"}>
            {status}
          </Badge>
        </div>
        <CardDescription>
          Current Step: {currentStep} of {steps.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.name} className="flex flex-col items-center">
              <div
                className={`rounded-full p-2 ${
                  step.status === "completed"
                    ? "bg-green-100 text-green-600"
                    : step.status === "current"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step.status === "completed" ? (
                  <CheckCircle className="h-6 w-6" />
                ) : step.status === "current" ? (
                  <Clock className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              <span className="mt-2 text-sm font-medium">{step.name}</span>
              {index < steps.length - 1 && (
                <div className={`h-1 w-12 mt-2 ${step.status === "completed" ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

