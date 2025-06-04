import React, { useState } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@floodalert.com",
    phone: "+94 77 123 4567",
    role: "System Administrator",
    adminId: "ADM-001",
    permissions: "Full Access",
    joinDate: "2022-01-15",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    if (!isEditing) return
    setIsEditing(false)
    toast.success("Admin profile updated successfully!")
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Admin Profile
          </h1>
        </header>

        <main className="flex-1 px-4 py-8 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader className="flex flex-col items-center pt-8 pb-6">
                <Avatar className="w-24 h-24 mb-4 border-4 border-blue-100 dark:border-gray-700">
                  <AvatarImage src="/admin-avatar.png" />
                  <AvatarFallback className="text-3xl font-bold bg-blue-100 dark:bg-gray-700">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <CardTitle className="text-xl font-bold">
                    {profile.firstName} {profile.lastName}
                  </CardTitle>
                  <Badge variant="outline" className="mt-2 bg-blue-100 dark:bg-gray-700">
                    {profile.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Admin ID</Label>
                    <p className="text-sm font-medium">{profile.adminId}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Permissions</Label>
                    <p className="text-sm font-medium">{profile.permissions}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Member Since</Label>
                    <p className="text-sm font-medium">{profile.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Admin Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your admin profile and account settings
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "First Name", key: "firstName" },
                    { label: "Last Name", key: "lastName" },
                    { label: "Admin ID", key: "adminId", readOnly: true },
                    { label: "Email", key: "email", colSpan: 2 },
                    { label: "Phone", key: "phone" },
                    { label: "Permissions", key: "permissions", readOnly: true },
                    { label: "Join Date", key: "joinDate", readOnly: true },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className={field.colSpan === 2 ? "md:col-span-2" : ""}
                    >
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}
                      </Label>
                      <Input
                        name={field.key}
                        value={profile[field.key]}
                        onChange={handleChange}
                        readOnly={!isEditing || field.readOnly}
                        className={`mt-1 ${(!isEditing || field.readOnly) ? "bg-gray-50 dark:bg-gray-700" : ""}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-4 border-t px-6 py-4">
                {isEditing ? (
                  <>
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit} variant="outline">
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Additional Info Section */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">System Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Users</span>
                      <span className="text-sm font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Sessions</span>
                      <span className="text-sm font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">System Health</span>
                      <span className="text-sm font-medium text-green-500">Excellent</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Recent Admin Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Updated user permissions</p>
                      <p className="text-xs text-muted-foreground">Today, 10:45 AM</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Performed system maintenance</p>
                      <p className="text-xs text-muted-foreground">Yesterday, 2:30 PM</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Added new admin user</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminProfile;