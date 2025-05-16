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
import { toast } from "sonner"

const initialData = [
  { id: 1, name: "Nimal Perera", nic: "911234567V", subsidy: "Fertilizer", year: "2022" },
  { id: 2, name: "Kamal Silva", nic: "921234568V", subsidy: "Seed", year: "2025" },
  { id: 3, name: "Sunil Fernando", nic: "891234569V", subsidy: "Equipment", year: "2023" },
  { id: 4, name: "Anil Perera", nic: "911234567V", subsidy: "Fertilizer", year: "2024" },
  { id: 5, name: "Pavan Jayasinghe", nic: "921234568V", subsidy: "Seed", year: "2025" },
  { id: 6, name: "Nishani Wanigasingha", nic: "791234569V", subsidy: "Equipment", year: "2025" },
]

function SubsidyGivers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [people, setPeople] = useState(initialData)

  const [newName, setNewName] = useState("")
  const [newNIC, setNewNIC] = useState("")
  const [newSubsidy, setNewSubsidy] = useState("")
  const [newYear, setNewYear] = useState("")

  const filteredPeople = people.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nic.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddSubsidy = (e) => {
    e.preventDefault()
    if (!newName || !newNIC || !newSubsidy || !newYear) {
      toast.error("Please fill all fields")
      return
    }

    const newEntry = {
      id: people.length + 1,
      name: newName,
      nic: newNIC,
      subsidy: newSubsidy,
      year: newYear,
    }

    setPeople([newEntry, ...people])
    setNewName("")
    setNewNIC("")
    setNewSubsidy("")
    setNewYear("")
    toast.success("New subsidy added (UI only)")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Subsidy Beneficiaries
          </h1>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900 space-y-8">
          {/* Search & Table */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Input
              type="text"
              placeholder="Search by name or NIC"
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle>Selected People</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                <thead className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">NIC</th>
                    <th className="px-4 py-2">Subsidy Type</th>
                    <th className="px-4 py-2">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeople.length > 0 ? (
                    filteredPeople.map((person) => (
                      <tr key={person.id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2">{person.name}</td>
                        <td className="px-4 py-2">{person.nic}</td>
                        <td className="px-4 py-2">{person.subsidy}</td>
                        <td className="px-4 py-2">{person.year}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Add New Subsidy Form */}
          
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 max-w-2xl">
            <CardHeader>
              <CardTitle>Add New Subsidy</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSubsidy} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="Enter full name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>NIC</Label>
                  <Input
                    placeholder="Enter NIC number"
                    value={newNIC}
                    onChange={(e) => setNewNIC(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subsidy Type</Label>
                  <Input
                    placeholder="Enter subsidy type (e.g. Fertilizer)"
                    value={newSubsidy}
                    onChange={(e) => setNewSubsidy(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    placeholder="Enter year (e.g. 2025)"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Add Subsidy</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SubsidyGivers;
