"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"

const signatureFonts = [
  { id: "font1", name: "Signature Style 1", fontFamily: "Dancing Script" },
  { id: "font2", name: "Signature Style 2", fontFamily: "Great Vibes" },
  { id: "font3", name: "Signature Style 3", fontFamily: "Pacifico" },
  { id: "font4", name: "Signature Style 4", fontFamily: "Sacramento" },
  { id: "font5", name: "Signature Style 5", fontFamily: "Allura" },
  { id: "font6", name: "Signature Style 6", fontFamily: "Alex Brush" },
  { id: "font7", name: "Signature Style 7", fontFamily: "Yellowtail" },
  { id: "font8", name: "Signature Style 8", fontFamily: "Mr De Haviland" },
]

interface SignatureSelectProps {
  onSignatureSelect: (signatureData: string) => void
}

export function SignatureSelect({ onSignatureSelect }: SignatureSelectProps) {
  const [fullName, setFullName] = useState("")
  const [selectedFont, setSelectedFont] = useState("")

  const handleFontSelect = (fontId: string) => {
    setSelectedFont(fontId)
    const font = signatureFonts.find((f) => f.id === fontId)
    if (font && fullName) {
      // In a real app, you'd generate an actual signature image here
      onSignatureSelect(`${fullName}-${font.fontFamily}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <Button variant="outline" onClick={() => setFullName("")}>
          Reset Font Selection
        </Button>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        <RadioGroup value={selectedFont} onValueChange={handleFontSelect}>
          <div className="grid grid-cols-2 gap-4">
            {signatureFonts.map((font, index) => (
              <div key={font.id} className="relative flex items-center rounded-lg border p-4 hover:bg-accent">
                <RadioGroupItem value={font.id} id={font.id} className="absolute left-4" />
                <Label htmlFor={font.id} className="flex-1 pl-8 font-normal">
                  <div
                    className="text-2xl"
                    style={{
                      fontFamily: font.fontFamily,
                      WebkitFontSmoothing: "antialiased",
                    }}
                  >
                    {fullName || "Signature Preview"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Signature {index + 1}</div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </ScrollArea>
    </div>
  )
}

