import React from "react";
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
import { useState } from "react";

function ShelterInformation() {
  const [expandedShelter, setExpandedShelter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");

  const shelters = [
    {
      id: "SHEL-001",
      name: "Colombo Public School",
      district: "Colombo",
      address: "123 Education Road, Colombo 07",
      capacity: "250 people",
      currentOccupancy: "180 people",
      contact: "0112 345 678",
      facilities: ["Food", "Water", "Medical Aid", "Toilets", "Beds"],
      available: true,
      directions: "Near Colombo University, next to the main playground"
    },
    {
      id: "SHEL-002",
      name: "Gampaha Community Hall",
      district: "Gampaha",
      address: "456 Town Hall Road, Gampaha",
      capacity: "150 people",
      currentOccupancy: "90 people",
      contact: "0332 345 678",
      facilities: ["Food", "Water", "Toilets"],
      available: true,
      directions: "Opposite the Gampaha bus stand"
    },
    {
      id: "SHEL-003",
      name: "Kalutara Temple Grounds",
      district: "Kalutara",
      address: "789 Temple Road, Kalutara",
      capacity: "300 people",
      currentOccupancy: "250 people",
      contact: "0342 345 678",
      facilities: ["Food", "Water", "Medical Aid", "Toilets"],
      available: true,
      directions: "Behind the Kalutara Bodhiya"
    },
    {
      id: "SHEL-004",
      name: "Galle Municipal Hall",
      district: "Galle",
      address: "321 Church Road, Galle",
      capacity: "200 people",
      currentOccupancy: "200 people",
      contact: "0912 345 678",
      facilities: ["Water", "Toilets", "First Aid"],
      available: false,
      directions: "Next to the Galle Fort entrance"
    },
    {
      id: "SHEL-005",
      name: "Matara Sports Complex",
      district: "Matara",
      address: "654 Sports Lane, Matara",
      capacity: "400 people",
      currentOccupancy: "300 people",
      contact: "0412 345 678",
      facilities: ["Food", "Water", "Medical Aid", "Toilets", "Showers"],
      available: true,
      directions: "Near the Matara bus terminal"
    }
  ];

  const districts = [
    "All Districts",
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Galle",
    "Matara",
    "Hambantota",
    "Kandy",
    "Matale"
  ];

  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = 
      shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shelter.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shelter.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = 
      districtFilter === "all" || 
      districtFilter === "All Districts" ||
      shelter.district === districtFilter;
    
    return matchesSearch && matchesDistrict;
  });

  const toggleExpandShelter = (id) => {
    setExpandedShelter(expandedShelter === id ? null : id);
  };

  const getAvailabilityBadge = (available) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        Available
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        Full
      </Badge>
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 bg-blue-600 text-white">
          <SidebarTrigger className="-ml-1 text-white" />
          <h1 className="text-xl font-semibold">
            Shelter Information
          </h1>
        </header>

        <main className="p-4 bg-white dark:bg-gray-900">
          <div className="flex-1 p-4 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Available Shelters
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Find safe locations near you
                  </p>
                </div>
              </div>

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

              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Shelter List</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    {filteredShelters.length} shelters found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredShelters.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No shelters found matching your criteria</p>
                      </div>
                    ) : (
                      filteredShelters.map((shelter) => (
                        <Card 
                          key={shelter.id} 
                          className="overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <div 
                            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center"
                            onClick={() => toggleExpandShelter(shelter.id)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="hidden md:block">
                                {expandedShelter === shelter.id ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {shelter.name}
                                  </h3>
                                  {getAvailabilityBadge(shelter.available)}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
                                    {shelter.district}
                                  </Badge>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Capacity: {shelter.currentOccupancy}/{shelter.capacity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {expandedShelter === shelter.id && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Address
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {shelter.address}
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Contact
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {shelter.contact}
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Directions
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {shelter.directions}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Facilities
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {shelter.facilities.map((facility, index) => (
                                        <Badge 
                                          key={index} 
                                          variant="outline" 
                                          className="text-blue-600 dark:text-blue-400"
                                        >
                                          {facility}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Current Status
                                    </h4>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                      <p>
                                        <span className="font-medium">Capacity:</span> {shelter.currentOccupancy}/{shelter.capacity}
                                      </p>
                                      <p>
                                        <span className="font-medium">Availability:</span> {shelter.available ? "Accepting people" : "At full capacity"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end pt-2">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                  Get Directions
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