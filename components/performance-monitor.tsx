"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Cpu, HardDrive, Zap, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  audioLatency: number
  cpuUsage: number
  renderTime: number
  audioBufferHealth: number
  activeVoices: number
  sampleRate: number
}

interface PerformanceAlert {
  id: string
  type: "warning" | "error" | "info"
  message: string
  timestamp: number
  resolved: boolean
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 45,
    audioLatency: 5.8,
    cpuUsage: 23,
    renderTime: 16.7,
    audioBufferHealth: 95,
    activeVoices: 8,
    sampleRate: 44100,
  })

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const performanceObserverRef = useRef<PerformanceObserver | null>(null)

  // Performance monitoring
  useEffect(() => {
    if (!isMonitoring) return

    const updateMetrics = () => {
      // Simulate realistic performance metrics
      const now = performance.now()
      frameCountRef.current++

      // Calculate FPS
      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current))
        frameCountRef.current = 0
        lastTimeRef.current = now

        // Update metrics with some realistic variation
        setMetrics((prev) => ({
          fps: Math.max(30, fps + (Math.random() - 0.5) * 10),
          memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 5)),
          audioLatency: Math.max(2, Math.min(20, prev.audioLatency + (Math.random() - 0.5) * 2)),
          cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 8)),
          renderTime: Math.max(8, Math.min(33, prev.renderTime + (Math.random() - 0.5) * 3)),
          audioBufferHealth: Math.max(70, Math.min(100, prev.audioBufferHealth + (Math.random() - 0.5) * 5)),
          activeVoices: Math.max(0, Math.min(32, prev.activeVoices + Math.floor((Math.random() - 0.5) * 4))),
          sampleRate: 44100,
        }))
      }

      requestAnimationFrame(updateMetrics)
    }

    const animationId = requestAnimationFrame(updateMetrics)

    // Set up Performance Observer for detailed metrics
    if ("PerformanceObserver" in window) {
      try {
        performanceObserverRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.entryType === "measure" || entry.entryType === "navigation") {
              console.log(`[v0] Performance entry: ${entry.name} - ${entry.duration}ms`)
            }
          })
        })

        performanceObserverRef.current.observe({ entryTypes: ["measure", "navigation", "paint"] })
      } catch (error) {
        console.warn("[v0] Performance Observer not supported:", error)
      }
    }

    return () => {
      cancelAnimationFrame(animationId)
      performanceObserverRef.current?.disconnect()
    }
  }, [isMonitoring])

  // Performance alerts
  useEffect(() => {
    const checkPerformance = () => {
      const newAlerts: PerformanceAlert[] = []

      if (metrics.fps < 30) {
        newAlerts.push({
          id: `fps-${Date.now()}`,
          type: "warning",
          message: `Low FPS detected: ${metrics.fps.toFixed(1)} fps`,
          timestamp: Date.now(),
          resolved: false,
        })
      }

      if (metrics.memoryUsage > 70) {
        newAlerts.push({
          id: `memory-${Date.now()}`,
          type: "error",
          message: `High memory usage: ${metrics.memoryUsage.toFixed(1)}%`,
          timestamp: Date.now(),
          resolved: false,
        })
      }

      if (metrics.audioLatency > 15) {
        newAlerts.push({
          id: `latency-${Date.now()}`,
          type: "warning",
          message: `High audio latency: ${metrics.audioLatency.toFixed(1)}ms`,
          timestamp: Date.now(),
          resolved: false,
        })
      }

      if (metrics.audioBufferHealth < 80) {
        newAlerts.push({
          id: `buffer-${Date.now()}`,
          type: "error",
          message: `Audio buffer underrun risk: ${metrics.audioBufferHealth.toFixed(1)}%`,
          timestamp: Date.now(),
          resolved: false,
        })
      }

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev.slice(0, 9)]) // Keep last 10 alerts
        console.log("[v0] Performance alerts generated:", newAlerts)
      }
    }

    const interval = setInterval(checkPerformance, 2000)
    return () => clearInterval(interval)
  }, [metrics])

  const getMetricStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return "good"
    if (value <= thresholds.warning) return "warning"
    return "critical"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const optimizePerformance = () => {
    console.log("[v0] Running performance optimization...")

    // Simulate performance optimization
    setMetrics((prev) => ({
      ...prev,
      memoryUsage: Math.max(20, prev.memoryUsage * 0.8),
      cpuUsage: Math.max(15, prev.cpuUsage * 0.7),
      audioLatency: Math.max(3, prev.audioLatency * 0.6),
      audioBufferHealth: Math.min(100, prev.audioBufferHealth * 1.1),
    }))

    // Clear resolved alerts
    setAlerts((prev) => prev.map((alert) => ({ ...alert, resolved: true })))
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  if (!showDetails) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Performance</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      metrics.fps >= 50 ? "bg-green-500" : metrics.fps >= 30 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  />
                  <span>{metrics.fps.toFixed(0)} fps</span>
                </div>

                <div className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  <span>{metrics.cpuUsage.toFixed(0)}%</span>
                </div>

                <div className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  <span>{metrics.memoryUsage.toFixed(0)}%</span>
                </div>

                {alerts.filter((a) => !a.resolved).length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {alerts.filter((a) => !a.resolved).length}
                  </Badge>
                )}
              </div>

              <Button variant="ghost" size="sm" onClick={() => setShowDetails(true)} className="w-6 h-6 p-0">
                <TrendingUp className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Performance Monitor
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsMonitoring(!isMonitoring)} className="w-6 h-6 p-0">
                {isMonitoring ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Clock className="w-3 h-3" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)} className="w-6 h-6 p-0">
                ×
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>FPS</span>
                <span className={getStatusColor(getMetricStatus(60 - metrics.fps, { good: 10, warning: 30 }))}>
                  {metrics.fps.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    metrics.fps >= 50 ? "bg-green-500" : metrics.fps >= 30 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, (metrics.fps / 60) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>CPU</span>
                <span className={getStatusColor(getMetricStatus(metrics.cpuUsage, { good: 30, warning: 60 }))}>
                  {metrics.cpuUsage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    metrics.cpuUsage <= 30 ? "bg-green-500" : metrics.cpuUsage <= 60 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${metrics.cpuUsage}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Memory</span>
                <span className={getStatusColor(getMetricStatus(metrics.memoryUsage, { good: 40, warning: 70 }))}>
                  {metrics.memoryUsage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    metrics.memoryUsage <= 40
                      ? "bg-green-500"
                      : metrics.memoryUsage <= 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${metrics.memoryUsage}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Latency</span>
                <span className={getStatusColor(getMetricStatus(metrics.audioLatency, { good: 10, warning: 20 }))}>
                  {metrics.audioLatency.toFixed(1)}ms
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    metrics.audioLatency <= 10
                      ? "bg-green-500"
                      : metrics.audioLatency <= 20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, (metrics.audioLatency / 30) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-muted/20 rounded">
              <div className="font-medium">{metrics.activeVoices}</div>
              <div className="text-muted-foreground">Voices</div>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded">
              <div className="font-medium">{metrics.audioBufferHealth.toFixed(0)}%</div>
              <div className="text-muted-foreground">Buffer</div>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded">
              <div className="font-medium">{(metrics.sampleRate / 1000).toFixed(1)}k</div>
              <div className="text-muted-foreground">Sample Rate</div>
            </div>
          </div>

          {/* Alerts */}
          {alerts.filter((a) => !a.resolved).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Active Alerts</span>
                <Button variant="ghost" size="sm" onClick={clearAlerts} className="text-xs h-6">
                  Clear
                </Button>
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {alerts
                  .filter((a) => !a.resolved)
                  .slice(0, 3)
                  .map((alert) => (
                    <div key={alert.id} className="flex items-center gap-2 text-xs p-2 bg-muted/20 rounded">
                      {alert.type === "error" ? (
                        <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                      )}
                      <span className="flex-1 truncate">{alert.message}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" onClick={optimizePerformance} className="flex-1 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Optimize
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="text-xs">
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
