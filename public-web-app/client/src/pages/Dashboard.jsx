import React, { useState, useEffect } from "react";
import { FloodPredictions } from "@/components/dashboard/FloodPredictions";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

function Dashboard() {
  const [floodRiskData, setFloodRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's flood risk data
  useEffect(() => {
    const fetchFloodRisk = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch('/api/flood/user-risk', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setFloodRiskData(data);
        } else {
          throw new Error(data.message || 'Failed to fetch flood risk data');
        }
      } catch (err) {
        console.error('Error fetching flood risk:', err);
        setError(err.message);
        // Fallback to dummy data for development
        setFloodRiskData(getDummyFloodData());
      } finally {
        setLoading(false);
      }
    };

    fetchFloodRisk();
    
    // Set up auto-refresh every 30 minutes
    const interval = setInterval(fetchFloodRisk, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Dummy data for development/fallback
  const getDummyFloodData = () => ({
    success: true,
    data: {
      last_updated: new Date().toISOString()
    }
  });

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:border-gray-800">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Flood Risk Dashboard
              </h1>
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              )}
            </div>
          </header>

          <main className="p-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Data</AlertTitle>
                <AlertDescription>
                  {error}. Using sample data for demonstration.
                </AlertDescription>
              </Alert>
            )}

            <div className="w-full space-y-6">
              {/* Pass the flood risk data to FloodPredictions component */}
              <FloodPredictions 
                floodRiskData={floodRiskData}
                loading={loading}
              />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Dashboard;