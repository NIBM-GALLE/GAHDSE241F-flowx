import React from "react";
import {
  Gift,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  DollarSign,
  ClipboardList,
  Info,
  MapPin,
  User
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

function NewSubsidies() {
  const [expandedSubsidy, setExpandedSubsidy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const subsidies = [
    {
      id: "SUB-2023-045",
      title: "Flood Relief Cash Grant",
      category: "financial",
      amount: "LKR 25,000",
      description: "One-time cash grant for families affected by recent floods. Intended to cover basic necessities and emergency expenses.",
      eligibility: "Families in flood-affected districts with damage to primary residence",
      status: "active",
      deadline: "2023-12-31",
      applicationLink: "https://relief.gov.lk/flood-grant",
      contact: "0112 345 678",
      districts: ["Colombo", "Gampaha", "Kalutara", "Galle", "Matara"],
      requirements: ["National ID", "Proof of residence", "Damage assessment report"]
    },
    {
      id: "SUB-2023-044",
      title: "Agricultural Recovery Package",
      category: "agriculture",
      amount: "Up to LKR 100,000",
      description: "Subsidy for farmers to recover crops and equipment damaged by floods. Includes seeds, tools, and technical assistance.",
      eligibility: "Registered farmers with flood-damaged crops/equipment",
      status: "active",
      deadline: "2024-01-15",
      applicationLink: "https://agri.gov.lk/flood-recovery",
      contact: "0112 345 679",
      districts: ["All flood-affected areas"],
      requirements: ["Farmer registration", "Damage photos", "Land ownership proof"]
    },
    {
      id: "SUB-2023-043",
      title: "Home Repair Loan Scheme",
      category: "housing",
      amount: "Up to LKR 500,000 at 2% interest",
      description: "Low-interest loans for essential home repairs after flood damage. 5-year repayment period with 1-year grace period.",
      eligibility: "Homeowners with significant flood damage",
      status: "active",
      deadline: "2024-03-01",
      applicationLink: "https://housing.gov.lk/flood-loan",
      contact: "0112 345 680",
      districts: ["All flood-affected areas"],
      requirements: ["Title deed", "Damage assessment", "Income verification"]
    },
    {
      id: "SUB-2023-042",
      title: "Small Business Recovery Fund",
      category: "business",
      amount: "LKR 50,000 - 200,000",
      description: "Grants for small businesses to restart operations after flood damage. Priority given to women-owned businesses.",
      eligibility: "Registered businesses with <10 employees",
      status: "active",
      deadline: "2023-12-15",
      applicationLink: "https://business.gov.lk/recovery-fund",
      contact: "0112 345 681",
      districts: ["Colombo", "Gampaha", "Kalutara"],
      requirements: ["Business registration", "Tax records", "Damage evidence"]
    }
  ];

  const filteredSubsidies = subsidies.filter(subsidy => {
    const matchesSearch = 
      subsidy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subsidy.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subsidy.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || 
      subsidy.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
        </Badge>;
      case "upcoming":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          <Clock className="h-3 w-3 mr-1" /> Upcoming
        </Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          <AlertCircle className="h-3 w-3 mr-1" /> Expired
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category) => {
    return <Badge variant="outline" className="text-blue-600 dark:text-blue-300">
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>;
  };

  const toggleExpandSubsidy = (id) => {
    setExpandedSubsidy(expandedSubsidy === id ? null : id);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 bg-blue-200 text-white">
          <SidebarTrigger className="-ml-1 text-white" />
          <h1 className="text-xl font-semibold">
            New Subsidy Programs
          </h1>
        </header>

        <main className="p-4 bg-white dark:bg-gray-900">
          <div className="flex-1 p-4 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Gift className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Available Subsidies
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Government assistance programs for flood-affected individuals and businesses
                  </p>
                </div>
              </div>

              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search subsidies..."
                        className="pl-8 border-gray-300 dark:border-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-2">
                          <Filter className="h-4 w-4" />
                          {categoryFilter === "all" ? "Filter by Category" : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                          All Categories
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryFilter("financial")}>
                          Financial
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryFilter("agriculture")}>
                          Agriculture
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryFilter("housing")}>
                          Housing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryFilter("business")}>
                          Business
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Current Subsidy Programs</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    {filteredSubsidies.length} programs available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredSubsidies.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No subsidy programs found matching your criteria</p>
                      </div>
                    ) : (
                      filteredSubsidies.map((subsidy) => (
                        <Card 
                          key={subsidy.id} 
                          className="overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <div 
                            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center"
                            onClick={() => toggleExpandSubsidy(subsidy.id)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="hidden md:block">
                                {expandedSubsidy === subsidy.id ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {subsidy.title}
                                  </h3>
                                  {getStatusBadge(subsidy.status)}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {getCategoryBadge(subsidy.category)}
                                  <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
                                    {subsidy.amount}
                                  </Badge>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Deadline: {formatDate(subsidy.deadline)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {expandedSubsidy === subsidy.id && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Description
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {subsidy.description}
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Eligibility
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {subsidy.eligibility}
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Available Districts
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {subsidy.districts.map(district => (
                                        <Badge 
                                          key={district} 
                                          variant="outline" 
                                          className="text-blue-600 dark:text-blue-400"
                                        >
                                          {district}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <ClipboardList className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Requirements
                                    </h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                      {subsidy.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                      <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Application Details
                                    </h4>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                      <p>
                                        <span className="font-medium">Deadline:</span> {formatDate(subsidy.deadline)}
                                      </p>
                                      <p>
                                        <span className="font-medium">Contact:</span> {subsidy.contact}
                                      </p>
                                      <p>
                                        <span className="font-medium">Apply at:</span>{" "}
                                        <a 
                                          href={subsidy.applicationLink} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                          {subsidy.applicationLink}
                                        </a>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline">
                                  Save for Later
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                  Apply Now
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
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-gray-900 dark:text-white">Important Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <p>• All applications require verification of flood damage and identity documents</p>
                  <p>• Subsidy amounts may vary based on assessment of need</p>
                  <p>• Applications submitted after deadlines will not be considered</p>
                  <p>• Beware of scams - only apply through official government websites</p>
                  <p>• For application assistance, visit your local government office</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default NewSubsidies;