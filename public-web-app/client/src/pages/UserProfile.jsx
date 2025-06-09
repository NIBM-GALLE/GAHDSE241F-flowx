import React, { useState, useEffect } from "react";
import axios from "axios";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [areaNames, setAreaNames] = useState({
    district: "",
    division: "",
    grama: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Fetch user profile and area names
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        setProfile({
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.member_email || "",
          phone: user.member_phone_number || "",
          address: user.address || "",
          nic: user.member_nic || user.nic || "",
          role: user.role || "General User",
          joinDate: user.join_date || "",
          emergencyContact: user.emergency_contact || "",
          houseId: user.house_id || "",
          district_id: user.district_id,
          divisional_secretariat_id: user.divisional_secretariat_id,
          grama_niladhari_division_id: user.grama_niladhari_division_id,
        });
        // Fetch area names
        const [districtRes, divisionRes, gramaRes] = await Promise.all([
          axios.get(`/api/area/districts/${user.district_id}/name`),
          axios.get(
            `/api/area/divisional-secretariats/${user.divisional_secretariat_id}/name`
          ),
          axios.get(
            `/api/area/grama-niladhari-divisions/${user.grama_niladhari_division_id}/name`
          ),
        ]);
        setAreaNames({
          district: districtRes.data.name || "",
          division: divisionRes.data.name || "",
          grama: gramaRes.data.name || "",
        });
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/auth/profile",
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          emergencyContact: profile.emergencyContact,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully!");
    } catch {
      setError("Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowEditDialog(true);
  };

  const handleDialogClose = () => {
    setIsEditing(false);
    setShowEditDialog(false);
  };

  const handleDialogSave = async () => {
    await handleSave();
    setShowEditDialog(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading profile...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }
  if (!profile) {
    return null;
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
        <main className="flex-1 px-4 py-8 dark:from-gray-900 dark:to-gray-800">
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
                    <Label className="text-xs text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-sm font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Member Since
                    </Label>
                    <p className="text-sm font-medium">{profile.joinDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      NIC Number
                    </Label>
                    <p className="text-sm font-medium">{profile.nic}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      District
                    </Label>
                    <p className="text-sm font-medium">{areaNames.district}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Divisional Secretariat
                    </Label>
                    <p className="text-sm font-medium">{areaNames.division}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Grama Niladhari Division
                    </Label>
                    <p className="text-sm font-medium">{areaNames.grama}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      House ID
                    </Label>
                    <p className="text-sm font-medium">{profile.houseId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details Card */}
            <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Personal Information
                </CardTitle>
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
                    { label: "House ID", key: "houseId", readOnly: true },
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
                <Button onClick={handleEdit} variant="outline">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
          {/* Edit Profile Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-lg w-full rounded-2xl p-8 bg-white dark:bg-gray-900 shadow-2xl border dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-200">
                  Edit Profile
                </DialogTitle>
                <p className="text-sm text-muted-foreground mb-4">
                  Update your personal details below and save changes.
                </p>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleDialogSave(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "First Name", key: "firstName" },
                    { label: "Last Name", key: "lastName" },
                    { label: "Email", key: "email", colSpan: 2 },
                    { label: "Phone Number", key: "phone" },
                    { label: "Emergency Contact", key: "emergencyContact" },
                    { label: "NIC Number", key: "nic", readOnly: true },
                    { label: "House ID", key: "houseId", readOnly: true },
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
                        readOnly={field.readOnly}
                        className={`mt-1 ${field.readOnly ? "bg-gray-50 dark:bg-gray-700" : ""}`}
                      />
                    </div>
                  ))}
                </div>
                <DialogFooter className="flex justify-end gap-4 mt-4">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default UserProfile;