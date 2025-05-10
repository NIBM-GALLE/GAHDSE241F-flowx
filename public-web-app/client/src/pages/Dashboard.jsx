import React from "react";

import { FloodPredictions } from "@/components/dashboard/FloodPredictions";
import { Announcements } from "@/components/dashboard/Announcements";
import { Subsidies } from "@/components/dashboard/Subsidies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function Dashboard() {
  // Dummy data
  const floodData = {
    location: "Galle",
    floodRisk: 75,
    predictedWaterLevel: "3.2m",
    predictionTime: "2025-05-10 08:00",
  };

  const announcements = [
    {
      type: "warning",
      title: "Heavy Rainfall Alert",
      message: "Expect heavy rainfall in Colombo and surrounding areas within the next 24 hours.",
      date: "2025-05-09",
    },
    {
      type: "info",
      title: "Relief Camp Setup",
      message: "A new relief camp has been set up at Galle Town Hall.",
      date: "2025-05-08",
    },
    {
      type: "general",
      title: "Donation Drive",
      message: "We are organizing a donation drive. Volunteers are welcome!",
      date: "2025-05-07",
    },
  ];

  const subsidies = [
    {
      title: "Emergency Relief Fund",
      description: "Immediate financial aid for affected families",
      amount: "LKR 25,000",
      eligibility: "Flood-affected residents of Galle",
    },
    {
      title: "Agricultural Loss Compensation",
      description: "Compensation for crop damages due to flooding",
      amount: "LKR 50,000",
      eligibility: "Registered farmers in Southern Province",
    },
  ];

  return (
    <div>
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

          <main className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <FloodPredictions
                  floodData={floodData}
                  floodRisk={floodData.floodRisk}
                />
              </div>
              <div className="lg:col-span-1">
                <Tabs defaultValue="announcements" className="h-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="announcements">Announcements</TabsTrigger>
                    <TabsTrigger value="subsidies">Subsidies</TabsTrigger>
                  </TabsList>
                  <TabsContent value="announcements">
                    <Announcements />
                  </TabsContent>
                  <TabsContent value="subsidies">
                    <Subsidies subsidies={subsidies} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Dashboard;
