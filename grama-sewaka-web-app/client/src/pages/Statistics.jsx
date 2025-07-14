import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BiWater, BiBarChartAlt2, BiTimeFive, BiLineChart } from "react-icons/bi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function Statistics() {
  const [stats, setStats] = useState({ flood_count: 0, details_count: 0 });
  const [currentSummary, setCurrentSummary] = useState(null);
  const [pastSummary, setPastSummary] = useState({ floods: [], details: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, currentRes, pastRes] = await Promise.all([
          axios.get("/api/flood/statistics"),
          axios.get("/api/flood/summary/current"),
          axios.get("/api/flood/summary/past"),
        ]);
        setStats(statsRes.data);
        setCurrentSummary(currentRes.data.data);
        setPastSummary({ floods: pastRes.data.floods, details: pastRes.data.details });
      } catch {
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Prepare data for the bar chart (e.g., flood_area by date)
  const chartData = pastSummary.details.map(d => ({
    date: d.flood_details_date,
    flood_area: parseFloat(d.flood_area),
    rain_fall: parseFloat(d.rain_fall),
    river_level: parseFloat(d.river_level)
  }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-blue-200">
            <BiBarChartAlt2 className="inline-block mr-2 text-blue-600 dark:text-blue-300" />
            Statistics Dashboard
          </h1>
        </header>
        <main className="p-4 md:p-8 bg-gradient-to-b dark:from-gray-900 dark:to-gray-950 min-h-screen">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-100 dark:border-gray-700">
                <BiWater className="w-14 h-14 text-blue-500 mb-3" />
                <div className="text-5xl font-extrabold text-blue-700 dark:text-blue-300">{stats.flood_count}</div>
                <div className="text-lg font-semibold mt-2 text-gray-700 dark:text-gray-200">Flood Events</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center border border-green-100 dark:border-gray-700">
                <BiBarChartAlt2 className="w-14 h-14 text-green-500 mb-3" />
                <div className="text-5xl font-extrabold text-green-700 dark:text-green-300">{stats.details_count}</div>
                <div className="text-lg font-semibold mt-2 text-gray-700 dark:text-gray-200">Flood Details Records</div>
              </div>
            </div>
            {/* Loading/Error State */}
            {loading ? (
              <div className="text-gray-500 text-lg py-12">Loading statistics...</div>
            ) : error ? (
              <div className="text-red-500 text-lg py-12">{error}</div>
            ) : (
              <>
                {/* Current Flood Summary */}
                <section className="bg-blue-50 dark:bg-blue-900 rounded-2xl shadow-lg p-8 text-left border border-blue-200 dark:border-blue-800">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-900 dark:text-blue-200"><BiTimeFive className="inline-block" /> Current Flood Summary</h3>
                  {currentSummary ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-2 text-lg">Flood: <span className="font-semibold">{currentSummary.flood.flood_name}</span></div>
                        <div className="mb-2">Duration: <span className="font-semibold">{currentSummary.durationDays} days</span></div>
                        <div className="mb-2">Variance of Daily Flood Area: <span className="font-semibold">{currentSummary.variance.toFixed(2)}</span></div>
                        <div className="mb-2">Start Date: <span className="font-semibold">{currentSummary.flood.start_date}</span></div>
                        <div className="mb-2">Status: <span className="font-semibold">{currentSummary.flood.flood_status}</span></div>
                      </div>
                      <div className="flex flex-col justify-center">
                        {/* Bar Chart for Current Flood Details */}
                        {currentSummary.details && currentSummary.details.length > 0 && (
                          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
                            <h4 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-200">Flood Area by Date (Current Flood)</h4>
                            <ResponsiveContainer width="100%" height={220}>
                              <BarChart data={currentSummary.details.map(d => ({
                                date: d.flood_details_date,
                                flood_area: parseFloat(d.flood_area),
                                rain_fall: parseFloat(d.rain_fall),
                                river_level: parseFloat(d.river_level)
                              }))} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="flood_area" fill="#3182ce" name="Flood Area (sq km)" />
                                <Bar dataKey="rain_fall" fill="#38a169" name="Rainfall (mm)" />
                                <Bar dataKey="river_level" fill="#805ad5" name="River Level (m)" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>No current flood event.</div>
                  )}
                </section>
                {/* Past Floods Static Summary */}
                <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-left border border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100"><BiLineChart className="inline-block" /> Past Floods Summary</h3>
                  {pastSummary.floods.length === 0 ? (
                    <div>No past floods found.</div>
                  ) : (
                    <div className="space-y-4">
                      {pastSummary.floods.map(flood => (
                        <div key={flood.flood_id} className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                          <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">{flood.flood_name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{flood.start_date} to {flood.end_date || 'Ongoing'}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Status: {flood.flood_status}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{flood.flood_description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                {/* Bar Chart for Past Flood Details */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-200">Flood Area by Date (Past Events)</h3>
                  {chartData.length === 0 ? (
                    <div>No flood details data for chart.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="flood_area" fill="#3182ce" name="Flood Area (sq km)" />
                        <Bar dataKey="rain_fall" fill="#38a169" name="Rainfall (mm)" />
                        <Bar dataKey="river_level" fill="#805ad5" name="River Level (m)" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Statistics;
