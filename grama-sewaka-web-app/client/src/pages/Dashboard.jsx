import { AppSidebar } from "@/components/sidebar/app-sidebar"
import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import FloodSummary from "@/components/dashboard/FloodSummary";
import Donation from "@/components/dashboard/Donation";
import VictimRequests from "@/components/dashboard/VictimRequests";
import Subsidies from "@/components/dashboard/Subsidies";
import { useUserStore } from "@/stores/useUserStore";

function Page() {
  const { user } = useUserStore();
  // user?.role should be one of: 'admin', 'government_officer', 'grama_sevaka'
  const userRole = user?.role;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:border-gray-800">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col bg-gray-50 dark:bg-gray-900">
          <div className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8 space-y-6">
            {/* Admin: show empty state or message */}
            {userRole === "admin" && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-300">
                <h2 className="text-2xl font-bold mb-2">Welcome, Admin!</h2>
                <p className="mb-4">Admin dashboard is coming soon. You will be able to add, view, and update flood and flood details here.</p>
                <span className="text-4xl">🚧</span>
              </div>
            )}
            {/* Government Officer: show all widgets */}
            {userRole === "government_officer" && (
              <>
                <FloodSummary />
                <Donation />
                <Subsidies />
                <VictimRequests />
              </>
            )}
            {/* Grama Niladhari: hide Donation */}
            {userRole === "grama_sevaka" && (
              <>
                <FloodSummary />
                <Subsidies />
                <VictimRequests />
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;