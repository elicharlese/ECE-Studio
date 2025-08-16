"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { RotaryKnob } from "@/components/rotary-knob"
import { Waves, Zap, Volume2, Sparkles } from "lucide-react"

export function EffectsRack() {
  const [effects, setEffects] = useState({
    reverb: {
      enabled: true,
      roomSize: 50,
      damping: 30,
      wetLevel: 25,
    },
    delay: {
      enabled: false,
      time: 250,
      feedback: 40,
      wetLevel: 30,
    },
    distortion: {
      enabled: false,
      drive: 20,
      tone: 50,
      level: 75,
    },
    chorus: {
      enabled: true,
      rate: 2,
      depth: 40,
      wetLevel: 35,
    },
  })

  const toggleEffect = (effectName: keyof typeof effects) => {
    setEffects((prev) => ({
      ...prev,
      [effectName]: {
        ...prev[effectName],
        enabled: !prev[effectName].enabled,
      },
    }))
  }

  const updateEffectParam = (effectName: keyof typeof effects, param: string, value: number) => {
    setEffects((prev) => ({
      ...prev,
      [effectName]: {
        ...prev[effectName],
        [param]: value,
      },
    }))
  }

  const effectConfigs = [
    {
      name: "reverb",
      title: "Reverb",
      icon: Waves,
      color: "text-primary",
      params: [
        { key: "roomSize", label: "Room Size", unit: "%" },
        { key: "damping", label: "Damping", unit: "%" },
        { key: "wetLevel", label: "Wet Level", unit: "%" },
      ],
    },
    {
      name: "delay",
      title: "Delay",
      icon: Volume2,
      color: "text-accent",
      params: [
        { key: "time", label: "Time", unit: "ms" },
        { key: "feedback", label: "Feedback", unit: "%" },
        { key: "wetLevel", label: "Wet Level", unit: "%" },
      ],
    },
    {
      name: "distortion",
      title: "Distortion",
      icon: Zap,
      color: "text-destructive",
      params: [
        { key: "drive", label: "Drive", unit: "%" },
        { key: "tone", label: "Tone", unit: "%" },
        { key: "level", label: "Level", unit: "%" },
      ],
    },
    {
      name: "chorus",
      title: "Chorus",
      icon: Sparkles,
      color: "text-chart-3",
      params: [
        { key: "rate", label: "Rate", unit: "Hz" },
        { key: "depth", label: "Depth", unit: "%" },
        { key: "wetLevel", label: "Wet Level", unit: "%" },
      ],
    },
  ]

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-chart-3/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-chart-3" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">Effects Rack</h2>
              <p className="text-sm text-muted-foreground">Professional audio processing</p>
            </div>
          </div>
        </div>

        {/* Effects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {effectConfigs.map((config) => {
            const effect = effects[config.name as keyof typeof effects]
            const Icon = config.icon

            return (
              <Card
                key={config.name}
                className={`p-6 transition-all duration-300 ${
                  effect.enabled
                    ? "bg-card/70 backdrop-blur-sm border-primary/30 shadow-lg"
                    : "bg-card/30 backdrop-blur-sm border-border/50"
                }`}
              >
                {/* Effect Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${config.color}`} />
                    <h3 className="text-lg font-semibold">{config.title}</h3>
                  </div>
                  <Switch
                    checked={effect.enabled}
                    onCheckedChange={() => toggleEffect(config.name as keyof typeof effects)}
                  />
                </div>

                {/* Effect Parameters */}
                <div
                  className={`space-y-4 transition-opacity duration-300 ${
                    effect.enabled ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-4">
                    {config.params.map((param) => (
                      <div key={param.key} className="text-center">
                        <RotaryKnob
                          value={effect[param.key as keyof typeof effect] as number}
                          onChange={(value) => updateEffectParam(config.name as keyof typeof effects, param.key, value)}
                          min={param.key === "time" ? 0 : 0}
                          max={param.key === "time" ? 1000 : 100}
                          label={param.label}
                          unit={param.unit}
                          size={60}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Master Controls */}
        <Card className="mt-6 p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Master Effects</span>
              <Button variant="outline" size="sm">
                Bypass All
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Wet/Dry Mix</span>
              <div className="w-32">
                <RotaryKnob value={50} onChange={() => {}} min={0} max={100} label="" unit="%" size={40} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
