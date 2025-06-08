import React, { useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useUserStore } from "@/stores/useUserStore";

export default function FloodSummary() {
    const { token } = useUserStore();
    const {
        floodSummary,
        floodSummaryLoading,
        floodSummaryError,
        fetchFloodSummary,
    } = useDashboardStore(token);

    useEffect(() => {
        fetchFloodSummary();
        // eslint-disable-next-line
    }, [token]);

    // Loading state
    if (floodSummaryLoading) {
        return (
            <Card className="border border-blue-200 dark:border-blue-800 animate-pulse">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/20 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-blue-500">Loading flood summary...</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 h-40" />
            </Card>
        );
    }

    // Error state
    if (floodSummaryError) {
        return (
            <Card className="border border-red-200 dark:border-red-800">
                <CardHeader className="bg-red-50 dark:bg-red-900/20 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-red-500">Error loading flood summary</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-red-600 dark:text-red-300">
                    {floodSummaryError}
                </CardContent>
            </Card>
        );
    }

    // Empty state
    if (!floodSummary) {
        return (
            <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-gray-500">No flood data available</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-gray-500 dark:text-gray-400">
                    Flood summary data is not available at the moment.
                </CardContent>
            </Card>
        );
    }

    // Extract data from API response
    const floodStatus = floodSummary.status || "over"; // fallback
    const floodRisk = floodSummary.risk || 0;
    const floodData = {
        rain_fall: floodSummary.rain_fall,
        river_level: floodSummary.river_level,
        date: floodSummary.date,
        location: floodSummary.location,
        affectedFamilies: floodSummary.affected_families,
        collectedItems: floodSummary.collected_items,
        progress: floodSummary.relief_progress,
    };
    const analysis = floodSummary.item_distribution || [];

    return (
        <div className="space-y-6">
            {floodStatus === "flood" ? (
                <Card className="border border-blue-200 dark:border-blue-800">
                    <CardHeader className="bg-blue-50 dark:bg-blue-900/20 rounded-t-lg">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-red-500">🚨</span>
                            <span>Real-Time Flood Analysis</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Flood Risk</p>
                            <Progress value={floodRisk} className="h-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {floodRisk}% risk detected - Take immediate action
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                                <CardContent className="text-center py-6">
                                    <p className="font-semibold text-blue-700 dark:text-blue-300">🌊 River Level</p>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                                        {floodData.river_level} M
                                    </p>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Critical level: 2.5M</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                                <CardContent className="text-center py-6">
                                    <p className="font-semibold text-blue-700 dark:text-blue-300">🌧️ Rainfall Today</p>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                                        {floodData.rain_fall} MM
                                    </p>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Normal range: 50-80mm</p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Flood Summary */}
                    <Card className="border border-gray-200 dark:border-gray-800">
                        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-green-500">✅</span>
                                    <span>Flood Summary - {floodData.location}</span>
                                </CardTitle>
                                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                    Completed
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Date</p>
                                    <p className="font-medium">{floodData.date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Affected Families</p>
                                    <p className="font-medium">{floodData.affectedFamilies}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Items Collected</p>
                                    <p className="font-medium">{floodData.collectedItems}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-2">Relief Progress</p>
                                    <Progress value={floodData.progress} className="h-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{floodData.progress}% completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bar Chart */}
                    <Card className="border border-gray-200 dark:border-gray-800">
                        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-blue-900">📊</span>
                                <span>Item Distribution</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analysis}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888"
                                            className="text-xs"
                                        />
                                        <YAxis
                                            stroke="#888"
                                            className="text-xs"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: 'var(--radius)',
                                            }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
