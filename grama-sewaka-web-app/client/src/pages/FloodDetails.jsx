import React, { useEffect, useState } from 'react';
import { useFloodStore } from '@/stores/useFloodStore';
import { useUserStore } from '@/stores/useUserStore';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default function FloodDetails() {
  const { token } = useUserStore();
  const {
    getCurrentFloodDetails,
    getPastFloodDetails,
    updateFloodDetailsFields,
  } = useFloodStore();
  const [currentFloodDetails, setCurrentFloodDetails] = useState(null);
  const [pastFloodDetails, setPastFloodDetails] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    getCurrentFloodDetails(token).then(setCurrentFloodDetails).catch(() => setCurrentFloodDetails(null));
    getPastFloodDetails(token).then(setPastFloodDetails).catch(() => setPastFloodDetails([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Handler to open edit modal with current details
  const handleEditClick = () => {
    setEditFields({ ...currentFloodDetails });
    setShowEditModal(true);
  };

  // Handler for input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  };

  // Handler to save updated details
  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      // Only send changed fields
      const changed = {};
      ["flood_details_date", "river_level", "rain_fall", "water_rising_rate", "flood_area"].forEach((field) => {
        if (editFields[field] !== undefined && String(editFields[field]) !== String(currentFloodDetails[field])) {
          changed[field] = editFields[field];
        }
      });
      if (Object.keys(changed).length === 0) {
        alert("No changes to update.");
        return;
      }
      await updateFloodDetailsFields(currentFloodDetails.flood_details_id, changed, token);
      setShowEditModal(false);
      // Refresh details
      getCurrentFloodDetails(token).then(setCurrentFloodDetails).catch(() => setCurrentFloodDetails(null));
    } catch (err) {
      alert(err?.message || "Failed to update flood details");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <span className="text-xl font-semibold text-gray-900 dark:text-white">Flood Details</span>
        </header>
        <main className="flex-1 px-4 py-8 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Current Flood Details */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Current Flood Details</CardTitle>
              </CardHeader>
              <CardContent>
                {currentFloodDetails ? (
                  <div className="space-y-2">
                    <div><b>Date:</b> {currentFloodDetails.flood_details_date}</div>
                    <div><b>River Level:</b> {currentFloodDetails.river_level} m</div>
                    <div><b>Rainfall:</b> {currentFloodDetails.rain_fall} mm</div>
                    <div><b>Water Rising Rate:</b> {currentFloodDetails.water_rising_rate} m/h</div>
                    <div><b>Flood Area:</b> {currentFloodDetails.flood_area} km²</div>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleEditClick}>Edit</button>
                  </div>
                ) : (
                  <p>No details for current flood.</p>
                )}
              </CardContent>
            </Card>

            {/* Past Flood Details Table */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Past Flood Details</CardTitle>
              </CardHeader>
              <CardContent>
                {pastFloodDetails.length > 0 ? (
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
                      {pastFloodDetails.map(detail => (
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
        </main>
      </SidebarInset>

      {/* Edit Flood Details Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 dark:bg-black/30">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Current Flood Details</h2>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  name="flood_details_date"
                  type="date"
                  value={editFields.flood_details_date || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">River Level (m)</label>
                <input
                  name="river_level"
                  type="number"
                  step="0.01"
                  value={editFields.river_level || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rainfall (mm)</label>
                <input
                  name="rain_fall"
                  type="number"
                  step="0.1"
                  value={editFields.rain_fall || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Water Rising Rate (m/h)</label>
                <input
                  name="water_rising_rate"
                  type="number"
                  step="0.01"
                  value={editFields.water_rising_rate || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Flood Area (km²)</label>
                <input
                  name="flood_area"
                  type="number"
                  step="0.01"
                  value={editFields.flood_area || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}