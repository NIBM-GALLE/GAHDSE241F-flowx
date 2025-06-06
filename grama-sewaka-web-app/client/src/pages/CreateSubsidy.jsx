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
import { toast } from 'sonner';
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

function CreateSubsidy() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    subsidyType: "",
    startDate: new Date(),
    endDate: null,
    eligibilityCriteria: "",
    documentsRequired: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
   
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateSelect = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.amount || isNaN(formData.amount)) newErrors.amount = "Valid amount is required";
    if (!formData.subsidyType) newErrors.subsidyType = "Subsidy type is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.eligibilityCriteria) newErrors.eligibilityCriteria = "Eligibility criteria is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      
      console.log("Subsidy data:", formData);
      toast({
        title: "Success!",
        description: "New subsidy created successfully",
        variant: "default",
      });
      
      setFormData({
        title: "",
        description: "",
        amount: "",
        subsidyType: "",
        startDate: new Date(),
        endDate: null,
        eligibilityCriteria: "",
        documentsRequired: "",
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
            Create New Subsidy
          </h1>
        </header>

        <main className="flex-1 px-4 py-8 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Subsidy Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fill in the details for the new subsidy program
                </p>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                 
                  <div>
                    <Label htmlFor="title">Title*</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description">Description*</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className={`mt-1 ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="amount">Amount (LKR)*</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        className={`mt-1 ${errors.amount ? "border-red-500" : ""}`}
                      />
                      {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
                    </div>

                    {/* Subsidy Type */}
                    <div>
                      <Label htmlFor="subsidyType">Subsidy Type*</Label>
                      <Select
                        value={formData.subsidyType}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, subsidyType: value }));
                          if (errors.subsidyType) {
                            setErrors(prev => ({ ...prev, subsidyType: "" }));
                          }
                        }}
                      >
                        <SelectTrigger className={`mt-1 ${errors.subsidyType ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Select subsidy type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="housing">Housing</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="business">Small Business</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subsidyType && <p className="mt-1 text-sm text-red-500">{errors.subsidyType}</p>}
                    </div>

                    <div>
                      <Label>Start Date*</Label>
                      <div className={`mt-1 border rounded-md p-2 ${errors.startDate ? "border-red-500" : ""}`}>
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => handleDateSelect(date, "startDate")}
                          className="rounded-md border"
                        />
                      </div>
                      {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
                      {formData.startDate && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Selected: {format(formData.startDate, "PPP")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>End Date (Optional)</Label>
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

                  <div>
                    <Label htmlFor="eligibilityCriteria">Eligibility Criteria*</Label>
                    <Textarea
                      id="eligibilityCriteria"
                      name="eligibilityCriteria"
                      value={formData.eligibilityCriteria}
                      onChange={handleChange}
                      rows={3}
                      className={`mt-1 ${errors.eligibilityCriteria ? "border-red-500" : ""}`}
                      placeholder="List the requirements applicants must meet"
                    />
                    {errors.eligibilityCriteria && <p className="mt-1 text-sm text-red-500">{errors.eligibilityCriteria}</p>}
                  </div>

                  <div>
                    <Label htmlFor="documentsRequired">Documents Required</Label>
                    <Textarea
                      id="documentsRequired"
                      name="documentsRequired"
                      value={formData.documentsRequired}
                      onChange={handleChange}
                      rows={2}
                      className="mt-1"
                      placeholder="List any documents applicants need to provide"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-4 border-t px-6 py-4">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Subsidy
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

export default CreateSubsidy;