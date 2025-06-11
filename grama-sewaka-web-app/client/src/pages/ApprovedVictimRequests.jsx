import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useVictimRequestStore } from "@/stores/useVictimRequestStore";
import { useUserStore } from "@/stores/useUserStore";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ApprovedVictimRequests() {
  const { user } = useUserStore();
  const role = user?.role;
  const {
    approvedRequests,
    loading,
    error,
    fetchApprovedRequests,
  } = useVictimRequestStore();
  const [search, setSearch] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchApprovedRequests(role);
  }, [role, fetchApprovedRequests]);

  const statusVariantMap = {
    approved: "success",
    pending: "warning",
    review: "secondary",
    rejected: "destructive",
    distributed: "success",
    collected: "success",
  };

  const filtered = (approvedRequests || []).filter((req) => {
    const searchLower = search.toLowerCase();
    return (
      (req.first_name?.toLowerCase() || "").includes(searchLower) ||
      (req.last_name?.toLowerCase() || "").includes(searchLower) ||
      (req.house_id?.toString().toLowerCase() || "").includes(searchLower) ||
      (req.address?.toLowerCase() || "").includes(searchLower) ||
      (req.victim_request_title?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Approved Victim Requests
          </h1>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Input
              type="text"
              placeholder="Search by name, house ID, or address"
              className="max-w-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle>Approved Victim Requests</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                <thead className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-2">First Name</th>
                    <th className="px-4 py-2">Last Name</th>
                    <th className="px-4 py-2">House ID</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Emergency</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8 text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((req) => (
                      <tr
                        key={req.victim_request_id}
                        className="border-b dark:border-gray-700"
                      >
                        <td className="px-4 py-2">{req.first_name}</td>
                        <td className="px-4 py-2">{req.last_name}</td>
                        <td className="px-4 py-2">{req.house_id}</td>
                        <td className="px-4 py-2">{req.victim_request_title}</td>
                        <td className="px-4 py-2">{req.victim_request_date}</td>
                        <td className="px-4 py-2">
                          <Badge
                            variant={
                              statusVariantMap[req.victim_request_status] ||
                              "secondary"
                            }
                          >
                            {req.victim_request_status
                              ?.charAt(0)
                              .toUpperCase() +
                              req.victim_request_status?.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">{req.emergency_level}</td>
                        <td className="px-4 py-2">{req.address}</td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(req);
                              setViewModalOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
          {/* View Modal */}
          <Dialog open={!!viewModalOpen} onOpenChange={setViewModalOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Victim Request Details</DialogTitle>
              </DialogHeader>
              {selectedRequest && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      First Name
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.first_name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last Name
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.last_name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      House ID
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.house_id}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Title
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.victim_request_title}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Date
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.victim_request_date}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Status
                    </span>
                    <span className="font-semibold">
                      <Badge
                        variant={
                          statusVariantMap[selectedRequest.victim_request_status] ||
                          "secondary"
                        }
                      >
                        {selectedRequest.victim_request_status
                          ?.charAt(0)
                          .toUpperCase() +
                          selectedRequest.victim_request_status?.slice(1)}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Emergency
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.emergency_level}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Address
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.address}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Message
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.victim_request_message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Needs
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.needs}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Members
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.house_members}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Phone
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.member_phone_number}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Distance to River
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.distance_to_river}m
                    </span>
                  </div>
                </div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
