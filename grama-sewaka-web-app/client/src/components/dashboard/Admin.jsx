import React, { useState, useEffect } from "react";
import FloodSummary from "./FloodSummary";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Dummy data for demonstration
const initialFloods = [
  { id: 1, date: "2025-06-01", river_level: 2.8, rain_fall: 120, area: "Galle", status: "active" },
  { id: 2, date: "2025-05-15", river_level: 2.2, rain_fall: 80, area: "Matara", status: "over" },
];

export default function AdminDashboard() {
  const [floods, setFloods] = useState(initialFloods);
  const [form, setForm] = useState({ date: "", river_level: "", rain_fall: "", area: "" });
  const [editingId, setEditingId] = useState(null);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Insert or update flood
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setFloods(floods.map(f => f.id === editingId ? { ...f, ...form, id: editingId } : f));
      setEditingId(null);
    } else {
      setFloods([...floods, { ...form, id: Date.now(), status: "active" }]);
    }
    setForm({ date: "", river_level: "", rain_fall: "", area: "" });
  };

  // Edit flood
  const handleEdit = (flood) => {
    setForm({ date: flood.date, river_level: flood.river_level, rain_fall: flood.rain_fall, area: flood.area });
    setEditingId(flood.id);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <FloodSummary />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Flood Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4" onSubmit={handleSubmit}>
            <div>
              <Label>Date</Label>
              <Input name="date" type="date" value={form.date} onChange={handleChange} required />
            </div>
            <div>
              <Label>River Level (m)</Label>
              <Input name="river_level" type="number" step="0.01" value={form.river_level} onChange={handleChange} required />
            </div>
            <div>
              <Label>Rainfall (mm)</Label>
              <Input name="rain_fall" type="number" value={form.rain_fall} onChange={handleChange} required />
            </div>
            <div>
              <Label>Area</Label>
              <Input name="area" value={form.area} onChange={handleChange} required />
            </div>
            <div className="md:col-span-4 flex gap-2 mt-2">
              <Button type="submit">{editingId ? "Update" : "Insert"} Flood</Button>
              {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({ date: "", river_level: "", rain_fall: "", area: "" }); }}>Cancel</Button>}
            </div>
          </form>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">River Level</th>
                  <th className="p-2">Rainfall</th>
                  <th className="p-2">Area</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {floods.map(flood => (
                  <tr key={flood.id} className="border-t">
                    <td className="p-2">{flood.date}</td>
                    <td className="p-2">{flood.river_level}</td>
                    <td className="p-2">{flood.rain_fall}</td>
                    <td className="p-2">{flood.area}</td>
                    <td className="p-2">{flood.status}</td>
                    <td className="p-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(flood)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
