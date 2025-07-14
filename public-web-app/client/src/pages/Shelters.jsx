import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin } from "lucide-react";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { getDivisionalSecretariatName } from "@/lib/areaApi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  const [dsNames, setDsNames] = useState({});
  const [houseLat, setHouseLat] = useState(null);
  const [houseLng, setHouseLng] = useState(null);

  // Map marker icon
  const shelterIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  // Custom icon for user house (red)
  const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

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
        setHouseLat(res.data.data.houseLat);
        setHouseLng(res.data.data.houseLng);
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

  // Calculate map bounds to fit all shelters
  const shelterPositions = relatedShelters.filter(s => s.latitude && s.longitude).map(s => [parseFloat(s.latitude), parseFloat(s.longitude)]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Shelters Near You</h1>
        </header>
        <main className="flex-1 px-4 py-8 dark:from-gray-900 dark:to-gray-800 min-h-screen">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Map Section */}
            <section>
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-600" /> Shelters Map</h2>
              <div className="rounded-xl overflow-hidden border border-blue-200 dark:border-blue-800 shadow-lg mb-4">
                <MapContainer center={shelterPositions[0] || [7.8731, 80.7718]} zoom={8} style={{ height: "350px", width: "100%" }} scrollWheelZoom={true}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {/* User house marker */}
                  {houseLat && houseLng && (
                    <Marker position={[parseFloat(houseLat), parseFloat(houseLng)]} icon={userIcon}>
                      <Popup>
                        <div><strong>Your House</strong></div>
                        <div>Lat: {houseLat}, Lng: {houseLng}</div>
                      </Popup>
                    </Marker>
                  )}
                  {/* Shelter markers */}
                  {shelterPositions.length > 0 && shelterPositions.map((pos, i) => (
                    <Marker key={i} position={pos} icon={shelterIcon}>
                      <Popup>
                        <div>
                          <strong>{relatedShelters[i].shelter_name}</strong><br />
                          {relatedShelters[i].shelter_address}<br />
                          Size: {relatedShelters[i].shelter_size}<br />
                          Available: {relatedShelters[i].available}<br />
                          Status: {relatedShelters[i].shelter_status}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </section>
            {/* List Section */}
            <section>
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Shelter List</h2>
              {loadingRelated ? (
                <div className="flex justify-center items-center h-32"><Loader2 className="animate-spin" /></div>
              ) : errorRelated ? (
                <div className="text-red-500">{errorRelated}</div>
              ) : relatedShelters.length === 0 ? (
                <div className="text-gray-500 text-center">No shelters found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedShelters.map(shelter => (
                    <Card key={shelter.shelter_id} className="hover:shadow-xl transition-shadow cursor-pointer border border-blue-100 dark:border-blue-800">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <CardTitle className="text-lg text-blue-800 dark:text-blue-200 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" /> {shelter.shelter_name}
                          </CardTitle>
                          <CardDescription className="text-gray-500 dark:text-gray-400">{shelter.shelter_address}</CardDescription>
                        </div>
                        {getStatusBadge(shelter.shelter_status)}
                      </CardHeader>
                      <CardContent className="flex flex-col gap-1 text-sm">
                        <div><b>Available:</b> <span className="text-green-700 dark:text-green-300">{shelter.available}</span> / <span className="text-gray-700 dark:text-gray-300">{shelter.shelter_size}</span></div>
                        <div><b>DS:</b> {dsNames[shelter.divisional_secretariat_id] || shelter.divisional_secretariat_id}</div>
                        {shelter.shelter_status === 'full' && <div className="text-red-600 font-semibold">Full</div>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
