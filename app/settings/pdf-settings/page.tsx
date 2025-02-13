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
import { mockDb, type PDFSettings } from "@/lib/mock-db"

export default function PDFSettingsPage() {
  const [settings, setSettings] = useState<PDFSettings | null>(null)

  useEffect(() => {
    setSettings(mockDb.getPDFSettings())
  }, [])

  const handleSave = () => {
    if (settings) {
      const updatedSettings = mockDb.updatePDFSettings(settings)
      setSettings(updatedSettings)
      toast({
        title: "Success",
        description: "PDF settings updated successfully.",
      })
    }
  }

  if (!settings) {
    return <Layout>Loading...</Layout>
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

