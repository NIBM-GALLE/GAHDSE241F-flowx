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

function PendingDonations() {
  const {
    pendingDonations,
    fetchPendingDonations,
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
    fetchPendingDonations();
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
    fetchPendingDonations();
  };

  const filtered = pendingDonations.filter((d) =>
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
          <h1 className="text-xl font-semibold">Pending Donations</h1>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900">
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle>Pending Donation Requests</CardTitle>
              <div className="mt-4">
                <Input
                  type="text"
                  placeholder="Search by donor, method or date"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {error && <div className="text-red-600 text-sm mb-2 px-6 pt-4">{error}</div>}
              {success && <div className="text-green-600 text-sm mb-2 px-6 pt-4">{success}</div>}
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-900">
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
                        <TableRow key={d.donations_id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <TableCell className="font-medium">{d.fullname || d.name || "-"}</TableCell>
                          <TableCell>Rs. {d.category || d.donations_amount}</TableCell>
                          <TableCell>{d.donation_phone_number || d.donations_method}</TableCell>
                          <TableCell>{d.donation_email}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${d.donations_status === "pending" ? "bg-gray-200 text-gray-800" : d.donations_status === "collected" ? "bg-green-100 text-green-800" : d.donations_status === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                              {d.donations_status || d.status}
                            </span>
                          </TableCell>
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
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No pending donation requests found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* View Dialog */}
          <Dialog open={showView} onOpenChange={(v) => { setShowView(v); if (!v) clearSelected(); }}>
            <DialogContent className="max-w-lg rounded-2xl shadow-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <DialogTitle className="text-gray-900 dark:text-gray-200 text-lg font-bold">Donation Details</DialogTitle>
                <DialogClose asChild>
                  <button className="text-gray-700 dark:text-gray-200 hover:text-gray-400 text-2xl font-bold focus:outline-none">&times;</button>
                </DialogClose>
              </div>
              <div className="p-6 bg-white dark:bg-gray-900">
                {selectedDonation ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    {Object.entries(selectedDonation).map(([key, value]) => (
                      <div key={key} className="flex flex-col mb-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize text-sm">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-gray-900 dark:text-gray-100 text-base break-words">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">Loading...</div>
                )}
                <DialogFooter className="mt-6 flex justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </div>
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
                  variant={statusValue === "collected" ? "default" : "outline"}
                  onClick={() => setStatusValue("collected")}
                  className="w-full"
                >
                  Set as Collected
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

export default PendingDonations;
