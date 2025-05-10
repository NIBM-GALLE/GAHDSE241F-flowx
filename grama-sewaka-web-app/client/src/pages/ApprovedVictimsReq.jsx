import { AppSidebar } from "@/components/sidebar/app-sidebar"
import React, { useState } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import Victim from "@/components/victims/victims"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"

function ApprovedVictimsReq() {
    const userRole = "admin"
    
      return (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:border-gray-800">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  New Victim Requests
                </h1>
              </div>
            </header>
    
            <div className="flex flex-1 flex-col bg-gray-50 dark:bg-gray-900">
              <div className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8 space-y-6">
                
                {/* Filter Section (Only for admin) */}
                {userRole === "admin" && (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0">
                          
                    {/* Location filter */}
                    <div className="flex flex-col w-full">
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Filter by Location
                      </label>
                      <select className="border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200">
                          <option value="">Select Location</option>
                          <option value="location1">Location 1</option>
                          <option value="location2">Location 2</option>
                          <option value="location3">Location 3</option>
                          <option value="location4">Location 4</option>
                          <option value="location5">Location 5</option>
                      </select>
                    </div>
            
                    {/* Buttons */}
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <Button className="flex items-center gap-2">
                        <Filter size={16} />
                        Apply
                      </Button>
                      <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-red-500">
                        <X size={16} />
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
                )}
    
                <Victim />
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      )
}

export default ApprovedVictimsReq;