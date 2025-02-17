"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { settingsApi } from "@/lib/api/settingsApi"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/loading"
import type { CustomizationSettings } from "@/lib/models/settings"

export default function CustomizationPage() {
  const [settings, setSettings] = useState<CustomizationSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const fetchedSettings = await settingsApi.getCustomizationSettings()
        setSettings(fetchedSettings)
      } catch (error) {
        console.error("Error fetching customization settings:", error)
        toast({
          title: "Error",
          description: "Failed to fetch customization settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [user])

  const handleSaveSettings = async () => {
    if (settings) {
      try {
        await settingsApi.updateCustomizationSettings(settings)
        toast({
          title: "Settings Saved",
          description: "Your customization settings have been updated successfully.",
        })
      } catch (error) {
        console.error("Error saving settings:", error)
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
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
        <h1 className="text-3xl font-bold">Customization Settings</h1>
        <p className="text-muted-foreground">Customize the appearance and behavior of your eSignPro instance.</p>

        <Tabs defaultValue="theme">
          <TabsList>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize the look and feel of your application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.theme.primaryColor}
                      onChange={(e) =>
                        setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })
                      }
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      type="text"
                      value={settings.theme.primaryColor}
                      onChange={(e) =>
                        setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })
                      }
                      className="flex-grow"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.theme.secondaryColor}
                      onChange={(e) =>
                        setSettings({ ...settings, theme: { ...settings.theme, secondaryColor: e.target.value } })
                      }
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      type="text"
                      value={settings.theme.secondaryColor}
                      onChange={(e) =>
                        setSettings({ ...settings, theme: { ...settings.theme, secondaryColor: e.target.value } })
                      }
                      className="flex-grow"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Input
                    id="fontFamily"
                    value={settings.theme.fontFamily}
                    onChange={(e) =>
                      setSettings({ ...settings, theme: { ...settings.theme, fontFamily: e.target.value } })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="darkMode"
                    checked={settings.theme.darkMode}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, theme: { ...settings.theme, darkMode: checked } })
                    }
                  />
                  <Label htmlFor="darkMode">Enable Dark Mode</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>Customize your company's branding elements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={settings.branding.logo}
                    onChange={(e) =>
                      setSettings({ ...settings, branding: { ...settings.branding, logo: e.target.value } })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.branding.companyName}
                    onChange={(e) =>
                      setSettings({ ...settings, branding: { ...settings.branding, companyName: e.target.value } })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    value={settings.branding.favicon}
                    onChange={(e) =>
                      setSettings({ ...settings, branding: { ...settings.branding, favicon: e.target.value } })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Customize the appearance of your email notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headerImage">Header Image URL</Label>
                  <Input
                    id="headerImage"
                    value={settings.email.headerImage}
                    onChange={(e) =>
                      setSettings({ ...settings, email: { ...settings.email, headerImage: e.target.value } })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Input
                    id="footerText"
                    value={settings.email.footerText}
                    onChange={(e) =>
                      setSettings({ ...settings, email: { ...settings.email, footerText: e.target.value } })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signature">Email Signature</Label>
                  <Input
                    id="signature"
                    value={settings.email.signature}
                    onChange={(e) =>
                      setSettings({ ...settings, email: { ...settings.email, signature: e.target.value } })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security-related settings for your application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordStrength">Minimum Password Strength</Label>
                  <Slider
                    id="passwordStrength"
                    min={6}
                    max={16}
                    step={1}
                    value={[settings.security.passwordStrength]}
                    onValueChange={(value) =>
                      setSettings({ ...settings, security: { ...settings.security, passwordStrength: value[0] } })
                    }
                  />
                  <p className="text-sm text-muted-foreground">Current value: {settings.security.passwordStrength}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, security: { ...settings.security, twoFactorAuth: checked } })
                    }
                  />
                  <Label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: Number.parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </Layout>
  )
}

