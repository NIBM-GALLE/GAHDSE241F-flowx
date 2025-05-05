import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function Donation() {
  const [donations, setDonations] = useState([
    { id: 1, amount: 1000, status: "approved" },
    { id: 2, amount: 2000, status: "pending" },
    { id: 3, amount: 1500, status: "approved" },
    { id: 4, amount: 2500, status: "pending" },
  ]);

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            New Donations
          </CardTitle>
          <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
            View All Donations
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {donations.map((donation) => (
            <Card 
              key={donation.id} 
              className="shadow-sm hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700"
            >
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Donation #{donation.id}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Amount: ${donation.amount.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <Badge 
                  variant={donation.status === "approved" ? "default" : "secondary"}
                  className={
                    donation.status === "approved" 
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" 
                      : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                  }
                >
                  {donation.status}
                </Badge>
                <Button size="sm" variant="outline" className="text-gray-700 dark:text-gray-300">
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Donation;