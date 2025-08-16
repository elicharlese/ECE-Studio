"use client"

import type React from "react"

interface TimelineRulerProps {
  duration: number
  pixelsPerSecond: number
  currentTime: number
  onTimeClick: (time: number) => void
}

export function TimelineRuler({ duration, pixelsPerSecond, currentTime, onTimeClick }: TimelineRulerProps) {
  const width = duration * pixelsPerSecond
  const majorTickInterval = 4 // seconds
  const minorTickInterval = 1 // seconds

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const time = x / pixelsPerSecond
    onTimeClick(Math.max(0, Math.min(duration, time)))
  }

  return (
    <div
      className="relative h-12 bg-muted/20 border-b border-border cursor-pointer select-none"
      style={{ width }}
      onClick={handleClick}
    >
      {/* Major ticks and labels */}
      {Array.from({ length: Math.floor(duration / majorTickInterval) + 1 }, (_, i) => {
        const time = i * majorTickInterval
        const x = time * pixelsPerSecond

        return (
          <div key={`major-${i}`} className="absolute top-0 h-full" style={{ left: x }}>
            <div className="text-xs text-muted-foreground px-1 py-1">
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
            </div>
            <div className="w-px h-4 bg-border absolute bottom-0" />
          </div>
        )
      })}

      {/* Minor ticks */}
      {Array.from({ length: Math.floor(duration / minorTickInterval) + 1 }, (_, i) => {
        const time = i * minorTickInterval
        const x = time * pixelsPerSecond

        if (time % majorTickInterval !== 0) {
          return <div key={`minor-${i}`} className="absolute bottom-0 w-px h-2 bg-border/60" style={{ left: x }} />
        }
        return null
      })}

      {/* Grid lines */}
      {Array.from({ length: Math.floor(duration) + 1 }, (_, i) => (
        <div
          key={`grid-${i}`}
          className="absolute top-0 bottom-0 w-px bg-border/30"
          style={{ left: i * pixelsPerSecond }}
        />
      ))}

      {/* Playhead */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none"
        style={{ left: currentTime * pixelsPerSecond }}
      >
        <div className="w-3 h-3 bg-primary rounded-full -translate-x-1/2 absolute top-1" />
      </div>
    </div>
  )
}
