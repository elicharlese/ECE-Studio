"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"

interface RotaryKnobProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  label: string
  unit?: string
  size?: number
}

export function RotaryKnob({ value, onChange, min, max, label, unit = "", size = 80 }: RotaryKnobProps) {
  const [isDragging, setIsDragging] = useState(false)
  const knobRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const startValue = useRef(0)

  const normalizedValue = (value - min) / (max - min)
  const rotation = normalizedValue * 270 - 135 // -135° to +135°

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      startY.current = e.clientY
      startValue.current = value
      e.preventDefault()
    },
    [value],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const deltaY = startY.current - e.clientY
      const sensitivity = (max - min) / 200
      const newValue = Math.max(min, Math.min(max, startValue.current + deltaY * sensitivity))
      onChange(newValue)
    },
    [isDragging, min, max, onChange],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={knobRef}
        className="relative cursor-pointer select-none"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-border bg-gradient-to-br from-card to-muted"
          style={{
            background: `conic-gradient(from 225deg, hsl(var(--primary)) 0deg, hsl(var(--primary)) ${normalizedValue * 270}deg, hsl(var(--muted)) ${normalizedValue * 270}deg, hsl(var(--muted)) 270deg)`,
          }}
        />

        {/* Inner knob */}
        <div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-background to-card border-2 border-border shadow-lg"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          {/* Indicator dot */}
          <div className="absolute w-2 h-2 bg-primary rounded-full top-1 left-1/2 transform -translate-x-1/2" />
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-accent rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="text-center">
        <div className="text-xs font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">
          {Math.round(value)}
          {unit}
        </div>
      </div>
    </div>
  )
}
