import { toast } from "@/components/ui/use-toast"

export const handleError = (error: unknown) => {
  console.error("An error occurred:", error)
  toast({
    title: "Error",
    description: error instanceof Error ? error.message : "An unexpected error occurred",
    variant: "destructive",
  })
}

