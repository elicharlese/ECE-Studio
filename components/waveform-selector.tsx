"use client"

import { Button } from "@/components/ui/button"

interface WaveformSelectorProps {
  value: string
  onChange: (waveform: string) => void
}

export function WaveformSelector({ value, onChange }: WaveformSelectorProps) {
  const waveforms = [
    { name: "sine", icon: "∿" },
    { name: "sawtooth", icon: "⩘" },
    { name: "square", icon: "⊓" },
    { name: "triangle", icon: "△" },
  ]

  return (
    <div className="space-y-3">
      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-2">Waveform</div>
        <div className="grid grid-cols-2 gap-2">
          {waveforms.map((waveform) => (
            <Button
              key={waveform.name}
              variant={value === waveform.name ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(waveform.name)}
              className="h-12 flex flex-col items-center justify-center gap-1"
            >
              <span className="text-lg">{waveform.icon}</span>
              <span className="text-xs capitalize">{waveform.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
