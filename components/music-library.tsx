"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Play,
  Pause,
  Download,
  Heart,
  Star,
  Music,
  Zap,
  Filter,
  Folder,
  Sparkles,
  Database,
  Upload,
  BarChart3,
  Volume2,
} from "lucide-react"

interface Sample {
  id: string
  name: string
  artist: string
  category: string
  subcategory: string
  tags: string[]
  bpm: number
  key: string
  duration: number
  rating: number
  price: number
  downloads: number
  waveform: number[]
  isPlaying: boolean
  isFavorite: boolean
  isOwned: boolean
  license: "royalty-free" | "exclusive" | "lease"
  blockchain_hash?: string
}

interface Preset {
  id: string
  name: string
  instrument: string
  category: string
  tags: string[]
  rating: number
  price: number
  isOwned: boolean
  parameters: Record<string, number>
}

interface ProjectTemplate {
  id: string
  name: string
  genre: string
  bpm: number
  key: string
  tracks: number
  description: string
  rating: number
  price: number
  isOwned: boolean
  preview_url: string
}

export function MusicLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("samples")
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "rating" | "price">("newest")
  const [filterBPM, setFilterBPM] = useState([60, 180])
  const [filterKey, setFilterKey] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [samples, setSamples] = useState<Sample[]>([
    {
      id: "sample-1",
      name: "Deep Bass Loop",
      artist: "BassLab",
      category: "loops",
      subcategory: "bass",
      tags: ["deep", "bass", "loop", "electronic"],
      bpm: 128,
      key: "Am",
      duration: 8.0,
      rating: 4.8,
      price: 0.2,
      downloads: 1250,
      waveform: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
      isPlaying: false,
      isFavorite: true,
      isOwned: false,
      license: "royalty-free",
      blockchain_hash: "0x1a2b3c4d...",
    },
    {
      id: "sample-2",
      name: "Trap Snare Hit",
      artist: "DrumKing",
      category: "one-shots",
      subcategory: "drums",
      tags: ["trap", "snare", "punchy", "hip-hop"],
      bpm: 0,
      key: "C",
      duration: 0.5,
      rating: 4.9,
      price: 0.05,
      downloads: 3200,
      waveform: Array.from({ length: 20 }, () => Math.random() * 1.0),
      isPlaying: false,
      isFavorite: false,
      isOwned: true,
      license: "exclusive",
      blockchain_hash: "0x5e6f7g8h...",
    },
    {
      id: "sample-3",
      name: "Ethereal Pad",
      artist: "SynthMaster",
      category: "stems",
      subcategory: "synth",
      tags: ["ethereal", "pad", "ambient", "atmospheric"],
      bpm: 120,
      key: "Dm",
      duration: 16.0,
      rating: 4.7,
      price: 0.4,
      downloads: 890,
      waveform: Array.from({ length: 200 }, () => Math.random() * 0.6 + 0.2),
      isPlaying: false,
      isFavorite: true,
      isOwned: false,
      license: "lease",
    },
  ])

  const [presets, setPresets] = useState<Preset[]>([
    {
      id: "preset-1",
      name: "Vintage Lead",
      instrument: "synthesizer",
      category: "lead",
      tags: ["vintage", "analog", "warm", "lead"],
      rating: 4.6,
      price: 0.1,
      isOwned: true,
      parameters: { cutoff: 75, resonance: 30, attack: 10, decay: 40, sustain: 60, release: 50 },
    },
    {
      id: "preset-2",
      name: "Deep House Bass",
      instrument: "bass",
      category: "bass",
      tags: ["deep", "house", "sub", "electronic"],
      rating: 4.8,
      price: 0.15,
      isOwned: false,
      parameters: { cutoff: 45, resonance: 60, attack: 5, decay: 30, sustain: 80, release: 40 },
    },
  ])

  const [templates, setTemplates] = useState<ProjectTemplate[]>([
    {
      id: "template-1",
      name: "Deep House Starter",
      genre: "Deep House",
      bpm: 124,
      key: "Am",
      tracks: 8,
      description: "Professional deep house template with bass, drums, and melodic elements",
      rating: 4.7,
      price: 1.5,
      isOwned: false,
      preview_url: "/preview1.mp3",
    },
    {
      id: "template-2",
      name: "Trap Banger",
      genre: "Trap",
      bpm: 140,
      key: "Gm",
      tracks: 12,
      description: "Hard-hitting trap template with 808s, hi-hats, and melodic hooks",
      rating: 4.9,
      price: 2.0,
      isOwned: true,
      preview_url: "/preview2.mp3",
    },
  ])

  const categories = [
    { id: "samples", name: "Samples", icon: Music, count: samples.length },
    { id: "presets", name: "Presets", icon: Zap, count: presets.length },
    { id: "templates", name: "Templates", icon: Folder, count: templates.length },
    { id: "ai-generated", name: "AI Generated", icon: Sparkles, count: 0 },
    { id: "my-library", name: "My Library", icon: Database, count: 0 },
  ]

  const subcategories = {
    samples: [
      { id: "all", name: "All" },
      { id: "loops", name: "Loops" },
      { id: "one-shots", name: "One-shots" },
      { id: "stems", name: "Stems" },
      { id: "vocals", name: "Vocals" },
    ],
    presets: [
      { id: "all", name: "All" },
      { id: "lead", name: "Lead" },
      { id: "bass", name: "Bass" },
      { id: "pad", name: "Pad" },
      { id: "pluck", name: "Pluck" },
      { id: "fx", name: "Effects" },
    ],
    templates: [
      { id: "all", name: "All" },
      { id: "electronic", name: "Electronic" },
      { id: "hip-hop", name: "Hip-Hop" },
      { id: "house", name: "House" },
      { id: "techno", name: "Techno" },
      { id: "ambient", name: "Ambient" },
    ],
  }

  const keys = ["all", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

  const filteredContent = () => {
    let content: any[] = []

    switch (selectedCategory) {
      case "samples":
        content = samples
        break
      case "presets":
        content = presets
        break
      case "templates":
        content = templates
        break
      default:
        content = samples
    }

    return content
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesSubcategory =
          selectedSubcategory === "all" ||
          item.category === selectedSubcategory ||
          item.subcategory === selectedSubcategory ||
          item.genre?.toLowerCase() === selectedSubcategory

        const matchesBPM =
          selectedCategory !== "samples" || (item.bpm >= filterBPM[0] && item.bpm <= filterBPM[1]) || item.bpm === 0

        const matchesKey = filterKey === "all" || item.key === filterKey

        return matchesSearch && matchesSubcategory && matchesBPM && matchesKey
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "popular":
            return (b.downloads || 0) - (a.downloads || 0)
          case "rating":
            return b.rating - a.rating
          case "price":
            return a.price - b.price
          default:
            return 0
        }
      })
  }

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id)
    console.log(`[v0] ${playingId === id ? "Stopped" : "Playing"} sample: ${id}`)
  }

  const generateAISample = async () => {
    console.log(`[v0] Generating AI sample with prompt: ${searchQuery}`)
    // Simulate AI generation
    const newSample: Sample = {
      id: `ai-${Date.now()}`,
      name: `AI Generated: ${searchQuery || "Untitled"}`,
      artist: "AI Studio",
      category: "loops",
      subcategory: "synth",
      tags: ["ai-generated", "synthetic", "unique"],
      bpm: 120,
      key: "C",
      duration: 8.0,
      rating: 0,
      price: 0.3,
      downloads: 0,
      waveform: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
      isPlaying: false,
      isFavorite: false,
      isOwned: true,
      license: "royalty-free",
    }
    setSamples((prev) => [newSample, ...prev])
  }

  const purchaseItem = (id: string, price: number) => {
    console.log(`[v0] Purchasing item ${id} for ${price} SOL`)
    // Update ownership status
    setSamples((prev) => prev.map((sample) => (sample.id === id ? { ...sample, isOwned: true } : sample)))
    setPresets((prev) => prev.map((preset) => (preset.id === id ? { ...preset, isOwned: true } : preset)))
    setTemplates((prev) => prev.map((template) => (template.id === id ? { ...template, isOwned: true } : template)))
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">Music Library</h2>
              <p className="text-sm text-muted-foreground">Comprehensive collection of samples, presets & templates</p>
            </div>
          </div>

          {/* AI Generation */}
          {selectedCategory === "ai-generated" && (
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-primary">AI Sample Generator</div>
                    <div className="text-xs text-muted-foreground">Describe the sound you want</div>
                  </div>
                  <Button size="sm" onClick={generateAISample} disabled={!searchQuery}>
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-1" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Navigation */}
      <div className="p-6 border-b border-border bg-muted/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={
                selectedCategory === "ai-generated" ? "Describe the sound you want to generate..." : "Search library..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-2 rounded-md border border-border bg-background text-sm"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price">Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">BPM Range</label>
                  <Slider
                    value={filterBPM}
                    onValueChange={setFilterBPM}
                    min={60}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{filterBPM[0]}</span>
                    <span>{filterBPM[1]}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Key</label>
                  <select
                    value={filterKey}
                    onChange={(e) => setFilterKey(e.target.value)}
                    className="w-full p-2 rounded-md border border-border bg-background text-sm"
                  >
                    {keys.map((key) => (
                      <option key={key} value={key}>
                        {key === "all" ? "All Keys" : key}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">License Type</label>
                  <select className="w-full p-2 rounded-md border border-border bg-background text-sm">
                    <option value="all">All Licenses</option>
                    <option value="royalty-free">Royalty Free</option>
                    <option value="exclusive">Exclusive</option>
                    <option value="lease">Lease</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Slider defaultValue={[0, 5]} min={0} max={10} step={0.1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Free</span>
                    <span>10 SOL</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Categories Sidebar */}
        <div className="w-64 bg-sidebar border-r border-sidebar-border">
          <div className="p-4">
            <h3 className="text-sm font-medium text-sidebar-foreground mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setSelectedSubcategory("all")
                    }}
                    className="w-full justify-start"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name}
                    <Badge variant="secondary" className="ml-auto">
                      {category.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>

            {/* Subcategories */}
            {subcategories[selectedCategory as keyof typeof subcategories] && (
              <div className="mt-6">
                <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  {selectedCategory}
                </h4>
                <div className="space-y-1">
                  {subcategories[selectedCategory as keyof typeof subcategories].map((sub) => (
                    <Button
                      key={sub.id}
                      variant={selectedSubcategory === sub.id ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className="w-full justify-start text-xs"
                    >
                      {sub.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"
            }
          >
            {filteredContent().map((item) => (
              <Card
                key={item.id}
                className={`overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 ${
                  viewMode === "list" ? "flex items-center p-4" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    {/* Grid View */}
                    <div className="relative">
                      <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        {item.waveform ? (
                          <div className="flex items-end gap-px h-16 w-24">
                            {item.waveform.slice(0, 24).map((amp: number, i: number) => (
                              <div key={i} className="bg-primary/60 w-1" style={{ height: `${amp * 100}%` }} />
                            ))}
                          </div>
                        ) : (
                          <Music className="w-8 h-8 text-primary/60" />
                        )}
                      </div>

                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => togglePlay(item.id)}
                          className="rounded-full w-10 h-10"
                        >
                          {playingId === item.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>

                      {item.isOwned && <Badge className="absolute top-2 left-2 bg-green-500">Owned</Badge>}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 w-8 h-8 p-0 text-white/70 hover:text-red-500"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-2">
                      <div>
                        <h3 className="font-medium truncate text-sm">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">{item.artist || item.instrument || item.genre}</p>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{item.rating}</span>
                        </div>
                        {item.bpm > 0 && (
                          <>
                            <span>•</span>
                            <span>{item.bpm} BPM</span>
                          </>
                        )}
                        {item.key && (
                          <>
                            <span>•</span>
                            <span>{item.key}</span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {item.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-sm font-bold text-primary">
                          {item.price === 0 ? "Free" : `${item.price} SOL`}
                        </div>
                        <Button size="sm" onClick={() => purchaseItem(item.id, item.price)} disabled={item.isOwned}>
                          {item.isOwned ? (
                            <>
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </>
                          ) : (
                            <>
                              <Download className="w-3 h-3 mr-1" />
                              Buy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* List View */
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-primary/60" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.artist || item.instrument || item.genre}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{item.rating}</span>
                        {item.bpm > 0 && <span>• {item.bpm} BPM</span>}
                        {item.key && <span>• {item.key}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => togglePlay(item.id)} className="w-8 h-8 p-0">
                        {playingId === item.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>

                      <div className="text-sm font-bold text-primary min-w-16 text-right">
                        {item.price === 0 ? "Free" : `${item.price} SOL`}
                      </div>

                      <Button size="sm" onClick={() => purchaseItem(item.id, item.price)} disabled={item.isOwned}>
                        {item.isOwned ? "Download" : "Buy"}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {filteredContent().length === 0 && (
            <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border-border/50">
              <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Content Found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedCategory === "ai-generated"
                  ? "Enter a description above to generate AI samples"
                  : "Try adjusting your search terms or filters"}
              </p>
              {selectedCategory === "ai-generated" && (
                <Button onClick={generateAISample} disabled={!searchQuery}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Sample
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-12 border-t border-border bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{filteredContent().length} items</span>
          <span>•</span>
          <span>Category: {selectedCategory}</span>
          {selectedSubcategory !== "all" && (
            <>
              <span>•</span>
              <span>Filter: {selectedSubcategory}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>View: {viewMode}</span>
          <span>•</span>
          <span>Sort: {sortBy}</span>
          {playingId && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>Playing</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
