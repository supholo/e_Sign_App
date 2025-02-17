export interface RecentActivity {
  id: string
  type: "document" | "workflow" | "signature" | "user" | "template"
  action: string
  itemId: string
  itemName: string
  userId: string
  userName: string
  timestamp: string
}

