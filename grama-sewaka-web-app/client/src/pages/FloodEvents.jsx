import React, { useEffect, useState } from "react";
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFloodStore } from "@/stores/useFloodStore";
import { useUserStore } from "@/stores/useUserStore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

function FloodEvents() {
  const { token, user } = useUserStore();
  const {
    loading,
    currentFlood,
    pastFloods,
    updateFlood,
    getCurrentFlood,
    getPastFloods,
  } = useFloodStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFlood, setEditFlood] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [viewFlood, setViewFlood] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  useEffect(() => {
    getCurrentFlood(token);
    getPastFloods(token);
    // eslint-disable-next-line
  }, [token]);

  const handleEditClick = () => {
    setEditFlood(currentFlood);
    setEditFields({}); // Start with empty fields for update
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    if (!editFlood) return;
    const changed = {};
    // Only include fields that are non-empty and different from the original
    if (
      editFields.flood_name &&
      editFields.flood_name !== editFlood.flood_name
    )
      changed.flood_name = editFields.flood_name;
    if (
      editFields.flood_status &&
      editFields.flood_status !== editFlood.flood_status
    )
      changed.flood_status = editFields.flood_status;
    if (
      editFields.flood_description &&
      editFields.flood_description !== editFlood.flood_description
    )
      changed.flood_description = editFields.flood_description;
    if (
      editFields.end_date &&
      editFields.end_date !== (editFlood.end_date || "") &&
      /^\d{4}-\d{2}-\d{2}$/.test(editFields.end_date)
    ) {
      changed.end_date = editFields.end_date;
    }
    if (Object.keys(changed).length === 0) {
      toast.info("No changes to update.");
      return;
    }
    console.log("Updating flood with:", changed);
    try {
      const response = await updateFlood(editFlood.flood_id, changed, token);
      console.log("UpdateFlood response:", response);
      toast.success("Flood event updated.");
      setShowEditModal(false);
      await getCurrentFlood(token);
      await getPastFloods(token);
    } catch (err) {
      console.error("Update error:", err);
      // Try to show the most informative error message
      let msg = err?.response?.data?.message || err?.message || JSON.stringify(err);
      toast.error(msg);
    }
  };

  // Only allow editing if user is admin
  const isAdmin = user?.role === "admin";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Flood Events
          </h1>
        </header>
        <main className="flex-1 px-4 py-8 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Current Flood Event */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Current Flood Event</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : currentFlood ? (
                  <div className="space-y-2">
                    <div><b>Name:</b> {currentFlood.flood_name}</div>
                    <div><b>Status:</b> {currentFlood.flood_status}</div>
                    <div><b>Start Date:</b> {currentFlood.start_date}</div>
                    <div><b>End Date:</b> {currentFlood.end_date || "-"}</div>
                    <div><b>Description:</b> {currentFlood.flood_description}</div>
                    {isAdmin && (
                      <Button className="mt-4" onClick={handleEditClick}>Update</Button>
                    )}
                  </div>
                ) : (
                  <p>No current flood event.</p>
                )}
              </CardContent>
            </Card>

            {/* Past Flood Events */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Past Flood Events</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : pastFloods && pastFloods.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastFloods.map(flood => (
                        <TableRow key={flood.flood_id}>
                          <TableCell>{flood.flood_name}</TableCell>
                          <TableCell>{flood.flood_status}</TableCell>
                          <TableCell>{flood.start_date}</TableCell>
                          <TableCell>{flood.end_date || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate" title={flood.flood_description}>{flood.flood_description}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => { setViewFlood(flood); setShowViewDialog(true); }}>View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p>No past flood events.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Edit Flood Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-lg" aria-describedby="edit-flood-desc">
            <DialogHeader>
              <DialogTitle>Edit Current Flood Event</DialogTitle>
            </DialogHeader>
            <p id="edit-flood-desc" className="text-sm text-gray-500 mb-2">
              Only admins can update flood event details. Leave fields blank to keep current values.
            </p>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleEditSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  name="flood_name"
                  value={editFields.flood_name || ""}
                  onChange={handleEditChange}
                  placeholder={editFlood?.flood_name || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="flood_status"
                  value={editFields.flood_status || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800"
                >
                  <option value="">{editFlood?.flood_status ? `Current: ${editFlood.flood_status}` : "Select status"}</option>
                  <option value="active">active</option>
                  <option value="over">over</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input
                  name="end_date"
                  type="date"
                  value={editFields.end_date || ""}
                  onChange={handleEditChange}
                  placeholder={editFlood?.end_date ? editFlood.end_date.slice(0, 10) : ""}
                  min={editFlood?.start_date ? editFlood.start_date.slice(0, 10) : undefined}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  name="flood_description"
                  value={editFields.flood_description || ""}
                  onChange={handleEditChange}
                  placeholder={editFlood?.flood_description || ""}
                />
              </div>
              <DialogFooter className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!isAdmin}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Flood Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Flood Event Details</DialogTitle>
            </DialogHeader>
            {viewFlood && (
              <div className="space-y-2">
                <div><b>Name:</b> {viewFlood.flood_name}</div>
                <div><b>Status:</b> {viewFlood.flood_status}</div>
                <div><b>Start Date:</b> {viewFlood.start_date}</div>
                <div><b>End Date:</b> {viewFlood.end_date || "-"}</div>
                <div><b>Description:</b> {viewFlood.flood_description}</div>
                <div><b>Created By (Admin ID):</b> {viewFlood.admin_id}</div>
                {/* Add more fields if needed */}
              </div>
            )}
            <DialogFooter className="flex justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default FloodEvents;
