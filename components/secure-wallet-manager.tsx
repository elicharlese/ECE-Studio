"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Wallet,
  Copy,
  ExternalLink,
  Zap,
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Eye,
  EyeOff,
  Fingerprint,
  HardDrive,
  Activity,
  TrendingUp,
  DollarSign,
  History,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletProvider {
  name: string
  icon: string
  installed: boolean
  connecting: boolean
}

interface Transaction {
  id: string
  type: "mint" | "purchase" | "sale" | "transfer"
  amount: number
  status: "pending" | "confirmed" | "failed"
  timestamp: number
  hash: string
  from?: string
  to?: string
}

interface SecuritySettings {
  requireConfirmation: boolean
  transactionLimit: number
  enableBiometric: boolean
  enableHardwareWallet: boolean
  autoLockTimeout: number
  requireMultiSig: boolean
  multiSigThreshold: number
}

interface WalletState {
  connected: boolean
  publicKey: string | null
  balance: number
  network: string
  provider: string | null
  isLocked: boolean
  securityLevel: "basic" | "enhanced" | "maximum"
}

export function SecureWalletManager() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balance: 0,
    network: "mainnet-beta",
    provider: null,
    isLocked: false,
    securityLevel: "enhanced",
  })

  const [providers, setProviders] = useState<WalletProvider[]>([
    { name: "Phantom", icon: "👻", installed: true, connecting: false },
    { name: "Solflare", icon: "🔥", installed: true, connecting: false },
    { name: "Ledger", icon: "🔒", installed: false, connecting: false },
    { name: "Trezor", icon: "🛡️", installed: false, connecting: false },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-1",
      type: "purchase",
      amount: 0.5,
      status: "confirmed",
      timestamp: Date.now() - 3600000,
      hash: "5KJp9X2vR8...",
      from: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      to: "marketplace",
    },
    {
      id: "tx-2",
      type: "mint",
      amount: 0.1,
      status: "pending",
      timestamp: Date.now() - 1800000,
      hash: "3Hm8N5qT9L...",
      to: "nft-contract",
    },
  ])

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    requireConfirmation: true,
    transactionLimit: 5.0,
    enableBiometric: false,
    enableHardwareWallet: false,
    autoLockTimeout: 15,
    requireMultiSig: false,
    multiSigThreshold: 2,
  })

  const [showPrivateInfo, setShowPrivateInfo] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [pendingTransaction, setPendingTransaction] = useState<any>(null)
  const [securityScore, setSecurityScore] = useState(85)

  const { toast } = useToast()

  // Calculate security score based on settings
  useEffect(() => {
    let score = 50 // Base score
    if (securitySettings.requireConfirmation) score += 10
    if (securitySettings.enableBiometric) score += 15
    if (securitySettings.enableHardwareWallet) score += 20
    if (securitySettings.requireMultiSig) score += 15
    if (securitySettings.transactionLimit < 1.0) score += 10
    if (securitySettings.autoLockTimeout <= 10) score += 5

    setSecurityScore(Math.min(100, score))
  }, [securitySettings])

  const connectWallet = async (providerName: string) => {
    setIsConnecting(true)
    setSelectedProvider(providerName)

    // Update provider connecting state
    setProviders((prev) => prev.map((p) => (p.name === providerName ? { ...p, connecting: true } : p)))

    try {
      // Simulate connection process with security checks
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock security verification
      if (securitySettings.enableBiometric) {
        console.log("[v0] Performing biometric verification...")
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      if (securitySettings.enableHardwareWallet && (providerName === "Ledger" || providerName === "Trezor")) {
        console.log("[v0] Connecting to hardware wallet...")
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      setWallet({
        connected: true,
        publicKey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        balance: 12.45,
        network: "mainnet-beta",
        provider: providerName,
        isLocked: false,
        securityLevel: securitySettings.enableHardwareWallet ? "maximum" : "enhanced",
      })

      toast({
        title: "Wallet Connected Securely",
        description: `Connected to ${providerName} with enhanced security`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please check your security settings.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
      setProviders((prev) => prev.map((p) => ({ ...p, connecting: false })))
    }
  }

  const disconnectWallet = () => {
    setWallet({
      connected: false,
      publicKey: null,
      balance: 0,
      network: "mainnet-beta",
      provider: null,
      isLocked: false,
      securityLevel: "basic",
    })

    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been securely disconnected",
    })
  }

  const lockWallet = () => {
    setWallet((prev) => ({ ...prev, isLocked: true }))
    toast({
      title: "Wallet Locked",
      description: "Wallet has been locked for security",
    })
  }

  const unlockWallet = async () => {
    // Simulate biometric or password verification
    if (securitySettings.enableBiometric) {
      console.log("[v0] Verifying biometric authentication...")
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setWallet((prev) => ({ ...prev, isLocked: false }))
    toast({
      title: "Wallet Unlocked",
      description: "Wallet has been unlocked successfully",
    })
  }

  const approveTransaction = async (tx: any) => {
    if (securitySettings.requireConfirmation) {
      console.log("[v0] Requiring user confirmation for transaction")
    }

    if (tx.amount > securitySettings.transactionLimit) {
      toast({
        title: "Transaction Limit Exceeded",
        description: `Transaction amount exceeds limit of ${securitySettings.transactionLimit} SOL`,
        variant: "destructive",
      })
      return
    }

    // Add to transaction history
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: tx.type,
      amount: tx.amount,
      status: "pending",
      timestamp: Date.now(),
      hash: `${Math.random().toString(36).substring(2, 15)}...`,
      to: tx.to,
    }

    setTransactions((prev) => [newTx, ...prev])
    setPendingTransaction(null)

    toast({
      title: "Transaction Submitted",
      description: "Transaction has been submitted to the blockchain",
    })
  }

  const updateSecuritySetting = (key: keyof SecuritySettings, value: any) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }))
    console.log(`[v0] Updated security setting: ${key} = ${value}`)
  }

  const formatAddress = (address: string) => {
    if (!showPrivateInfo) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`
    }
    return address
  }

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "maximum":
        return "text-green-500"
      case "enhanced":
        return "text-yellow-500"
      default:
        return "text-red-500"
    }
  }

  if (!wallet.connected) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Secure Wallet Connection</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Connect your Solana wallet with enterprise-grade security
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Security Score */}
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Security Score</span>
                  <Badge variant={securityScore >= 80 ? "default" : securityScore >= 60 ? "secondary" : "destructive"}>
                    {securityScore}/100
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      securityScore >= 80 ? "bg-green-500" : securityScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${securityScore}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Wallet Providers */}
            <div className="grid grid-cols-2 gap-4">
              {providers.map((provider) => (
                <Card
                  key={provider.name}
                  className={`cursor-pointer transition-all duration-200 ${
                    provider.installed ? "hover:border-primary/50 bg-card" : "opacity-50 cursor-not-allowed bg-muted/20"
                  }`}
                  onClick={() => provider.installed && connectWallet(provider.name)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{provider.icon}</div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {provider.installed ? "Installed" : "Not Installed"}
                    </div>
                    {provider.connecting && (
                      <div className="mt-2">
                        <Zap className="w-4 h-4 animate-spin mx-auto" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Security Settings Preview */}
            <Card className="bg-muted/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Security Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Transaction Confirmation</span>
                  <CheckCircle
                    className={`w-4 h-4 ${securitySettings.requireConfirmation ? "text-green-500" : "text-muted-foreground"}`}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Biometric Authentication</span>
                  <Fingerprint
                    className={`w-4 h-4 ${securitySettings.enableBiometric ? "text-green-500" : "text-muted-foreground"}`}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Hardware Wallet Support</span>
                  <HardDrive
                    className={`w-4 h-4 ${securitySettings.enableHardwareWallet ? "text-green-500" : "text-muted-foreground"}`}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Multi-Signature</span>
                  <Key
                    className={`w-4 h-4 ${securitySettings.requireMultiSig ? "text-green-500" : "text-muted-foreground"}`}
                  />
                </div>
              </CardContent>
            </Card>

            {isConnecting && (
              <div className="text-center py-4">
                <Zap className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Connecting to {selectedProvider}...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (wallet.isLocked) {
    return (
      <Card className="max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-8 text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Wallet Locked</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Your wallet is locked for security. Please authenticate to continue.
          </p>
          <Button onClick={unlockWallet} className="w-full">
            <Fingerprint className="w-4 h-4 mr-2" />
            Unlock Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">History</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getSecurityLevelColor(wallet.securityLevel)}>
              <Shield className="w-3 h-3 mr-1" />
              {wallet.securityLevel} security
            </Badge>
            <Button variant="outline" size="sm" onClick={lockWallet}>
              <Lock className="w-4 h-4 mr-1" />
              Lock
            </Button>
            <Button variant="outline" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Wallet Overview */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatAddress(wallet.publicKey!)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPrivateInfo(!showPrivateInfo)}
                        className="w-6 h-6 p-0"
                      >
                        {showPrivateInfo ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
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
                        {wallet.provider}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">${(wallet.balance * 23.45).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">USD Value</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <Card className="bg-muted/20">
                  <CardContent className="p-3 text-center">
                    <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-500" />
                    <div className="text-sm font-medium">Portfolio</div>
                    <div className="text-xs text-muted-foreground">+12.5%</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-3 text-center">
                    <Activity className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                    <div className="text-sm font-medium">Transactions</div>
                    <div className="text-xs text-muted-foreground">{transactions.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-3 text-center">
                    <Shield className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-medium">Security</div>
                    <div className="text-xs text-muted-foreground">{securityScore}/100</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-3 text-center">
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                    <div className="text-sm font-medium">Limit</div>
                    <div className="text-xs text-muted-foreground">{securitySettings.transactionLimit} SOL</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.status === "confirmed"
                            ? "bg-green-500/20 text-green-500"
                            : tx.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {tx.status === "confirmed" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : tx.status === "pending" ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className="text-sm text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{tx.amount} SOL</div>
                      <div className="text-sm text-muted-foreground">{tx.hash}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Score */}
              <div className="p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Overall Security Score</span>
                  <Badge variant={securityScore >= 80 ? "default" : securityScore >= 60 ? "secondary" : "destructive"}>
                    {securityScore}/100
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      securityScore >= 80 ? "bg-green-500" : securityScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${securityScore}%` }}
                  />
                </div>
              </div>

              {/* Security Options */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Require Confirmation</span>
                    </div>
                    <Button
                      variant={securitySettings.requireConfirmation ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateSecuritySetting("requireConfirmation", !securitySettings.requireConfirmation)
                      }
                    >
                      {securitySettings.requireConfirmation ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-primary" />
                      <span className="text-sm">Biometric Auth</span>
                    </div>
                    <Button
                      variant={securitySettings.enableBiometric ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSecuritySetting("enableBiometric", !securitySettings.enableBiometric)}
                    >
                      {securitySettings.enableBiometric ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-primary" />
                      <span className="text-sm">Hardware Wallet</span>
                    </div>
                    <Button
                      variant={securitySettings.enableHardwareWallet ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateSecuritySetting("enableHardwareWallet", !securitySettings.enableHardwareWallet)
                      }
                    >
                      {securitySettings.enableHardwareWallet ? "On" : "Off"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-sm">Transaction Limit</span>
                    </div>
                    <Slider
                      value={[securitySettings.transactionLimit]}
                      onValueChange={(value) => updateSecuritySetting("transactionLimit", value[0])}
                      min={0.1}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {securitySettings.transactionLimit} SOL per transaction
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm">Auto-Lock Timeout</span>
                    </div>
                    <Slider
                      value={[securitySettings.autoLockTimeout]}
                      onValueChange={(value) => updateSecuritySetting("autoLockTimeout", value[0])}
                      min={5}
                      max={60}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground mt-1">{securitySettings.autoLockTimeout} minutes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Wallet Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Network</label>
                  <select className="w-full mt-1 p-2 rounded-md border border-border bg-background">
                    <option value="mainnet-beta">Mainnet Beta</option>
                    <option value="devnet">Devnet</option>
                    <option value="testnet">Testnet</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">RPC Endpoint</label>
                  <Input placeholder="Custom RPC endpoint" className="mt-1" />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-3">Advanced Security</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable Multi-Signature</span>
                    <Button
                      variant={securitySettings.requireMultiSig ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSecuritySetting("requireMultiSig", !securitySettings.requireMultiSig)}
                    >
                      {securitySettings.requireMultiSig ? "On" : "Off"}
                    </Button>
                  </div>

                  {securitySettings.requireMultiSig && (
                    <div>
                      <label className="text-sm">Signature Threshold</label>
                      <Slider
                        value={[securitySettings.multiSigThreshold]}
                        onValueChange={(value) => updateSecuritySetting("multiSigThreshold", value[0])}
                        min={2}
                        max={5}
                        step={1}
                        className="w-full mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Require {securitySettings.multiSigThreshold} signatures
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
