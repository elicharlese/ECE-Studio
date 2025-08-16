"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Upload, Music, Zap, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MintingState {
  step: number
  progress: number
  status: "idle" | "uploading" | "minting" | "complete" | "error"
  txHash?: string
}

export function NFTMinting() {
  const [mintingState, setMintingState] = useState<MintingState>({
    step: 1,
    progress: 0,
    status: "idle",
  })

  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    royalty: 5,
    collection: "SoundChain Studio",
  })

  const { toast } = useToast()

  const startMinting = async () => {
    if (!metadata.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your NFT",
        variant: "destructive",
      })
      return
    }

    setMintingState({ step: 1, progress: 0, status: "uploading" })

    // Simulate minting process
    const steps = [
      { name: "Uploading audio to IPFS", duration: 2000 },
      { name: "Uploading metadata to IPFS", duration: 1500 },
      { name: "Creating NFT on Solana", duration: 3000 },
      { name: "Confirming transaction", duration: 2000 },
    ]

    for (let i = 0; i < steps.length; i++) {
      setMintingState((prev) => ({ ...prev, step: i + 1, progress: (i / steps.length) * 100 }))
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration))
    }

    setMintingState({
      step: 4,
      progress: 100,
      status: "complete",
      txHash: "5xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    })

    toast({
      title: "NFT Minted Successfully!",
      description: "Your music NFT has been created on the Solana blockchain",
    })
  }

  const resetMinting = () => {
    setMintingState({ step: 1, progress: 0, status: "idle" })
    setMetadata({ name: "", description: "", royalty: 5, collection: "SoundChain Studio" })
  }

  if (mintingState.status === "complete") {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">NFT Minted Successfully!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your music NFT "{metadata.name}" has been created on the Solana blockchain
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Transaction Hash:</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {mintingState.txHash?.slice(0, 8)}...{mintingState.txHash?.slice(-8)}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Royalty:</span>
              <span>{metadata.royalty}%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              View on Explorer
            </Button>
            <Button onClick={resetMinting} className="flex-1">
              Mint Another
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Mint Music NFT</h3>
            <p className="text-sm text-muted-foreground">Create a unique NFT from your music track</p>
          </div>
        </div>

        {/* Minting Progress */}
        {mintingState.status !== "idle" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Step {mintingState.step} of 4</span>
              <span className="font-medium">{Math.round(mintingState.progress)}%</span>
            </div>
            <Progress value={mintingState.progress} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {mintingState.step === 1 && "Uploading audio to IPFS..."}
              {mintingState.step === 2 && "Uploading metadata to IPFS..."}
              {mintingState.step === 3 && "Creating NFT on Solana..."}
              {mintingState.step === 4 && "Confirming transaction..."}
            </div>
          </div>
        )}

        {/* Metadata Form */}
        {mintingState.status === "idle" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nft-name">NFT Name</Label>
              <Input
                id="nft-name"
                placeholder="Enter NFT name"
                value={metadata.name}
                onChange={(e) => setMetadata((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nft-description">Description</Label>
              <Textarea
                id="nft-description"
                placeholder="Describe your music NFT"
                value={metadata.description}
                onChange={(e) => setMetadata((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="royalty">Royalty (%)</Label>
                <Input
                  id="royalty"
                  type="number"
                  min="0"
                  max="50"
                  value={metadata.royalty}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, royalty: Number.parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collection">Collection</Label>
                <Input
                  id="collection"
                  value={metadata.collection}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, collection: e.target.value }))}
                  disabled
                />
              </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Upload your music file</p>
              <Button variant="outline" size="sm">
                <Music className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        )}

        {/* Action Button */}
        {mintingState.status === "idle" && (
          <Button onClick={startMinting} className="w-full" disabled={!metadata.name.trim()}>
            <Zap className="w-4 h-4 mr-2" />
            Mint NFT (0.1 SOL)
          </Button>
        )}
      </div>
    </Card>
  )
}
