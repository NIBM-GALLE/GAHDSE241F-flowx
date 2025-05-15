import { AppSidebar } from "@/components/sidebar/app-sidebar"
import React, { useState } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Filter, Search, X } from "lucide-react"

function VictimHistory() {
  const userRole = "admin"
  const [searchTerm, setSearchTerm] = useState("")
  const [season, setSeason] = useState("")

  // Mocked data (replace with API data)
  const victimHistory = [
    {
      id: 1,
      name: "John Doe",
      season: "Summer",
      status: "Approved",
    },
    {
      id: 2,
      name: "Jane Smith",
      season: "Winter",
      status: "Pending",
    },
  ]

  const filteredVictims = victimHistory.filter((v) =>
    (v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.id.toString().includes(searchTerm)) &&
    (season === "" || v.season === season)
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Victim History
            </h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8 space-y-6 bg-gray-50 dark:bg-gray-900">
          {userRole === "admin" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0">
                
                {/* Search Bar */}
                <div className="w-full">
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Search by Name or ID
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                    <input
                      type="text"
                      placeholder="Enter victim name or ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="p-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
                    />
                    <div className="px-2 text-gray-400">
                      <Search size={18} />
                    </div>
                  </div>
                </div>

                {/* Season Filter */}
                <div className="w-full">
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Filter by Season
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="">All Seasons</option>
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter</option>
                    <option value="Spring">Spring</option>
                    <option value="Autumn">Autumn</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <Button onClick={() => {}} className="flex items-center gap-2">
                    <Filter size={16} />
                    Apply
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm("")
                      setSeason("")
                    }}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-500"
                  >
                    <X size={16} />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Victim History Table */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Victim Records
            </h2>

            {filteredVictims.length > 0 ? (
              <table className="w-full table-auto text-left border-collapse">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Season</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVictims.map((victim) => (
                    <tr key={victim.id} className="text-gray-800 dark:text-gray-100">
                      <td className="px-4 py-2">{victim.id}</td>
                      <td className="px-4 py-2">{victim.name}</td>
                      <td className="px-4 py-2">{victim.season}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            victim.status === "Approved"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {victim.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No victims found.</p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default VictimHistory;
