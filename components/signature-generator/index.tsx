"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignatureSelect } from "./signature-select"
import { SignatureUpload } from "./signature-upload"
import { SignatureDraw } from "./signature-draw"
import { SignaturePad } from "./signature-pad"
import { SavedSignatures } from "./saved-signatures"

interface SignatureGeneratorProps {
  onSignatureSelect: (signatureData: string) => void
}

export function SignatureGenerator({ onSignatureSelect }: SignatureGeneratorProps) {
  const [activeTab, setActiveTab] = useState("select")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="select">Select</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="draw">Draw</TabsTrigger>
        <TabsTrigger value="pad">eSignature Pad</TabsTrigger>
        <TabsTrigger value="saved">My Signatures</TabsTrigger>
      </TabsList>

      <TabsContent value="select">
        <SignatureSelect onSignatureSelect={onSignatureSelect} />
      </TabsContent>

      <TabsContent value="upload">
        <SignatureUpload onSignatureSelect={onSignatureSelect} />
      </TabsContent>

      <TabsContent value="draw">
        <SignatureDraw onSignatureSelect={onSignatureSelect} />
      </TabsContent>

      <TabsContent value="pad">
        <SignaturePad onSignatureSelect={onSignatureSelect} />
      </TabsContent>

      <TabsContent value="saved">
        <SavedSignatures onSignatureSelect={onSignatureSelect} />
      </TabsContent>
    </Tabs>
  )
}

