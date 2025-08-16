"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Scissors,
  ZoomIn,
  ZoomOut,
  Volume2,
  EqualIcon as Equalizer,
  Waves,
  Zap,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  Square,
  Save,
  Download,
  AudioWaveformIcon as Waveform,
  BarChart3,
  TrendingUp,
  Settings2,
} from "lucide-react"

interface AudioRegion {
  id: string
  start: number
  end: number
  fadeIn: number
  fadeOut: number
  gain: number
  selected: boolean
}

interface AudioEffect {
  id: string
  name: string
  type: "eq" | "compressor" | "reverb" | "delay" | "distortion" | "filter"
  enabled: boolean
  parameters: Record<string, number>
}

export function AudioEditor() {
  const [waveformData, setWaveformData] = useState<number[]>(
    Array.from({ length: 2000 }, () => (Math.random() - 0.5) * 2),
  )
  const [spectrogramData, setSpectrogramData] = useState<number[][]>([])
  const [selectedRegion, setSelectedRegion] = useState<AudioRegion | null>(null)
  const [playheadPosition, setPlayheadPosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoom, setZoom] = useState([100])
  const [viewMode, setViewMode] = useState<"waveform" | "spectrogram" | "both">("waveform")
  const [editMode, setEditMode] = useState<"select" | "cut" | "fade" | "gain">("select")

  const [effects, setEffects] = useState<AudioEffect[]>([
    {
      id: "eq",
      name: "Parametric EQ",
      type: "eq",
      enabled: false,
      parameters: { lowGain: 0, midGain: 0, highGain: 0, lowFreq: 100, midFreq: 1000, highFreq: 8000 },
    },
    {
      id: "compressor",
      name: "Compressor",
      type: "compressor",
      enabled: false,
      parameters: { threshold: -12, ratio: 4, attack: 10, release: 100, makeup: 0 },
    },
    {
      id: "reverb",
      name: "Reverb",
      type: "reverb",
      enabled: false,
      parameters: { roomSize: 50, damping: 50, wetLevel: 30, dryLevel: 70, predelay: 20 },
    },
  ])

  const [audioAnalysis, setAudioAnalysis] = useState({
    rms: -18.5,
    peak: -6.2,
    lufs: -23.1,
    dynamicRange: 12.3,
    spectralCentroid: 2400,
    zeroCrossings: 1250,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spectrogramRef = useRef<HTMLCanvasElement>(null)

  // Generate spectrogram data
  useEffect(() => {
    const specData = Array.from({ length: 100 }, () => Array.from({ length: 256 }, () => Math.random() * 0.8))
    setSpectrogramData(specData)
  }, [])

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    // Background
    ctx.fillStyle = "hsl(var(--background))"
    ctx.fillRect(0, 0, width, height)

    // Grid lines
    ctx.strokeStyle = "hsl(var(--border))"
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * height
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Waveform
    const samplesPerPixel = Math.max(1, Math.floor(waveformData.length / width))
    ctx.strokeStyle = "hsl(var(--primary))"
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let x = 0; x < width; x++) {
      const sampleIndex = Math.floor((x / width) * waveformData.length)
      let min = 0,
        max = 0

      for (let i = 0; i < samplesPerPixel && sampleIndex + i < waveformData.length; i++) {
        const sample = waveformData[sampleIndex + i]
        min = Math.min(min, sample)
        max = Math.max(max, sample)
      }

      const yMin = height / 2 + (min * height) / 4
      const yMax = height / 2 + (max * height) / 4

      if (x === 0) {
        ctx.moveTo(x, yMax)
      } else {
        ctx.lineTo(x, yMax)
      }
    }
    ctx.stroke()

    // Selected region
    if (selectedRegion) {
      const startX = (selectedRegion.start / waveformData.length) * width
      const endX = (selectedRegion.end / waveformData.length) * width

      ctx.fillStyle = "hsla(var(--primary), 0.2)"
      ctx.fillRect(startX, 0, endX - startX, height)

      ctx.strokeStyle = "hsl(var(--primary))"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(startX, 0)
      ctx.lineTo(startX, height)
      ctx.moveTo(endX, 0)
      ctx.lineTo(endX, height)
      ctx.stroke()
    }

    // Playhead
    const playheadX = (playheadPosition / waveformData.length) * width
    ctx.strokeStyle = "hsl(var(--destructive))"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(playheadX, 0)
    ctx.lineTo(playheadX, height)
    ctx.stroke()

    console.log(`[v0] Waveform rendered: ${width}x${height}, samples: ${waveformData.length}`)
  }, [waveformData, selectedRegion, playheadPosition, zoom])

  // Draw spectrogram
  useEffect(() => {
    const canvas = spectrogramRef.current
    if (!canvas || viewMode === "waveform") return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    const imageData = ctx.createImageData(width, height)

    for (let x = 0; x < width; x++) {
      const timeIndex = Math.floor((x / width) * spectrogramData.length)
      if (timeIndex < spectrogramData.length) {
        const spectrum = spectrogramData[timeIndex]

        for (let y = 0; y < height; y++) {
          const freqIndex = Math.floor((1 - y / height) * spectrum.length)
          const magnitude = spectrum[freqIndex] || 0

          const pixelIndex = (y * width + x) * 4
          const intensity = Math.floor(magnitude * 255)

          // Color mapping: blue to red based on intensity
          imageData.data[pixelIndex] = intensity // Red
          imageData.data[pixelIndex + 1] = intensity * 0.5 // Green
          imageData.data[pixelIndex + 2] = 255 - intensity // Blue
          imageData.data[pixelIndex + 3] = 255 // Alpha
        }
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }, [spectrogramData, viewMode])

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const position = Math.floor((x / canvas.width) * waveformData.length)

      if (editMode === "select") {
        setPlayheadPosition(position)
      }
    },
    [editMode, waveformData.length],
  )

  const applyEffect = (effectId: string, enabled: boolean) => {
    setEffects((prev) => prev.map((effect) => (effect.id === effectId ? { ...effect, enabled } : effect)))
    console.log(`[v0] ${enabled ? "Applied" : "Removed"} effect: ${effectId}`)
  }

  const updateEffectParameter = (effectId: string, parameter: string, value: number) => {
    setEffects((prev) =>
      prev.map((effect) =>
        effect.id === effectId ? { ...effect, parameters: { ...effect.parameters, [parameter]: value } } : effect,
      ),
    )
  }

  const processAudio = (operation: string) => {
    console.log(`[v0] Processing audio: ${operation}`)

    switch (operation) {
      case "normalize":
        const maxAmplitude = Math.max(...waveformData.map(Math.abs))
        if (maxAmplitude > 0) {
          setWaveformData((prev) => prev.map((sample) => sample / maxAmplitude))
        }
        break
      case "reverse":
        setWaveformData((prev) => [...prev].reverse())
        break
      case "fade-in":
        if (selectedRegion) {
          setWaveformData((prev) =>
            prev.map((sample, i) => {
              if (i >= selectedRegion.start && i <= selectedRegion.end) {
                const progress = (i - selectedRegion.start) / (selectedRegion.end - selectedRegion.start)
                return sample * progress
              }
              return sample
            }),
          )
        }
        break
      case "fade-out":
        if (selectedRegion) {
          setWaveformData((prev) =>
            prev.map((sample, i) => {
              if (i >= selectedRegion.start && i <= selectedRegion.end) {
                const progress = 1 - (i - selectedRegion.start) / (selectedRegion.end - selectedRegion.start)
                return sample * progress
              }
              return sample
            }),
          )
        }
        break
    }
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Waveform className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-sans">Audio Editor</h2>
              <p className="text-xs text-muted-foreground">Professional Audio Processing</p>
            </div>
          </div>

          {/* Edit Tools */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {[
              { mode: "select", icon: TrendingUp, label: "Select" },
              { mode: "cut", icon: Scissors, label: "Cut" },
              { mode: "fade", icon: Waves, label: "Fade" },
              { mode: "gain", icon: Volume2, label: "Gain" },
            ].map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                variant={editMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setEditMode(mode as any)}
                className="w-8 h-8 p-0"
                title={label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          {/* Processing Tools */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => processAudio("normalize")}>
              <Equalizer className="w-4 h-4 mr-1" />
              Normalize
            </Button>
            <Button variant="outline" size="sm" onClick={() => processAudio("reverse")}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reverse
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Transport */}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 p-0">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
              <Square className="w-4 h-4" />
            </Button>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {[
              { mode: "waveform", icon: Waveform, label: "Waveform" },
              { mode: "spectrogram", icon: BarChart3, label: "Spectrogram" },
              { mode: "both", icon: Settings2, label: "Both" },
            ].map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode as any)}
                className="w-8 h-8 p-0"
                title={label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setZoom([Math.max(25, zoom[0] - 25)])}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Slider value={zoom} onValueChange={setZoom} min={25} max={400} step={25} className="w-20" />
            <Button variant="outline" size="sm" onClick={() => setZoom([Math.min(400, zoom[0] + 25)])}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Audio Display */}
        <div className="flex-1 flex flex-col">
          {/* Waveform/Spectrogram Display */}
          <div className="flex-1 p-4 overflow-hidden">
            <div className="h-full bg-card rounded-lg border border-border overflow-hidden">
              {(viewMode === "waveform" || viewMode === "both") && (
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={viewMode === "both" ? 200 : 400}
                  className="w-full cursor-crosshair"
                  onClick={handleCanvasClick}
                  style={{ height: viewMode === "both" ? "50%" : "100%" }}
                />
              )}
              {(viewMode === "spectrogram" || viewMode === "both") && (
                <canvas
                  ref={spectrogramRef}
                  width={800}
                  height={viewMode === "both" ? 200 : 400}
                  className="w-full"
                  style={{ height: viewMode === "both" ? "50%" : "100%" }}
                />
              )}
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="h-32 border-t border-border bg-muted/20 p-4">
            <div className="grid grid-cols-6 gap-4 h-full">
              {[
                { label: "RMS Level", value: `${audioAnalysis.rms} dB`, color: "text-green-500" },
                { label: "Peak Level", value: `${audioAnalysis.peak} dB`, color: "text-yellow-500" },
                { label: "LUFS", value: `${audioAnalysis.lufs} LUFS`, color: "text-blue-500" },
                { label: "Dynamic Range", value: `${audioAnalysis.dynamicRange} dB`, color: "text-purple-500" },
                { label: "Spectral Centroid", value: `${audioAnalysis.spectralCentroid} Hz`, color: "text-orange-500" },
                { label: "Zero Crossings", value: `${audioAnalysis.zeroCrossings}`, color: "text-pink-500" },
              ].map(({ label, value, color }) => (
                <Card key={label} className="bg-card">
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground mb-1">{label}</div>
                    <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Effects Panel */}
        <div className="w-80 bg-sidebar border-l border-sidebar-border overflow-y-auto">
          <Tabs defaultValue="effects" className="h-full">
            <div className="p-4 border-b border-sidebar-border">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="effects" className="p-4 space-y-4">
              {effects.map((effect) => (
                <Card key={effect.id} className="bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{effect.name}</CardTitle>
                      <Button
                        variant={effect.enabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => applyEffect(effect.id, !effect.enabled)}
                        className="w-8 h-8 p-0"
                      >
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(effect.parameters).map(([param, value]) => (
                      <div key={param} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize">{param.replace(/([A-Z])/g, " $1")}</span>
                          <span>{value}</span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={(newValue) => updateEffectParameter(effect.id, param, newValue[0])}
                          min={param.includes("Freq") ? 20 : param.includes("Gain") ? -20 : 0}
                          max={param.includes("Freq") ? 20000 : param.includes("Gain") ? 20 : 100}
                          step={param.includes("Freq") ? 10 : 0.1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              {/* Quick Actions */}
              <Card className="bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => processAudio("fade-in")}
                    disabled={!selectedRegion}
                  >
                    <Waves className="w-4 h-4 mr-2" />
                    Fade In
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => processAudio("fade-out")}
                    disabled={!selectedRegion}
                  >
                    <Waves className="w-4 h-4 mr-2" />
                    Fade Out
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => processAudio("normalize")}
                  >
                    <Equalizer className="w-4 h-4 mr-2" />
                    Normalize
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Noise Reduction
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="p-4">
              <div className="space-y-4">
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Frequency Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-muted rounded flex items-end justify-center gap-1 p-2">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-primary rounded-t w-2"
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Phase Correlation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-green-500">+0.95</div>
                      <div className="text-xs text-muted-foreground">Excellent Correlation</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Loudness Meter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Integrated</span>
                      <span>-23.1 LUFS</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Short-term</span>
                      <span>-19.8 LUFS</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Momentary</span>
                      <span>-16.2 LUFS</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-12 border-t border-border bg-card px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Length: {(waveformData.length / 44100).toFixed(2)}s</span>
          <span>Sample Rate: 44.1 kHz</span>
          <span>Bit Depth: 24-bit</span>
          {selectedRegion && (
            <Badge variant="secondary">
              Selection: {((selectedRegion.end - selectedRegion.start) / 44100).toFixed(2)}s
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Zoom: {zoom[0]}%</span>
          <span>Mode: {editMode}</span>
        </div>
      </div>
    </div>
  )
}
