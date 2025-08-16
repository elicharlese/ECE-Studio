"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Share2, Clock, Plus, Settings, Video, Mic, MicOff } from "lucide-react"

interface Collaborator {
  id: string
  name: string
  avatar: string
  role: "owner" | "producer" | "mixer" | "guest"
  status: "online" | "offline" | "busy"
  lastActive: string
}

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  timePosition: number
}

export function CollaborationHub() {
  const [collaborators] = useState<Collaborator[]>([
    {
      id: "user-1",
      name: "Alex Producer",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "owner",
      status: "online",
      lastActive: "now",
    },
    {
      id: "user-2",
      name: "Sam Mixer",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "mixer",
      status: "online",
      lastActive: "2 min ago",
    },
    {
      id: "user-3",
      name: "Jordan Beats",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "producer",
      status: "busy",
      lastActive: "5 min ago",
    },
  ])

  const [comments] = useState<Comment[]>([
    {
      id: "comment-1",
      author: "Sam Mixer",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "The bass could use more low-end around 2:30",
      timestamp: "10 min ago",
      timePosition: 150,
    },
    {
      id: "comment-2",
      author: "Jordan Beats",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "Love the synth lead! Maybe add some reverb?",
      timestamp: "15 min ago",
      timePosition: 45,
    },
  ])

  const [newComment, setNewComment] = useState("")
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-primary/20 text-primary"
      case "producer":
        return "bg-accent/20 text-accent"
      case "mixer":
        return "bg-chart-3/20 text-chart-3"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-chart-3/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-chart-3" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">Collaboration Hub</h2>
              <p className="text-sm text-muted-foreground">Work together on your music projects</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isVoiceChatActive ? "default" : "outline"}
              onClick={() => setIsVoiceChatActive(!isVoiceChatActive)}
            >
              <Video className="w-4 h-4 mr-2" />
              {isVoiceChatActive ? "Leave" : "Join"} Voice Chat
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Collaborators Panel */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Collaborators</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {collaborator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(
                          collaborator.status,
                        )}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{collaborator.name}</span>
                        <Badge className={`${getRoleColor(collaborator.role)} text-xs`}>{collaborator.role}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{collaborator.lastActive}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voice Chat Controls */}
              {isVoiceChatActive && (
                <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Voice Chat Active</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant={isMuted ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-8 h-8 p-0"
                      >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">2 participants connected</div>
                </div>
              )}
            </Card>
          </div>

          {/* Comments and Activity */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="comments" className="space-y-4">
              <TabsList>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
              </TabsList>

              <TabsContent value="comments">
                <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/20">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.floor(comment.timePosition / 60)}:
                              {(comment.timePosition % 60).toString().padStart(2, "0")}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1"
                    />
                    <Button>
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="space-y-3">
                    {[
                      { user: "Sam Mixer", action: "adjusted EQ on Lead Synth track", time: "5 min ago" },
                      { user: "Jordan Beats", action: "added new drum pattern", time: "12 min ago" },
                      { user: "Alex Producer", action: "uploaded vocal sample", time: "1 hour ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="versions">
                <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="space-y-3">
                    {[
                      {
                        version: "v1.3",
                        author: "Alex Producer",
                        changes: "Added vocal harmonies",
                        time: "2 hours ago",
                      },
                      { version: "v1.2", author: "Sam Mixer", changes: "Improved mix balance", time: "1 day ago" },
                      { version: "v1.1", author: "Jordan Beats", changes: "Updated drum sounds", time: "2 days ago" },
                    ].map((version, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{version.version}</Badge>
                            <span className="font-medium">{version.author}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{version.changes}</p>
                          <div className="text-xs text-muted-foreground">{version.time}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Restore
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
