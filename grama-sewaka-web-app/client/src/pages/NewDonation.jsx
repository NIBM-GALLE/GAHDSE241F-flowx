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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { toast } from "sonner" // ✅ NEW

function NewDonation() {
  const [donorName, setDonorName] = useState("")
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState(new Date())

  const handleSubmit = (e) => {
    e.preventDefault()

    const newDonation = {
      donorName,
      amount,
      method,
      notes,
      date: format(date, "yyyy-MM-dd"),
    }

    console.log("Submitting donation:", newDonation)

    toast("Donation Submitted", {
      description: "Your donation has been recorded (UI only).",
    })

    setDonorName("")
    setAmount("")
    setMethod("")
    setNotes("")
    setDate(new Date())
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            New Donation
          </h1>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle>Enter Donation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Donor Name</Label>
                  <Input
                    placeholder="Enter donor's name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Amount (Rs.)</Label>
                  <Input
                    type="number"
                    placeholder="Enter donation amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Any additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setDonorName("")
                      setAmount("")
                      setMethod("")
                      setNotes("")
                      setDate(new Date())
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="submit">Submit Donation</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default NewDonation;
