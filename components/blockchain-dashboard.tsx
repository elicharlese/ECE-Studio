"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnection } from "@/components/wallet-connection"
import { NFTMinting } from "@/components/nft-minting"
import { NFTMarketplace } from "@/components/nft-marketplace"
import { Wallet, Coins, Music, ShoppingCart, Award, ExternalLink } from "lucide-react"

export function BlockchainDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    {
      title: "Portfolio Value",
      value: "12.8 SOL",
      change: "+5.2%",
      icon: Coins,
      color: "text-primary",
    },
    {
      title: "NFTs Owned",
      value: "7",
      change: "+2",
      icon: Music,
      color: "text-accent",
    },
    {
      title: "Total Sales",
      value: "3.4 SOL",
      change: "+1.1 SOL",
      icon: ShoppingCart,
      color: "text-chart-3",
    },
    {
      title: "Royalties Earned",
      value: "0.8 SOL",
      change: "+0.3 SOL",
      icon: Award,
      color: "text-chart-4",
    },
  ]

  const recentTransactions = [
    {
      id: "1",
      type: "mint",
      name: "Cosmic Waves",
      amount: "0.1 SOL",
      hash: "5xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "sale",
      name: "Digital Dreams",
      amount: "2.5 SOL",
      hash: "7mNpkL9qW3rT8vBnM4hTrpQrT2kWspQrT5xKXtg2CW87",
      timestamp: "1 day ago",
    },
    {
      id: "3",
      type: "royalty",
      name: "Neon Nights",
      amount: "0.2 SOL",
      hash: "9hTrpQrT2kWspQrT5xKXtg2CW877mNpkL9qW3rT8vBnM",
      timestamp: "3 days ago",
    },
  ]

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-sans">Blockchain Dashboard</h1>
            <p className="text-muted-foreground">Manage your music NFTs and blockchain assets</p>
          </div>
        </div>

        {/* Wallet Connection */}
        <WalletConnection />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mint">Mint NFT</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.title} className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-green-500">{stat.change}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Recent Transactions */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={tx.type === "mint" ? "default" : tx.type === "sale" ? "secondary" : "outline"}
                        className="capitalize"
                      >
                        {tx.type}
                      </Badge>
                      <div>
                        <p className="font-medium">{tx.name}</p>
                        <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{tx.amount}</span>
                      <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="mint">
            <NFTMinting />
          </TabsContent>

          <TabsContent value="marketplace">
            <NFTMarketplace />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card className="p-8 text-center bg-card/30 backdrop-blur-sm border-border/50">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Portfolio Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Detailed portfolio analytics and management tools are in development.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
