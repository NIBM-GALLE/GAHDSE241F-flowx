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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const initialNotes = [
  {
    id: 1,
    name: "Kamal Perera",
    nic: "951234567V",
    note: "Approved for fertilizer subsidy due to consistent crop yield.",
    date: "2025-03-15",
  },
  {
    id: 2,
    name: "Nimal Silva",
    nic: "902345678V",
    note: "Subsidy granted for irrigation improvement.",
    date: "2025-02-28",
  },
  {
    id: 3,
    name: "Sunil Rathnayake",
    nic: "871122334V",
    note: "Pending follow-up on land ownership verification.",
    date: "2025-01-10",
  },
    {
        id: 4,
        name: "Anjali Fernando",
        nic: "981234567V",
        note: "Subsidy application under review.",
        date: "2025-03-01",
    },
    {
        id: 5,
        name: "Dilani Jayasinghe",
        nic: "891234567V",
        note: "Approved for seed subsidy for next planting season.",
        date: "2025-02-20",
    },
    {
        id: 6,
        name: "Ravi Kumara",
        nic: "781234567V",
        note: "Subsidy granted for equipment purchase.",
        date: "2025-01-15",
    },
]

function SubsidyNotes() {
  const [search, setSearch] = useState("")
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
            Subsidy Notes
          </h1>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900">
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle>Notes of Given Subsidies</CardTitle>
              <div className="mt-4">
                <Label>Search Notes</Label>
                <Input
                  type="text"
                  placeholder="Search by name, NIC or note..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>NIC</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                      <TableRow key={note.id}>
                        <TableCell>{note.name}</TableCell>
                        <TableCell>{note.nic}</TableCell>
                        <TableCell>{note.note}</TableCell>
                        <TableCell>{note.date}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="4" className="text-center">
                        No matching notes found.
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

export default SubsidyNotes;
