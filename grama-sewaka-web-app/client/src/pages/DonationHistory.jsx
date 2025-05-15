import React, { useState } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"

const dummyDonations = [
  {
    donorName: "John Doe",
    amount: 5000,
    method: "Cash",
    notes: "Monthly contribution",
    date: "2024-01-15",
  },
  {
    donorName: "Jane Smith",
    amount: 2500,
    method: "Online",
    notes: "One-time help",
    date: "2023-09-10",
  },
  {
    donorName: "Michael Fernando",
    amount: 1000,
    method: "Bank Transfer",
    notes: "",
    date: "2025-04-05",
  },
]

function DonationHistory() {
  const [yearFilter, setYearFilter] = useState("")
  const [filteredData, setFilteredData] = useState(dummyDonations)

  const handleFilter = () => {
    if (yearFilter === "") {
      setFilteredData(dummyDonations)
    } else {
      const filtered = dummyDonations.filter((donation) =>
        donation.date.startsWith(yearFilter)
      )
      setFilteredData(filtered)
    }
  }

  const handleClear = () => {
    setYearFilter("")
    setFilteredData(dummyDonations)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Donation History
          </h1>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900 space-y-6">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Label className="text-sm text-gray-700 dark:text-gray-300">
                Filter by Year
              </Label>
                <Input
                    type="text"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    placeholder="YYYY"
                    className="w-32"
                />
                <Button onClick={handleFilter} className="bg-blue-500 text-white">
                  <Filter size={16} />
                </Button>
                <Button onClick={handleClear} className="bg-red-500 text-white">
                    <X size={16} />
                </Button>
            </div>
            <Button
              className="bg-green-500 text-white"   
                onClick={() => {
                    
                    console.log("Add New Donation")
                    }
                }
            >
              Add New Donation
            </Button>
          </div>
           


          <Card className="p-4 border dark:border-gray-700 bg-white dark:bg-gray-800">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3">Donor</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((donation, index) => (
                    <tr key={index} className="border-b dark:border-gray-600">
                      <td className="px-4 py-2">{donation.donorName}</td>
                      <td className="px-4 py-2">Rs. {donation.amount}</td>
                      <td className="px-4 py-2">{donation.method}</td>
                      <td className="px-4 py-2">{donation.date}</td>
                      <td className="px-4 py-2">{donation.notes || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center px-4 py-4 text-gray-500">
                      No donation records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DonationHistory;
