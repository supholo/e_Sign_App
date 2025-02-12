"use client"
import { Layout } from "@/components/layout"
import { FlexiformEditor } from "@/components/flexiform-editor"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function CreateFlexiform() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/templates">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Create Flexiform</h1>
          </div>
        </div>
        <FlexiformEditor />
      </div>
    </Layout>
  )
}

