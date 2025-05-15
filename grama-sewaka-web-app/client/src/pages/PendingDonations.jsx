import React, { useEffect, useState } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Dummy data — replace with API call later
const dummyDonations = [
  {
    id: 1,
    donorName: "John Doe",
    amount: 5000,
    date: "2025-05-12",
    status: "Pending",
    reference: "DON1234",
  },
  {
    id: 2,
    donorName: "Ayesha Silva",
    amount: 2000,
    date: "2025-05-10",
    status: "Pending",
    reference: "DON5678",
  },
    {
        id: 3,
        donorName: "Ravi Kumar",
        amount: 1500,
        date: "2025-05-08",
        status: "Pending",
        reference: "DON9101",
    },
    {
        id: 4,
        donorName: "Priya Sharma",
        amount: 3000,
        date: "2025-05-06",
        status: "Pending",
        reference: "DON1121",
    },

]

function PendingDonations() {
  const [donations, setDonations] = useState([])

  useEffect(() => {
    // In real app, fetch data from API
    // fetch("/api/donations?status=pending").then(res => res.json()).then(setDonations)
    setDonations(dummyDonations)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pending Donations
          </h1>
        </header>

        <div className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900">
          <ScrollArea className="h-full pr-2">
            <div className="grid gap-4">
              {donations.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No pending donations found.
                </p>
              ) : (
                donations.map((donation) => (
                  <Card
                    key={donation.id}
                    className="bg-white dark:bg-gray-800 border dark:border-gray-700"
                  >
                    <CardHeader className="flex flex-row justify-between items-center">
                      <CardTitle className="text-base font-medium text-gray-900 dark:text-white">
                        {donation.donorName}
                      </CardTitle>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-500">
                        {donation.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p><strong>Amount:</strong> Rs. {donation.amount}</p>
                      <p><strong>Date:</strong> {donation.date}</p>
                      <p><strong>Reference ID:</strong> {donation.reference}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default PendingDonations;
