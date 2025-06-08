import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useUserStore } from "@/stores/useUserStore";

export default function VictimRequests() {
  const { token } = useUserStore();
  const {
    victimRequests,
    victimRequestsLoading,
    victimRequestsError,
    fetchVictimRequests,
  } = useDashboardStore(token);

  useEffect(() => {
    fetchVictimRequests();
    // eslint-disable-next-line
  }, [token]);

  if (victimRequestsLoading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800 animate-pulse">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading victim requests...
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 h-24" />
      </Card>
    );
  }

  if (victimRequestsError) {
    return (
      <Card className="border border-red-200 dark:border-red-800">
        <CardHeader className="bg-red-50 dark:bg-red-900/20 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-red-700 dark:text-red-300">
            Error loading victim requests
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-red-600 dark:text-red-300">
          {victimRequestsError}
        </CardContent>
      </Card>
    );
  }

  if (!victimRequests || victimRequests.length === 0) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            No new victim requests
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-gray-500 dark:text-gray-400">
          There are no new victim requests at the moment.
        </CardContent>
      </Card>
    );
  }

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
          {victimRequests.map((request) => (
            <Card 
              key={request.id || request._id} 
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