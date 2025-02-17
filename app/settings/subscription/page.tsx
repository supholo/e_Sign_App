"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { settingsApi } from "@/lib/api/settingsApi"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import type { SubscriptionPlan } from "@/lib/models/settings"

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const fetchedPlans = await settingsApi.getSubscriptionPlans()
        setPlans(fetchedPlans)
        const active = fetchedPlans.find((plan) => plan.isActive)
        setCurrentPlan(active || null)
      } catch (error) {
        console.error("Error fetching subscription plans:", error)
        toast({
          title: "Error",
          description: "Failed to fetch subscription plans. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlans()
  }, [user, toast])

  const handleChangePlan = async (planId: string) => {
    try {
      const updatedPlan = await settingsApi.updateSubscription(planId)
      setCurrentPlan(updatedPlan)
      setPlans(plans.map((p) => ({ ...p, isActive: p.id === planId })))
      toast({
        title: "Subscription Updated",
        description: `You are now subscribed to the ${updatedPlan.name} plan.`,
      })
    } catch (error) {
      console.error("Error updating subscription:", error)
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return null // The Layout component will handle redirection
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information.</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={plan.isActive ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>${plan.price}/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.isActive ? (
                  <Badge variant="outline" className="w-full justify-center">
                    Current Plan
                  </Badge>
                ) : (
                  <Button className="w-full" onClick={() => handleChangePlan(plan.id)}>
                    Switch to {plan.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {currentPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                You are currently on the <strong>{currentPlan.name}</strong> plan.
              </p>
              <p>Next billing date: {new Date().toLocaleDateString()}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Manage Billing</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  )
}

