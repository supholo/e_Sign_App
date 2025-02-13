"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { mockDb, type BrandingSettings } from "@/lib/mock-db"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ColorPicker } from "@/components/color-picker"

export default function BrandingSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<BrandingSettings | null>(null)

  useEffect(() => {
    setSettings(mockDb.getBrandingSettings())
  }, [])

  const handleSave = () => {
    if (settings) {
      const updatedSettings = mockDb.updateBrandingSettings(settings)
      setSettings(updatedSettings)
      toast({
        title: "Success",
        description: "Branding settings updated successfully.",
      })
    }
  }

  if (!settings) {
    return <Layout>Loading...</Layout>
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>
          <h1 className="text-3xl font-bold">Branding Settings</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Visual Branding</CardTitle>
            <CardDescription>Customize the visual elements of your eSignature platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <ColorPicker
                color={settings.primaryColor}
                onChange={(color) => setSettings({ ...settings, primaryColor: color })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <ColorPicker
                color={settings.secondaryColor}
                onChange={(color) => setSettings({ ...settings, secondaryColor: color })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Input
                id="fontFamily"
                value={settings.fontFamily}
                onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                placeholder="Arial, sans-serif"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customCss">Custom CSS</Label>
              <Textarea
                id="customCss"
                value={settings.customCss}
                onChange={(e) => setSettings({ ...settings, customCss: e.target.value })}
                placeholder="Enter custom CSS here"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Email Branding</CardTitle>
            <CardDescription>Customize the email template for notifications and invitations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="emailTemplate">Email Template</Label>
              <Textarea
                id="emailTemplate"
                value={settings.emailTemplate}
                onChange={(e) => setSettings({ ...settings, emailTemplate: e.target.value })}
                placeholder="Enter HTML email template here"
                rows={10}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Landing Page Content</CardTitle>
            <CardDescription>Customize the content for your landing page.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="landingPageContent">Landing Page Content</Label>
              <Textarea
                id="landingPageContent"
                value={settings.landingPageContent}
                onChange={(e) => setSettings({ ...settings, landingPageContent: e.target.value })}
                placeholder="Enter landing page content here"
                rows={10}
              />
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </Layout>
  )
}

