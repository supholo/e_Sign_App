"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eraser } from "lucide-react"

interface SignaturePadProps {
  onSignatureSelect: (signatureData: string) => void
}

export function SignaturePad({ onSignatureSelect }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const draw = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !isDrawing) return

    e.preventDefault()
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const point = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }

    if (lastPoint) {
      ctx.beginPath()
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }

    setLastPoint(point)
  }

  const startDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    setLastPoint({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    })
  }

  const endDrawing = () => {
    setIsDrawing(false)
    setLastPoint(null)
    const canvas = canvasRef.current
    if (canvas) {
      onSignatureSelect(canvas.toDataURL())
    }
  }

  const clearPad = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onSignatureSelect("")
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full border rounded touch-none bg-white"
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </Card>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={clearPad}>
          <Eraser className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  )
}

