"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  ChevronDown,
  LayoutDashboard,
  FileText,
  GitBranch,
  PenTool,
  ClipboardList,
  Settings,
  ChevronLeft,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { HeaderIcons } from "@/components/header-icons"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Workflows", href: "/workflows", icon: GitBranch },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Signatures", href: "/signatures", icon: PenTool },
  { name: "Audit Logs", href: "/audit-logs", icon: ClipboardList },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/sign-in")
    }
  }, [user, router])

  if (!user) {
    return null // or return a loading spinner
  }

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar for desktop */}
        <aside
          className={cn(
            "hidden lg:flex flex-col border-r border-border bg-card/95 backdrop-blur-sm transition-all duration-300 ease-in-out",
            isCollapsed ? "w-[4.5rem]" : "w-64",
          )}
        >
          <div className="flex h-16 shrink-0 items-center px-4 justify-between border-b">
            <span
              className={cn(
                "text-2xl font-bold text-primary transition-all duration-300",
                isCollapsed ? "scale-0 w-0" : "scale-100 w-auto",
              )}
            >
              eSignPro
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-transform duration-300"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 p-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  "relative overflow-hidden",
                )}
              >
                <item.icon
                  className={cn("flex-shrink-0 transition-all duration-300", isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3")}
                />
                <span
                  className={cn("transition-all duration-300", isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto")}
                >
                  {item.name}
                </span>
                {pathname === item.href && <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full" />}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top navigation */}
          <header className="bg-card/95 backdrop-blur-sm border-b border-border z-50 relative">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open sidebar</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                    <nav className="flex flex-col h-full bg-card">
                      <div className="p-4 border-b">
                        <span className="text-2xl font-bold text-primary">eSignPro</span>
                      </div>
                      <div className="flex-1 p-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                              "flex items-center px-2 py-2 text-base font-medium rounded-md mb-1 transition-colors",
                              pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            )}
                          >
                            <item.icon className="mr-4 h-5 w-5" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Header Icons */}
              <div className="flex items-center">
                <HeaderIcons />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "text-sm font-medium text-muted-foreground transition-all duration-200",
                          isCollapsed && "lg:hidden",
                        )}
                      >
                        {user?.name || "User"}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-background relative">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl animate-fade-in">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

