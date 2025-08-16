"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RotaryKnob } from "@/components/rotary-knob"
import { Play, Square, Shuffle } from "lucide-react"

export function DrumMachine() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [bpm, setBpm] = useState([120])

  const [pattern, setPattern] = useState({
    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    snare: [
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
    ],
    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    openhat: [
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
    ],
  })

  const drums = [
    { name: "Kick", key: "kick", color: "bg-primary" },
    { name: "Snare", key: "snare", color: "bg-accent" },
    { name: "Hi-Hat", key: "hihat", color: "bg-chart-3" },
    { name: "Open Hat", key: "openhat", color: "bg-chart-4" },
  ]

  const toggleStep = (drumKey: string, stepIndex: number) => {
    setPattern((prev) => ({
      ...prev,
      [drumKey]: prev[drumKey as keyof typeof prev].map((step, index) => (index === stepIndex ? !step : step)),
    }))
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Shuffle className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">Quantum Drums</h2>
              <p className="text-sm text-muted-foreground">AI-powered rhythm generation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">BPM</span>
              <Slider value={bpm} onValueChange={setBpm} min={60} max={200} step={1} className="w-24" />
              <span className="text-sm font-mono w-8">{bpm[0]}</span>
            </div>
            <Button
              variant={isPlaying ? "default" : "outline"}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full"
            >
              {isPlaying ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Step Sequencer */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 mb-6">
          <div className="space-y-4">
            {/* Step indicators */}
            <div className="flex gap-1 mb-4">
              <div className="w-20"></div>
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className={`w-8 h-6 rounded flex items-center justify-center text-xs font-mono ${
                    i === currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Drum tracks */}
            {drums.map((drum) => (
              <div key={drum.key} className="flex items-center gap-1">
                <div className="w-20 text-sm font-medium">{drum.name}</div>
                {pattern[drum.key as keyof typeof pattern].map((active, stepIndex) => (
                  <Button
                    key={stepIndex}
                    variant="outline"
                    size="sm"
                    className={`w-8 h-8 p-0 ${
                      active ? `${drum.color} border-transparent` : "bg-muted/50 hover:bg-muted"
                    }`}
                    onClick={() => toggleStep(drum.key, stepIndex)}
                  >
                    {active && <div className="w-2 h-2 bg-white rounded-full" />}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {drums.map((drum) => (
            <Card key={drum.key} className="p-4 bg-card/30 backdrop-blur-sm border-border/50">
              <div className="text-center space-y-4">
                <h4 className="font-medium">{drum.name}</h4>
                <div className="flex justify-center">
                  <RotaryKnob value={75} onChange={() => {}} min={0} max={100} label="Volume" unit="%" size={60} />
                </div>
                <div className="flex justify-center">
                  <RotaryKnob value={50} onChange={() => {}} min={0} max={100} label="Pan" unit="" size={50} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
