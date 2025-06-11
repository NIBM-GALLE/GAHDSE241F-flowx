import React, { useEffect } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useUserStore } from "@/stores/useUserStore";

export default function Subsidies() {
  const { token } = useUserStore();
  const {
    subsidies,
    subsidiesLoading,
    subsidiesError,
    fetchSubsidies,
  } = useDashboardStore(token);

  useEffect(() => {
    fetchSubsidies();
    // eslint-disable-next-line
  }, [token]);

  if (subsidiesLoading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800 animate-pulse">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Loading subsidies...</h2>
        </CardHeader>
        <CardContent className="pt-6 h-24" />
      </Card>
    );
  }

  if (subsidiesError) {
    return (
      <Card className="border border-red-200 dark:border-red-800">
        <CardHeader className="bg-red-50 dark:bg-red-900/20 rounded-t-lg">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">Error loading subsidies</h2>
        </CardHeader>
        <CardContent className="pt-6 text-red-600 dark:text-red-300">
          {subsidiesError}
        </CardContent>
      </Card>
    );
  }

  if (!subsidies || subsidies.length === 0) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No new subsidies</h2>
        </CardHeader>
        <CardContent className="pt-6 text-gray-500 dark:text-gray-400">
          There are no new subsidies at the moment.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Subsidies</h2>
          <Button 
          variant="outline" size="sm" className="text-gray-700 dark:text-gray-300" onClick={() => window.location.href = "/subsidy-notes"}>
            View All Subsidies
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-800">
              <TableRow>
                <TableHead className="text-gray-700 dark:text-gray-300">Header</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Category</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Quantity</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Collect Place</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subsidies.map((subsidy, idx) => (
                <TableRow key={subsidy.id || subsidy._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {subsidy.header || subsidy.subsidy_name || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
                      {subsidy.category || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {subsidy.quantity ?? subsidy.current_quantity ?? "-"}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {subsidy.collectPlace || subsidy.collection_place || "-"}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {subsidy.members || subsidy.member_count || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}