"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  Users,
  GitBranch,
  Shield,
  Mail,
  Activity,
  FileText,
  BadgeIcon as Certificate,
  Key,
  Paintbrush,
  LayoutDashboard,
  Receipt,
  Star,
  Building2,
  UserCog,
  Sliders,
  FileJson,
} from "lucide-react"

const adminSettings = [
  { icon: Activity, label: "Subscription", href: "/settings/subscription" },
  { icon: Building2, label: "Manage Departments", href: "/settings/departments" },
  { icon: Users, label: "Manage Users", href: "/settings/users" },
  { icon: GitBranch, label: "Manage Workflows", href: "/manage-workflows" },
  { icon: Shield, label: "Access Management", href: "/settings/access" },
  { icon: UserCog, label: "Manage Authorizer", href: "/settings/authorizer" },
  { icon: Paintbrush, label: "Customization", href: "/settings/customization" },
  { icon: Mail, label: "Email Templates", href: "/settings/email-templates" },
  { icon: Activity, label: "Activity Log", href: "/settings/activity-log" },
  { icon: FileText, label: "Custom Fields", href: "/settings/custom-fields" },
  { icon: Sliders, label: "Advanced Settings", href: "/settings/advanced" },
  { icon: FileJson, label: "PDF Settings", href: "/settings/pdf-settings" },
  { icon: Certificate, label: "Certificate Settings", href: "/settings/certificate" },
  { icon: Key, label: "DSC Settings", href: "/settings/dsc" },
  { icon: Paintbrush, label: "Branding Settings", href: "/settings/branding" },
]

const gatewaySettings = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/settings/gateway-dashboard" },
  { icon: Receipt, label: "Transaction Log", href: "/settings/transaction-log" },
  { icon: Star, label: "DSC Branding", href: "/settings/dsc-branding" },
]

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const router = useRouter()

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="admin">Admin Settings</TabsTrigger>
            <TabsTrigger value="gateway">Gateway Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Manage system-wide settings and configurations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminSettings.map((setting) => (
                    <Card
                      key={setting.href}
                      className="hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => router.push(setting.href)}
                    >
                      <CardContent className="p-4 flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <setting.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{setting.label}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gateway">
            <Card>
              <CardHeader>
                <CardTitle>Gateway Settings</CardTitle>
                <CardDescription>Configure payment and transaction settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gatewaySettings.map((setting) => (
                    <Card key={setting.href} className="hover:bg-accent transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <setting.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{setting.label}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

