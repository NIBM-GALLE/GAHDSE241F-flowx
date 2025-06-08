import React, { useState, useEffect } from "react"
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
import { useUserStore } from "@/stores/useUserStore";

function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const { user, token, getUserDetails, updateUserDetails } = useUserStore();
  const [profile, setProfile] = useState({});

  //fetch user details from backend on mount
  useEffect(() => {
    if (user && user.role && user.id && typeof getUserDetails === 'function') {
      getUserDetails(user.role, user.id, token).then((data) => {
        if (data && data.success) {
          setProfile(data.data);
        }
      });
    }
  }, [user, token, getUserDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    if (!isEditing) return
    try {
      if (typeof updateUserDetails === 'function') {
        const data = await updateUserDetails(user.role, user.id, profile, token);
        if (data && data.success) {
          setIsEditing(false);
          toast.success("Profile updated successfully!");
        } else {
          throw new Error(data?.message || "Update failed");
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
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
                    {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <CardTitle className="text-xl font-bold">
                    {profile.first_name} {profile.last_name}
                  </CardTitle>
                  <Badge variant="outline" className="mt-2 bg-blue-100 dark:bg-gray-700">
                    {user?.role?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-24">NIC</Label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.nic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-24">Email</Label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.admin_email || profile.government_officer_email || profile.grama_sevaka_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-24">Phone</Label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.admin_phone_number || profile.government_officer_phone_number || profile.grama_sevaka_phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-24">Address</Label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.address}</span>
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
                    { label: "First Name", key: "first_name" },
                    { label: "Last Name", key: "last_name" },
                    { label: "NIC", key: "nic" },
                    { label: "Email", key: user?.role === 'admin' ? 'admin_email' : user?.role === 'government_officer' ? 'government_officer_email' : 'grama_sevaka_email', colSpan: 2 },
                    { label: "Phone", key: user?.role === 'admin' ? 'admin_phone_number' : user?.role === 'government_officer' ? 'government_officer_phone_number' : 'grama_sevaka_phone_number' },
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
                        value={profile[field.key] || ""}
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
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Profile;