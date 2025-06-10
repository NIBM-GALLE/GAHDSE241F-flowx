import React, { useEffect, useState } from "react";
import FloodSummary from "./FloodSummary";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import axios from "axios";
import { useUserStore } from '@/stores/useUserStore';

export default function AdminDashboard() {
  const [pastFloodDetails, setPastFloodDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useUserStore();

  useEffect(() => {
    const fetchPastFloodDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/flood/details/past", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setPastFloodDetails(res.data?.data || []);
      } catch {
        setError("Failed to fetch past flood details.");
        setPastFloodDetails([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchPastFloodDetails();
  }, [token]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Past Flood Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : pastFloodDetails.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>River Level</TableHead>
                  <TableHead>Rainfall</TableHead>
                  <TableHead>Water Rising Rate</TableHead>
                  <TableHead>Flood Area</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastFloodDetails.map((detail) => (
                  <TableRow key={detail.flood_details_id}>
                    <TableCell>{detail.flood_details_date}</TableCell>
                    <TableCell>{detail.river_level} m</TableCell>
                    <TableCell>{detail.rain_fall} mm</TableCell>
                    <TableCell>{detail.water_rising_rate} m/h</TableCell>
                    <TableCell>{detail.flood_area} km²</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No past flood details.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
