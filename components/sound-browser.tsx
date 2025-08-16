"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Play,
  Pause,
  Download,
  Heart,
  Star,
  Music,
  Zap,
  Waves,
  Mic,
  Filter,
  Database,
  Sparkles,
} from "lucide-react"

interface SoundPack {
  id: string
  name: string
  artist: string
  category: string
  tags: string[]
  samples: number
  rating: number
  price: number
  image: string
  isPlaying: boolean
  isFavorite: boolean
}

export function SoundBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [playingId, setPlayingId] = useState<string | null>(null)

  const soundPacks: SoundPack[] = [
    {
      id: "pack-1",
      name: "Cosmic Synthwave",
      artist: "NeonBeats",
      category: "synth",
      tags: ["synthwave", "retro", "80s", "neon"],
      samples: 24,
      rating: 4.8,
      price: 0.5,
      image: "/placeholder.svg?height=200&width=200",
      isPlaying: false,
      isFavorite: true,
    },
    {
      id: "pack-2",
      name: "Deep House Essentials",
      artist: "GrooveFactory",
      category: "house",
      tags: ["deep house", "electronic", "club", "bass"],
      samples: 32,
      rating: 4.6,
      price: 0.8,
      image: "/placeholder.svg?height=200&width=200",
      isPlaying: false,
      isFavorite: false,
    },
    {
      id: "pack-3",
      name: "Trap Drums Vol.3",
      artist: "BeatMachine",
      category: "drums",
      tags: ["trap", "hip hop", "drums", "808"],
      samples: 18,
      rating: 4.9,
      price: 0.3,
      image: "/placeholder.svg?height=200&width=200",
      isPlaying: false,
      isFavorite: true,
    },
    {
      id: "pack-4",
      name: "Ambient Textures",
      artist: "SoundScape",
      category: "ambient",
      tags: ["ambient", "atmospheric", "pad", "texture"],
      samples: 16,
      rating: 4.7,
      price: 0.6,
      image: "/placeholder.svg?height=200&width=200",
      isPlaying: false,
      isFavorite: false,
    },
    {
      id: "pack-5",
      name: "Future Bass Leads",
      artist: "ElectroWave",
      category: "bass",
      tags: ["future bass", "edm", "lead", "melodic"],
      samples: 20,
      rating: 4.5,
      price: 0.7,
      image: "/placeholder.svg?height=200&width=200",
      isPlaying: false,
      isFavorite: false,
    },
    {
      id: "pack-6",
      name: "Vocal Chops",
      artist: "VocalLab",
      category: "vocal",
      tags: ["vocal", "chops", "processed", "human"],
      samples: 28,
      rating: 4.4,
      price: 0.9,
      image: "/placeholder.svg?height=200&width=200",
      isPlaying: false,
      isFavorite: true,
    },
  ]

  const categories = [
    { id: "all", name: "All", icon: Music },
    { id: "synth", name: "Synth", icon: Zap },
    { id: "drums", name: "Drums", icon: Music },
    { id: "bass", name: "Bass", icon: Waves },
    { id: "vocal", name: "Vocal", icon: Mic },
    { id: "ambient", name: "Ambient", icon: Filter },
  ]

  const filteredPacks = soundPacks.filter((pack) => {
    const matchesSearch =
      pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || pack.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id)
  }

  const toggleFavorite = (id: string) => {
    // In a real app, this would update the backend
    console.log(`Toggle favorite for ${id}`)
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Search className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">Sound Browser</h2>
              <p className="text-sm text-muted-foreground">Discover and download premium sound packs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Database className="w-4 h-4 mr-1" />
              Full Library
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-1" />
              AI Generate
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sounds, artists, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {category.name}
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPacks.map((pack) => (
                <Card
                  key={pack.id}
                  className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="relative">
                    <img src={pack.image || "/placeholder.svg"} alt={pack.name} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => togglePlay(pack.id)}
                        className="rounded-full w-12 h-12"
                      >
                        {playingId === pack.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(pack.id)}
                      className={`absolute top-2 right-2 w-8 h-8 p-0 ${
                        pack.isFavorite ? "text-red-500" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${pack.isFavorite ? "fill-current" : ""}`} />
                    </Button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold truncate">{pack.name}</h3>
                      <p className="text-sm text-muted-foreground">{pack.artist}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{pack.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{pack.samples} samples</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {pack.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-lg font-bold text-primary">{pack.price} SOL</div>
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Buy
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredPacks.length === 0 && (
              <Card className="p-8 text-center bg-card/30 backdrop-blur-sm border-border/50">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search terms or browse different categories
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
