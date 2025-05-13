import {
    Bell,
    AlertTriangle,
    Info,
    Megaphone,
    CalendarDays,
    Search,
    Filter,
  } from "lucide-react";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
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
  
  function Announcements() {
    const announcements = [
      {
        id: "ANN-2023-045",
        title: "Heavy Rainfall Warning",
        type: "warning",
        message:
          "The Meteorological Department warns of heavy rainfall exceeding 150mm in the next 24 hours across the southern region.",
        date: "2023-11-15T08:30:00",
        priority: "high",
        status: "active",
      },
      {
        id: "ANN-2023-044",
        title: "Evacuation Centers Opened",
        type: "info",
        message:
          "Three new evacuation centers have been established in Galle District. Transport will be provided from high-risk areas.",
        date: "2023-11-14T14:15:00",
        priority: "medium",
        status: "active",
      },
      {
        id: "ANN-2023-043",
        title: "Water Purification Kits Distribution",
        type: "info",
        message:
          "Free water purification kits available at local government offices from tomorrow.",
        date: "2023-11-13T10:00:00",
        priority: "medium",
        status: "active",
      },
      {
        id: "ANN-2023-042",
        title: "Flood Relief Volunteer Program",
        type: "general",
        message:
          "Register to volunteer for flood relief efforts in affected areas. Training provided.",
        date: "2023-11-12T09:45:00",
        priority: "low",
        status: "active",
      },
      {
        id: "ANN-2023-041",
        title: "Road Closure Notification",
        type: "warning",
        message:
          "Main road between Galle and Matara closed due to flooding. Use alternate routes.",
        date: "2023-11-11T16:20:00",
        priority: "high",
        status: "expired",
      },
      {
        id: "ANN-2023-040",
        title: "Emergency Contact Numbers",
        type: "info",
        message:
          "Updated emergency contact numbers for flood-related assistance.",
        date: "2023-11-10T11:10:00",
        priority: "medium",
        status: "active",
      },
      {
        id: "ANN-2023-039",
        title: "School Closures",
        type: "general",
        message:
          "All schools in flood-affected areas will remain closed until further notice.",
        date: "2023-11-09T07:30:00",
        priority: "low",
        status: "expired",
      },
    ];
  
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
  
    const getPriorityColor = (priority) => {
      switch (priority) {
        case "high":
          return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "medium":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        default:
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      }
    };
  
    const getTypeIcon = (type) => {
      switch (type) {
        case "warning":
          return <AlertTriangle className="h-4 w-4 text-red-500" />;
        case "info":
          return <Info className="h-4 w-4 text-blue-500" />;
        default:
          return <Megaphone className="h-4 w-4 text-gray-500" />;
      }
    };
  
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center gap-2 px-4 dark:border-gray-800">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Announcements
            </h1>
          </header>
  
          <main className="p-4 space-y-6">
            <div className="flex-1 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    Announcements
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Important updates and notifications
                  </p>
                </div>
  
                <div className="flex gap-2">
                  <Button variant="outline">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Calendar View
                  </Button>
                  <Button>+ New Announcement</Button>
                </div>
              </div>
  
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search announcements..."
                        className="pl-8"
                      />
                    </div>
  
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-2">
                          <Filter className="h-4 w-4" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuItem>All Announcements</DropdownMenuItem>
                        <DropdownMenuItem>Active Only</DropdownMenuItem>
                        <DropdownMenuItem>High Priority</DropdownMenuItem>
                        <DropdownMenuItem>Warnings</DropdownMenuItem>
                        <DropdownMenuItem>Information</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
  
              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>
                    {announcements.length} announcements found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {announcements.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{a.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {a.message}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(a.type)}
                              <span className="capitalize">{a.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(a.priority)}
                            >
                              {a.priority} priority
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(a.date)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                a.status === "active" ? "default" : "secondary"
                              }
                            >
                              {a.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
  
              {/* Mobile View */}
              <div className="mt-6 md:hidden">
                <h2 className="text-lg font-semibold mb-4">Announcements</h2>
                <div className="space-y-4">
                  {announcements.map((a) => (
                    <Card key={a.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{a.title}</CardTitle>
                          <Badge
                            variant={a.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {a.status}
                          </Badge>
                        </div>
                        <CardDescription>{formatDate(a.date)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(a.type)}
                          <Badge
                            variant="outline"
                            className={getPriorityColor(a.priority) + " text-xs"}
                          >
                            {a.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm mb-3">{a.message}</p>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  export default Announcements;
  