import React from "react";
import {
  Home,
  User,
  Phone,
  MapPin,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Mail
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
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

function ShelterRequest() {
  // Sample data matching your database schema
  const [requests, setRequests] = useState([
    {
      shelter_request_id: 1,
      shelter_request_title: "Flooded House - Immediate Evacuation Needed",
      shelter_request_message: "Water level rising rapidly, already 2 feet inside the house. Need immediate relocation for family of 4.",
      shelter_request_needs: "Temporary shelter, food, clothing",
      emergency_level: "critical",
      shelter_request_status: "pending",
      member: {
        member_id: 1,
        first_name: "Kamal",
        last_name: "Perera",
        member_email: "kamal@example.com",
        member_phone_number: "0771234567",
        house: {
          house_id: "H001",
          address: "123 River Street, Colombo 05",
          latitude: 6.927079,
          longitude: 79.861244,
          members: 4,
          distance_to_river: 50.25,
          grama_niladhari_division_id: 101,
          divisional_secretariat_id: 10,
          district_id: 1
        }
      }
    },
    {
      shelter_request_id: 2,
      shelter_request_title: "House Partially Submerged",
      shelter_request_message: "First floor under water, staying on second floor but need to evacuate elderly parents.",
      shelter_request_needs: "Shelter with wheelchair access, medical assistance",
      emergency_level: "high",
      shelter_request_status: "in_progress",
      member: {
        member_id: 2,
        first_name: "Nimali",
        last_name: "Fernando",
        member_email: "nimali@example.com",
        member_phone_number: "0769876543",
        house: {
          house_id: "H002",
          address: "456 Flood Lane, Gampaha",
          latitude: 7.091706,
          longitude: 79.999817,
          members: 3,
          distance_to_river: 120.75,
          grama_niladhari_division_id: 102,
          divisional_secretariat_id: 11,
          district_id: 2
        }
      }
    },
    {
      shelter_request_id: 3,
      shelter_request_title: "Potential Flood Risk",
      shelter_request_message: "Water levels rising near our home, requesting preemptive shelter arrangement.",
      shelter_request_needs: "Temporary shelter for 5 people",
      emergency_level: "medium",
      shelter_request_status: "pending",
      member: {
        member_id: 3,
        first_name: "Sunil",
        last_name: "Rathnayake",
        member_email: "sunil@example.com",
        member_phone_number: "0712345678",
        house: {
          house_id: "H003",
          address: "789 Canal Road, Kalutara",
          latitude: 6.585278,
          longitude: 79.963889,
          members: 5,
          distance_to_river: 200.50,
          grama_niladhari_division_id: 103,
          divisional_secretariat_id: 12,
          district_id: 3
        }
      }
    }
  ]);

  const [expandedRequest, setExpandedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [emergencyFilter, setEmergencyFilter] = useState("all");

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.member.house.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.shelter_request_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      request.shelter_request_status === statusFilter;
    
    const matchesEmergency = 
      emergencyFilter === "all" || 
      request.emergency_level === emergencyFilter;
    
    return matchesSearch && matchesStatus && matchesEmergency;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <RefreshCw className="h-3 w-3 mr-1" /> In Progress
        </Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
        </Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="h-3 w-3 mr-1" /> Rejected
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getEmergencyBadge = (level) => {
    switch (level) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const toggleExpandRequest = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const updateRequestStatus = (id, newStatus) => {
    setRequests(requests.map(request => 
      request.shelter_request_id === id 
        ? { ...request, shelter_request_status: newStatus } 
        : request
    ));
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 bg-blue-600 text-white">
          <SidebarTrigger className="-ml-1 text-white" />
          <h1 className="text-xl font-semibold">
            Shelter Requests (Admin)
          </h1>
        </header>

        <main className="p-4 bg-white dark:bg-gray-900">
          <div className="flex-1 p-4 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Shelter Requests
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage all shelter requests from affected residents
                  </p>
                </div>
              </div>

              <Card className="border border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search requests..."
                        className="pl-8 border-gray-300 dark:border-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex gap-2">
                            <Filter className="h-4 w-4" />
                            {statusFilter === "all" ? "Status" : statusFilter.replace('_', ' ')}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                            All Statuses
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("in_progress")}>
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                            Rejected
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            {emergencyFilter === "all" ? "Emergency" : emergencyFilter}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem onClick={() => setEmergencyFilter("all")}>
                            All Levels
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEmergencyFilter("critical")}>
                            Critical
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEmergencyFilter("high")}>
                            High
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEmergencyFilter("medium")}>
                            Medium
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEmergencyFilter("low")}>
                            Low
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">All Shelter Requests</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    {filteredRequests.length} requests found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No requests found matching your criteria</p>
                      </div>
                    ) : (
                      filteredRequests.map((request) => (
                        <Card 
                          key={request.shelter_request_id} 
                          className="overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <div 
                            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center"
                            onClick={() => toggleExpandRequest(request.shelter_request_id)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="hidden md:block">
                                {expandedRequest === request.shelter_request_id ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {request.shelter_request_title}
                                  </h3>
                                  {getStatusBadge(request.shelter_request_status)}
                                  {getEmergencyBadge(request.emergency_level)}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
                                    {request.member.first_name} {request.member.last_name}
                                  </Badge>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {request.member.house.address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {expandedRequest === request.shelter_request_id && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Requester Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="text-gray-500 dark:text-gray-400">Name</p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                          {request.member.first_name} {request.member.last_name}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 dark:text-gray-400">Contact</p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                          {request.member.member_phone_number}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                          {request.member.member_email}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 dark:text-gray-400">House ID</p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                          {request.member.house.house_id}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" /> House Details
                                    </h4>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                      <p>
                                        <span className="font-medium">Address:</span> {request.member.house.address}
                                      </p>
                                      <p>
                                        <span className="font-medium">Family Members:</span> {request.member.house.members}
                                      </p>
                                      <p>
                                        <span className="font-medium">Distance to River:</span> {request.member.house.distance_to_river} meters
                                      </p>
                                      <p>
                                        <span className="font-medium">Coordinates:</span> {request.member.house.latitude}, {request.member.house.longitude}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Request Details
                                    </h4>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                      <p>
                                        <span className="font-medium">Message:</span> {request.shelter_request_message}
                                      </p>
                                      <p>
                                        <span className="font-medium">Needs:</span> {request.shelter_request_needs}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">Emergency Level:</span>
                                        {getEmergencyBadge(request.emergency_level)}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">Status:</span>
                                        {getStatusBadge(request.shelter_request_status)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Location Map
                                    </h4>
                                    <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                                      <p className="text-gray-500 dark:text-gray-400">
                                        Map view would be displayed here with coordinates: 
                                        {request.member.house.latitude}, {request.member.house.longitude}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end gap-3 pt-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="border-blue-300 text-blue-600 dark:text-blue-400">
                                      Change Status
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem 
                                      onClick={() => updateRequestStatus(request.shelter_request_id, "pending")}
                                    >
                                      Mark as Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => updateRequestStatus(request.shelter_request_id, "in_progress")}
                                    >
                                      Mark as In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => updateRequestStatus(request.shelter_request_id, "completed")}
                                    >
                                      Mark as Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => updateRequestStatus(request.shelter_request_id, "rejected")}
                                    >
                                      Mark as Rejected
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                  Assign Shelter
                                </Button>
                                <Button variant="outline">
                                  <Mail className="h-4 w-4 mr-2" /> Contact
                                </Button>
                              </div>
                            </div>
                          )}
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ShelterRequest;