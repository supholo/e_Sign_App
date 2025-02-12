"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { mockDb } from "@/lib/mock-db"

interface SavedSignaturesProps {
  onSignatureSelect: (signatureData: string) => void
}

interface SavedSignature {
  id: string
  name: string
  data: string
  createdAt: string
}

export function SavedSignatures({ onSignatureSelect }: SavedSignaturesProps) {
  const [signatures, setSignatures] = useState<SavedSignature[]>([])
  const [selectedSignature, setSelectedSignature] = useState("")

  useEffect(() => {
    // In a real app, fetch saved signatures from the database
    const savedSignatures = mockDb.getSavedSignatures()
    setSignatures(savedSignatures)
  }, [])

  const handleSignatureSelect = (signatureId: string) => {
    setSelectedSignature(signatureId)
    const signature = signatures.find((s) => s.id === signatureId)
    if (signature) {
      onSignatureSelect(signature.data)
    }
  }

  return (
    <div className="space-y-4">
      {signatures.length > 0 ? (
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <RadioGroup value={selectedSignature} onValueChange={handleSignatureSelect}>
            <div className="grid gap-4">
              {signatures.map((signature) => (
                <div key={signature.id} className="relative flex items-center rounded-lg border p-4 hover:bg-accent">
                  <RadioGroupItem value={signature.id} id={signature.id} className="absolute left-4" />
                  <Label htmlFor={signature.id} className="flex-1 pl-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{signature.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Created on {new Date(signature.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <img
                        src={signature.data || "/placeholder.svg"}
                        alt={signature.name}
                        className="h-12 object-contain"
                      />
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </ScrollArea>
      ) : (
        <div className="text-center text-muted-foreground p-8">
          <p>No saved signatures found</p>
          <p className="text-sm">Create a signature using any method to save it for future use</p>
        </div>
      )}
    </div>
  )
}

