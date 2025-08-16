"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotaryKnob } from "@/components/rotary-knob"
import { Music, Settings, Plus, Trash2, Copy, Power, Zap, Waves, Mic, Headphones } from "lucide-react"

interface Instrument {
  id: string
  name: string
  type: "synth" | "sampler" | "drum" | "bass"
  enabled: boolean
  volume: number
  pan: number
  preset: string
  color: string
}

export function InstrumentRack() {
  const [instruments, setInstruments] = useState<Instrument[]>([
    {
      id: "inst-1",
      name: "Lead Synth",
      type: "synth",
      enabled: true,
      volume: 75,
      pan: 0,
      preset: "Cosmic Lead",
      color: "bg-primary",
    },
    {
      id: "inst-2",
      name: "Bass Engine",
      type: "bass",
      enabled: true,
      volume: 80,
      pan: -10,
      preset: "Deep Sub",
      color: "bg-accent",
    },
    {
      id: "inst-3",
      name: "Drum Kit",
      type: "drum",
      enabled: false,
      volume: 85,
      pan: 0,
      preset: "Trap Kit",
      color: "bg-chart-3",
    },
  ])

  const [selectedInstrument, setSelectedInstrument] = useState<string>("inst-1")

  const toggleInstrument = (id: string) => {
    setInstruments((prev) => prev.map((inst) => (inst.id === id ? { ...inst, enabled: !inst.enabled } : inst)))
  }

  const updateInstrument = (id: string, updates: Partial<Instrument>) => {
    setInstruments((prev) => prev.map((inst) => (inst.id === id ? { ...inst, ...updates } : inst)))
  }

  const addInstrument = () => {
    const newInstrument: Instrument = {
      id: `inst-${Date.now()}`,
      name: "New Instrument",
      type: "synth",
      enabled: true,
      volume: 75,
      pan: 0,
      preset: "Default",
      color: "bg-chart-4",
    }
    setInstruments((prev) => [...prev, newInstrument])
  }

  const deleteInstrument = (id: string) => {
    setInstruments((prev) => prev.filter((inst) => inst.id !== id))
    if (selectedInstrument === id) {
      setSelectedInstrument(instruments[0]?.id || "")
    }
  }

  const getInstrumentIcon = (type: string) => {
    switch (type) {
      case "synth":
        return Zap
      case "bass":
        return Waves
      case "drum":
        return Music
      case "sampler":
        return Mic
      default:
        return Music
    }
  }

  const selectedInst = instruments.find((inst) => inst.id === selectedInstrument)

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">Instrument Rack</h2>
              <p className="text-sm text-muted-foreground">Manage and control your instruments</p>
            </div>
          </div>
          <Button onClick={addInstrument}>
            <Plus className="w-4 h-4 mr-2" />
            Add Instrument
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Instrument List */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Instruments</h3>
              <div className="space-y-2">
                {instruments.map((instrument) => {
                  const Icon = getInstrumentIcon(instrument.type)
                  return (
                    <div
                      key={instrument.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedInstrument === instrument.id
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-muted/20 hover:bg-muted/40"
                      }`}
                      onClick={() => setSelectedInstrument(instrument.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded ${instrument.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{instrument.name}</div>
                            <div className="text-xs text-muted-foreground">{instrument.preset}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant={instrument.enabled ? "default" : "outline"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleInstrument(instrument.id)
                            }}
                            className="w-6 h-6 p-0"
                          >
                            <Power className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Instrument Details */}
          <div className="lg:col-span-2">
            {selectedInst ? (
              <Tabs defaultValue="controls" className="space-y-4">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="controls">Controls</TabsTrigger>
                    <TabsTrigger value="presets">Presets</TabsTrigger>
                    <TabsTrigger value="effects">Effects</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteInstrument(selectedInst.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <TabsContent value="controls">
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                    <div className="space-y-6">
                      {/* Instrument Header */}
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-lg ${selectedInst.color} flex items-center justify-center`}>
                          {(() => {
                            const Icon = getInstrumentIcon(selectedInst.type)
                            return <Icon className="w-8 h-8 text-white" />
                          })()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{selectedInst.name}</h3>
                          <p className="text-muted-foreground">{selectedInst.preset}</p>
                          <Badge variant="secondary" className="mt-1 capitalize">
                            {selectedInst.type}
                          </Badge>
                        </div>
                      </div>

                      {/* Main Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <RotaryKnob
                            value={selectedInst.volume}
                            onChange={(value) => updateInstrument(selectedInst.id, { volume: value })}
                            min={0}
                            max={100}
                            label="Volume"
                            unit="%"
                            size={80}
                          />
                        </div>
                        <div className="text-center">
                          <RotaryKnob
                            value={selectedInst.pan + 50}
                            onChange={(value) => updateInstrument(selectedInst.id, { pan: value - 50 })}
                            min={0}
                            max={100}
                            label="Pan"
                            unit=""
                            size={80}
                          />
                        </div>
                        <div className="text-center">
                          <RotaryKnob
                            value={75}
                            onChange={() => {}}
                            min={0}
                            max={100}
                            label="Reverb"
                            unit="%"
                            size={80}
                          />
                        </div>
                      </div>

                      {/* Additional Parameters */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <RotaryKnob
                            value={50}
                            onChange={() => {}}
                            min={0}
                            max={100}
                            label="Attack"
                            unit="ms"
                            size={60}
                          />
                        </div>
                        <div className="text-center">
                          <RotaryKnob
                            value={30}
                            onChange={() => {}}
                            min={0}
                            max={100}
                            label="Decay"
                            unit="ms"
                            size={60}
                          />
                        </div>
                        <div className="text-center">
                          <RotaryKnob
                            value={70}
                            onChange={() => {}}
                            min={0}
                            max={100}
                            label="Sustain"
                            unit="%"
                            size={60}
                          />
                        </div>
                        <div className="text-center">
                          <RotaryKnob
                            value={40}
                            onChange={() => {}}
                            min={0}
                            max={100}
                            label="Release"
                            unit="ms"
                            size={60}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="presets">
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        "Cosmic Lead",
                        "Deep Sub",
                        "Trap Kit",
                        "Vintage Pad",
                        "Acid Bass",
                        "Ethereal Pluck",
                        "Heavy Drums",
                        "Soft Piano",
                      ].map((preset) => (
                        <Button
                          key={preset}
                          variant={selectedInst.preset === preset ? "default" : "outline"}
                          className="h-16 flex flex-col items-center justify-center"
                          onClick={() => updateInstrument(selectedInst.id, { preset })}
                        >
                          <span className="font-medium">{preset}</span>
                        </Button>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="effects">
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                    <div className="text-center py-8">
                      <Headphones className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Effects Chain</h3>
                      <p className="text-sm text-muted-foreground">
                        Effects processing for this instrument coming soon
                      </p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="p-8 text-center bg-card/30 backdrop-blur-sm border-border/50">
                <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Instrument Selected</h3>
                <p className="text-sm text-muted-foreground">Select an instrument from the list to view its controls</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
