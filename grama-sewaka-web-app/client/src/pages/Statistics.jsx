import React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function Statistics() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold flex items-center gap-2">
            Statistics
          </h1>
        </header>
        <main className="p-4">
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Statistics Page</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This page will display flood and relief statistics in the future.
            </p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Statistics;
