"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, RefreshCw, Copy } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to console with detailed information
    console.error("[v0] Error Boundary caught an error:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // In a real app, send error to monitoring service
    this.reportError(error, errorInfo)
  }

  reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Simulate error reporting to monitoring service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: "user_123", // Would come from auth context
        sessionId: "session_456", // Would come from session management
      }

      console.log("[v0] Reporting error to monitoring service:", errorReport)

      // In production, this would be:
      // await fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorReport) })
    } catch (reportingError) {
      console.error("[v0] Failed to report error:", reportingError)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    })
  }

  copyErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    }

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <Card className="max-w-2xl w-full bg-destructive/5 border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-destructive">Something went wrong</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">An unexpected error occurred in the audio studio</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Error Details</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {this.state.errorId}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {this.state.error?.message || "Unknown error occurred"}
                </p>
                {process.env.NODE_ENV === "development" && this.state.error?.stack && (
                  <details className="mt-2">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      Stack Trace (Development)
                    </summary>
                    <pre className="text-xs mt-2 p-2 bg-background rounded border overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.copyErrorDetails}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Details
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>
                  If this problem persists, please contact support with error ID:{" "}
                  <code className="bg-muted px-1 rounded">{this.state.errorId}</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional error boundary hook for simpler usage
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error("[v0] Error caught by error handler:", error, errorInfo)

    // In a real app, report to error monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      additionalInfo: errorInfo,
    }

    console.log("[v0] Error report:", errorReport)
  }
}
