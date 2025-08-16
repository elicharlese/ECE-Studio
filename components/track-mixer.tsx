"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { RotaryKnob } from "@/components/rotary-knob"
import { Volume2, VolumeX, Mic, Headphones, Settings, MoreVertical } from "lucide-react"

interface TrackMixerProps {
  tracks: Array<{
    id: string
    name: string
    color: string
    volume: number
    pan: number
    muted: boolean
    solo: boolean
    armed: boolean
  }>
  onTrackUpdate: (trackId: string, updates: any) => void
}

export function TrackMixer({ tracks, onTrackUpdate }: TrackMixerProps) {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)

  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Track Mixer</h3>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tracks.map((track) => (
          <Card
            key={track.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selectedTrack === track.id ? "ring-2 ring-primary bg-card" : "bg-card/70 hover:bg-card"
            }`}
            onClick={() => setSelectedTrack(track.id)}
          >
            <div className="space-y-4">
              {/* Track Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${track.color}`} />
                  <span className="text-sm font-medium truncate">{track.name}</span>
                </div>
                <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-1">
                <Button
                  variant={track.armed ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTrackUpdate(track.id, { armed: !track.armed })
                  }}
                  className="w-8 h-8 p-0"
                >
                  <Mic className="w-3 h-3" />
                </Button>
                <Button
                  variant={track.solo ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTrackUpdate(track.id, { solo: !track.solo })
                  }}
                  className="w-8 h-8 p-0 text-xs"
                >
                  S
                </Button>
                <Button
                  variant={track.muted ? "destructive" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTrackUpdate(track.id, { muted: !track.muted })
                  }}
                  className="w-8 h-8 p-0 text-xs"
                >
                  M
                </Button>
              </div>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Volume</span>
                  <span>{track.volume}%</span>
                </div>
                <div className="flex items-center gap-2">
                  {track.muted ? (
                    <VolumeX className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-3 h-3 text-muted-foreground" />
                  )}
                  <Slider
                    value={[track.volume]}
                    onValueChange={(value) => onTrackUpdate(track.id, { volume: value[0] })}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Pan Control */}
              <div className="flex justify-center">
                <RotaryKnob
                  value={track.pan + 50} // Convert -50 to +50 range to 0-100
                  onChange={(value) => onTrackUpdate(track.id, { pan: value - 50 })}
                  min={0}
                  max={100}
                  label="Pan"
                  unit=""
                  size={50}
                />
              </div>

              {/* Level Meter */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground text-center">Level</div>
                <div className="h-16 w-4 mx-auto bg-muted rounded-full relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                    style={{ height: `${Math.random() * 80 + 10}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Master Section */}
      <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Master</span>
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-muted-foreground" />
              <Slider value={[75]} max={100} step={1} className="w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">-12 dB</Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
