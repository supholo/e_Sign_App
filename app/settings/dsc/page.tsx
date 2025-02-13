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
import { mockDb, type DSCSettings } from "@/lib/mock-db"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DSCSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<DSCSettings | null>(null)

  useEffect(() => {
    setSettings(mockDb.getDSCSettings())
  }, [])

  const handleSave = () => {
    if (settings) {
      const updatedSettings = mockDb.updateDSCSettings(settings)
      setSettings(updatedSettings)
      toast({
        title: "Success",
        description: "DSC settings updated successfully.",
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
          <h1 className="text-3xl font-bold">Digital Signature Certificate (DSC) Settings</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>DSC Configuration</CardTitle>
            <CardDescription>
              Configure settings for Digital Signature Certificates used in document signing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">DSC Provider</Label>
              <Input
                id="provider"
                value={settings.provider}
                onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tokenType">Token Type</Label>
              <Select
                value={settings.tokenType}
                onValueChange={(value: "USB" | "Smart Card" | "Cloud") =>
                  setSettings({ ...settings, tokenType: value })
                }
              >
                <SelectTrigger id="tokenType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USB">USB Token</SelectItem>
                  <SelectItem value="Smart Card">Smart Card</SelectItem>
                  <SelectItem value="Cloud">Cloud-based</SelectItem>
                </SelectContent>
              </Select>
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
            <div className="flex items-center space-x-2">
              <Switch
                id="autoRenewal"
                checked={settings.autoRenewal}
                onCheckedChange={(checked) => setSettings({ ...settings, autoRenewal: checked })}
              />
              <Label htmlFor="autoRenewal">Enable Auto-Renewal</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notificationThreshold">Expiry Notification Threshold (days)</Label>
              <Input
                id="notificationThreshold"
                type="number"
                value={settings.notificationThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, notificationThreshold: Number.parseInt(e.target.value, 10) })
                }
              />
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </Layout>
  )
}

