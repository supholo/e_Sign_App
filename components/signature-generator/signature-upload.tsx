"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon } from "lucide-react"

interface SignatureUploadProps {
  onSignatureSelect: (signatureData: string) => void
}

export function SignatureUpload({ onSignatureSelect }: SignatureUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setPreviewUrl(dataUrl)
        onSignatureSelect(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="signature">Upload Signature</Label>
        <Input id="signature" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <Button variant="outline" onClick={() => document.getElementById("signature")?.click()} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Choose Image
        </Button>
      </div>

      {previewUrl ? (
        <div className="border rounded-lg p-4">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Signature Preview"
            className="max-w-full h-auto max-h-[200px] mx-auto"
          />
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <ImageIcon className="mx-auto h-12 w-12 mb-2" />
          <p>Upload an image of your signature</p>
          <p className="text-sm">Supported formats: PNG, JPG, GIF</p>
        </div>
      )}
    </div>
  )
}

