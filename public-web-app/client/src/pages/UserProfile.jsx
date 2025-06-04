import React, { useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+94 77 123 4567",
    address: "123 Main St, Colombo",
    nic: "123456789V",
    role: "General User",
    joinDate: "2023-05-15",
    emergencyContact: "+94 76 987 6543",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
    // Here you would typically make an API call to save the data
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

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
            {/* Profile Summary Card */}
            <Card className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader className="flex flex-col items-center pt-8 pb-6">
                <Avatar className="w-24 h-24 mb-4 border-4 border-blue-100 dark:border-gray-700">
                  <AvatarImage src="/user-avatar.png" />
                  <AvatarFallback className="text-3xl font-bold bg-blue-100 dark:bg-gray-700">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <CardTitle className="text-xl font-bold">
                    {profile.firstName} {profile.lastName}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="mt-2 bg-blue-100 dark:bg-gray-700"
                  >
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
                    <Label className="text-xs text-muted-foreground">Member Since</Label>
                    <p className="text-sm font-medium">{profile.joinDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">NIC Number</Label>
                    <p className="text-sm font-medium">{profile.nic}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details Card */}
            <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your personal details and contact information
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "First Name", key: "firstName" },
                    { label: "Last Name", key: "lastName" },
                    { label: "Email", key: "email", colSpan: 2 },
                    { label: "Phone Number", key: "phone" },
                    { label: "Emergency Contact", key: "emergencyContact" },
                    { label: "NIC Number", key: "nic", readOnly: true },
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
                        readOnly={!isEditing || field.readOnly}
                        className={`mt-1 ${
                          !isEditing || field.readOnly
                            ? "bg-gray-50 dark:bg-gray-700"
                            : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-4 border-t px-6 py-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
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

            {/* Additional User Information */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Account Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Password</p>
                        <p className="text-xs text-muted-foreground">
                          Last changed 3 months ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">My Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Last Login</p>
                      <p className="text-xs text-muted-foreground">
                        Today at 9:30 AM from Colombo, Sri Lanka
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Alerts Subscribed</p>
                      <p className="text-xs text-muted-foreground">
                        3 active alert subscriptions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default UserProfile;