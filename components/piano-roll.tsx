"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Square, Edit3, MousePointer, Scissors, Zap, Music2, Copy, Trash2 } from "lucide-react"

interface Note {
  id: string
  pitch: number // MIDI note number (0-127)
  start: number // in beats
  duration: number // in beats
  velocity: number // 0-127
}

export function PianoRoll() {
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", pitch: 60, start: 0, duration: 1, velocity: 100 }, // C4
    { id: "2", pitch: 64, start: 1, duration: 1, velocity: 90 }, // E4
    { id: "3", pitch: 67, start: 2, duration: 1, velocity: 95 }, // G4
    { id: "4", pitch: 72, start: 3, duration: 2, velocity: 85 }, // C5
  ])

  const [selectedTool, setSelectedTool] = useState<"select" | "draw" | "erase">("draw")
  const [zoom, setZoom] = useState([50])
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [snapValue, setSnapValue] = useState("1/16")
  const [quantizeStrength, setQuantizeStrength] = useState([100])
  const [humanizeAmount, setHumanizeAmount] = useState([0])
  const [velocityRange, setVelocityRange] = useState([80, 120])
  const [showVelocity, setShowVelocity] = useState(false)
  const [playbackMode, setPlaybackMode] = useState<"loop" | "once">("loop")

  const pianoRollRef = useRef<HTMLDivElement>(null)

  // Piano roll dimensions
  const noteHeight = 16
  const beatWidth = zoom[0] * 2
  const totalBeats = 32
  const lowestNote = 36 // C2
  const highestNote = 96 // C7
  const totalNotes = highestNote - lowestNote + 1

  // Note names for display
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  const isBlackKey = (note: number) => [1, 3, 6, 8, 10].includes(note % 12)

  const getNoteColor = (pitch: number) => {
    return isBlackKey(pitch) ? "bg-muted" : "bg-background"
  }

  const getNoteName = (pitch: number) => {
    const octave = Math.floor(pitch / 12) - 1
    const noteName = noteNames[pitch % 12]
    return `${noteName}${octave}`
  }

  const addNote = (pitch: number, beat: number) => {
    if (selectedTool === "draw") {
      const newNote: Note = {
        id: Date.now().toString(),
        pitch,
        start: Math.floor(beat),
        duration: 1,
        velocity: 100,
      }
      setNotes((prev) => [...prev, newNote])
    }
  }

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  const selectNote = (noteId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedNotes((prev) => (prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]))
    } else {
      setSelectedNotes([noteId])
    }
  }

  const quantizeNotes = () => {
    const snapValues = {
      "1/4": 1,
      "1/8": 0.5,
      "1/16": 0.25,
      "1/32": 0.125,
    }
    const snapSize = snapValues[snapValue as keyof typeof snapValues] || 0.25
    const strength = quantizeStrength[0] / 100

    setNotes((prev) =>
      prev.map((note) => {
        const quantizedStart = Math.round(note.start / snapSize) * snapSize
        const newStart = note.start + (quantizedStart - note.start) * strength
        return { ...note, start: newStart }
      }),
    )
  }

  const humanizeNotes = () => {
    const amount = humanizeAmount[0] / 100
    setNotes((prev) =>
      prev.map((note) => ({
        ...note,
        start: note.start + (Math.random() - 0.5) * amount * 0.1,
        velocity: Math.max(1, Math.min(127, note.velocity + (Math.random() - 0.5) * amount * 20)),
      })),
    )
  }

  const duplicateSelectedNotes = () => {
    const selectedNotesData = notes.filter((note) => selectedNotes.includes(note.id))
    const newNotes = selectedNotesData.map((note) => ({
      ...note,
      id: Date.now().toString() + Math.random(),
      start: note.start + note.duration,
    }))
    setNotes((prev) => [...prev, ...newNotes])
  }

  const deleteSelectedNotes = () => {
    setNotes((prev) => prev.filter((note) => !selectedNotes.includes(note.id)))
    setSelectedNotes([])
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-sans">Piano Roll</h2>
              <p className="text-xs text-muted-foreground">Advanced MIDI Note Editor</p>
            </div>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={selectedTool === "select" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTool("select")}
              className="w-8 h-8 p-0"
            >
              <MousePointer className="w-4 h-4" />
            </Button>
            <Button
              variant={selectedTool === "draw" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTool("draw")}
              className="w-8 h-8 p-0"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant={selectedTool === "erase" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTool("erase")}
              className="w-8 h-8 p-0"
            >
              <Scissors className="w-4 h-4" />
            </Button>
          </div>

          {/* Advanced editing tools */}
          {selectedNotes.length > 0 && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={duplicateSelectedNotes}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={deleteSelectedNotes}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
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

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={quantizeNotes}>
              <Zap className="w-4 h-4 mr-1" />
              Quantize
            </Button>
            <Button variant="outline" size="sm" onClick={humanizeNotes}>
              <Music2 className="w-4 h-4 mr-1" />
              Humanize
            </Button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Zoom</span>
            <Slider value={zoom} onValueChange={setZoom} min={25} max={200} step={25} className="w-20" />
          </div>

          <Badge variant="secondary">4/4</Badge>
        </div>
      </div>

      {/* Advanced controls panel */}
      <div className="border-b border-border bg-muted/20">
        <Tabs defaultValue="editing" className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editing">Editing</TabsTrigger>
              <TabsTrigger value="quantize">Quantize</TabsTrigger>
              <TabsTrigger value="velocity">Velocity</TabsTrigger>
              <TabsTrigger value="timing">Timing</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editing" className="px-4 pb-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Snap</label>
                <select
                  value={snapValue}
                  onChange={(e) => setSnapValue(e.target.value)}
                  className="w-full p-2 rounded-md border border-border bg-background text-sm"
                >
                  <option value="1/4">1/4</option>
                  <option value="1/8">1/8</option>
                  <option value="1/16">1/16</option>
                  <option value="1/32">1/32</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Playback</label>
                <select
                  value={playbackMode}
                  onChange={(e) => setPlaybackMode(e.target.value as "loop" | "once")}
                  className="w-full p-2 rounded-md border border-border bg-background text-sm"
                >
                  <option value="once">Play Once</option>
                  <option value="loop">Loop</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">View</label>
                <Button
                  variant={showVelocity ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowVelocity(!showVelocity)}
                  className="w-full"
                >
                  Velocity Lanes
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Selection</label>
                <span className="text-sm text-muted-foreground">{selectedNotes.length} notes</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quantize" className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantize Strength</label>
                <Slider
                  value={quantizeStrength}
                  onValueChange={setQuantizeStrength}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{quantizeStrength[0]}%</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Humanize Amount</label>
                <Slider
                  value={humanizeAmount}
                  onValueChange={setHumanizeAmount}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{humanizeAmount[0]}%</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="velocity" className="px-4 pb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Velocity Range</label>
              <Slider
                value={velocityRange}
                onValueChange={setVelocityRange}
                min={1}
                max={127}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{velocityRange[0]}</span>
                <span>{velocityRange[1]}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timing" className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-3">
                  <h4 className="text-sm font-medium mb-2">Swing</h4>
                  <Slider defaultValue={[0]} min={-50} max={50} step={1} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <h4 className="text-sm font-medium mb-2">Gate Time</h4>
                  <Slider defaultValue={[90]} min={10} max={200} step={5} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <h4 className="text-sm font-medium mb-2">Micro Timing</h4>
                  <Slider defaultValue={[0]} min={-20} max={20} step={1} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Piano Roll Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Piano Keys */}
        <div className="w-16 bg-sidebar border-r border-sidebar-border">
          <div className="h-8 border-b border-sidebar-border" /> {/* Header spacer */}
          {Array.from({ length: totalNotes }, (_, i) => {
            const pitch = highestNote - i
            const isBlack = isBlackKey(pitch)
            return (
              <div
                key={pitch}
                className={`h-4 border-b border-sidebar-border/30 flex items-center justify-end pr-2 text-xs font-mono ${
                  isBlack ? "bg-sidebar-accent text-sidebar-accent-foreground" : "bg-sidebar text-sidebar-foreground"
                }`}
                style={{ height: noteHeight }}
              >
                {pitch % 12 === 0 && <span>{getNoteName(pitch)}</span>}
              </div>
            )
          })}
        </div>

        {/* Grid and Notes */}
        <div className="flex-1 overflow-auto">
          <div ref={pianoRollRef} className="relative" style={{ width: totalBeats * beatWidth }}>
            {/* Beat ruler */}
            <div className="h-8 border-b border-border bg-muted/20 relative">
              {Array.from({ length: totalBeats + 1 }, (_, i) => (
                <div key={i} className="absolute top-0 h-full flex items-center" style={{ left: i * beatWidth }}>
                  <div className="text-xs text-muted-foreground px-1">{i + 1}</div>
                  <div className="w-px h-4 bg-border absolute bottom-0" />
                </div>
              ))}
            </div>

            {/* Note grid */}
            <div className="relative" style={{ height: totalNotes * noteHeight }}>
              {/* Grid lines */}
              {Array.from({ length: totalNotes }, (_, i) => {
                const pitch = highestNote - i
                return (
                  <div
                    key={pitch}
                    className={`absolute left-0 right-0 border-b border-border/20 ${getNoteColor(pitch)}`}
                    style={{ top: i * noteHeight, height: noteHeight }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const beat = x / beatWidth
                      addNote(pitch, beat)
                    }}
                  />
                )
              })}

              {/* Vertical grid lines */}
              {Array.from({ length: totalBeats * 4 + 1 }, (_, i) => (
                <div
                  key={i}
                  className={`absolute top-0 bottom-0 ${i % 4 === 0 ? "w-px bg-border" : "w-px bg-border/30"}`}
                  style={{ left: (i * beatWidth) / 4 }}
                />
              ))}

              {/* Notes */}
              {notes.map((note) => {
                const y = (highestNote - note.pitch) * noteHeight
                const x = note.start * beatWidth
                const width = note.duration * beatWidth
                const isSelected = selectedNotes.includes(note.id)

                return (
                  <div
                    key={note.id}
                    className={`absolute rounded cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-primary ring-2 ring-primary ring-offset-1 ring-offset-background"
                        : "bg-accent hover:bg-accent/80"
                    }`}
                    style={{
                      left: x,
                      top: y + 1,
                      width: Math.max(width - 2, 8),
                      height: noteHeight - 2,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (selectedTool === "erase") {
                        deleteNote(note.id)
                      } else {
                        selectNote(note.id, e.ctrlKey || e.metaKey)
                      }
                    }}
                  >
                    <div className="p-1 h-full flex items-center">
                      <div className="text-xs text-white font-medium truncate">{getNoteName(note.pitch)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="h-16 border-t border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Selected: {selectedNotes.length} notes</span>
            {selectedNotes.length === 1 && (
              <>
                <span className="text-muted-foreground">
                  Note: {getNoteName(notes.find((n) => n.id === selectedNotes[0])?.pitch || 60)}
                </span>
                <span className="text-muted-foreground">
                  Velocity: {notes.find((n) => n.id === selectedNotes[0])?.velocity || 100}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Snap:</span>
            <Badge variant="secondary">{snapValue}</Badge>
            <span className="text-sm text-muted-foreground">Mode:</span>
            <Badge variant="secondary">{playbackMode}</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
