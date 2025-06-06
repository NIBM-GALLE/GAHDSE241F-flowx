import React, { useEffect, useState } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useDonationStore } from "@/stores/useDonationStore";

function DonationHistory() {
  const {
    donationHistory,
    donationStats,
    fetchDonationHistory,
    fetchDonationStats,
    getDonationById,
    selectedDonation,
    error,
    clearSelected,
  } = useDonationStore();

  const [search, setSearch] = useState("");
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    fetchDonationHistory();
    fetchDonationStats();
    // eslint-disable-next-line
  }, []);

  const handleView = async (id) => {
    await getDonationById(id);
    setShowView(true);
  };

  const filtered = donationHistory.filter((d) =>
    (d.fullname || d.donor_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.category || d.donations_amount || "").toString().toLowerCase().includes(search.toLowerCase()) ||
    (d.donation_phone_number || d.donations_method || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.donation_email || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.date || d.announcement_date || "").includes(search)
  );

  const stats = donationStats?.current_flood?.statistics || donationStats?.overall_statistics || {};

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Donation History & Statistics
          </h1>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900 space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Collected</CardTitle>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.collected || 0}</div>
              </CardHeader>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending || 0}</div>
              </CardHeader>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Rejected</CardTitle>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected || 0}</div>
              </CardHeader>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Total</CardTitle>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</div>
              </CardHeader>
            </Card>
          </div>

          {/* History Table */}
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">Donation History</CardTitle>
              <div className="mt-4 flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Search by donor, amount, method, or date"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {error && <div className="text-red-600 text-sm mb-2 px-6 pt-4">{error}</div>}
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-900">
                      <TableHead>Donor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length > 0 ? (
                      filtered.map((d) => (
                        <TableRow key={d.donations_id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <TableCell className="font-medium">{d.fullname || d.donor_name || "-"}</TableCell>
                          <TableCell>{d.category || d.donations_amount}</TableCell>
                          <TableCell>{d.donation_phone_number || d.donations_method}</TableCell>
                          <TableCell>{d.donation_email}</TableCell>
                          <TableCell>Rs. {d.donations_amount || d.amount}</TableCell>
                          <TableCell>{d.date || d.announcement_date || d.start_date}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${d.donations_status === "collected" ? "bg-green-100 text-green-800" : d.donations_status === "pending" ? "bg-yellow-100 text-yellow-800" : d.donations_status === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                              {d.donations_status || d.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleView(d.donations_id)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No donation history found.
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DonationHistory;
