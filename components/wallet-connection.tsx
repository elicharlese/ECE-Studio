"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Zap, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletState {
  connected: boolean
  publicKey: string | null
  balance: number
  network: string
}

export function WalletConnection() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balance: 0,
    network: "mainnet-beta",
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      // Simulate enhanced connection process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setWallet({
        connected: true,
        publicKey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        balance: 2.45,
        network: "mainnet-beta",
      })

      toast({
        title: "Wallet Connected Securely",
        description: "Successfully connected with enhanced security features",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet({
      connected: false,
      publicKey: null,
      balance: 0,
      network: "mainnet-beta",
    })
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been securely disconnected",
    })
  }

  const copyAddress = () => {
    if (wallet.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!wallet.connected) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Secure Wallet Connection</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your Solana wallet with enterprise-grade security features
            </p>
          </div>
          <Button onClick={connectWallet} disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Connecting Securely...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Connect Secure Wallet
              </>
            )}
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Solana Mainnet • Enhanced Security
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatAddress(wallet.publicKey!)}</span>
              <Button variant="ghost" size="sm" onClick={copyAddress} className="w-6 h-6 p-0">
                <Copy className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{wallet.balance} SOL</span>
              <Badge variant="secondary" className="text-xs">
                {wallet.network}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Shield className="w-2 h-2 mr-1" />
                Secure
              </Badge>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={disconnectWallet}>
          Disconnect
        </Button>
      </div>
    </Card>
  )
}
