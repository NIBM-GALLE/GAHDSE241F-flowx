import React, { useEffect, useState } from "react";
import {
  Home,
  MapPin,
  Users,
  Phone,
  Clock,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Info
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useShelterStore } from "@/stores/useShelterStore";

function ShelterInformation() {
  const [expandedShelter, setExpandedShelter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");

  const {
    fetchShelterInfo,
    assignedShelter,
    allShelters,
    loadingShelterInfo,
    errorShelterInfo,
    fetchShelterHistory,
    shelterHistory,
    loadingHistory,
    errorHistory
  } = useShelterStore();

  useEffect(() => {
    fetchShelterInfo();
    fetchShelterHistory();
    // eslint-disable-next-line
  }, []);

  // Get unique districts from allShelters for filter
  const districts = [
    "All Districts",
    ...Array.from(new Set(allShelters.map(s => s.divisional_secretariat_id || s.district)))
  ];

  const filteredShelters = allShelters.filter(shelter => {
    const matchesSearch =
      (shelter.shelter_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shelter.shelter_address || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict =
      districtFilter === "all" ||
      districtFilter === "All Districts" ||
      (shelter.divisional_secretariat_id && shelter.divisional_secretariat_id.toString() === districtFilter) ||
      (shelter.district && shelter.district === districtFilter);
    return matchesSearch && matchesDistrict;
  });

  const toggleExpandShelter = (id) => {
    setExpandedShelter(expandedShelter === id ? null : id);
  };

  const getAvailabilityBadge = (available) => {
    return available > 0 ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Available</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Full</Badge>
    );
  };

  // Helper for request status badge
  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle unauthorized error
  if ((errorShelterInfo && errorShelterInfo.toLowerCase().includes('token')) ||
      (errorHistory && errorHistory.toLowerCase().includes('token'))) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Shelter Information</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

          <main className="p-4 bg-white dark:bg-gray-900">
            <div className="max-w-xl mx-auto mt-12 text-center">
              <Card className="border border-red-300 dark:border-red-700">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Not Authorized</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Your session has expired or you are not authorized. Please log in again to continue.</p>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/login'}>Go to Login</Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Shelter Information</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-4 bg-white dark:bg-gray-900">
          <div className="flex-1 p-4 md:p-8">
            <div className="space-y-6">
              {/* Shelter Request History Section */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Your Shelter Request History</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    {loadingHistory ? 'Loading...' : (shelterHistory?.length || 0) + ' requests found'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingHistory ? (
                    <div className="flex items-center gap-2 text-blue-600"><Clock className="animate-spin" /> Loading history...</div>
                  ) : errorHistory ? (
                    <div className="text-red-600">{errorHistory}</div>
                  ) : shelterHistory && shelterHistory.length > 0 ? (
                    <div className="space-y-3">
                      {shelterHistory.map((item, idx) => (
                        <Card key={idx} className="border border-gray-200 dark:border-gray-700">
                          <CardHeader className="flex flex-row items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold">{item.flood_name || 'Flood'} ({item.start_date?.slice(0,10)})</span>
                            {getStatusBadge(item.shelter_request_status)}
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              <div><b>Title:</b> {item.shelter_request_title}</div>
                              <div><b>Message:</b> {item.shelter_request_message}</div>
                              <div><b>Needs:</b> {item.shelter_request_needs}</div>
                              <div><b>Status:</b> {item.shelter_request_status}</div>
                              <div><b>Address:</b> {item.house_address}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">No previous shelter requests found.</div>
                  )}
                </CardContent>
              </Card>
              {/* Assigned Shelter Section */}
              <Card className="border border-green-300 dark:border-green-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Your Assigned Shelter</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingShelterInfo ? (
                    <div className="flex items-center gap-2 text-green-600"><Clock className="animate-spin" /> Loading assigned shelter...</div>
                  ) : errorShelterInfo ? (
                    <div className="text-red-600">{errorShelterInfo}</div>
                  ) : assignedShelter ? (
                    <div className="space-y-2">
                      <div className="font-semibold text-lg">{assignedShelter.shelter_name}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{assignedShelter.shelter_address}</div>
                      <div className="flex gap-2 mt-2">
                        {getAvailabilityBadge(assignedShelter.available)}
                        <Badge variant="outline">Capacity: {assignedShelter.shelter_size}</Badge>
                        <Badge variant="outline">Available: {assignedShelter.available}</Badge>
                      </div>
                      {assignedShelter.flood_name && (
                        <div className="text-xs text-gray-500 mt-1">Flood: {assignedShelter.flood_name} ({assignedShelter.start_date} - {assignedShelter.end_date || 'Ongoing'})</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500">No assigned shelter found.</div>
                  )}
                </CardContent>
              </Card>
              {/* Search and Filter UI */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search shelters..."
                        className="pl-8 border-gray-300 dark:border-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-2">
                          <Filter className="h-4 w-4" />
                          {districtFilter === "all" ? "Filter by District" : districtFilter}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {districts.map((district) => (
                          <DropdownMenuItem
                            key={district}
                            onClick={() => setDistrictFilter(district)}
                          >
                            {district}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
              {/* All Shelters List */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Shelter List</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    {filteredShelters.length} shelters found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loadingShelterInfo ? (
                      <div className="text-center py-8 text-blue-600"><Clock className="animate-spin" /> Loading shelters...</div>
                    ) : errorShelterInfo ? (
                      <div className="text-red-600">{errorShelterInfo}</div>
                    ) : filteredShelters.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No shelters found matching your criteria</p>
                      </div>
                    ) : (
                      filteredShelters.map((shelter) => (
                        <Card
                          key={shelter.shelter_id}
                          className="overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <div
                            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center"
                            onClick={() => toggleExpandShelter(shelter.shelter_id)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="hidden md:block">
                                {expandedShelter === shelter.shelter_id ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {shelter.shelter_name}
                                  </h3>
                                  {getAvailabilityBadge(shelter.available)}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
                                    {shelter.divisional_secretariat_id || shelter.district}
                                  </Badge>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Capacity: {shelter.available}/{shelter.shelter_size}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {expandedShelter === shelter.shelter_id && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Address
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {shelter.shelter_address}
                                    </p>
                                  </div>
                                  {/* Add more details if available from backend */}
                                </div>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Current Status
                                    </h4>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                      <p>
                                        <span className="font-medium">Capacity:</span> {shelter.available}/{shelter.shelter_size}
                                      </p>
                                      <p>
                                        <span className="font-medium">Availability:</span> {shelter.available > 0 ? "Accepting people" : "At full capacity"}
                                      </p>
                                    </div>
                                  </div>
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
              {/* Information Card */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-gray-900 dark:text-white">Shelter Guidelines</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <p>• Space is limited - please respect shelter rules</p>
                  <p>• Pets may not be allowed in all shelters</p>
                  <p>• Report any issues to shelter staff immediately</p>
                  <p>• Follow all safety instructions from shelter staff</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ShelterInformation;