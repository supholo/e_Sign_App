"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { settingsApi } from "@/lib/api/settingsApi"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import type { AdvancedSettings } from "@/lib/models/settings"

export default function AdvancedSettingsPage() {
  const [settings, setSettings] = useState<AdvancedSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const fetchedSettings = await settingsApi.getAdvancedSettings()
        setSettings(fetchedSettings)
      } catch (error) {
        console.error("Error fetching advanced settings:", error)
        toast({
          title: "Error",
          description: "Failed to fetch advanced settings. Please try again.",
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
        const updatedSettings = await settingsApi.updateAdvancedSettings(settings)
        setSettings(updatedSettings)
        toast({
          title: "Success",
          description: "Advanced settings updated successfully.",
        })
      } catch (error) {
        console.error("Error updating advanced settings:", error)
        toast({
          title: "Error",
          description: "Failed to update advanced settings. Please try again.",
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
        <h1 className="text-3xl font-bold">Advanced Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Document Settings</CardTitle>
            <CardDescription>Configure advanced settings for document handling and processing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxSignatures">Maximum Signatures per Document</Label>
              <Input
                id="maxSignatures"
                type="number"
                value={settings.maxSignaturesPerDocument}
                onChange={(e) =>
                  setSettings({ ...settings, maxSignaturesPerDocument: Number.parseInt(e.target.value, 10) })
                }
                className="w-20"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maxDocumentSize">Maximum Document Size (MB)</Label>
              <Input
                id="maxDocumentSize"
                type="number"
                value={settings.maxDocumentSize}
                onChange={(e) => setSettings({ ...settings, maxDocumentSize: Number.parseInt(e.target.value, 10) })}
                className="w-20"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="allowedFileTypes">Allowed File Types (comma-separated)</Label>
              <Input
                id="allowedFileTypes"
                value={settings.allowedFileTypes.join(", ")}
                onChange={(e) =>
                  setSettings({ ...settings, allowedFileTypes: e.target.value.split(",").map((type) => type.trim()) })
                }
                className="w-60"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allowBulkUpload"
                checked={settings.allowBulkUpload}
                onCheckedChange={(checked) => setSettings({ ...settings, allowBulkUpload: checked })}
              />
              <Label htmlFor="allowBulkUpload">Allow Bulk Upload</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableAuditTrail"
                checked={settings.enableAuditTrail}
                onCheckedChange={(checked) => setSettings({ ...settings, enableAuditTrail: checked })}
              />
              <Label htmlFor="enableAuditTrail">Enable Audit Trail</Label>
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </Layout>
  )
}

