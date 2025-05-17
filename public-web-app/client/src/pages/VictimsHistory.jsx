import React from "react";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  CalendarDays,
  FileText,
  MapPin,
  User,
  Phone,
  Home,
  HeartHandshake,
  Info
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";

function VictimHistory() {
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const requests = [
    {
      id: "REQ-2023-001",
      date: "2023-11-15T14:30:00",
      fullName: "Kamal Perera",
      phone: "+94 77 123 4567",
      district: "Colombo",
      city: "Dehiwala",
      urgency: "critical",
      assistanceType: "rescue",
      status: "completed",
      details: "Family of 4 trapped in rising flood waters. Need immediate evacuation from 2nd floor.",
      response: "Rescue team dispatched at 15:10. Family evacuated safely at 16:30.",
      landmarks: "Near St. Mary's Church, behind Dehiwala Zoo",
      address: "123 Galle Road, Dehiwala",
      familyMembers: 4,
      medicalConditions: "Elderly mother with mobility issues"
    },
    {
      id: "REQ-2023-002",
      date: "2023-11-14T09:15:00",
      fullName: "Nimali Fernando",
      phone: "+94 76 987 6543",
      district: "Gampaha",
      city: "Negombo",
      urgency: "high",
      assistanceType: "shelter",
      status: "in-progress",
      details: "House completely flooded. Need temporary shelter for 3 family members.",
      response: "Assigned to Negombo Public School shelter. Waiting for transport.",
      landmarks: "Near Negombo fish market",
      address: "45 Canal Road, Negombo",
      familyMembers: 3,
      medicalConditions: "None"
    },
    {
      id: "REQ-2023-003",
      date: "2023-11-13T16:45:00",
      fullName: "Sunil Rathnayake",
      phone: "+94 71 234 5678",
      district: "Kalutara",
      city: "Panadura",
      urgency: "medium",
      assistanceType: "food",
      status: "pending",
      details: "No access to food supplies for 2 days. 5 family members including 2 children.",
      response: "Pending volunteer availability for delivery.",
      landmarks: "Near Panadura Bridge",
      address: "78 Galle Road, Panadura",
      familyMembers: 5,
      medicalConditions: "Youngest child has asthma"
    },
    {
      id: "REQ-2023-004",
      date: "2023-11-12T11:20:00",
      fullName: "Anoma Silva",
      phone: "+94 70 345 6789",
      district: "Colombo",
      city: "Moratuwa",
      urgency: "low",
      assistanceType: "medical",
      status: "completed",
      details: "Need prescription medication delivery for diabetes.",
      response: "Medications delivered on 2023-11-13 at 10:15.",
      landmarks: "Near Moratuwa University",
      address: "23 Temple Road, Moratuwa",
      familyMembers: 2,
      medicalConditions: "Type 2 diabetes"
    },
    {
      id: "REQ-2023-005",
      date: "2023-11-10T08:00:00",
      fullName: "Priyantha Bandara",
      phone: "+94 72 456 7890",
      district: "Galle",
      city: "Ambalangoda",
      urgency: "high",
      assistanceType: "water",
      status: "completed",
      details: "No access to clean water for 3 days. 6 family members.",
      response: "Water purification kits and bottled water delivered on 2023-11-11.",
      landmarks: "Near Ambalangoda Mask Museum",
      address: "12 Beach Road, Ambalangoda",
      familyMembers: 6,
      medicalConditions: "None"
    }
  ];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
        </Badge>;
      case "in-progress":
        return <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
          <Clock className="h-3 w-3 mr-1" /> In Progress
        </Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          <AlertCircle className="h-3 w-3 mr-1" /> Pending
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case "critical":
        return <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>;
      case "low":
        return <Badge className="bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const toggleExpandRequest = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 bg-gradient-to-r from-indigo-300 to-purple-200 text-white">
          <SidebarTrigger className="-ml-1 text-white" />
          <h1 className="text-xl font-semibold">
            My Request History
          </h1>
        </header>

        <main className="p-4 bg-gray-50 dark:bg-gray-900">
          <div className="flex-1 p-4 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-400 dark:text-indigo-300">
                    <FileText className="h-6 w-6" />
                    My Assistance Requests
                  </h1>
                  <p className="text-sm text-indigo-500 dark:text-indigo-400">
                    History of all your submitted requests
                  </p>
                </div>
              </div>

              <Card className="border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-indigo-500" />
                      <Input
                        placeholder="Search requests..."
                        className="pl-8 border-indigo-300 focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-2 border-indigo-300 hover:bg-indigo-50">
                          <Filter className="h-4 w-4 text-indigo-500" />
                          {statusFilter === "all" ? "Filter by Status" : statusFilter.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border-indigo-200">
                        <DropdownMenuItem 
                          onClick={() => setStatusFilter("all")}
                          className="hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                        >
                          All Requests
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setStatusFilter("completed")}
                          className="hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                        >
                          Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setStatusFilter("in-progress")}
                          className="hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                        >
                          In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setStatusFilter("pending")}
                          className="hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                        >
                          Pending
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                  <CardTitle className="text-purple-700 dark:text-purple-300">Request History</CardTitle>
                  <CardDescription className="text-purple-500 dark:text-purple-400">
                    {filteredRequests.length} requests found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-purple-400 dark:text-purple-500">No requests found matching your criteria</p>
                      </div>
                    ) : (
                      filteredRequests.map((request) => (
                        <Card 
                          key={request.id} 
                          className="overflow-hidden border-l-4"
                          style={{
                            borderLeftColor: 
                              request.urgency === "critical" ? "#f43f5e" :
                              request.urgency === "high" ? "#f97316" :
                              request.urgency === "medium" ? "#eab308" : "#84cc16"
                          }}
                        >
                          <div 
                            className="p-4 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 flex justify-between items-center"
                            onClick={() => toggleExpandRequest(request.id)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="hidden md:block">
                                {expandedRequest === request.id ? (
                                  <ChevronUp className="h-5 w-5 text-purple-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-purple-500" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-purple-800 dark:text-purple-200">
                                    {request.id} - {request.fullName}
                                  </h3>
                                  {getStatusBadge(request.status)}
                                </div>
                                <p className="text-sm text-purple-500 dark:text-purple-400">
                                  {formatDate(request.date)} • {request.district}, {request.city}
                                </p>
                              </div>
                            </div>
                            <div className="hidden md:block">
                              {getUrgencyBadge(request.urgency)}
                            </div>
                          </div>

                          {expandedRequest === request.id && (
                            <div className="border-t border-purple-100 dark:border-purple-800 p-4 space-y-4 bg-purple-50/50 dark:bg-purple-900/10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                                    <User className="h-4 w-4" /> Personal Information
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="text-purple-500 dark:text-purple-400">Phone</p>
                                      <p className="text-purple-800 dark:text-purple-200">{request.phone}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-500 dark:text-purple-400">Family Members</p>
                                      <p className="text-purple-800 dark:text-purple-200">{request.familyMembers}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-purple-500 dark:text-purple-400">Medical Conditions</p>
                                      <p className="text-purple-800 dark:text-purple-200">
                                        {request.medicalConditions || "None reported"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                                    <MapPin className="h-4 w-4" /> Location Details
                                  </h4>
                                  <div className="text-sm">
                                    <p className="text-purple-500 dark:text-purple-400">Address</p>
                                    <p className="text-purple-800 dark:text-purple-200">{request.address}</p>
                                    <p className="text-purple-500 dark:text-purple-400 mt-2">Landmarks</p>
                                    <p className="text-purple-800 dark:text-purple-200">{request.landmarks}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                                  <HeartHandshake className="h-4 w-4" /> Assistance Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="text-sm">
                                    <p className="text-purple-500 dark:text-purple-400">Type</p>
                                    <p className="text-purple-800 dark:text-purple-200 capitalize">
                                      {request.assistanceType}
                                    </p>
                                  </div>
                                  <div className="text-sm">
                                    <p className="text-purple-500 dark:text-purple-400">Urgency</p>
                                    <div>
                                      {getUrgencyBadge(request.urgency)}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm">
                                  <p className="text-purple-500 dark:text-purple-400">Request Details</p>
                                  <p className="text-purple-800 dark:text-purple-200">{request.details}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                                  <Info className="h-4 w-4" /> Response Information
                                </h4>
                                <div className="text-sm">
                                  <p className="text-purple-500 dark:text-purple-400">Status Update</p>
                                  <p className="text-purple-800 dark:text-purple-200">{request.response}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Table View */}
              <div className="md:hidden">
                <Card className="border border-purple-200 dark:border-purple-800">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                    <CardTitle className="text-purple-700 dark:text-purple-300">Recent Requests</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-purple-50 dark:bg-purple-900/10">
                        <TableRow>
                          <TableHead className="text-purple-700 dark:text-purple-300">ID</TableHead>
                          <TableHead className="text-purple-700 dark:text-purple-300">Status</TableHead>
                          <TableHead className="text-right text-purple-700 dark:text-purple-300">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.map((request) => (
                          <TableRow 
                            key={request.id} 
                            className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10"
                            onClick={() => toggleExpandRequest(request.id)}
                          >
                            <TableCell className="font-medium text-purple-800 dark:text-purple-200">
                              {request.id}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(request.status)}
                            </TableCell>
                            <TableCell className="text-right text-purple-500 dark:text-purple-400">
                              {new Date(request.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default VictimHistory;