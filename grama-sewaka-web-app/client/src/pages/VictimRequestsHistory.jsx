import React, { useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useVictimRequestStore } from "@/stores/useVictimRequestStore";
import { useUserStore } from "@/stores/useUserStore";

function RequestCard({ request }) {
  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-3 transition-transform hover:scale-[1.02] hover:shadow-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
          <span className="font-semibold text-lg text-gray-900 dark:text-white">
            {request.victim_request_title || request.name}
          </span>
        </div>
        <Badge>{request.victim_request_status || request.status}</Badge>
      </div>
      <div className="text-gray-700 dark:text-gray-300 text-base mb-1 font-medium">
        {request.victim_request_message}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span className="inline-flex items-center gap-1"><b>By:</b> {request.first_name} {request.last_name}</span>
        <span className="inline-flex items-center gap-1"><b>Phone:</b> {request.member_phone_number}</span>
        <span className="inline-flex items-center gap-1"><b>Date:</b> {request.victim_request_date}</span>
        <span className="inline-flex items-center gap-1"><b>Emergency:</b> {request.emergency_level}</span>
        <span className="inline-flex items-center gap-1"><b>Needs:</b> {request.needs}</span>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span className="inline-flex items-center gap-1"><b>Address:</b> {request.address}</span>
        <span className="inline-flex items-center gap-1"><b>Members:</b> {request.house_members}</span>
        <span className="inline-flex items-center gap-1"><b>Distance to river:</b> {request.distance_to_river}m</span>
      </div>
      <div className="absolute top-2 right-2">
        <span className="rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
          #{request.victim_request_id}
        </span>
      </div>
    </div>
  );
}

export default function VictimRequestsHistory() {
  const { user } = useUserStore();
  const role = user?.role;
  const {
    history,
    loading,
    error,
    fetchRequestHistory,
  } = useVictimRequestStore();

  useEffect(() => {
    fetchRequestHistory(role);
  }, [role, fetchRequestHistory]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Victim Requests History
            </h1>
          </div>
        </header>
        <div className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center items-center h-40">
                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></span>
                <span className="ml-3 text-gray-500 font-semibold">Loading...</span>
              </div>
            ) : error ? (
              <div className="col-span-full text-center text-red-500 font-semibold">{error}</div>
            ) : history.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 dark:text-gray-500">No history found.</div>
            ) : (
              history.map((req) => (
                <RequestCard key={req.victim_request_id} request={req} />
              ))
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
