"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Dashboard } from "@/components/dashboard"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"

export default function Home() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setIsLoading(false)
    }
  }, [user])

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return null // The Layout component will handle redirection
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  )
}

