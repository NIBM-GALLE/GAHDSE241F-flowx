import React, { useEffect, useState } from "react";
import { useDonationStore } from "@/stores/useDonationStore";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function NewDonationRequests() {
  const {
    newDonations,
    fetchNewDonations,
    getDonationById,
    updateDonationStatus,
    selectedDonation,
    loading,
    error,
    success,
    clearStatus,
    clearSelected,
  } = useDonationStore();

  const [search, setSearch] = useState("");
  const [showView, setShowView] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [statusId, setStatusId] = useState(null);
  const [statusValue, setStatusValue] = useState("");

  useEffect(() => {
    fetchNewDonations();
    // eslint-disable-next-line
  }, []);

  const handleView = async (id) => {
    await getDonationById(id);
    setShowView(true);
  };

  const handleStatus = (id) => {
    setStatusId(id);
    setShowStatus(true);
    setStatusValue("");
    clearStatus();
  };

  const handleStatusUpdate = async () => {
    if (!statusValue) return;
    await updateDonationStatus(statusId, statusValue);
    setShowStatus(false);
    setStatusId(null);
    setStatusValue("");
    fetchNewDonations();
  };

  const filtered = newDonations.filter((d) =>
    d.donor_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.method?.toLowerCase().includes(search.toLowerCase()) ||
    (d.announcement_date || d.date || "").includes(search)
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            New Donation Requests
          </h1>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900">
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle>People Who Want to Give Donations</CardTitle>
              <div className="mt-4">
                <Input
                  type="text"
                  placeholder="Search by donor, method or date"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
              {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((d) => (
                      <TableRow key={d.donations_id}>
                        <TableCell>{d.fullname || d.name || "-"}</TableCell>
                        <TableCell>Rs. {d.category || d.donations_amount}</TableCell>
                        <TableCell>{d.donation_phone_number || d.donations_method}</TableCell>
                        <TableCell>{d.donation_email} </TableCell>
                        <TableCell>{d.donations_status || d.status}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="mr-2" onClick={() => handleView(d.donations_id)}>
                            View
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleStatus(d.donations_id)}>
                            Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No donation requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* View Dialog */}
          <Dialog open={showView} onOpenChange={(v) => { setShowView(v); if (!v) clearSelected(); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Donation Details</DialogTitle>
              </DialogHeader>
              {selectedDonation ? (
                <div className="space-y-2">
                  {Object.entries(selectedDonation).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Loading...</div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Status Dialog */}
          <Dialog open={showStatus} onOpenChange={setShowStatus}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Donation Status</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button
                  variant={statusValue === "pending" ? "default" : "outline"}
                  onClick={() => setStatusValue("pending")}
                  className="w-full"
                >
                  Set as Pending
                </Button>
                <Button
                  variant={statusValue === "rejected" ? "destructive" : "outline"}
                  onClick={() => setStatusValue("rejected")}
                  className="w-full"
                >
                  Reject
                </Button>
              </div>
              <DialogFooter>
                <Button onClick={handleStatusUpdate} disabled={!statusValue || loading}>
                  {loading ? "Updating..." : "Update Status"}
                </Button>
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

export default NewDonationRequests;
