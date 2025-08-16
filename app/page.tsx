"use client"

import { useState, Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { LoadingSkeleton, AudioTimelineLoading, KeyboardLoading } from "@/components/loading-skeleton"
import { AudioTimeline } from "@/components/audio-timeline"
import { Synthesizer } from "@/components/synthesizer"
import { DrumMachine } from "@/components/drum-machine"
import { EffectsRack } from "@/components/effects-rack"
import { PianoRoll } from "@/components/piano-roll"
import { InstrumentRack } from "@/components/instrument-rack"
import { SoundBrowser } from "@/components/sound-browser"
import { ProjectManager } from "@/components/project-manager"
import { ExportManager } from "@/components/export-manager"
import { CollaborationHub } from "@/components/collaboration-hub"
import { WalletConnection } from "@/components/wallet-connection"
import { BlockchainDashboard } from "@/components/blockchain-dashboard"
import { NFTMarketplace } from "@/components/nft-marketplace"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, Settings, Mic, Headphones } from "lucide-react"

export default function SoundStudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentView, setCurrentView] = useState("timeline")
  const [tempo, setTempo] = useState(120)

  return (
    <ErrorBoundary>
      <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SoundForge Studio
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>BPM: {tempo}</span>
              <span>•</span>
              <span>4/4</span>
              <span>•</span>
              <span>C Major</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ErrorBoundary fallback={<div className="w-32 h-8 bg-muted animate-pulse rounded" />}>
              <Suspense fallback={<LoadingSkeleton variant="card" className="w-32 h-8" />}>
                <WalletConnection />
              </Suspense>
            </ErrorBoundary>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
            <Tabs value={currentView} onValueChange={setCurrentView} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-4 bg-sidebar">
                <TabsTrigger value="timeline" className="text-xs">
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="instruments" className="text-xs">
                  Instruments
                </TabsTrigger>
                <TabsTrigger value="sounds" className="text-xs">
                  Sounds
                </TabsTrigger>
                <TabsTrigger value="blockchain" className="text-xs">
                  Blockchain
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="timeline" className="h-full m-0">
                  <div className="p-4 space-y-4 h-full overflow-y-auto">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSkeleton variant="list" count={3} />}>
                        <ProjectManager />
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                </TabsContent>

                <TabsContent value="instruments" className="h-full m-0">
                  <div className="p-4 space-y-4 h-full overflow-y-auto">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSkeleton variant="list" count={4} />}>
                        <InstrumentRack />
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                </TabsContent>

                <TabsContent value="sounds" className="h-full m-0">
                  <div className="p-4 h-full overflow-y-auto">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSkeleton variant="card" count={3} />}>
                        <SoundBrowser />
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                </TabsContent>

                <TabsContent value="blockchain" className="h-full m-0">
                  <div className="p-4 space-y-4 h-full overflow-y-auto">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSkeleton variant="card" count={2} />}>
                        <BlockchainDashboard />
                        <NFTMarketplace />
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Center Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Transport Controls */}
            <div className="flex items-center justify-between p-4 bg-card border-b border-border">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 bg-transparent">
                  <Square className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 bg-transparent">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 bg-transparent">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-destructive" />
                  <span className="text-sm">REC</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-3/4 h-full bg-primary rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  <span className="text-sm">Monitor</span>
                </div>
              </div>
            </div>

            {/* Main Timeline/Workspace */}
            <div className="flex-1 overflow-hidden">
              <ErrorBoundary>
                <Suspense fallback={<AudioTimelineLoading />}>
                  <AudioTimeline />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>

          {/* Right Sidebar - Instruments & Effects */}
          <div className="w-96 bg-sidebar border-l border-sidebar-border overflow-y-auto">
            <Tabs defaultValue="synth" className="h-full">
              <TabsList className="grid w-full grid-cols-3 bg-sidebar">
                <TabsTrigger value="synth" className="text-xs">
                  Synth
                </TabsTrigger>
                <TabsTrigger value="drums" className="text-xs">
                  Drums
                </TabsTrigger>
                <TabsTrigger value="fx" className="text-xs">
                  Effects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="synth" className="p-4">
                <Card className="bg-card">
                  <CardContent className="p-4">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSkeleton variant="card" />}>
                        <Synthesizer />
                      </Suspense>
                    </ErrorBoundary>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="drums" className="p-4">
                <Card className="bg-card">
                  <CardContent className="p-4">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSkeleton variant="card" />}>
                        <DrumMachine />
                      </Suspense>
                    </ErrorBoundary>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fx" className="p-4">
                <Card className="bg-card">
                  <CardContent className="p-4">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSkeleton variant="card" />}>
                        <EffectsRack />
                      </Suspense>
                    </ErrorBoundary>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Bottom Panel - Piano Roll & Additional Tools */}
        <div className="h-80 border-t border-border bg-card">
          <Tabs defaultValue="piano" className="h-full">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <TabsList className="bg-sidebar">
                <TabsTrigger value="piano" className="text-xs">
                  Piano Roll
                </TabsTrigger>
                <TabsTrigger value="export" className="text-xs">
                  Export
                </TabsTrigger>
                <TabsTrigger value="collab" className="text-xs">
                  Collaborate
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Quantize
                </Button>
                <Button variant="outline" size="sm">
                  Humanize
                </Button>
              </div>
            </div>

            <TabsContent value="piano" className="h-full m-0 p-4">
              <ErrorBoundary>
                <Suspense fallback={<KeyboardLoading />}>
                  <PianoRoll />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="export" className="h-full m-0 p-4">
              <ErrorBoundary>
                <Suspense fallback={<LoadingSkeleton variant="card" />}>
                  <ExportManager />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="collab" className="h-full m-0 p-4">
              <ErrorBoundary>
                <Suspense fallback={<LoadingSkeleton variant="card" />}>
                  <CollaborationHub />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>

        {/* Performance Monitor */}
        <PerformanceMonitor />
      </div>
    </ErrorBoundary>
  )
}
