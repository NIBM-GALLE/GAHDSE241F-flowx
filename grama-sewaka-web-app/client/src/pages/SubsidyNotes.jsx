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
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, PlusCircle, Download } from "lucide-react"

const initialNotes = [
  {
    id: 1,
    name: "Kamal Perera",
    nic: "951234567V",
    note: "Approved for fertilizer subsidy due to consistent crop yield.",
    date: "2025-03-15",
    status: "approved",
    amount: "LKR 15,000",
  },
  {
    id: 2,
    name: "Nimal Silva",
    nic: "902345678V",
    note: "Subsidy granted for irrigation improvement.",
    date: "2025-02-28",
    status: "approved",
    amount: "LKR 25,000",
  },
  {
    id: 3,
    name: "Sunil Rathnayake",
    nic: "871122334V",
    note: "Pending follow-up on land ownership verification.",
    date: "2025-01-10",
    status: "pending",
    amount: "LKR 10,000",
  },
  {
    id: 4,
    name: "Anjali Fernando",
    nic: "981234567V",
    note: "Subsidy application under review.",
    date: "2025-03-01",
    status: "review",
    amount: "LKR 12,000",
  },
  {
    id: 5,
    name: "Dilani Jayasinghe",
    nic: "891234567V",
    note: "Approved for seed subsidy for next planting season.",
    date: "2025-02-20",
    status: "approved",
    amount: "LKR 8,000",
  },
  {
    id: 6,
    name: "Ravi Kumara",
    nic: "781234567V",
    note: "Subsidy granted for equipment purchase.",
    date: "2025-01-15",
    status: "approved",
    amount: "LKR 35,000",
  },
]

const statusVariantMap = {
  approved: "success",
  pending: "warning",
  review: "secondary",
}

function SubsidyNotes() {
  const [search, setSearch] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  
  const filteredNotes = initialNotes.filter(
    (note) =>
      note.name.toLowerCase().includes(search.toLowerCase()) ||
      note.nic.toLowerCase().includes(search.toLowerCase()) ||
      note.note.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Agricultural Subsidy Management
          </h1>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Total Subsidies</CardTitle>
                  <CardDescription>This year</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">6</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Approved Amount</CardTitle>
                  <CardDescription>Total disbursed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">LKR 83,000</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Pending Approvals</CardTitle>
                  <CardDescription>Requiring action</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">2</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Table Card */}
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Subsidy Records</CardTitle>
                    <CardDescription>
                      All approved and pending agricultural subsidies
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search records..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 w-full md:w-[300px]"
                      />
                    </div>
                    <Button onClick={() => setIsAddingNote(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Record
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farmer</TableHead>
                      <TableHead>NIC</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotes.length > 0 ? (
                      filteredNotes.map((note) => (
                        <TableRow key={note.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <TableCell className="font-medium">{note.name}</TableCell>
                          <TableCell>{note.nic}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{note.note}</TableCell>
                          <TableCell>{note.amount}</TableCell>
                          <TableCell>
                            <Badge variant={statusVariantMap[note.status]}>
                              {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{note.date}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="6" className="text-center py-8">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Search className="h-8 w-8 text-muted-foreground" />
                            <p className="text-lg font-medium">No records found</p>
                            <p className="text-sm text-muted-foreground">
                              Try adjusting your search or add a new record
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{filteredNotes.length}</span> of <span className="font-medium">{initialNotes.length}</span> records
                </div>
                <div className="space-x-3">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SubsidyNotes;