import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getDivisionalSecretariatName } from "@/lib/areaApi";

function getStatusBadge(status) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
    case "full":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Full</Badge>;
    case "maintenance":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Maintenance</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function Shelters() {
  const [relatedShelters, setRelatedShelters] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [errorRelated, setErrorRelated] = useState(null);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [dsNames, setDsNames] = useState({});

  useEffect(() => {
    async function fetchRelatedShelters() {
      setLoadingRelated(true);
      setErrorRelated(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/shelters/related", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const shelters = res.data.data.relatedShelters || [];
        setRelatedShelters(shelters);
        // Fetch DS names for all unique ids
        const uniqueDsIds = [...new Set(shelters.map(s => s.divisional_secretariat_id).filter(Boolean))];
        const dsNameMap = {};
        await Promise.all(uniqueDsIds.map(async (id) => {
          dsNameMap[id] = await getDivisionalSecretariatName(id);
        }));
        setDsNames(dsNameMap);
      } catch (err) {
        setErrorRelated(err.response?.data?.message || err.message || "Failed to load shelters");
      } finally {
        setLoadingRelated(false);
      }
    }
    fetchRelatedShelters();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">View Shelters</h1>
        </header>
        <main className="flex-1 px-4 py-8 dark:from-gray-900 dark:to-gray-800 min-h-screen">
          <div className="max-w-3xl mx-auto">
            <Card className="mt-6 border border-blue-200 dark:border-blue-800 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-lg text-gray-900 dark:text-white">Related Shelters Near You</CardTitle>
                </div>
                <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">Click 'View' to see shelter details.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRelated ? (
                  <div className="flex items-center gap-2 text-blue-600"><Loader2 className="animate-spin" /> Loading shelters...</div>
                ) : errorRelated ? (
                  <div className="text-red-600">{errorRelated}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Address</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Available</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Divisional Secretariat</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {relatedShelters && relatedShelters.length > 0 ? (
                          relatedShelters.map((shelter) => (
                            <tr key={shelter.shelter_id}>
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{shelter.shelter_name}</td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{shelter.shelter_address}</td>
                              <td className="px-4 py-3">{getStatusBadge(shelter.shelter_status)}</td>
                              <td className="px-4 py-3">{shelter.available}</td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{dsNames[shelter.divisional_secretariat_id] || shelter.divisional_secretariat_id}</td>
                              <td className="px-4 py-3">
                                <Button size="sm" variant="outline" onClick={() => setSelectedShelter(shelter)}>
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No related shelters found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Shelter Details Dialog */}
            <Dialog open={!!selectedShelter} onOpenChange={v => !v && setSelectedShelter(null)}>
              <DialogContent className="max-w-lg w-full rounded-2xl p-8 bg-white dark:bg-gray-900 shadow-2xl border dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-200">Shelter Details</DialogTitle>
                </DialogHeader>
                {selectedShelter && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-lg text-gray-900 dark:text-white">{selectedShelter.shelter_name}</span>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300"><b>Address:</b> {selectedShelter.shelter_address}</div>
                    <div className="flex gap-4 text-sm">
                      <span><b>Status:</b> {getStatusBadge(selectedShelter.shelter_status)}</span>
                      <span><b>Available:</b> {selectedShelter.available}</span>
                      <span><b>Capacity:</b> {selectedShelter.shelter_size}</span>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300"><b>Divisional Secretariat:</b> {dsNames[selectedShelter.divisional_secretariat_id] || selectedShelter.divisional_secretariat_id}</div>
                    {selectedShelter.flood_name && (
                      <div className="text-sm text-gray-700 dark:text-gray-300"><b>Flood:</b> {selectedShelter.flood_name} ({selectedShelter.start_date} - {selectedShelter.end_date || 'Ongoing'})</div>
                    )}
                    {selectedShelter.shelter_house_id && (
                      <div className="text-blue-700 dark:text-blue-300 font-semibold text-sm">Assigned to your house</div>
                    )}
                  </div>
                )}
                <DialogFooter className="flex justify-end mt-6">
                  <Button variant="outline" onClick={() => setSelectedShelter(null)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
