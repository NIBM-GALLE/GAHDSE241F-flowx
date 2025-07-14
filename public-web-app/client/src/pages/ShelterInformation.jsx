import React, { useEffect } from "react";
import {
  Home,
  MapPin,
  Clock,
  Info
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function ShelterInformation() {
  const {
    fetchShelterInfo,
    assignedShelter,
    loadingShelterInfo,
    errorShelterInfo,
    fetchShelterHistory,
    shelterHistory,
    loadingHistory,
    errorHistory,
    houseLat,
    houseLng
  } = useShelterStore();

  const [showShelterDialog, setShowShelterDialog] = React.useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = React.useState(false);
  const [selectedHistory, setSelectedHistory] = React.useState(null);

  useEffect(() => {
    fetchShelterInfo();
    fetchShelterHistory();
    // eslint-disable-next-line
  }, []);

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
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Shelter Information</h1>
        </header>
        <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
          <div className="flex-1 p-4 md:p-8">
            <div className="space-y-8">
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
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Flood</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                            <th className="px-4 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {shelterHistory.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.flood_name || 'Flood'} ({item.start_date?.slice(0,10)})</td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.shelter_request_title}</td>
                              <td className="px-4 py-3">{getStatusBadge(item.shelter_request_status)}</td>
                              <td className="px-4 py-3">
                                <Button size="sm" variant="outline" onClick={() => { setSelectedHistory(item); setShowHistoryDialog(true); }}>
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => setShowShelterDialog(true)}>
                        View Details
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-500">No assigned shelter found.</div>
                  )}
                </CardContent>
              </Card>
              {/* Map Section */}
              <Card className="border border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Map: Your Location & Assigned Shelter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl overflow-hidden border border-blue-200 dark:border-blue-800 shadow-lg mb-4">
                    <MapContainer
                      center={
                        houseLat && houseLng && !isNaN(parseFloat(houseLat)) && !isNaN(parseFloat(houseLng))
                          ? [parseFloat(houseLat), parseFloat(houseLng)]
                          : [7.8731, 80.7718]
                      }
                      zoom={10}
                      style={{ height: "300px", width: "100%" }}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      {/* User marker (red) */}
                      {houseLat && houseLng && !isNaN(parseFloat(houseLat)) && !isNaN(parseFloat(houseLng)) && (
                        <Marker position={[parseFloat(houseLat), parseFloat(houseLng)]} icon={L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                          <Popup>Your House</Popup>
                        </Marker>
                      )}
                      {/* Assigned shelter marker (blue) */}
                      {assignedShelter && assignedShelter.latitude && assignedShelter.longitude && !isNaN(parseFloat(assignedShelter.latitude)) && !isNaN(parseFloat(assignedShelter.longitude)) && (
                        <Marker position={[parseFloat(assignedShelter.latitude), parseFloat(assignedShelter.longitude)]} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                          <Popup>{assignedShelter.shelter_name}</Popup>
                        </Marker>
                      )}
                    </MapContainer>
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
              {/* Dialogs */}
              <Dialog open={showShelterDialog} onOpenChange={setShowShelterDialog}>
                <DialogContent className="max-w-lg w-full rounded-2xl p-8 bg-white dark:bg-gray-900 shadow-2xl border dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2 text-green-700 dark:text-green-200">Assigned Shelter Details</DialogTitle>
                  </DialogHeader>
                  {assignedShelter && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-lg text-gray-900 dark:text-white">{assignedShelter.shelter_name}</span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300"><b>Address:</b> {assignedShelter.shelter_address}</div>
                      <div className="flex gap-4 text-sm">
                        <span><b>Status:</b> {getAvailabilityBadge(assignedShelter.available)}</span>
                        <span><b>Capacity:</b> {assignedShelter.shelter_size}</span>
                        <span><b>Available:</b> {assignedShelter.available}</span>
                      </div>
                      {assignedShelter.flood_name && (
                        <div className="text-sm text-gray-700 dark:text-gray-300"><b>Flood:</b> {assignedShelter.flood_name} ({assignedShelter.start_date} - {assignedShelter.end_date || 'Ongoing'})</div>
                      )}
                    </div>
                  )}
                  <DialogFooter className="flex justify-end mt-6">
                    <Button variant="outline" onClick={() => setShowShelterDialog(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
                <DialogContent className="max-w-lg w-full rounded-2xl p-8 bg-white dark:bg-gray-900 border dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-200">Shelter Request Details</DialogTitle>
                  </DialogHeader>
                  {selectedHistory && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold text-lg text-gray-900 dark:text-white">{selectedHistory.flood_name || 'Flood'} ({selectedHistory.start_date?.slice(0,10)})</span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300"><b>Title:</b> {selectedHistory.shelter_request_title}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300"><b>Message:</b> {selectedHistory.shelter_request_message}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300"><b>Needs:</b> {selectedHistory.shelter_request_needs}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300"><b>Status:</b> {getStatusBadge(selectedHistory.shelter_request_status)}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300"><b>Address:</b> {selectedHistory.house_address}</div>
                    </div>
                  )}
                  <DialogFooter className="flex justify-end mt-6">
                    <Button variant="outline" onClick={() => setShowHistoryDialog(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ShelterInformation;