import React from "react";
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
  import { useAnnouncementsStore } from "@/stores/useAnnouncementsStore";
  
  function Announcements() {
    const { announcements, loading, error } = useAnnouncementsStore();
    const [selectedAnnouncement, setSelectedAnnouncement] = React.useState(null);
    const [search, setSearch] = React.useState("");
    const [filter, setFilter] = React.useState("all");
  
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
  
    //map emergency_level to display label and color
    const getPriorityLabel = (level) => {
      switch (level) {
        case "high_priority":
          return "High";
        case "active_only":
          return "Active";
        case "warnings":
          return "Warning";
        case "information":
          return "Info";
        default:
          return level;
      }
    };
    const getPriorityColor = (level) => {
      switch (level) {
        case "high_priority":
          return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300";
        case "active_only":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300";
        case "warnings":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300";
        case "information":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-300";
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
                  <Button>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Calendar View
                  </Button>
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
                        value={search}
                        onChange={e => setSearch(e.target.value)}
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
                        <DropdownMenuItem onClick={() => setFilter("all")} className={filter === "all" ? "font-semibold bg-accent" : ""}>All Announcements</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter("active_only")} className={filter === "active_only" ? "font-semibold bg-accent" : ""}>Active Only</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter("high_priority")} className={filter === "high_priority" ? "font-semibold bg-accent" : ""}>High Priority</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter("warnings")} className={filter === "warnings" ? "font-semibold bg-accent" : ""}>Warnings</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter("information")} className={filter === "information" ? "font-semibold bg-accent" : ""}>Information</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>
                    {loading ? "Loading..." : error ? error : `${announcements.length} announcements found`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading announcements...</div>
                  ) : error ? (
                    <div className="py-8 text-center text-red-500">{error}</div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden md:block">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">ID</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Priority</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {announcements
                              .filter((a) => {
                                const title = (a.title || "").toLowerCase();
                                const message = (a.message || "").toLowerCase();
                                const searchTerm = (search || "").toLowerCase();
                                const matchesSearch =
                                  title.includes(searchTerm) || message.includes(searchTerm);
                                if (filter === "all") return matchesSearch;
                                return matchesSearch && a.emergency_level === filter;
                              })
                              .map((a) => (
                                <TableRow key={a.id} className="transition hover:bg-accent/50">
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
                                      className={getPriorityColor(a.emergency_level) + " border font-semibold px-3 py-1 text-sm"}
                                    >
                                      {getPriorityLabel(a.emergency_level)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{formatDate(a.date)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedAnnouncement(a)}>
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                      {/* Mobile Card View */}
                      <div className="md:hidden space-y-4">
                        {announcements
                          .filter((a) => {
                            const title = (a.title || "").toLowerCase();
                            const message = (a.message || "").toLowerCase();
                            const searchTerm = (search || "").toLowerCase();
                            const matchesSearch =
                              title.includes(searchTerm) || message.includes(searchTerm);
                            if (filter === "all") return matchesSearch;
                            return matchesSearch && a.emergency_level === filter;
                          })
                          .map((a) => (
                            <Card key={a.id}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">{a.title}</CardTitle>
                                  <Badge
                                    variant="outline"
                                    className={getPriorityColor(a.emergency_level) + " text-xs"}
                                  >
                                    {getPriorityLabel(a.emergency_level)}
                                  </Badge>
                                </div>
                                <CardDescription>{formatDate(a.date)}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center gap-2 mb-2">
                                  {getTypeIcon(a.type)}
                                  <span className="capitalize text-xs text-muted-foreground">{a.type}</span>
                                </div>
                                <p className="text-sm mb-3 line-clamp-2">{a.message}</p>
                                <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedAnnouncement(a)}>
                                  View Details
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Announcement Details Dialog */}
              {selectedAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full p-8 relative border border-gray-200 dark:border-gray-800">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setSelectedAnnouncement(null)}
                    >
                      <span className="sr-only">Close</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(selectedAnnouncement.type)}
                      <h2 className="text-2xl font-bold">{selectedAnnouncement.title}</h2>
                    </div>
                    <div className="mb-2 text-sm text-muted-foreground flex items-center gap-2">
                      <span>{formatDate(selectedAnnouncement.date)}</span>
                      <Badge variant="outline" className={getPriorityColor(selectedAnnouncement.emergency_level) + " border font-semibold px-2 py-0.5 text-xs"}>
                        {getPriorityLabel(selectedAnnouncement.emergency_level)}
                      </Badge>
                    </div>
                    <div className="mb-4 text-base text-gray-700 dark:text-gray-200">
                      {selectedAnnouncement.message}
                    </div>
                    {selectedAnnouncement.description && (
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-300">
                        <span className="font-semibold">Description: </span>
                        {selectedAnnouncement.description}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  export default Announcements;
