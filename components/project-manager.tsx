"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FolderOpen, Plus, Search, MoreVertical, Play, Share2, Clock, Users, Star, Copy, Music } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  lastModified: string
  duration: string
  bpm: number
  key: string
  collaborators: number
  isStarred: boolean
  isPublic: boolean
  tags: string[]
  thumbnail: string
  status: "draft" | "in-progress" | "completed" | "published"
}

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj-1",
      name: "Cosmic Journey",
      description: "An ethereal synthwave track exploring space themes",
      createdAt: "2024-01-15",
      lastModified: "2024-01-20",
      duration: "3:42",
      bpm: 128,
      key: "Am",
      collaborators: 2,
      isStarred: true,
      isPublic: false,
      tags: ["synthwave", "ambient", "space"],
      thumbnail: "/placeholder.svg?height=200&width=300",
      status: "in-progress",
    },
    {
      id: "proj-2",
      name: "Urban Beats",
      description: "Heavy trap-influenced hip hop instrumental",
      createdAt: "2024-01-10",
      lastModified: "2024-01-18",
      duration: "2:58",
      bpm: 140,
      key: "Gm",
      collaborators: 1,
      isStarred: false,
      isPublic: true,
      tags: ["trap", "hip hop", "urban"],
      thumbnail: "/placeholder.svg?height=200&width=300",
      status: "completed",
    },
    {
      id: "proj-3",
      name: "Deep House Vibes",
      description: "Groovy deep house track for the dancefloor",
      createdAt: "2024-01-05",
      lastModified: "2024-01-12",
      duration: "5:23",
      bpm: 124,
      key: "Fm",
      collaborators: 3,
      isStarred: true,
      isPublic: false,
      tags: ["deep house", "electronic", "dance"],
      thumbnail: "/placeholder.svg?height=200&width=300",
      status: "published",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedView, setSelectedView] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    bpm: 120,
    key: "C",
    template: "blank",
  })

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesView =
      selectedView === "all" ||
      (selectedView === "starred" && project.isStarred) ||
      (selectedView === "shared" && project.collaborators > 1) ||
      project.status === selectedView

    return matchesSearch && matchesView
  })

  const createProject = () => {
    const project: Project = {
      id: `proj-${Date.now()}`,
      name: newProject.name || "Untitled Project",
      description: newProject.description,
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      duration: "0:00",
      bpm: newProject.bpm,
      key: newProject.key,
      collaborators: 1,
      isStarred: false,
      isPublic: false,
      tags: [],
      thumbnail: "/placeholder.svg?height=200&width=300",
      status: "draft",
    }

    setProjects((prev) => [project, ...prev])
    setIsCreateDialogOpen(false)
    setNewProject({ name: "", description: "", bpm: 120, key: "C", template: "blank" })
  }

  const toggleStar = (id: string) => {
    setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj, isStarred: !proj.isStarred } : proj)))
  }

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground"
      case "in-progress":
        return "bg-blue-500/20 text-blue-400"
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "published":
        return "bg-primary/20 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const templates = [
    { id: "blank", name: "Blank Project", description: "Start from scratch" },
    { id: "electronic", name: "Electronic Template", description: "Pre-configured for electronic music" },
    { id: "hiphop", name: "Hip Hop Template", description: "Trap and hip hop setup" },
    { id: "house", name: "House Template", description: "Deep house and techno ready" },
  ]

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-card to-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">Project Manager</h2>
              <p className="text-sm text-muted-foreground">Organize and manage your music projects</p>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    value={newProject.name}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Describe your project"
                    value={newProject.description}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bpm">BPM</Label>
                    <Input
                      id="bpm"
                      type="number"
                      min="60"
                      max="200"
                      value={newProject.bpm}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, bpm: Number.parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key">Key</Label>
                    <select
                      id="key"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={newProject.key}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, key: e.target.value }))}
                    >
                      {["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Template</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {templates.map((template) => (
                      <Button
                        key={template.id}
                        variant={newProject.template === template.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewProject((prev) => ({ ...prev, template: template.id }))}
                        className="h-auto p-3 flex flex-col items-start"
                      >
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-muted-foreground">{template.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={createProject} className="flex-1">
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedView} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={project.thumbnail || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" className="rounded-full w-10 h-10 p-0">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                    <Badge className={`absolute top-2 left-2 ${getStatusColor(project.status)} capitalize`}>
                      {project.status.replace("-", " ")}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStar(project.id)
                      }}
                      className={`absolute top-2 right-2 w-8 h-8 p-0 ${
                        project.isStarred ? "text-yellow-500" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${project.isStarred ? "fill-current" : ""}`} />
                    </Button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold truncate">{project.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{project.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        <span>{project.bpm} BPM</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{project.collaborators}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-muted-foreground">
                        Modified {new Date(project.lastModified).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <Share2 className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <Card className="p-8 text-center bg-card/30 backdrop-blur-sm border-border/50">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Create your first project to get started"}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
