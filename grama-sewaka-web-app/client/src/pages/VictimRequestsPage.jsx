import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useVictimRequestStore } from "@/stores/useVictimRequestStore";
import { useUserStore } from "@/stores/useUserStore";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function RequestCard({ request, canApprove, onApprove }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 p-5 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg text-gray-900 dark:text-white">{request.victim_request_title || request.name}</div>
        <Badge variant={request.victim_request_status === 'approved' ? 'success' : 'secondary'}>
          {request.victim_request_status || request.status}
        </Badge>
      </div>
      <div className="text-gray-700 dark:text-gray-300 text-sm mb-1">{request.victim_request_message}</div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>By: {request.first_name} {request.last_name}</span>
        <span>Phone: {request.member_phone_number}</span>
        <span>Date: {request.victim_request_date}</span>
        <span>Emergency: {request.emergency_level}</span>
        <span>Needs: {request.needs}</span>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Address: {request.address}</span>
        <span>Members: {request.house_members}</span>
        <span>Distance to river: {request.distance_to_river}m</span>
      </div>
      {canApprove && request.victim_request_status === 'pending' && (
        <Button size="sm" className="mt-2 w-fit" onClick={() => onApprove(request.victim_request_id)}>
          Approve
        </Button>
      )}
    </div>
  );
}

function RequestTable({ data, columns, onView }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                No data found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.victim_request_id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{row[col.key]}</TableCell>
                ))}
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => onView(row)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function VictimRequestsPage() {
  const { user } = useUserStore();
  const role = user?.role;
  const [search, setSearch] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [tab, setTab] = useState("pending");
  const {
    requests,
    approvedRequests,
    history,
    loading,
    error,
    fetchPendingRequests,
    fetchApprovedRequests,
    fetchRequestHistory
  } = useVictimRequestStore();

  useEffect(() => {
    if (tab === "pending") fetchPendingRequests(role);
    if (tab === "approved") fetchApprovedRequests(role);
    if (tab === "history") fetchRequestHistory(role);
  }, [tab, role, fetchPendingRequests, fetchApprovedRequests, fetchRequestHistory]);

  // Filtered lists
  const filteredRequests = (tab === "pending" ? requests : tab === "approved" ? approvedRequests : history) || [];
  const filtered = filteredRequests.filter(req => {
    const searchLower = search.toLowerCase();
    return (
      (req.first_name?.toLowerCase() || "").includes(searchLower) ||
      (req.last_name?.toLowerCase() || "").includes(searchLower) ||
      (req.house_id?.toString().toLowerCase() || "").includes(searchLower) ||
      (req.address?.toLowerCase() || "").includes(searchLower) ||
      (req.victim_request_title?.toLowerCase() || "").includes(searchLower)
    );
  });

  const statusVariantMap = {
    approved: "success",
    pending: "warning",
    review: "secondary",
    rejected: "destructive",
    distributed: "success",
    collected: "success",
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Victim Requests
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
            <Tabs value={tab} onValueChange={setTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="pending">New Requests</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle>All Victim Requests</CardTitle>
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
                      <td colSpan="9" className="text-center py-8">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8 text-red-500">{error}</td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((req) => (
                      <tr key={req.victim_request_id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2">{req.first_name}</td>
                        <td className="px-4 py-2">{req.last_name}</td>
                        <td className="px-4 py-2">{req.house_id}</td>
                        <td className="px-4 py-2">{req.victim_request_title}</td>
                        <td className="px-4 py-2">{req.victim_request_date}</td>
                        <td className="px-4 py-2">
                          <Badge variant={statusVariantMap[req.victim_request_status] || "secondary"}>
                            {req.victim_request_status?.charAt(0).toUpperCase() + req.victim_request_status?.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">{req.emergency_level}</td>
                        <td className="px-4 py-2">{req.address}</td>
                        <td className="px-4 py-2 text-right">
                          <Button size="sm" variant="outline" onClick={() => { setSelectedRequest(req); setViewModalOpen(true); }}>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-4 py-4 text-center text-gray-500">No records found.</td>
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
                    <span className="text-xs text-gray-500 dark:text-gray-400">First Name</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.first_name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Last Name</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.last_name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">House ID</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.house_id}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Title</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.victim_request_title}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Date</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.victim_request_date}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                    <span className="font-semibold">
                      <Badge variant={statusVariantMap[selectedRequest.victim_request_status] || "secondary"}>
                        {selectedRequest.victim_request_status?.charAt(0).toUpperCase() + selectedRequest.victim_request_status?.slice(1)}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Emergency</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.emergency_level}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Address</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.address}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Message</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.victim_request_message}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Needs</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.needs}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Members</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.house_members}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Phone</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.member_phone_number}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Distance to River</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedRequest.distance_to_river}m</span>
                  </div>
                </div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}