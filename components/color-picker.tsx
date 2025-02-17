"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [inputColor, setInputColor] = useState(color)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className="flex items-center space-x-2">
      <Input type="color" value={inputColor} onChange={handleColorChange} className="w-12 h-12 p-1 rounded-md" />
      <Input type="text" value={inputColor} onChange={handleColorChange} className="flex-grow" placeholder="#000000" />
    </div>
  )
}

