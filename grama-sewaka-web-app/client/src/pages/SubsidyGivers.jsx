import React, { useState } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useSubsidyRequestStore } from "@/stores/useSubsidyRequestStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

const statusVariantMap = {
  approved: "success",
  pending: "warning",
  review: "secondary",
  rejected: "destructive",
  distributed: "success",
  collected: "success",
}

function SubsidyGivers() {
  const [search, setSearch] = useState("")
  const [viewRequest, setViewRequest] = useState(null)
  const { requests, loading, error, fetchDivisionSubsidyRequests } =
    useSubsidyRequestStore()

  React.useEffect(() => {
    fetchDivisionSubsidyRequests()
  }, [fetchDivisionSubsidyRequests])

  const filteredRequests = (requests || []).filter(
    (req) => {
      const searchLower = search.toLowerCase();
      return (
        (req.householder_name?.toLowerCase() || "").includes(searchLower) ||
        (req.house_id?.toString().toLowerCase() || "").includes(searchLower) ||
        (req.subsidy_name?.toLowerCase() || "").includes(searchLower) ||
        (req.subsidy_category?.toLowerCase() || "").includes(searchLower) ||
        (req.house_address?.toLowerCase() || "").includes(searchLower)
      );
    }
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Subsidy Requests (Division)
          </h1>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Input
              type="text"
              placeholder="Search by name, NIC, or subsidy"
              className="max-w-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle>All Subsidy Requests</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                <thead className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">House ID</th>
                    <th className="px-4 py-2">Subsidy</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Grama Sevaka</th>
                    <th className="px-4 py-2">Division</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="text-center py-8">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="10" className="text-center py-8 text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <tr
                        key={req.subsidy_house_id}
                        className="border-b dark:border-gray-700"
                      >
                        <td className="px-4 py-2">{req.householder_name}</td>
                        <td className="px-4 py-2">{req.house_id}</td>
                        <td className="px-4 py-2">{req.subsidy_name}</td>
                        <td className="px-4 py-2">{req.subsidy_category}</td>
                        <td className="px-4 py-2">{req.quantity}</td>
                        <td className="px-4 py-2">
                          <Badge
                            variant={
                              statusVariantMap[req.subsidies_status] || "secondary"
                            }
                          >
                            {req.subsidies_status?.charAt(0).toUpperCase() +
                              req.subsidies_status?.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          {req.grama_sevaka_first_name}{" "}
                          {req.grama_sevaka_last_name}
                        </td>
                        <td className="px-4 py-2">
                          {req.grama_niladhari_division_name}
                        </td>
                        <td className="px-4 py-2">{req.house_address}</td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewRequest(req)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
          {/* View Modal */}
          <Dialog
            open={!!viewRequest}
            onOpenChange={() => setViewRequest(null)}
          >
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Subsidy Request Details</DialogTitle>
              </DialogHeader>
              {viewRequest && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Name
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {viewRequest.householder_name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      House ID
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {viewRequest.house_id}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Subsidy
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {viewRequest.subsidy_name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Category
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {viewRequest.subsidy_category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Quantity
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {viewRequest.quantity}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Status
                    </span>
                    <span className="font-semibold">
                      <Badge
                        variant={
                          statusVariantMap[viewRequest.subsidies_status] ||
                          "secondary"
                        }
                      >
                        {viewRequest.subsidies_status?.charAt(0).toUpperCase() +
                          viewRequest.subsidies_status?.slice(1)}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Address
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {viewRequest.house_address}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Flood
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {viewRequest.flood_name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Grama Sevaka
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {viewRequest.grama_sevaka_first_name}{" "}
                      {viewRequest.grama_sevaka_last_name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Division
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {viewRequest.grama_niladhari_division_name}
                    </span>
                  </div>
                </div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SubsidyGivers
