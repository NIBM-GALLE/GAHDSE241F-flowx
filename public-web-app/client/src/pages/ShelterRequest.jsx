import React from "react";
import {
  Home,
  MapPin,
  Users,
  User,
  Phone,
  CalendarDays,
  AlertCircle,
  ClipboardList,
  Info
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";

function ShelterRequest() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    familyMembers: '',
    district: '',
    city: '',
    currentLocation: '',
    specialNeeds: '',
    urgentRequirement: 'no',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const districts = [
    "Colombo", "Gampaha", "Kalutara", "Galle", "Matara",
    "Hambantota", "Kandy", "Matale", "Nuwara Eliya", "Ratnapura",
    "Kegalle", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala",
    "Trincomalee", "Batticaloa", "Ampara", "Jaffna", "Kilinochchi",
    "Mannar", "Vavuniya", "Mullaitivu", "Puttalam", "Kurunegala"
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.currentLocation) newErrors.currentLocation = 'Current location is required';
    if (!formData.familyMembers) newErrors.familyMembers = 'Number of family members is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would typically make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center gap-2 px-4 bg-blue-600 text-white">
            <SidebarTrigger className="-ml-1 text-white" />
            <h1 className="text-xl font-semibold">
              Shelter Request
            </h1>
          </header>
          <main className="p-4 bg-white dark:bg-gray-900">
            <div className="max-w-3xl mx-auto">
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <CardTitle>Request Submitted Successfully</CardTitle>
                      <CardDescription>
                        Thank you for your shelter request. Emergency services will contact you soon.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Your request has been received and will be processed as soon as possible. 
                    Please keep your phone nearby for updates.
                  </p>
                  <Button onClick={() => setSubmitSuccess(false)}>
                    Submit Another Request
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 bg-blue-200 text-white">
          <SidebarTrigger className="-ml-1 text-white" />
          <h1 className="text-xl font-semibold">
            Shelter Request
          </h1>
        </header>

        <main className="p-4 bg-white dark:bg-gray-900">
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <CardTitle>Emergency Shelter Request Form</CardTitle>
                      <CardDescription>
                        Please fill out this form to request temporary shelter assistance
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    {errors.submit && (
                      <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 rounded-md">
                        {errors.submit}
                      </div>
                    )}

                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input 
                            id="fullName" 
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe" 
                            className="border-gray-300 dark:border-gray-600"
                            required 
                          />
                          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm">
                              <Phone className="h-4 w-4" />
                            </span>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+94 77 123 4567"
                              className="rounded-l-none border-gray-300 dark:border-gray-600"
                              required
                            />
                          </div>
                          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="familyMembers">Number of Family Members *</Label>
                        <Input
                          id="familyMembers"
                          type="number"
                          value={formData.familyMembers}
                          onChange={handleChange}
                          min="1"
                          placeholder="Including yourself"
                          className="border-gray-300 dark:border-gray-600"
                          required
                        />
                        {errors.familyMembers && <p className="text-sm text-red-500">{errors.familyMembers}</p>}
                      </div>
                    </div>
                    
                    {/* Location Information Section */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Location Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="district">District *</Label>
                          <Select 
                            value={formData.district}
                            onValueChange={(value) => handleSelectChange('district', value)}
                            required
                          >
                            <SelectTrigger id="district" className="border-gray-300 dark:border-gray-600">
                              <SelectValue placeholder="Select your district" />
                            </SelectTrigger>
                            <SelectContent>
                              {districts.map((district) => (
                                <SelectItem key={district} value={district}>
                                  {district}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="city">City/Town *</Label>
                          <Input 
                            id="city" 
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="e.g. Dehiwala" 
                            className="border-gray-300 dark:border-gray-600"
                            required 
                          />
                          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currentLocation">Current Location Details *</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm">
                            <MapPin className="h-4 w-4" />
                          </span>
                          <Input
                            id="currentLocation"
                            value={formData.currentLocation}
                            onChange={handleChange}
                            placeholder="Exact address or nearby landmarks"
                            className="rounded-l-none border-gray-300 dark:border-gray-600"
                            required
                          />
                        </div>
                        {errors.currentLocation && <p className="text-sm text-red-500">{errors.currentLocation}</p>}
                      </div>
                    </div>
                    
                    {/* Special Requirements Section */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Special Requirements
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="urgentRequirement">Is this an urgent life-threatening situation? *</Label>
                        <Select 
                          value={formData.urgentRequirement}
                          onValueChange={(value) => handleSelectChange('urgentRequirement', value)}
                          required
                        >
                          <SelectTrigger id="urgentRequirement" className="border-gray-300 dark:border-gray-600">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes - Need immediate evacuation</SelectItem>
                            <SelectItem value="no">No - But need shelter soon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="specialNeeds">Special Needs in Your Group</Label>
                        <Textarea
                          id="specialNeeds"
                          value={formData.specialNeeds}
                          onChange={handleChange}
                          placeholder="Elderly, disabled, pregnant women, infants, medical conditions, etc."
                          className="min-h-[80px] border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Any other important information about your situation"
                          className="min-h-[100px] border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <ClipboardList className="h-4 w-4" />
                      <span>By submitting this form, you agree to share this information with emergency services.</span>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" className="border-gray-300 dark:border-gray-600">
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-blue-400 hover:bg-blue-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Card>
              
              {/* Information Card */}
              <Card className="mt-6 border border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Important Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <p>• Shelter assignments are based on availability and need</p>
                  <p>• Bring essential medications and documents if possible</p>
                  <p>• For immediate life-threatening emergencies, call 1190</p>
                  <p>• You may be asked to provide ID upon arrival at shelter</p>
                  <p>• Pets may not be allowed in all shelters - please inquire</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ShelterRequest;