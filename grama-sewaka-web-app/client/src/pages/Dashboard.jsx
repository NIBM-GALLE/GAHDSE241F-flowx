import { AppSidebar } from "@/components/sidebar/app-sidebar"
import React, { useEffect } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import FloodSummary from "@/components/dashboard/FloodSummary";
import Donation from "@/components/dashboard/Donation";
import VictimRequests from "@/components/dashboard/VictimRequests";
import Subsidies from "@/components/dashboard/Subsidies";
import Admin from "@/components/dashboard/Admin";
import { useUserStore } from "@/stores/useUserStore";
import ShelterMap from '@/components/dashboard/Map.jsx';
import { useShelterStore } from '@/stores/useShelterStore';


function Page() {
  const { user } = useUserStore();
  const userRole = user?.role;
  const { fetchAllSheltersPublic, sheltersPublic = [] } = useShelterStore();
  useEffect(() => { fetchAllSheltersPublic(); }, [fetchAllSheltersPublic]);

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
              <>
                <FloodSummary user={user} />
                <Admin user={user} />
              </>
            )}
            {/* Government Officer: show all widgets */}
            {userRole === "government_officer" && (
              <>
                <FloodSummary user={user} />
                <ShelterMap sheltersPublic={sheltersPublic} />
                <Donation user={user} />
                <Subsidies user={user} />
                <VictimRequests user={user} />
              </>
            )}
            {/* Grama Niladhari: hide Donation */}
            {userRole === "grama_sevaka" && (
              <>
                <FloodSummary user={user} />
                <ShelterMap sheltersPublic={sheltersPublic} />
                <Subsidies user={user} />
                <VictimRequests user={user} />
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;