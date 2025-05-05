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
  
  const newSubsidies = [
    {
      id: 1,
      header: "School Supplies",
      category: "Education",
      quantity: 150,
      collectPlace: "Galle Center",
      members: 5,
    },
    {
      id: 2,
      header: "Dry Rations",
      category: "Food",
      quantity: 80,
      collectPlace: "Colombo South",
      members: 3,
    },
    {
      id: 3,
      header: "Medical Kits",
      category: "Health",
      quantity: 40,
      collectPlace: "Matara Clinic",
      members: 2,
    },
  ];
  
  export default function Subsidies() {
    return (
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Subsidies</h2>
            <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
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
                {newSubsidies.map((subsidy) => (
                  <TableRow key={subsidy.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {subsidy.header}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
                        {subsidy.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {subsidy.quantity}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {subsidy.collectPlace}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {subsidy.members}
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