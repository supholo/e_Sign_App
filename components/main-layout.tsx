import type React from "react"
import { Layout } from "@/components/layout"

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </Layout>
  )
}

