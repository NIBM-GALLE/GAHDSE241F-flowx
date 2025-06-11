import React, { useEffect, useState } from "react";
import { useAnnouncementStore } from "@/stores/useAnnouncementStore";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

function AnnouncementList() {
  const {
    announcements,
    fetchAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
    loading,
    error,
    success,
    clearStatus,
  } = useAnnouncementStore();

  const user = JSON.parse(localStorage.getItem("user")) || { role: "government_officer" };
  const userType = user.role;
  const roleLabel =
    userType === "admin"
      ? "Admin"
      : userType === "grama_sevaka"
      ? "Grama Niladhari"
      : "Government Officer";

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editData, setEditData] = useState({ title: "", description: "", emergency_level: "" });

  useEffect(() => {
    fetchAnnouncements(userType);
    // eslint-disable-next-line
  }, [userType]);

  // Open edit dialog
  const handleEdit = (item) => {
    setSelected(item);
    setEditData({
      title: item.title,
      description: item.description,
      emergency_level: item.emergency_level,
    });
    setShowEdit(true);
    clearStatus();
  };

  // Open delete dialog
  const handleDelete = (item) => {
    setSelected(item);
    setShowDelete(true);
    clearStatus();
  };

  // Update announcement (only changed fields)
  const handleUpdate = async () => {
    if (!selected) return;
    const changedFields = {};
    if (editData.title !== selected.title) changedFields.title = editData.title;
    if (editData.description !== selected.description) changedFields.description = editData.description;
    if (editData.emergency_level !== selected.emergency_level) changedFields.emergency_level = editData.emergency_level;
    if (Object.keys(changedFields).length === 0) {
      setShowEdit(false);
      setSelected(null);
      return;
    }
    await updateAnnouncement({
      id: selected.id,
      userType,
      ...changedFields,
    });
    setShowEdit(false);
    setSelected(null);
  };

  // Delete announcement
  const handleDeleteConfirm = async () => {
    await deleteAnnouncement(selected.id, userType);
    setShowDelete(false);
    setSelected(null);
  };

  // Filtered announcements
  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800 bg-gradient-to-r  text-black">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">{roleLabel} Announcements</h1>
        </header>
        <main className="flex-1 px-0 py-6 md:px-0 md:py-8 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-6xl mx-auto bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle>Announcements ({roleLabel})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-2 px-6 py-2 bg-blue-50 dark:bg-gray-800 rounded-lg shadow-sm w-full">
                  <span className="flex items-center gap-1 text-blue-700 dark:text-blue-300 font-medium text-base">
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                  </span>
                  <span className="mx-2 h-6 w-px bg-blue-200 dark:bg-gray-700" />
                  <Input
                    placeholder="Search announcements..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 min-w-0 border-none bg-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none text-base transition-shadow"
                  />
                  <button
                    type="button"
                    className="ml-2 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                    title="More filters (coming soon)"
                  >
                    <Filter className="w-4 h-4 text-blue-500" />
                  </button>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm font-medium mb-2">{error}</div>}
              {success && <div className="text-green-600 text-sm font-medium mb-2">{success}</div>}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Emergency</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          {loading ? "Loading..." : "No announcements found."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map(a => (
                        <TableRow key={a.id}>
                          <TableCell>{a.title}</TableCell>
                          <TableCell className="max-w-xs truncate">{a.description}</TableCell>
                          <TableCell>{a.emergency_level}</TableCell>
                          <TableCell>
                            {a.announcement_date
                              ? new Date(a.announcement_date).toISOString().slice(0, 10)
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="mr-2" onClick={() => handleEdit(a)}>
                              Update
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(a)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={showEdit} onOpenChange={setShowEdit}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Title</Label>
                <Input value={editData.title} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))} />
                <Label>Description</Label>
                <Textarea value={editData.description} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))} />
                <Label>Emergency Level</Label>
                <Select value={editData.emergency_level} onValueChange={v => setEditData(d => ({ ...d, emergency_level: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdate} disabled={loading} className="bg-blue-600 hover:bg-blue-700">{loading ? "Saving..." : "Save"}</Button>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={showDelete} onOpenChange={setShowDelete}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Announcement</DialogTitle>
              </DialogHeader>
              <div>Are you sure you want to delete this announcement?</div>
              <DialogFooter>
                <Button onClick={handleDeleteConfirm} disabled={loading} variant="destructive">{loading ? "Deleting..." : "Delete"}</Button>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AnnouncementList;
