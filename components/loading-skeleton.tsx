"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "timeline" | "waveform" | "keyboard"
  count?: number
  className?: string
}

export function LoadingSkeleton({ variant = "card", count = 1, className = "" }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <Card className={`animate-pulse ${className}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-32 bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "list":
        return (
          <div className={`animate-pulse space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/20 rounded">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-2 bg-muted rounded w-1/2" />
                </div>
                <div className="w-16 h-6 bg-muted rounded" />
              </div>
            ))}
          </div>
        )

      case "timeline":
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-12 bg-muted/20 border-b border-border mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted/20 rounded relative">
                  <div className="absolute left-4 top-2 w-20 h-4 bg-muted rounded" />
                  <div className="absolute left-8 top-8 w-32 h-8 bg-muted rounded" />
                  <div className="absolute left-48 top-8 w-24 h-8 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        )

      case "waveform":
        return (
          <div className={`animate-pulse flex items-end gap-1 h-32 ${className}`}>
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="bg-muted w-1 rounded-t" style={{ height: `${Math.random() * 80 + 20}%` }} />
            ))}
          </div>
        )

      case "keyboard":
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-8 bg-muted rounded" />
                <div className="w-16 h-8 bg-muted rounded" />
              </div>
            </div>
            <div className="h-32 bg-muted/20 rounded mb-4" />
            <div className="flex gap-1">
              {Array.from({ length: 52 }).map((_, i) => (
                <div key={i} className="w-6 h-32 bg-muted rounded-b" />
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className={`animate-pulse space-y-4 ${className}`}>
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        )
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </>
  )
}

// Specific loading components for common use cases
export function AudioTimelineLoading() {
  return <LoadingSkeleton variant="timeline" className="w-full h-full" />
}

export function WaveformLoading() {
  return <LoadingSkeleton variant="waveform" className="w-full" />
}

export function KeyboardLoading() {
  return <LoadingSkeleton variant="keyboard" className="w-full" />
}

export function SampleLibraryLoading() {
  return <LoadingSkeleton variant="card" count={6} className="w-full" />
}

export function InstrumentRackLoading() {
  return <LoadingSkeleton variant="list" count={4} className="w-full" />
}
