import { AppSidebar } from "@/components/sidebar/app-sidebar"
import React, { useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import FloodSummary from "@/components/dashboard/FloodSummary";
import Donation from "@/components/dashboard/Donation";
import VictimRequests from "@/components/dashboard/VictimRequests";
import Subsidies from "@/components/dashboard/Subsidies";

function Page() {
    const [userRole, setUserRole] = useState("gramasewaka");
    
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
            <FloodSummary />
            {userRole !== "gramasewaka" && <Donation />}
            <Subsidies />
            <VictimRequests />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page;