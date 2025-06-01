import React, { useEffect } from "react";
import {
  Gift,
  Clock,
  FileText
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSubsidiesStore } from "@/stores/useSubsidiesStore";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

function NewSubsidies() {
  const {
    newSubsidies,
    allSubsidies,
    loadingNew,
    loadingAll,
    errorNew,
    errorAll,
    fetchNewSubsidies,
    fetchAllSubsidiesForFlood
  } = useSubsidiesStore();

  useEffect(() => {
    fetchNewSubsidies();
    fetchAllSubsidiesForFlood();
  }, [fetchNewSubsidies, fetchAllSubsidiesForFlood]);

  const getStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "collected":
        return <Badge className="bg-green-100 text-green-800">Collected</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
                  <BreadcrumbPage>New Subsidies</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
            {/* header section */}
            <div className="flex flex-col space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Gift className="h-6 w-6" />
                <h1 className="text-3xl font-bold tracking-tight">New Subsidies</h1>
              </div>
              <p className="text-muted-foreground">
                View and claim subsidies available for your house during the current or latest flood event.
              </p>
            </div>
            {/* results card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>New Subsidies ({newSubsidies.length})</span>
                  {loadingNew && <Clock className="h-4 w-4 animate-spin" />}
                </CardTitle>
                <CardDescription>
                  {newSubsidies.length === 0 && !loadingNew && !errorNew
                    ? "No new subsidies available for your house"
                    : "Subsidies available for your household"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errorNew && (
                  <div className="text-red-600 py-4">{errorNew}</div>
                )}
                {loadingNew ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <Clock className="h-6 w-6 animate-spin mr-2" />
                    Loading new subsidies...
                  </div>
                ) : newSubsidies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No subsidies found</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-2 text-left">Subsidy Name</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Grama Sevaka</th>
                          <th className="px-4 py-2 text-left">Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newSubsidies.map((sub) => (
                          <tr key={sub.subsidy_house_id} className="border-b hover:bg-muted/50">
                            <td className="px-4 py-2 font-medium">{sub.subsidy_name}</td>
                            <td className="px-4 py-2">
                              <Badge>{sub.subsidy_category}</Badge>
                            </td>
                            <td className="px-4 py-2">
                              {getStatusBadge(sub.subsidies_status)}
                            </td>
                            <td className="px-4 py-2">
                              {sub.grama_sevaka_first_name} {sub.grama_sevaka_last_name}
                            </td>
                            <td className="px-4 py-2">{sub.house_address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* all subsidies table */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>All Subsidies for Current/Latest Flood</CardTitle>
                <CardDescription>
                  Overview of all subsidies distributed during this flood event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAll ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <Clock className="h-6 w-6 animate-spin mr-2" />
                    Loading all subsidies...
                  </div>
                ) : errorAll ? (
                  <div className="text-red-600 py-4">{errorAll}</div>
                ) : allSubsidies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No subsidies found</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-2 text-left">Subsidy Name</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Grama Sevaka</th>
                          <th className="px-4 py-2 text-left">Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allSubsidies.map((sub) => (
                          <tr key={sub.subsidy_house_id} className="border-b hover:bg-muted/50">
                            <td className="px-4 py-2 font-medium">{sub.subsidy_name}</td>
                            <td className="px-4 py-2">
                              <Badge>{sub.subsidy_category}</Badge>
                            </td>
                            <td className="px-4 py-2">
                              {getStatusBadge(sub.subsidies_status)}
                            </td>
                            <td className="px-4 py-2">
                              {sub.grama_sevaka_first_name} {sub.grama_sevaka_last_name}
                            </td>
                            <td className="px-4 py-2">{sub.house_address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default NewSubsidies;