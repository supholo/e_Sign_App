"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

export function HeaderIcons() {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)

  return (
    <div className="flex items-center justify-end flex-1 pr-4">
      <div className="flex items-center bg-background/50 backdrop-blur-sm rounded-full p-1 border shadow-sm">
        <div
          className={cn("flex items-center transition-all duration-300 ease-in-out", isSearchVisible ? "w-64" : "w-0")}
        >
          <Input
            type="search"
            placeholder="Search..."
            className={cn(
              "h-8 bg-transparent border-none focus-visible:ring-0 transition-all duration-300",
              isSearchVisible ? "w-full opacity-100" : "w-0 opacity-0",
            )}
          />
        </div>
        <TooltipProvider>
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 flex items-center justify-center cursor-pointer">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-accent cursor-pointer"
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-accent relative"
                  onClick={() => setIsNotificationDialogOpen(!isNotificationDialogOpen)}
                >
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center animate-badge">
                    3
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-accent">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Help</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <AnimatePresence>
        {isNotificationDialogOpen && (
          <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
            <motion.div
              initial={{ opacity: 0, y: -20, x: "calc(100vw - 24rem)" }}
              animate={{ opacity: 1, y: 0, x: "calc(100vw - 24rem)" }}
              exit={{ opacity: 0, y: -20, x: "calc(100vw - 24rem)" }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed z-50"
              style={{ top: "4rem", width: "22rem" }}
            >
              <DialogContent className="w-full overflow-hidden rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle>Notifications</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>You have 3 new notifications.</p>
                  {/* Add more notification content here */}
                </div>
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}

