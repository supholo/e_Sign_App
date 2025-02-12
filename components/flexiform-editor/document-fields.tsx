"use client"

import { useDraggable } from "@dnd-kit/core"
import {
  User,
  Building2,
  UserCircle,
  Phone,
  Mail,
  MapPin,
  Globe2,
  CreditCard,
  AlignLeft,
  CheckSquare,
  Radio,
  PenTool,
  QrCode,
} from "lucide-react"
import { cn } from "@/lib/utils"

const fieldTypes = [
  { id: "name", icon: User, label: "Name" },
  { id: "department", icon: Building2, label: "Department" },
  { id: "designation", icon: UserCircle, label: "Designation" },
  { id: "mobile", icon: Phone, label: "Mobile number" },
  { id: "email", icon: Mail, label: "Email" },
  { id: "city", icon: MapPin, label: "City" },
  { id: "state", icon: Globe2, label: "State" },
  { id: "national-id", icon: CreditCard, label: "National ID" },
  { id: "textbox", icon: AlignLeft, label: "Textbox" },
  { id: "checkbox", icon: CheckSquare, label: "Checkbox" },
  { id: "radio", icon: Radio, label: "Radio" },
  { id: "signature", icon: PenTool, label: "Signature" },
  { id: "qrcode", icon: QrCode, label: "QRCode" },
]

function DraggableField({ id, icon: Icon, label }: { id: string; icon: any; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center space-x-2 p-2 rounded-md cursor-move hover:bg-accent",
        isDragging && "opacity-50",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  )
}

export function DocumentFields() {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Document Fields</h2>
      <div className="space-y-1">
        {fieldTypes.map((field) => (
          <DraggableField key={field.id} id={field.id} icon={field.icon} label={field.label} />
        ))}
      </div>
    </div>
  )
}

