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
import { Badge } from "@/components/ui/badge";

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

export default function VictimRequestsPage() {
  const { user } = useUserStore();
  const role = user?.role;
  const [tab, setTab] = useState("pending");
  const {
    requests,
    approvedRequests,
    history,
    loading,
    error,
    fetchPendingRequests,
    fetchApprovedRequests,
    fetchRequestHistory,
    updateRequestStatus,
  } = useVictimRequestStore();

  useEffect(() => {
    if (tab === "pending") fetchPendingRequests(role);
    if (tab === "approved") fetchApprovedRequests(role);
    if (tab === "history") fetchRequestHistory(role);
  }, [tab, role, fetchPendingRequests, fetchApprovedRequests, fetchRequestHistory]);

  const handleApprove = async (id) => {
    await updateRequestStatus({ role, victim_request_id: id, status: "approved" });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Victim Requests
            </h1>
          </div>
        </header>
        <div className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8 space-y-6 bg-gray-50 dark:bg-gray-900">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">New Requests</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requests.length === 0 ? <div>No new requests.</div> :
                    requests.map((req) => (
                      <RequestCard key={req.victim_request_id} request={req} canApprove={role === 'grama_sevaka'} onApprove={handleApprove} />
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="approved">
              {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedRequests.length === 0 ? <div>No approved requests.</div> :
                    approvedRequests.map((req) => (
                      <RequestCard key={req.victim_request_id} request={req} canApprove={false} />
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="history">
              {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.length === 0 ? <div>No history found.</div> :
                    history.map((req) => (
                      <RequestCard key={req.victim_request_id} request={req} canApprove={false} />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
