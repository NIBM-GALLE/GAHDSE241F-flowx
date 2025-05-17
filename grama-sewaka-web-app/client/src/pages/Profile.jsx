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

function Profile() {
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    firstName: "Kamal",
    lastName: "Perera",
    idNumber: "123456789V",
    age: "30",
    address: "Colombo, Sri Lanka",
    email: "kamal.perera@example.com",
    phone: "+94 77 123 4567",
    role: "Grama Sewaka",
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
    toast.success("Profile updated successfully!")
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
            My Profile
          </h1>
        </header>

        <main className="flex-1 px-4 py-8 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader className="flex flex-col items-center pt-8 pb-6">
                <Avatar className="w-24 h-24 mb-4 border-4 border-blue-100 dark:border-gray-700">
                  <AvatarImage src="/default-avatar.png" />
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
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <p className="text-sm font-medium">{profile.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Member Since</Label>
                    <p className="text-sm font-medium">January 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your personal details and account information
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "First Name", key: "firstName" },
                    { label: "Last Name", key: "lastName" },
                    { label: "ID Number", key: "idNumber" },
                    { label: "Age", key: "age" },
                    { label: "Email", key: "email", colSpan: 2 },
                    { label: "Phone", key: "phone" },
                    { label: "Address", key: "address", colSpan: 2 },
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
                        readOnly={!isEditing}
                        className={`mt-1 ${!isEditing ? "bg-gray-50 dark:bg-gray-700" : ""}`}
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
                  <CardTitle className="text-lg font-bold">Project Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Flood Predictions</span>
                      <span className="text-sm font-medium">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Accuracy Rate</span>
                      <span className="text-sm font-medium">89.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Alerts Issued</span>
                      <span className="text-sm font-medium">18</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Updated flood model parameters</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Created new prediction for Colombo</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Completed training session</p>
                      <p className="text-xs text-muted-foreground">2 weeks ago</p>
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

export default Profile;