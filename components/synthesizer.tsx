"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RotaryKnob } from "@/components/rotary-knob"
import { WaveformSelector } from "@/components/waveform-selector"
import { Play, Square, Volume2, Zap } from "lucide-react"

export function Synthesizer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [oscillator1, setOscillator1] = useState({
    waveform: "sawtooth",
    frequency: [440],
    detune: [0],
    gain: [75],
  })
  const [filter, setFilter] = useState({
    cutoff: [2000],
    resonance: [10],
    type: "lowpass",
  })
  const [envelope, setEnvelope] = useState({
    attack: [10],
    decay: [30],
    sustain: [70],
    release: [50],
  })

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">Neural Synthesizer</h2>
              <p className="text-sm text-muted-foreground">Blockchain-powered sound generation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isPlaying ? "default" : "outline"}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full"
            >
              {isPlaying ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Oscillator Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4 text-center">Oscillator</h3>

            <div className="space-y-6">
              <WaveformSelector
                value={oscillator1.waveform}
                onChange={(waveform) => setOscillator1((prev) => ({ ...prev, waveform }))}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <RotaryKnob
                    value={oscillator1.frequency[0]}
                    onChange={(value) => setOscillator1((prev) => ({ ...prev, frequency: [value] }))}
                    min={20}
                    max={2000}
                    label="Frequency"
                    unit="Hz"
                  />
                </div>
                <div className="text-center">
                  <RotaryKnob
                    value={oscillator1.detune[0]}
                    onChange={(value) => setOscillator1((prev) => ({ ...prev, detune: [value] }))}
                    min={-100}
                    max={100}
                    label="Detune"
                    unit="¢"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-2">Gain</label>
                <Slider
                  value={oscillator1.gain}
                  onValueChange={(value) => setOscillator1((prev) => ({ ...prev, gain: value }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Filter Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4 text-center">Filter</h3>

            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-lg">
                  {["lowpass", "highpass", "bandpass"].map((type) => (
                    <Button
                      key={type}
                      variant={filter.type === type ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilter((prev) => ({ ...prev, type }))}
                      className="text-xs"
                    >
                      {type.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <RotaryKnob
                    value={filter.cutoff[0]}
                    onChange={(value) => setFilter((prev) => ({ ...prev, cutoff: [value] }))}
                    min={20}
                    max={20000}
                    label="Cutoff"
                    unit="Hz"
                  />
                </div>
                <div className="text-center">
                  <RotaryKnob
                    value={filter.resonance[0]}
                    onChange={(value) => setFilter((prev) => ({ ...prev, resonance: [value] }))}
                    min={0}
                    max={100}
                    label="Resonance"
                    unit="%"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Envelope Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4 text-center">Envelope</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <RotaryKnob
                    value={envelope.attack[0]}
                    onChange={(value) => setEnvelope((prev) => ({ ...prev, attack: [value] }))}
                    min={0}
                    max={100}
                    label="Attack"
                    unit="ms"
                  />
                </div>
                <div className="text-center">
                  <RotaryKnob
                    value={envelope.decay[0]}
                    onChange={(value) => setEnvelope((prev) => ({ ...prev, decay: [value] }))}
                    min={0}
                    max={100}
                    label="Decay"
                    unit="ms"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <RotaryKnob
                    value={envelope.sustain[0]}
                    onChange={(value) => setEnvelope((prev) => ({ ...prev, sustain: [value] }))}
                    min={0}
                    max={100}
                    label="Sustain"
                    unit="%"
                  />
                </div>
                <div className="text-center">
                  <RotaryKnob
                    value={envelope.release[0]}
                    onChange={(value) => setEnvelope((prev) => ({ ...prev, release: [value] }))}
                    min={0}
                    max={100}
                    label="Release"
                    unit="ms"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Controls */}
        <Card className="mt-6 p-4 bg-card/30 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <Slider value={[75]} max={100} step={1} className="w-32" />
            </div>
            <div className="text-sm text-muted-foreground">Master Volume</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
