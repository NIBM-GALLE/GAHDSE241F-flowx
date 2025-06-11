import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useUserStore } from "@/stores/useUserStore";

function Donation() {
  const { token } = useUserStore();
  const {
    donations,
    donationsLoading,
    donationsError,
    fetchDonations,
  } = useDashboardStore(token);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDonations();
    // eslint-disable-next-line
  }, [token]);

  if (donationsLoading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800 animate-pulse">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading donations...
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 h-24" />
      </Card>
    );
  }

  if (donationsError) {
    return (
      <Card className="border border-red-200 dark:border-red-800">
        <CardHeader className="bg-red-50 dark:bg-red-900/20 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-red-700 dark:text-red-300">
            Error loading donations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-red-600 dark:text-red-300">
          {donationsError}
        </CardContent>
      </Card>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            No new donations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-gray-500 dark:text-gray-400">
          There are no new donations at the moment.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            New Donations
          </CardTitle>
          <Button 
            variant="outline" size="sm" className="text-gray-700 dark:text-gray-300" onClick={() => window.location.href = "/donations/new-requests"}>
              View All Donations
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="text-xs text-gray-500 uppercase dark:text-gray-400">
            <tr>
              <th className="px-4 py-2">Donor</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Contact Number</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.map((d) => (
                <tr key={d.id || d._id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{d.fullname || d.name || "-"}</td>
                  <td className="px-4 py-2">Rs. {d.category || d.donations_amount}</td>
                  <td className="px-4 py-2">{d.donation_phone_number || d.donations_method}</td>
                  <td className="px-4 py-2">{d.donation_email}</td>
                  <td className="px-4 py-2">
                    <Badge variant={d.donations_status === "approved" ? "success" : d.donations_status === "pending" ? "warning" : d.donations_status === "rejected" ? "destructive" : "secondary"}>
                      {d.donations_status || d.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedDonation(d); setViewModalOpen(true); }}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8">No donation requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
      {/* View Dialog */}
      <Dialog open={!!viewModalOpen} onOpenChange={setViewModalOpen}>
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
    </Card>
  );
}

export default Donation;