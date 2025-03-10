"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { settingsApi } from "@/lib/api/settingsApi"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import type { CertificateSettings } from "@/lib/models/settings"

export default function CertificateSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<CertificateSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const fetchedSettings = await settingsApi.getCertificateSettings()
        setSettings(fetchedSettings)
      } catch (error) {
        console.error("Error fetching certificate settings:", error)
        toast({
          title: "Error",
          description: "Failed to fetch certificate settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [user])

  const handleSave = async () => {
    if (settings) {
      try {
        const updatedSettings = await settingsApi.updateCertificateSettings(settings)
        setSettings(updatedSettings)
        toast({
          title: "Success",
          description: "Certificate settings updated successfully.",
        })
      } catch (error) {
        console.error("Error updating certificate settings:", error)
        toast({
          title: "Error",
          description: "Failed to update certificate settings. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!user || !settings) {
    return null // The Layout component will handle redirection
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>
          <h1 className="text-3xl font-bold">Certificate Settings</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Digital Certificate Configuration</CardTitle>
            <CardDescription>Configure settings for digital certificates used in document signing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issuer">Certificate Issuer</Label>
              <Input
                id="issuer"
                value={settings.issuer}
                onChange={(e) => setSettings({ ...settings, issuer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validityPeriod">Validity Period (months)</Label>
              <Input
                id="validityPeriod"
                type="number"
                value={settings.validityPeriod}
                onChange={(e) => setSettings({ ...settings, validityPeriod: Number.parseInt(e.target.value, 10) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keySize">Key Size (bits)</Label>
              <Select
                value={settings.keySize.toString()}
                onValueChange={(value) => setSettings({ ...settings, keySize: Number.parseInt(value, 10) })}
              >
                <SelectTrigger id="keySize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2048">2048</SelectItem>
                  <SelectItem value="3072">3072</SelectItem>
                  <SelectItem value="4096">4096</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signatureAlgorithm">Signature Algorithm</Label>
              <Select
                value={settings.signatureAlgorithm}
                onValueChange={(value) => setSettings({ ...settings, signatureAlgorithm: value })}
              >
                <SelectTrigger id="signatureAlgorithm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHA256withRSA">SHA256 with RSA</SelectItem>
                  <SelectItem value="SHA384withRSA">SHA384 with RSA</SelectItem>
                  <SelectItem value="SHA512withRSA">SHA512 with RSA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="useHardwareToken"
                checked={settings.useHardwareToken}
                onCheckedChange={(checked) => setSettings({ ...settings, useHardwareToken: checked })}
              />
              <Label htmlFor="useHardwareToken">Use Hardware Token</Label>
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </Layout>
  )
}

