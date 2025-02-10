"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Upload, Edit, Type } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import type { Signature, Document } from "@/lib/mock-db"
import { Badge } from "@/components/ui/badge"

type SignatureDialogProps = {
  signature: Signature | null
  document: Document | null
  open: boolean
  onOpenChange: () => void
  onUpdateSignature: (updatedSignature: Signature) => void
}

export function SignatureDialog({ signature, document, open, onOpenChange, onUpdateSignature }: SignatureDialogProps) {
  const [signatureMethod, setSignatureMethod] = useState<string>("upload")
  const [additionalSignMethod, setAdditionalSignMethod] = useState<string>("aadhaar")
  const [signed, setSigned] = useState(false)
  const [typeSignature, setTypeSignature] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [signatureProgress, setSignatureProgress] = useState(0)

  const handleUpdate = () => {
    if (signature && document) {
      // Simulate signing process
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setSignatureProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          const updatedSignature = { ...signature, status: "Signed" }
          onUpdateSignature(updatedSignature)
          setSigned(true)
        }
      }, 500)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Signature Request</DialogTitle>
          <DialogDescription>Complete the signing process for your document.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="sign" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign">Sign Document</TabsTrigger>
            <TabsTrigger value="info">Document Info</TabsTrigger>
          </TabsList>
          <TabsContent value="sign">
            <Card>
              <CardHeader>
                <CardTitle>Signature Method</CardTitle>
                <CardDescription>Choose how you want to sign the document</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={signatureMethod}
                  onValueChange={setSignatureMethod}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upload" id="upload" />
                    <Label htmlFor="upload" className="flex items-center cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload a Scanned Signature
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="draw" id="draw" />
                    <Label htmlFor="draw" className="flex items-center cursor-pointer">
                      <Edit className="h-4 w-4 mr-2" />
                      Draw Signature on Screen
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="type" id="type" />
                    <Label htmlFor="type" className="flex items-center cursor-pointer">
                      <Type className="h-4 w-4 mr-2" />
                      Type-to-Sign
                    </Label>
                  </div>
                </RadioGroup>
                {signatureMethod === "upload" && (
                  <div>
                    <Label htmlFor="signatureUpload">Upload Signature</Label>
                    <Input id="signatureUpload" type="file" accept="image/*" onChange={handleFileUpload} />
                  </div>
                )}
                {signatureMethod === "draw" && (
                  <div>
                    <Label>Draw Signature</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center">
                      Signature Drawing Area (Implement canvas here)
                    </div>
                  </div>
                )}
                {signatureMethod === "type" && (
                  <div>
                    <Label htmlFor="typeSignature">Type Your Signature</Label>
                    <Input
                      id="typeSignature"
                      placeholder="Type your full name"
                      value={typeSignature}
                      onChange={(e) => setTypeSignature(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <Label>Additional Mandatory Signing Method</Label>
                  <Select value={additionalSignMethod} onValueChange={setAdditionalSignMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select additional signing method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhaar">Aadhaar eSign (Remote Digital Signing with Aadhaar OTP)</SelectItem>
                      <SelectItem value="usb">USB Token-Based DSC (PKCS#11 Signing)</SelectItem>
                      <SelectItem value="hsm">HSM-Based DSC (Bulk Digital Signing)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                {!signed ? (
                  <Button onClick={handleUpdate} disabled={!signatureMethod || !additionalSignMethod}>
                    Complete Signing Process
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2 text-green-500">
                    <CheckCircle className="h-5 w-5" />
                    <p>Document signed successfully.</p>
                  </div>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
                <CardDescription>Details about the document you're signing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Document Name:</span>
                  <span>{document?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <Badge variant="outline">{document?.status}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Uploaded By:</span>
                  <span>{document?.uploadedBy}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Upload Date:</span>
                  <span>{document?.date}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {signatureProgress > 0 && signatureProgress < 100 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Progress value={signatureProgress} className="w-full mt-4" />
            <p className="text-center mt-2">Signing in progress... {signatureProgress}%</p>
          </motion.div>
        )}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-700">Secure Signing Process</h4>
              <p className="text-sm text-blue-600">
                Your signature is protected by advanced encryption. This document is legally binding once signed.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

