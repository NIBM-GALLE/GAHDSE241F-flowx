import React, { useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

function CreateFloodEvent() {
  const [formData, setFormData] = useState({
    floodName: "",
    severity: "medium",
    startDate: new Date(),
    endDate: null,
    affectedAreas: "",
    description: "",
    waterLevel: "",
    casualties: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleDateSelect = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.floodName.trim()) newErrors.floodName = "Flood name is required";
    if (!formData.affectedAreas.trim()) newErrors.affectedAreas = "Affected areas are required";
    if (!formData.waterLevel || isNaN(formData.waterLevel)) newErrors.waterLevel = "Valid water level is required";
    if (formData.casualties && isNaN(formData.casualties)) newErrors.casualties = "Must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // API call would go here
      console.log("Flood event data:", formData);
      toast.success("Flood event created successfully!");
      
      // Reset form
      setFormData({
        floodName: "",
        severity: "medium",
        startDate: new Date(),
        endDate: null,
        affectedAreas: "",
        description: "",
        waterLevel: "",
        casualties: "",
        status: "active",
      });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Flood Event
          </h1>
        </header>

        <main className="flex-1 px-4 py-8 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Flood Event Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Record a new flood event with all relevant information
                </p>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Flood Name */}
                  <div>
                    <Label htmlFor="floodName">Flood Name*</Label>
                    <Input
                      id="floodName"
                      name="floodName"
                      value={formData.floodName}
                      onChange={handleChange}
                      placeholder="E.g., 2023 Colombo Floods"
                      className={`mt-1 ${errors.floodName ? "border-red-500" : ""}`}
                    />
                    {errors.floodName && (
                      <p className="mt-1 text-sm text-red-500">{errors.floodName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Severity */}
                    <div>
                      <Label>Severity*</Label>
                      <Select
                        value={formData.severity}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, severity: value }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="extreme">Extreme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status */}
                    <div>
                      <Label>Status*</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="monitoring">Monitoring</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div>
                      <Label>Start Date*</Label>
                      <div className="mt-1 border rounded-md p-2">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => handleDateSelect(date, "startDate")}
                          className="rounded-md border"
                        />
                      </div>
                      {formData.startDate && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Selected: {format(formData.startDate, "PPP")}
                        </p>
                      )}
                    </div>

                    {/* End Date */}
                    <div>
                      <Label>End Date (if resolved)</Label>
                      <div className="mt-1 border rounded-md p-2">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => handleDateSelect(date, "endDate")}
                          className="rounded-md border"
                        />
                      </div>
                      {formData.endDate && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Selected: {format(formData.endDate, "PPP")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Affected Areas */}
                  <div>
                    <Label htmlFor="affectedAreas">Affected Areas*</Label>
                    <Textarea
                      id="affectedAreas"
                      name="affectedAreas"
                      value={formData.affectedAreas}
                      onChange={handleChange}
                      placeholder="List affected districts, cities, or regions"
                      className={`mt-1 ${errors.affectedAreas ? "border-red-500" : ""}`}
                      rows={2}
                    />
                    {errors.affectedAreas && (
                      <p className="mt-1 text-sm text-red-500">{errors.affectedAreas}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Detailed description of the flood event"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Casualties */}
                    <div>
                      <Label htmlFor="casualties">Casualties (if any)</Label>
                      <Input
                        id="casualties"
                        name="casualties"
                        type="number"
                        value={formData.casualties}
                        onChange={handleChange}
                        className={`mt-1 ${errors.casualties ? "border-red-500" : ""}`}
                      />
                      {errors.casualties && (
                        <p className="mt-1 text-sm text-red-500">{errors.casualties}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
                </CardContent>

                <CardFooter className="flex justify-end gap-4 border-t px-6 py-4">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Flood Event
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default CreateFloodEvent;