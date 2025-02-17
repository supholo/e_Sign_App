import { Loader2 } from "lucide-react"

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="animate-spin mb-4">
        <Loader2 className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">eSignPro</h2>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  )
}

