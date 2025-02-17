"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { settingsApi } from "@/lib/api/settingsApi"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import type { PDFSettings } from "@/lib/models/settings"

export default function PDFSettingsPage() {
  const [settings, setSettings] = useState<PDFSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const fetchedSettings = await settingsApi.getPDFSettings()
        setSettings(fetchedSettings)
      } catch (error) {
        console.error("Error fetching PDF settings:", error)
        toast({
          title: "Error",
          description: "Failed to fetch PDF settings. Please try again.",
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
        const updatedSettings = await settingsApi.updatePDFSettings(settings)
        setSettings(updatedSettings)
        toast({
          title: "Success",
          description: "PDF settings updated successfully.",
        })
      } catch (error) {
        console.error("Error updating PDF settings:", error)
        toast({
          title: "Error",
          description: "Failed to update PDF settings. Please try again.",
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
        <h1 className="text-3xl font-bold">PDF Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>PDF Configuration</CardTitle>
            <CardDescription>Configure settings for PDF handling and processing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="defaultPageSize">Default Page Size</Label>
              <Select
                value={settings.defaultPageSize}
                onValueChange={(value: PDFSettings["defaultPageSize"]) =>
                  setSettings({ ...settings, defaultPageSize: value })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="defaultOrientation">Default Orientation</Label>
              <Select
                value={settings.defaultOrientation}
                onValueChange={(value: PDFSettings["defaultOrientation"]) =>
                  setSettings({ ...settings, defaultOrientation: value })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableAnnotations"
                checked={settings.enableAnnotations}
                onCheckedChange={(checked) => setSettings({ ...settings, enableAnnotations: checked })}
              />
              <Label htmlFor="enableAnnotations">Enable Annotations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableFormFilling"
                checked={settings.enableFormFilling}
                onCheckedChange={(checked) => setSettings({ ...settings, enableFormFilling: checked })}
              />
              <Label htmlFor="enableFormFilling">Enable Form Filling</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="watermarkText">Watermark Text</Label>
              <Input
                id="watermarkText"
                value={settings.watermarkText}
                onChange={(e) => setSettings({ ...settings, watermarkText: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="watermarkOpacity">Watermark Opacity</Label>
              <Slider
                id="watermarkOpacity"
                min={0}
                max={1}
                step={0.1}
                value={[settings.watermarkOpacity]}
                onValueChange={(value) => setSettings({ ...settings, watermarkOpacity: value[0] })}
              />
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </Layout>
  )
}

