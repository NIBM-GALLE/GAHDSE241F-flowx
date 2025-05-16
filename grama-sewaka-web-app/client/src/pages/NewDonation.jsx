import React, { useState } from "react"
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
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const initialRequests = [
  {
    id: 1,
    name: "Kamal Perera",
    amount: "5000",
    method: "Cash",
    date: "2025-05-01",
    status: "Pending",
  },
  {
    id: 2,
    name: "Nimali Silva",
    amount: "2000",
    method: "Bank Transfer",
    date: "2025-05-02",
    status: "Pending",
  },
  {
    id: 3,
    name: "Sunil Rathnayake",
    amount: "3000",
    method: "Online",
    date: "2025-05-04",
    status: "Pending",
  },
]

function NewDonation() {
  const [requests, setRequests] = useState(initialRequests)
  const [search, setSearch] = useState("")

  const handleAccept = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Accepted" } : req
      )
    )
    toast.success("Donation request accepted")
  }

  const filteredRequests = requests.filter(
    (req) =>
      req.name.toLowerCase().includes(search.toLowerCase()) ||
      req.method.toLowerCase().includes(search.toLowerCase()) ||
      req.date.includes(search)
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Donation Requests
          </h1>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900">
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle>People Who Want to Give Donations</CardTitle>
              <div className="mt-4">
                <Input
                  type="text"
                  placeholder="Search by name, method or date"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>{req.name}</TableCell>
                        <TableCell>Rs. {req.amount}</TableCell>
                        <TableCell>{req.method}</TableCell>
                        <TableCell>{req.date}</TableCell>
                        <TableCell>{req.status}</TableCell>
                        <TableCell>
                          {req.status === "Pending" ? (
                            <Button
                              size="sm"
                              onClick={() => handleAccept(req.id)}
                            >
                              Accept
                            </Button>
                          ) : (
                            <span className="text-green-500 font-medium">Accepted</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No donation requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default NewDonation;
