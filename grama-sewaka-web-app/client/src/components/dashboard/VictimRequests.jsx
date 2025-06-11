import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useVictimRequestStore } from "@/stores/useVictimRequestStore";
import { useUserStore } from "@/stores/useUserStore";
import { useNavigate } from "react-router-dom";

export default function VictimRequests() {
  const { user } = useUserStore();
  const role = user?.role;
  const {
    requests,
    loading,
    error,
    fetchPendingRequests,
  } = useVictimRequestStore();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingRequests(role);
  }, [role, fetchPendingRequests]);

  const statusVariantMap = {
    approved: "success",
    pending: "warning",
    review: "secondary",
    rejected: "destructive",
    distributed: "success",
    collected: "success",
    verified: "success",
  };

  if (loading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800 animate-pulse">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading victim requests...
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 h-24" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-red-200 dark:border-red-800">
        <CardHeader className="bg-red-50 dark:bg-red-900/20 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-red-700 dark:text-red-300">
            Error loading victim requests
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-red-600 dark:text-red-300">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            No new victim requests
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-gray-500 dark:text-gray-400">
          There are no new victim requests at the moment.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            New Victim Requests
          </CardTitle>
          <Button
            variant="primary"
            onClick={() => navigate("/newvictimrequests")}
            className="ml-4"
          >
            View All Requests
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 overflow-x-auto">
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
            {requests.map((req) => (
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
            ))}
          </tbody>
        </table>
      </CardContent>
      {/* View Dialog */}
      <Dialog open={!!viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Victim Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest ? (
            <div className="space-y-2">
              <div className="flex justify-between"><span className="font-medium">First Name:</span><span>{selectedRequest.first_name}</span></div>
              <div className="flex justify-between"><span className="font-medium">Last Name:</span><span>{selectedRequest.last_name}</span></div>
              <div className="flex justify-between"><span className="font-medium">House ID:</span><span>{selectedRequest.house_id}</span></div>
              <div className="flex justify-between"><span className="font-medium">Title:</span><span>{selectedRequest.victim_request_title}</span></div>
              <div className="flex justify-between"><span className="font-medium">Date:</span><span>{selectedRequest.victim_request_date}</span></div>
              <div className="flex justify-between"><span className="font-medium">Status:</span><span>{selectedRequest.victim_request_status}</span></div>
              <div className="flex justify-between"><span className="font-medium">Emergency:</span><span>{selectedRequest.emergency_level}</span></div>
              <div className="flex justify-between"><span className="font-medium">Address:</span><span>{selectedRequest.address}</span></div>
              <div className="flex justify-between"><span className="font-medium">Message:</span><span>{selectedRequest.victim_request_message}</span></div>
              <div className="flex justify-between"><span className="font-medium">Needs:</span><span>{selectedRequest.needs}</span></div>
              <div className="flex justify-between"><span className="font-medium">Members:</span><span>{selectedRequest.house_members}</span></div>
              <div className="flex justify-between"><span className="font-medium">Phone:</span><span>{selectedRequest.member_phone_number}</span></div>
              <div className="flex justify-between"><span className="font-medium">Distance to River:</span><span>{selectedRequest.distance_to_river}m</span></div>
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