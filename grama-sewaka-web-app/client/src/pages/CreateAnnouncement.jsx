import React, { useState } from "react"
import { useAnnouncementStore } from "@/stores/useAnnouncementStore"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"     
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function CreateAnnouncement() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [emergencyLevel, setEmergencyLevel] = useState("")
  const { loading, error, success, createAnnouncement, clearStatus } = useAnnouncementStore()

  //get user info
  const user = JSON.parse(localStorage.getItem("user")) || { id: 0, role: "government_officer" }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearStatus()
    if (!title || !description || !emergencyLevel) {
      useAnnouncementStore.setState({ error: "All fields are required." })
      return
    }
    await createAnnouncement({
      title,
      description,
      emergency_level: emergencyLevel,
      user_id: user.id,
      userType: user.role || "government_officer"
    })
    if (useAnnouncementStore.getState().success) {
      setTitle("")
      setDescription("")
      setEmergencyLevel("")
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Create Announcement</h1>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle>Create New Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write the announcement details"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Emergency Level</Label>
                  <Select value={emergencyLevel} onValueChange={setEmergencyLevel} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emergency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
                {success && <div className="text-green-600 text-sm font-medium">{success}</div>}

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setTitle("")
                      setDescription("")
                      setEmergencyLevel("")
                      clearStatus()
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    {loading ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CreateAnnouncement;
