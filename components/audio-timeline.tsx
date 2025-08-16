"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic,
  Headphones,
  ZoomIn,
  ZoomOut,
  Scissors,
  Copy,
  AudioWaveformIcon as Waveform,
  Crosshair,
  RotateCcw,
  Sparkles,
} from "lucide-react"

interface AudioClip {
  id: string
  name: string
  startTime: number
  duration: number
  trackId: string
  color: string
  waveform: number[]
}

interface Track {
  id: string
  name: string
  color: string
  volume: number
  pan: number
  muted: boolean
  solo: boolean
  armed: boolean
  clips: AudioClip[]
}

export function AudioTimeline() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [zoom, setZoom] = useState([50])
  const [selectedClip, setSelectedClip] = useState<string | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const [tracks, setTracks] = useState<Track[]>([
    {
      id: "track-1",
      name: "Lead Synth",
      color: "bg-primary",
      volume: 75,
      pan: 0,
      muted: false,
      solo: false,
      armed: false,
      clips: [
        {
          id: "clip-1",
          name: "Synth Lead 1",
          startTime: 0,
          duration: 8,
          trackId: "track-1",
          color: "bg-primary",
          waveform: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
        },
        {
          id: "clip-2",
          name: "Synth Lead 2",
          startTime: 16,
          duration: 12,
          trackId: "track-1",
          color: "bg-primary",
          waveform: Array.from({ length: 150 }, () => Math.random() * 0.6 + 0.2),
        },
      ],
    },
    {
      id: "track-2",
      name: "Bass Line",
      color: "bg-accent",
      volume: 80,
      pan: -10,
      muted: false,
      solo: false,
      armed: false,
      clips: [
        {
          id: "clip-3",
          name: "Bass Pattern",
          startTime: 4,
          duration: 24,
          trackId: "track-2",
          color: "bg-accent",
          waveform: Array.from({ length: 300 }, () => Math.random() * 0.9 + 0.05),
        },
      ],
    },
    {
      id: "track-3",
      name: "Drums",
      color: "bg-chart-3",
      volume: 85,
      pan: 0,
      muted: false,
      solo: false,
      armed: true,
      clips: [
        {
          id: "clip-4",
          name: "Drum Loop",
          startTime: 0,
          duration: 32,
          trackId: "track-3",
          color: "bg-chart-3",
          waveform: Array.from({ length: 400 }, () => Math.random() * 1.0),
        },
      ],
    },
    {
      id: "track-4",
      name: "Vocals",
      color: "bg-chart-4",
      volume: 70,
      pan: 5,
      muted: true,
      solo: false,
      armed: false,
      clips: [],
    },
  ])

  const [editMode, setEditMode] = useState<"select" | "cut" | "crossfade" | "stretch">("select")
  const [crossfadeLength, setCrossfadeLength] = useState([100])
  const [timeStretchRatio, setTimeStretchRatio] = useState([100])
  const [selectedClips, setSelectedClips] = useState<string[]>([])

  const pixelsPerSecond = zoom[0] * 2
  const timelineWidth = 64 * pixelsPerSecond // 64 seconds visible
  const playheadPosition = currentTime * pixelsPerSecond

  // Generate time markers
  const timeMarkers = []
  for (let i = 0; i <= 64; i += 4) {
    timeMarkers.push(i)
  }

  const toggleTrackMute = (trackId: string) => {
    setTracks((prev) => prev.map((track) => (track.id === trackId ? { ...track, muted: !track.muted } : track)))
  }

  const toggleTrackSolo = (trackId: string) => {
    setTracks((prev) => prev.map((track) => (track.id === trackId ? { ...track, solo: !track.solo } : track)))
  }

  const toggleTrackArm = (trackId: string) => {
    setTracks((prev) => prev.map((track) => (track.id === trackId ? { ...track, armed: !track.armed } : track)))
  }

  const updateTrackVolume = (trackId: string, volume: number) => {
    setTracks((prev) => prev.map((track) => (track.id === trackId ? { ...track, volume } : track)))
  }

  const createCrossfade = (clipId1: string, clipId2: string) => {
    console.log(`[v0] Creating crossfade between clips: ${clipId1} and ${clipId2}`)
    // Implementation would handle crossfade creation
  }

  const stretchClip = (clipId: string, ratio: number) => {
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId ? { ...clip, duration: clip.duration * (ratio / 100) } : clip,
        ),
      })),
    )
    console.log(`[v0] Stretched clip ${clipId} by ${ratio}%`)
  }

  const splitClip = (clipId: string, position: number) => {
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        clips: track.clips.flatMap((clip) => {
          if (clip.id === clipId) {
            const splitPoint = position - clip.startTime
            if (splitPoint > 0 && splitPoint < clip.duration) {
              return [
                { ...clip, duration: splitPoint },
                {
                  ...clip,
                  id: `${clip.id}_split`,
                  startTime: position,
                  duration: clip.duration - splitPoint,
                },
              ]
            }
          }
          return clip
        }),
      })),
    )
  }

  // Simulate playback
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev + 0.1) % 64)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Timeline Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          {/* Transport Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <Square className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Time Display */}
          <div className="font-mono text-sm bg-muted px-3 py-1 rounded">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, "0")}
          </div>

          {/* Advanced Editing Tools */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {[
              { mode: "select", icon: Crosshair, label: "Select" },
              { mode: "cut", icon: Scissors, label: "Cut" },
              { mode: "crossfade", icon: Waveform, label: "Crossfade" },
              { mode: "stretch", icon: RotateCcw, label: "Stretch" },
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

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Slider value={zoom} onValueChange={setZoom} min={10} max={200} step={10} className="w-24" />
            <Button variant="outline" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">120 BPM</Badge>
          <Badge variant="secondary">4/4</Badge>

          {/* Advanced Processing Options */}
          {editMode === "crossfade" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Length:</span>
              <Slider
                value={crossfadeLength}
                onValueChange={setCrossfadeLength}
                min={10}
                max={1000}
                step={10}
                className="w-20"
              />
              <span className="text-xs text-muted-foreground">{crossfadeLength[0]}ms</span>
            </div>
          )}

          {editMode === "stretch" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ratio:</span>
              <Slider
                value={timeStretchRatio}
                onValueChange={setTimeStretchRatio}
                min={50}
                max={200}
                step={5}
                className="w-20"
              />
              <span className="text-xs text-muted-foreground">{timeStretchRatio[0]}%</span>
            </div>
          )}

          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track Headers */}
        <div className="w-64 bg-sidebar border-r border-sidebar-border">
          <div className="h-12 border-b border-sidebar-border flex items-center px-4">
            <span className="text-sm font-medium text-sidebar-foreground">Tracks</span>
          </div>

          {tracks.map((track) => (
            <div key={track.id} className="h-24 border-b border-sidebar-border p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-sidebar-foreground truncate">{track.name}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant={track.armed ? "default" : "ghost"}
                    size="sm"
                    onClick={() => toggleTrackArm(track.id)}
                    className="w-6 h-6 p-0"
                  >
                    <Mic className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={track.solo ? "default" : "ghost"}
                    size="sm"
                    onClick={() => toggleTrackSolo(track.id)}
                    className="w-6 h-6 p-0 text-xs"
                  >
                    S
                  </Button>
                  <Button
                    variant={track.muted ? "destructive" : "ghost"}
                    size="sm"
                    onClick={() => toggleTrackMute(track.id)}
                    className="w-6 h-6 p-0 text-xs"
                  >
                    M
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {track.muted ? (
                  <VolumeX className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-3 h-3 text-muted-foreground" />
                )}
                <Slider
                  value={[track.volume]}
                  onValueChange={(value) => updateTrackVolume(track.id, value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8">{track.volume}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Area */}
        <div className="flex-1 overflow-auto">
          <div ref={timelineRef} className="relative" style={{ width: timelineWidth }}>
            {/* Time Ruler */}
            <div className="h-12 border-b border-border bg-muted/20 relative">
              {timeMarkers.map((time) => (
                <div
                  key={time}
                  className="absolute top-0 h-full flex flex-col justify-between"
                  style={{ left: time * pixelsPerSecond }}
                >
                  <div className="text-xs text-muted-foreground px-1">
                    {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
                  </div>
                  <div className="w-px h-3 bg-border" />
                </div>
              ))}

              {/* Grid Lines */}
              {Array.from({ length: 64 }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-border/30"
                  style={{ left: i * pixelsPerSecond }}
                />
              ))}
            </div>

            {/* Tracks */}
            {tracks.map((track) => (
              <div key={track.id} className="h-24 border-b border-border relative">
                {/* Grid Lines */}
                {Array.from({ length: 64 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-border/20"
                    style={{ left: i * pixelsPerSecond }}
                  />
                ))}

                {/* Audio Clips */}
                {track.clips.map((clip) => (
                  <div
                    key={clip.id}
                    className={`absolute top-2 bottom-2 rounded cursor-pointer transition-all duration-200 ${
                      selectedClip === clip.id
                        ? `${clip.color} ring-2 ring-primary ring-offset-2 ring-offset-background`
                        : `${clip.color}/80 hover:${clip.color}`
                    }`}
                    style={{
                      left: clip.startTime * pixelsPerSecond,
                      width: clip.duration * pixelsPerSecond,
                    }}
                    onClick={(e) => {
                      setSelectedClip(clip.id)
                      if (editMode === "cut" && e.detail === 2) {
                        // Double click to split
                        splitClip(clip.id, currentTime)
                      }
                    }}
                  >
                    <div className="p-2 h-full flex flex-col">
                      <div className="text-xs font-medium text-white truncate mb-1">{clip.name}</div>

                      {/* Enhanced Waveform with fade indicators */}
                      <div className="flex-1 flex items-end gap-px overflow-hidden relative">
                        {clip.waveform
                          .slice(0, Math.floor((clip.duration * pixelsPerSecond) / 2))
                          .map((amplitude, i) => (
                            <div
                              key={i}
                              className="bg-white/60 w-px"
                              style={{
                                height: `${amplitude * 100}%`,
                                opacity: i < 10 || i > clip.waveform.length - 10 ? 0.3 : 1, // Fade indicators
                              }}
                            />
                          ))}

                        {/* Crossfade Indicators */}
                        {editMode === "crossfade" && (
                          <>
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary/30 rounded-l" />
                            <div className="absolute right-0 top-0 bottom-0 w-2 bg-primary/30 rounded-r" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none"
              style={{ left: playheadPosition }}
            >
              <div className="w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 absolute top-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-12 border-t border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Sample Rate: 44.1 kHz</span>
          <span>Bit Depth: 24-bit</span>
          <span>Latency: 5.8ms</span>
          {selectedClips.length > 0 && <Badge variant="secondary">{selectedClips.length} clips selected</Badge>}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Mode: {editMode}</span>
            {editMode === "stretch" && <span>Ratio: {timeStretchRatio[0]}%</span>}
            {editMode === "crossfade" && <span>Length: {crossfadeLength[0]}ms</span>}
          </div>

          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-muted-foreground" />
            <Slider value={[75]} max={100} step={1} className="w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}
