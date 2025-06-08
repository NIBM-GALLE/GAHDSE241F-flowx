import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useUserStore } from "@/stores/useUserStore";

function Donation() {
  const { token } = useUserStore();
  const {
    donations,
    donationsLoading,
    donationsError,
    fetchDonations,
  } = useDashboardStore(token);

  useEffect(() => {
    fetchDonations();
    // eslint-disable-next-line
  }, [token]);

  if (donationsLoading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800 animate-pulse">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading donations...
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 h-24" />
      </Card>
    );
  }

  if (donationsError) {
    return (
      <Card className="border border-red-200 dark:border-red-800">
        <CardHeader className="bg-red-50 dark:bg-red-900/20 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-red-700 dark:text-red-300">
            Error loading donations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-red-600 dark:text-red-300">
          {donationsError}
        </CardContent>
      </Card>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            No new donations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-gray-500 dark:text-gray-400">
          There are no new donations at the moment.
        </CardContent>
      </Card>
    );
  }

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
              key={donation.id || donation._id} 
              className="shadow-sm hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700"
            >
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Donation #{donation.id || donation._id}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Amount: ${donation.amount ? donation.amount.toLocaleString() : 0}
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