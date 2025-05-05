import { Card, CardContent, CardHeader, CardTitle, 
    CardDescription, CardFooter
 } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const newVictimRequests = [
  {
    id: 1,
    name: "Nimal Perera",
    nic: "902345678V",
    date: "2025-05-01",
    location: "Galle",
    contact: "0771234567",
    status: "pending",
  },
  {
    id: 2,
    name: "Sunethra Silva",
    nic: "952349812V",
    date: "2025-05-03",
    location: "Matara",
    contact: "0719876543",
    status: "verified",
  },
  {
    id: 3,
    name: "Kamal Fernando",
    nic: "902345678V",
    date: "2025-05-02",
    location: "Colombo",
    contact: "0771234567",
    status: "pending",
  },
  {
    id: 4,
    name: "Anjali Kumari",
    nic: "952349812V",
    date: "2025-05-04",
    location: "Kandy",
    contact: "0719876543",
    status: "pending",
  },
];

export default function VictimRequests() {
  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            New Victim Requests
          </CardTitle>
          <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
            View All Requests
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {newVictimRequests.map((request) => (
            <Card 
              key={request.id} 
              className="shadow-sm hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    {request.name}
                  </CardTitle>
                  <Badge 
                    variant={request.status === "verified" ? "default" : "secondary"}
                    className={
                      request.status === "verified" 
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" 
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    }
                  >
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">NIC:</span>
                  <span className="text-gray-700 dark:text-gray-300">{request.nic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Date:</span>
                  <span className="text-gray-700 dark:text-gray-300">{request.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Location:</span>
                  <span className="text-gray-700 dark:text-gray-300">{request.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Contact:</span>
                  <span className="text-gray-700 dark:text-gray-300">{request.contact}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-4">
                <Button size="sm" variant="outline" className="text-gray-700 dark:text-gray-300">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}