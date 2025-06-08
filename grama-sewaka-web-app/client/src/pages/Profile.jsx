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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useAreaNameStore } from "@/stores/useAreaStore";

function Profile() {
  const { user, token, getUserDetails, updateUserDetails } = useUserStore();
  const { getDistrictNameById, getDSNameById, getGNDNameById } = useAreaNameStore();
  const [profile, setProfile] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [districtName, setDistrictName] = useState("");
  const [dsName, setDsName] = useState("");
  const [gndName, setGndName] = useState("");

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

  // Fetch area names when profile changes
  useEffect(() => {
    const fetchAreaNames = async () => {
      if (profile.district_id) {
        setDistrictName(await getDistrictNameById(profile.district_id));
      }
      if (profile.divisional_secretariat_id) {
        setDsName(await getDSNameById(profile.divisional_secretariat_id));
      }
      if (profile.grama_niladhari_division_id) {
        setGndName(await getGNDNameById(profile.grama_niladhari_division_id));
      }
    };
    fetchAreaNames();
  }, [profile.district_id, profile.divisional_secretariat_id, profile.grama_niladhari_division_id, getDistrictNameById, getDSNameById, getGNDNameById]);

  const handleEdit = () => {
    setEditProfile(profile);
    setShowEditModal(true);
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSave = async () => {
    try {
      if (typeof updateUserDetails === 'function') {
        const data = await updateUserDetails(user.role, user.id, editProfile, token);
        if (data && data.success) {
          setProfile(editProfile);
          setShowEditModal(false);
          toast.success("Profile updated successfully!");
        } else {
          throw new Error(data?.message || "Update failed");
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
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

        <main className="flex-1 px-4 py-8 dark:from-gray-900 dark:to-gray-800">
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
                  {/* NIC */}
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-24">NIC</Label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.nic}</span>
                  </div>
                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-24">Email</Label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.admin_email || profile.government_officer_email || profile.grama_sevaka_email}</span>
                  </div>
                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-24">Phone</Label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.admin_phone_number || profile.government_officer_phone_number || profile.grama_sevaka_phone_number}</span>
                  </div>
                  {/* Address */}
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-24">Address</Label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.address}</span>
                  </div>
                  {/* District */}
                  {profile.district_id && (
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground w-24">District</Label>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{districtName}</span>
                    </div>
                  )}
                  {/* Divisional Secretariat */}
                  {profile.divisional_secretariat_id && (
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground w-24">Divisional Secretariat</Label>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{dsName}</span>
                    </div>
                  )}
                  {/* Grama Niladhari Division */}
                  {profile.grama_niladhari_division_id && (
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground w-24">Grama Niladhari Division</Label>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{gndName}</span>
                    </div>
                  )}
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
                  {/* Display fields as plain text */}
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
                      <span className="mt-1 block text-base font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded px-2 py-1">
                        {profile[field.key] || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-4 border-t px-6 py-4">
                <Button onClick={handleEdit} variant="outline">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
          {/* Edit Profile Modal */}
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleModalSave();
                }}
                className="space-y-4"
              >
                {[
                  { label: "First Name", key: "first_name" },
                  { label: "Last Name", key: "last_name" },
                  { label: "NIC", key: "nic" },
                  { label: "Email", key: user?.role === 'admin' ? 'admin_email' : user?.role === 'government_officer' ? 'government_officer_email' : 'grama_sevaka_email' },
                  { label: "Phone", key: user?.role === 'admin' ? 'admin_phone_number' : user?.role === 'government_officer' ? 'government_officer_phone_number' : 'grama_sevaka_phone_number' },
                  { label: "Address", key: "address" },
                ].map((field) => (
                  <div key={field.key} className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-24">{field.label}</Label>
                    <Input
                      name={field.key}
                      value={editProfile[field.key] || ""}
                      onChange={handleEditChange}
                      className="mt-1 max-w-xs"
                    />
                  </div>
                ))}
                <DialogFooter className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Profile;