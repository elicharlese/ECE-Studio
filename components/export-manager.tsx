"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Download, Upload, Settings, CheckCircle, Clock, AlertCircle, Zap } from "lucide-react"

interface ExportJob {
  id: string
  name: string
  format: string
  quality: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  createdAt: string
  fileSize?: string
  downloadUrl?: string
}

export function ExportManager() {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: "export-1",
      name: "Cosmic Journey - Master",
      format: "WAV",
      quality: "24-bit/48kHz",
      status: "completed",
      progress: 100,
      createdAt: "2024-01-20T10:30:00Z",
      fileSize: "45.2 MB",
      downloadUrl: "#",
    },
    {
      id: "export-2",
      name: "Urban Beats - Stems",
      format: "WAV",
      quality: "24-bit/44.1kHz",
      status: "processing",
      progress: 65,
      createdAt: "2024-01-20T11:15:00Z",
    },
    {
      id: "export-3",
      name: "Deep House Vibes - MP3",
      format: "MP3",
      quality: "320kbps",
      status: "pending",
      progress: 0,
      createdAt: "2024-01-20T11:45:00Z",
    },
  ])

  const [exportSettings, setExportSettings] = useState({
    format: "wav",
    sampleRate: 48000,
    bitDepth: 24,
    quality: 320,
    normalize: true,
    fadeOut: false,
    includeMetadata: true,
  })

  const startExport = () => {
    const newJob: ExportJob = {
      id: `export-${Date.now()}`,
      name: "New Export",
      format: exportSettings.format.toUpperCase(),
      quality:
        exportSettings.format === "wav"
          ? `${exportSettings.bitDepth}-bit/${exportSettings.sampleRate / 1000}kHz`
          : `${exportSettings.quality}kbps`,
      status: "pending",
      progress: 0,
      createdAt: new Date().toISOString(),
    }

    setExportJobs((prev) => [newJob, ...prev])

    // Simulate export progress
    setTimeout(() => {
      setExportJobs((prev) =>
        prev.map((job) => (job.id === newJob.id ? { ...job, status: "processing" as const } : job)),
      )

      const progressInterval = setInterval(() => {
        setExportJobs((prev) => {
          const updatedJobs = prev.map((job) => {
            if (job.id === newJob.id && job.status === "processing") {
              const newProgress = Math.min(job.progress + Math.random() * 15, 100)
              if (newProgress >= 100) {
                return {
                  ...job,
                  status: "completed" as const,
                  progress: 100,
                  fileSize: "32.1 MB",
                  downloadUrl: "#",
                }
              }
              return { ...job, progress: newProgress }
            }
            return job
          })
          return updatedJobs
        })
      }, 500)

      setTimeout(() => clearInterval(progressInterval), 8000)
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "processing":
        return "bg-blue-500/20 text-blue-400"
      case "failed":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Download className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">Export Manager</h2>
              <p className="text-sm text-muted-foreground">Render and export your projects</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="export" className="space-y-6">
          <TabsList>
            <TabsTrigger value="export">Export Settings</TabsTrigger>
            <TabsTrigger value="queue">Export Queue</TabsTrigger>
            <TabsTrigger value="nft">NFT Export</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Export Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["wav", "mp3", "flac"].map((format) => (
                        <Button
                          key={format}
                          variant={exportSettings.format === format ? "default" : "outline"}
                          size="sm"
                          onClick={() => setExportSettings((prev) => ({ ...prev, format }))}
                          className="uppercase"
                        >
                          {format}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {exportSettings.format === "wav" && (
                    <>
                      <div className="space-y-2">
                        <Label>Sample Rate</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[44100, 48000].map((rate) => (
                            <Button
                              key={rate}
                              variant={exportSettings.sampleRate === rate ? "default" : "outline"}
                              size="sm"
                              onClick={() => setExportSettings((prev) => ({ ...prev, sampleRate: rate }))}
                            >
                              {rate / 1000}kHz
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Bit Depth</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[16, 24].map((depth) => (
                            <Button
                              key={depth}
                              variant={exportSettings.bitDepth === depth ? "default" : "outline"}
                              size="sm"
                              onClick={() => setExportSettings((prev) => ({ ...prev, bitDepth: depth }))}
                            >
                              {depth}-bit
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {exportSettings.format === "mp3" && (
                    <div className="space-y-2">
                      <Label>Quality: {exportSettings.quality}kbps</Label>
                      <Slider
                        value={[exportSettings.quality]}
                        onValueChange={(value) => setExportSettings((prev) => ({ ...prev, quality: value[0] }))}
                        min={128}
                        max={320}
                        step={32}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Processing Options</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportSettings.normalize}
                          onChange={(e) => setExportSettings((prev) => ({ ...prev, normalize: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Normalize audio</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportSettings.fadeOut}
                          onChange={(e) => setExportSettings((prev) => ({ ...prev, fadeOut: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Add fade out</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportSettings.includeMetadata}
                          onChange={(e) =>
                            setExportSettings((prev) => ({ ...prev, includeMetadata: e.target.checked }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Include metadata</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={startExport} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Start Export
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="queue" className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Export Queue</h3>

              <div className="space-y-4">
                {exportJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <h4 className="font-medium">{job.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {job.format} • {job.quality}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        {job.status === "completed" && job.downloadUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {job.status === "processing" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{Math.round(job.progress)}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                    )}

                    {job.status === "completed" && job.fileSize && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>File size: {job.fileSize}</span>
                        <span>Completed {new Date(job.createdAt).toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                ))}

                {exportJobs.length === 0 && (
                  <div className="text-center py-8">
                    <Download className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-semibold mb-2">No exports yet</h4>
                    <p className="text-sm text-muted-foreground">Start an export to see it here</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="nft" className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">NFT Export</h3>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Export your project as an NFT with blockchain ownership verification and royalty management.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Audio Quality</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        High Quality
                      </Button>
                      <Button variant="default" size="sm">
                        Lossless
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Royalty Percentage</Label>
                    <Slider value={[5]} min={0} max={20} step={1} className="w-full" />
                    <div className="text-xs text-muted-foreground">5% royalty on secondary sales</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    Export as NFT (0.1 SOL)
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
