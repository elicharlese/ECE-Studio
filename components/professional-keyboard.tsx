"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Piano, Mic, RotateCcw, Zap, Music, Headphones } from "lucide-react"

interface KeyboardNote {
  note: number
  velocity: number
  timestamp: number
  channel: number
}

interface ChordSuggestion {
  name: string
  notes: number[]
  quality: string
}

export function ProfessionalKeyboard() {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set())
  const [recordedNotes, setRecordedNotes] = useState<KeyboardNote[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [velocity, setVelocity] = useState([100])
  const [octave, setOctave] = useState([4])
  const [selectedScale, setSelectedScale] = useState("major")
  const [rootNote, setRootNote] = useState(0) // C
  const [sustainPedal, setSustainPedal] = useState(false)
  const [chordMode, setChordMode] = useState(false)
  const [detectedChord, setDetectedChord] = useState<ChordSuggestion | null>(null)

  const keyboardRef = useRef<HTMLDivElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Note names and scales
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  const scales = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    pentatonic: [0, 2, 4, 7, 9],
    blues: [0, 3, 5, 6, 7, 10],
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  }

  // Chord detection patterns
  const chordPatterns = [
    { name: "Major", pattern: [0, 4, 7], quality: "major" },
    { name: "Minor", pattern: [0, 3, 7], quality: "minor" },
    { name: "Diminished", pattern: [0, 3, 6], quality: "diminished" },
    { name: "Augmented", pattern: [0, 4, 8], quality: "augmented" },
    { name: "Major 7th", pattern: [0, 4, 7, 11], quality: "major7" },
    { name: "Minor 7th", pattern: [0, 3, 7, 10], quality: "minor7" },
    { name: "Dominant 7th", pattern: [0, 4, 7, 10], quality: "dominant7" },
  ]

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  // Detect chords from active notes
  useEffect(() => {
    if (activeNotes.size >= 3) {
      const notesArray = Array.from(activeNotes).sort((a, b) => a - b)
      const intervals = notesArray.map((note) => note % 12)
      const uniqueIntervals = [...new Set(intervals)].sort((a, b) => a - b)

      for (const chord of chordPatterns) {
        if (chord.pattern.length === uniqueIntervals.length) {
          const normalized = uniqueIntervals.map((interval) => (interval - uniqueIntervals[0] + 12) % 12)
          if (JSON.stringify(normalized) === JSON.stringify(chord.pattern)) {
            const rootNoteName = noteNames[uniqueIntervals[0]]
            setDetectedChord({
              name: `${rootNoteName} ${chord.name}`,
              notes: notesArray,
              quality: chord.quality,
            })
            return
          }
        }
      }
    }
    setDetectedChord(null)
  }, [activeNotes])

  const playNote = useCallback(
    (note: number, vel: number = velocity[0]) => {
      if (!audioContextRef.current) return

      const frequency = 440 * Math.pow(2, (note - 69) / 12)
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      oscillator.type = "sine"

      const normalizedVel = vel / 127
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      gainNode.gain.linearRampToValueAtTime(normalizedVel * 0.3, audioContextRef.current.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 1)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + 1)

      console.log(`[v0] Playing note ${note} (${noteNames[note % 12]}) with velocity ${vel}`)
    },
    [velocity],
  )

  const handleNoteOn = useCallback(
    (note: number) => {
      setActiveNotes((prev) => new Set([...prev, note]))
      playNote(note)

      if (isRecording) {
        const recordedNote: KeyboardNote = {
          note,
          velocity: velocity[0],
          timestamp: Date.now(),
          channel: 1,
        }
        setRecordedNotes((prev) => [...prev, recordedNote])
      }
    },
    [playNote, isRecording, velocity],
  )

  const handleNoteOff = useCallback(
    (note: number) => {
      if (!sustainPedal) {
        setActiveNotes((prev) => {
          const newSet = new Set(prev)
          newSet.delete(note)
          return newSet
        })
      }
    },
    [sustainPedal],
  )

  const isNoteInScale = (note: number) => {
    const scaleNotes = scales[selectedScale as keyof typeof scales]
    const noteInScale = (note - rootNote + 12) % 12
    return scaleNotes.includes(noteInScale)
  }

  const isBlackKey = (note: number) => [1, 3, 6, 8, 10].includes(note % 12)

  const renderKeyboard = () => {
    const startOctave = Math.max(0, octave[0] - 1)
    const endOctave = Math.min(8, octave[0] + 2)
    const keys = []

    for (let oct = startOctave; oct <= endOctave; oct++) {
      for (let note = 0; note < 12; note++) {
        const midiNote = oct * 12 + note
        if (midiNote > 127) break

        const isBlack = isBlackKey(note)
        const isActive = activeNotes.has(midiNote)
        const inScale = isNoteInScale(midiNote)
        const noteName = noteNames[note]

        if (isBlack) {
          keys.push(
            <button
              key={midiNote}
              className={`absolute w-8 h-20 rounded-b-md border border-border transition-all duration-75 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg transform translate-y-1"
                  : inScale
                    ? "bg-accent hover:bg-accent/80 text-accent-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
              style={{
                left: `${(oct - startOctave) * 168 + ([1, 3, 6, 8, 10].indexOf(note) + 1) * 24 - 12}px`,
                zIndex: 2,
              }}
              onMouseDown={() => handleNoteOn(midiNote)}
              onMouseUp={() => handleNoteOff(midiNote)}
              onMouseLeave={() => handleNoteOff(midiNote)}
            >
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-mono">
                {oct === octave[0] && noteName}
              </div>
            </button>,
          )
        }
      }
    }

    // White keys
    for (let oct = startOctave; oct <= endOctave; oct++) {
      const whiteNotes = [0, 2, 4, 5, 7, 9, 11]
      whiteNotes.forEach((note, index) => {
        const midiNote = oct * 12 + note
        if (midiNote > 127) return

        const isActive = activeNotes.has(midiNote)
        const inScale = isNoteInScale(midiNote)
        const noteName = noteNames[note]

        keys.push(
          <button
            key={midiNote}
            className={`absolute w-6 h-32 rounded-b-md border border-border transition-all duration-75 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-lg transform translate-y-1"
                : inScale
                  ? "bg-card hover:bg-accent text-card-foreground"
                  : "bg-background hover:bg-muted text-foreground"
            }`}
            style={{
              left: `${(oct - startOctave) * 168 + index * 24}px`,
              zIndex: 1,
            }}
            onMouseDown={() => handleNoteOn(midiNote)}
            onMouseUp={() => handleNoteOff(midiNote)}
            onMouseLeave={() => handleNoteOff(midiNote)}
          >
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-mono">
              {oct === octave[0] && noteName}
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
              {oct === octave[0] && oct}
            </div>
          </button>,
        )
      })
    }

    return keys
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Piano className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-sans">Professional Keyboard</h2>
              <p className="text-xs text-muted-foreground">Advanced MIDI Controller</p>
            </div>
          </div>

          {detectedChord && (
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{detectedChord.name}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="w-4 h-4 mr-1" />
              {isRecording ? "Stop" : "Record"}
            </Button>
            {recordedNotes.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setRecordedNotes([])}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <Badge variant="secondary">{recordedNotes.length} notes recorded</Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-border bg-muted/20">
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="scale">Scale & Theory</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="midi">MIDI</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Velocity</label>
                <Slider value={velocity} onValueChange={setVelocity} min={1} max={127} step={1} className="w-full" />
                <span className="text-xs text-muted-foreground">{velocity[0]}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Octave</label>
                <Slider value={octave} onValueChange={setOctave} min={0} max={8} step={1} className="w-full" />
                <span className="text-xs text-muted-foreground">C{octave[0]}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sustain Pedal</label>
                <Button
                  variant={sustainPedal ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSustainPedal(!sustainPedal)}
                  className="w-full"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  {sustainPedal ? "On" : "Off"}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Chord Mode</label>
                <Button
                  variant={chordMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChordMode(!chordMode)}
                  className="w-full"
                >
                  <Music className="w-4 h-4 mr-1" />
                  {chordMode ? "On" : "Off"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scale" className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Root Note</label>
                <select
                  value={rootNote}
                  onChange={(e) => setRootNote(Number.parseInt(e.target.value))}
                  className="w-full p-2 rounded-md border border-border bg-background"
                >
                  {noteNames.map((note, index) => (
                    <option key={index} value={index}>
                      {note}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Scale</label>
                <select
                  value={selectedScale}
                  onChange={(e) => setSelectedScale(e.target.value)}
                  className="w-full p-2 rounded-md border border-border bg-background"
                >
                  {Object.keys(scales).map((scale) => (
                    <option key={scale} value={scale}>
                      {scale.charAt(0).toUpperCase() + scale.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Active Notes</label>
                <div className="text-sm text-muted-foreground">
                  {activeNotes.size > 0
                    ? Array.from(activeNotes)
                        .map((note) => noteNames[note % 12])
                        .join(", ")
                    : "None"}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Reverb</h3>
                  <Slider defaultValue={[30]} min={0} max={100} step={1} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Chorus</h3>
                  <Slider defaultValue={[20]} min={0} max={100} step={1} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="midi" className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">MIDI Channel</label>
                <select className="w-full p-2 rounded-md border border-border bg-background">
                  {Array.from({ length: 16 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      Channel {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Program Change</label>
                <select className="w-full p-2 rounded-md border border-border bg-background">
                  <option value="1">Acoustic Grand Piano</option>
                  <option value="2">Bright Acoustic Piano</option>
                  <option value="3">Electric Grand Piano</option>
                  <option value="4">Honky-tonk Piano</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">MIDI Output</label>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Headphones className="w-4 h-4 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Keyboard */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-x-auto">
        <div ref={keyboardRef} className="relative" style={{ width: `${(8 - 0 + 1) * 168}px`, height: "140px" }}>
          {renderKeyboard()}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-12 border-t border-border bg-card px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Active: {activeNotes.size} notes</span>
          <span className="text-muted-foreground">
            Scale: {noteNames[rootNote]} {selectedScale}
          </span>
          {detectedChord && <Badge variant="secondary">{detectedChord.name}</Badge>}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Octave: C{octave[0]}</span>
          <span>•</span>
          <span>Velocity: {velocity[0]}</span>
        </div>
      </div>
    </div>
  )
}
