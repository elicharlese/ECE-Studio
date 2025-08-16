"use client"

import { useEffect, useRef } from "react"

interface WaveformVisualizerProps {
  audioData: number[]
  width: number
  height: number
  color?: string
  isPlaying?: boolean
  currentTime?: number
  duration?: number
}

export function WaveformVisualizer({
  audioData,
  width,
  height,
  color = "rgb(99, 102, 241)",
  isPlaying = false,
  currentTime = 0,
  duration = 1,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set up drawing
    const barWidth = width / audioData.length
    const centerY = height / 2

    // Draw waveform
    ctx.fillStyle = color
    audioData.forEach((amplitude, index) => {
      const barHeight = amplitude * height * 0.8
      const x = index * barWidth
      const y = centerY - barHeight / 2

      ctx.fillRect(x, y, Math.max(1, barWidth - 0.5), barHeight)
    })

    // Draw progress indicator if playing
    if (isPlaying && duration > 0) {
      const progressX = (currentTime / duration) * width
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fillRect(0, 0, progressX, height)
    }
  }, [audioData, width, height, color, isPlaying, currentTime, duration])

  return <canvas ref={canvasRef} width={width} height={height} className="rounded" />
}
