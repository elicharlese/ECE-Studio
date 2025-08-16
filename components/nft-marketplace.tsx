"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, ShoppingCart, Tag, TrendingUp, Music, User } from "lucide-react"

interface NFTItem {
  id: string
  name: string
  artist: string
  price: number
  image: string
  duration: string
  genre: string
  isPlaying: boolean
  owner: string
  royalty: number
}

export function NFTMarketplace() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const mockNFTs: NFTItem[] = [
    {
      id: "1",
      name: "Cosmic Waves",
      artist: "SynthMaster",
      price: 2.5,
      image: "/placeholder.svg?height=200&width=200",
      duration: "3:42",
      genre: "Electronic",
      isPlaying: false,
      owner: "7xKX...gAsU",
      royalty: 5,
    },
    {
      id: "2",
      name: "Digital Dreams",
      artist: "ByteBeats",
      price: 1.8,
      image: "/placeholder.svg?height=200&width=200",
      duration: "4:15",
      genre: "Ambient",
      isPlaying: false,
      owner: "9mNp...kLqW",
      royalty: 7,
    },
    {
      id: "3",
      name: "Neon Nights",
      artist: "CyberSound",
      price: 3.2,
      image: "/placeholder.svg?height=200&width=200",
      duration: "2:58",
      genre: "Synthwave",
      isPlaying: false,
      owner: "4hTr...vBnM",
      royalty: 10,
    },
    {
      id: "4",
      name: "Quantum Bass",
      artist: "DeepFreq",
      price: 4.1,
      image: "/placeholder.svg?height=200&width=200",
      duration: "5:23",
      genre: "Bass",
      isPlaying: false,
      owner: "2kWs...pQrT",
      royalty: 8,
    },
  ]

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id)
  }

  const filteredNFTs = mockNFTs.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">NFT Marketplace</h2>
              <p className="text-sm text-muted-foreground">Discover and trade unique music NFTs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="relative">
                    <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => togglePlay(nft.id)}
                        className="rounded-full w-12 h-12"
                      >
                        {playingId === nft.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {nft.genre}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold truncate">{nft.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{nft.artist}</span>
                        <span>•</span>
                        <span>{nft.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">{nft.price} SOL</div>
                      <div className="text-xs text-muted-foreground">{nft.royalty}% royalty</div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Tag className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">Owner: {nft.owner}</div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-nfts" className="space-y-6">
            <Card className="p-8 text-center bg-card/30 backdrop-blur-sm border-border/50">
              <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No NFTs Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You don't own any music NFTs yet. Start by minting your first track!
              </p>
              <Button>
                <Tag className="w-4 h-4 mr-2" />
                Mint Your First NFT
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNFTs
                .sort((a, b) => b.price - a.price)
                .slice(0, 6)
                .map((nft, index) => (
                  <Card key={nft.id} className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{nft.name}</h4>
                        <p className="text-sm text-muted-foreground">{nft.artist}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{nft.price} SOL</div>
                        <div className="flex items-center gap-1 text-xs text-green-500">
                          <TrendingUp className="w-3 h-3" />
                          +12%
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
