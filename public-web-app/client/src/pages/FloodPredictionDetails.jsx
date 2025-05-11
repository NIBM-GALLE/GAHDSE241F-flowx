import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Clock,
  AlertCircle,
  ArrowRight,
  Waves,
  CloudRain,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function FloodPredictionDetails() {
  const floodData = {
    location: "Galle",
    district: "Southern Province",
    floodRisk: 75,
    predictedWaterLevel: 3.2,
    currentWaterLevel: 2.8,
    predictionTime: "2025-05-10T08:00:00",
    affectedAreas: ["Galle City Center", "Unawatuna", "Hikkaduwa", "Ambalangoda"],
    safeZones: ["Galle Fort", "Rumassala", "Koggala High Ground"],
    floodArea: 15.6,
    recoveryTime: 3.5,
    timeline: [
      { time: "2025-05-10T08:00:00", waterLevel: 2.8, status: "Monitoring" },
      { time: "2025-05-10T12:00:00", waterLevel: 3.0, status: "Alert" },
      { time: "2025-05-10T16:00:00", waterLevel: 3.2, status: "Danger" },
      { time: "2025-05-11T08:00:00", waterLevel: 2.5, status: "Recovery" },
    ],
  };

  const getRiskLevel = (percentage) => {
    if (percentage <= 40) return "Low";
    if (percentage <= 70) return "Medium";
    return "High";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const riskLevel = getRiskLevel(floodData.floodRisk);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 dark:border-gray-800">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Flood Prediction Dashboard
          </h1>
        </header>

        <main className="p-4 space-y-6">
          {/* Main Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-6 w-6" />
                Flood Prediction Details
              </CardTitle>
              <CardDescription>
                Detailed flood prediction information for {floodData.location},{" "}
                {floodData.district}.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {riskLevel === "High" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Flood Warning!</AlertTitle>
                  <AlertDescription>
                    High flood risk detected. Please take necessary precautions.
                  </AlertDescription>
                </Alert>
              )}

              {/* Flood Risk Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Flood Risk Level</span>
                  <span className="text-sm font-medium">
                    {floodData.floodRisk}% ({riskLevel})
                  </span>
                </div>
                <Progress value={floodData.floodRisk} className="h-3" />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CloudRain className="h-4 w-4" />
                      Predicted Flood Area
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {floodData.floodArea.toFixed(2)} sq km
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Estimated affected area
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Safe Zones Count
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {floodData.safeZones.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended evacuation areas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recovery Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {floodData.recoveryTime.toFixed(1)} days
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Until normalcy returns
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Table */}
          <Card>
            <CardHeader>
              <CardTitle>Flood Progression Timeline</CardTitle>
              <CardDescription>
                Predicted water levels and status over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Water Level (m)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {floodData.timeline.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(entry.time)}</TableCell>
                      <TableCell>{entry.waterLevel}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            entry.status === "Danger"
                              ? "bg-red-100 text-red-800"
                              : entry.status === "Alert"
                              ? "bg-yellow-100 text-yellow-800"
                              : entry.status === "Recovery"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Progress
                          value={
                            entry.status === "Danger"
                              ? 80
                              : entry.status === "Alert"
                              ? 60
                              : entry.status === "Recovery"
                              ? 30
                              : 40
                          }
                          className="h-2 w-24"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end mt-6">
                <Button variant="outline">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View Detailed Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default FloodPredictionDetails;
