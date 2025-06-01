import React, { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  DollarSign,
  ClipboardList,
  Info,
  User,
  CalendarDays
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSubsidiesStore } from "@/stores/useSubsidiesStore";

// Error Boundary for UI safety
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    // Optionally log error
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p>Try refreshing the page or contact support if the problem persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function SubsidyHistory() {
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const subsidiesHistory = useSubsidiesStore((state) => state.subsidiesHistory);
  const fetchSubsidiesHistory = useSubsidiesStore((state) => state.fetchSubsidiesHistory);

  useEffect(() => {
    fetchSubsidiesHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = (subsidiesHistory || []).filter(item => {
    const matchesSearch =
      (item.subsidy_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subsidy_house_id || "").toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.grama_sevaka_first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.grama_sevaka_last_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || (item.subsidies_status || "").toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
    switch ((status || "").toLowerCase()) {
      case "collected":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" /> Collected</Badge>;
      case "rejected":
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const toggleExpandItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <ErrorBoundary>
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
                  <BreadcrumbPage>Subsidies History</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

          <main className="p-4 bg-white dark:bg-gray-900">
            <div className="flex-1 p-4 md:p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                      <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      My Subsidy Applications
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      History of all your subsidy applications and payments
                    </p>
                  </div>
                </div>

                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search applications..."
                          className="pl-8 border-gray-300 dark:border-gray-600"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex gap-2">
                            <Filter className="h-4 w-4" />
                            {statusFilter === "all" ? "Filter by Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                            All Applications
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                            Approved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                            Rejected
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                            Pending
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Application History</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      {filteredItems.length} applications found
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredItems.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 dark:text-gray-400">No applications found matching your criteria</p>
                        </div>
                      ) : (
                        filteredItems.map((item) => (
                          <Card 
                            key={item.id} 
                            className="overflow-hidden border border-gray-200 dark:border-gray-700"
                          >
                            <div 
                              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center"
                              onClick={() => toggleExpandItem(item.id)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="hidden md:block">
                                  {expandedItem === item.id ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                      {item.title}
                                    </h3>
                                    {getStatusBadge(item.status)}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
                                      {item.amount}
                                    </Badge>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Applied: {formatDate(item.dateApplied)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {expandedItem === item.id && (
                              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                        <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Dates
                                      </h4>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p className="text-gray-500 dark:text-gray-400">Applied</p>
                                          <p className="text-gray-700 dark:text-gray-300">{formatDate(item.dateApplied)}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 dark:text-gray-400">Processed</p>
                                          <p className="text-gray-700 dark:text-gray-300">{formatDate(item.dateProcessed)}</p>
                                        </div>
                                        {item.paymentDate && (
                                          <div className="col-span-2">
                                            <p className="text-gray-500 dark:text-gray-400">Payment Date</p>
                                            <p className="text-gray-700 dark:text-gray-300">{formatDate(item.paymentDate)}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {item.rejectionReason && (
                                      <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                          <XCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Rejection Reason
                                        </h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                          {item.rejectionReason}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-4">
                                    {item.status === "approved" && (
                                      <>
                                        <div className="space-y-2">
                                          <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Payment Details
                                          </h4>
                                          <div className="text-sm">
                                            <p className="text-gray-500 dark:text-gray-400">Method</p>
                                            <p className="text-gray-700 dark:text-gray-300">{item.paymentMethod}</p>
                                            <p className="text-gray-500 dark:text-gray-400 mt-2">Reference No</p>
                                            <p className="text-gray-700 dark:text-gray-300">{item.referenceNo}</p>
                                          </div>
                                        </div>
                                      </>
                                    )}

                                    <div className="space-y-2">
                                      <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Notes
                                      </h4>
                                      <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {item.notes}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                  <Button variant="outline" className="border-blue-300 text-blue-600 dark:text-blue-400">
                                    Download Receipt
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
                      <CardTitle className="text-gray-900 dark:text-white">Need Help?</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <p>• For questions about approved payments, contact your local relief office</p>
                    <p>• To appeal a rejected application, visit the original application page</p>
                    <p>• Payment processing typically takes 3-5 business days after approval</p>
                    <p>• Keep records of all reference numbers for future inquiries</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundary>
  );
}

export default SubsidyHistory;