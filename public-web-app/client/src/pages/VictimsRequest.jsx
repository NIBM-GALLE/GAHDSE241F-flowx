import { useState } from 'react';
import React from 'react';
import {
  User,
  MapPin,
  Phone,
  Home,
  AlertCircle,
  HeartHandshake,
  Mail,
  Map,
  ClipboardList,
    Info,
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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-medium text-red-800">Something went wrong</h2>
          <p className="text-red-600">Please refresh the page or try again later.</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

function VictimRequest() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    familyMembers: '',
    district: '',
    city: '',
    address: '',
    landmarks: '',
    urgency: '',
    assistanceType: '',
    details: '',
    medicalConditions: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const urgencyLevels = [
    { value: "critical", label: "Critical - Immediate danger" },
    { value: "high", label: "High - Need help within hours" },
    { value: "medium", label: "Medium - Need help today" },
    { value: "low", label: "Low - Need help soon" },
  ];

  const assistanceTypes = [
    { value: "rescue", label: "Rescue/Evacuation" },
    { value: "shelter", label: "Shelter/Housing" },
    { value: "food", label: "Food Supplies" },
    { value: "medical", label: "Medical Assistance" },
    { value: "water", label: "Clean Water" },
    { value: "other", label: "Other Assistance" },
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
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.urgency) newErrors.urgency = 'Urgency level is required';
    if (!formData.assistanceType) newErrors.assistanceType = 'Assistance type is required';
    if (!formData.details) newErrors.details = 'Details are required';
    
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
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        familyMembers: '',
        district: '',
        city: '',
        address: '',
        landmarks: '',
        urgency: '',
        assistanceType: '',
        details: '',
        medicalConditions: ''
      });
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
          <header className="flex h-16 items-center gap-2 px-4 dark:border-gray-800">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Request Assistance
            </h1>
          </header>
          <main className="p-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border border-green-200 dark:border-green-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <div>
                      <CardTitle>Request Submitted Successfully</CardTitle>
                      <CardDescription>
                        Thank you for your submission. Emergency services will contact you soon.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Your request has been received and will be processed as soon as possible.</p>
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
        <header className="flex h-16 items-center gap-2 px-4 dark:border-gray-800">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Request Assistance
          </h1>
        </header>

        <main className="p-4">
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
              <ErrorBoundary>
                <form onSubmit={handleSubmit}>
                  <Card className="border border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <HeartHandshake className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <div>
                          <CardTitle>Flood Victim Assistance Request</CardTitle>
                          <CardDescription>
                            Please fill out this form to request help from emergency services
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {errors.submit && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md">
                          {errors.submit}
                        </div>
                      )}

                      {/* Personal Information Section */}
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <User className="h-5 w-5" />
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
                              required 
                            />
                            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">
                                <Phone className="h-4 w-4" />
                              </span>
                              <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+94 77 123 4567"
                                className="rounded-l-none"
                                required
                              />
                            </div>
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">
                              <Mail className="h-4 w-4" />
                            </span>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your@email.com"
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="familyMembers">Number of Family Members Affected</Label>
                          <Input
                            id="familyMembers"
                            type="number"
                            value={formData.familyMembers}
                            onChange={handleChange}
                            min="1"
                            placeholder="e.g. 4"
                          />
                        </div>
                      </div>
                      
                      {/* Location Information Section */}
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <MapPin className="h-5 w-5" />
                          Location Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="district">District *</Label>
                            <Input 
                              id="district" 
                              value={formData.district}
                              onChange={handleChange}
                              placeholder="e.g. Colombo" 
                              required 
                            />
                            {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="city">City/Town *</Label>
                            <Input 
                              id="city" 
                              value={formData.city}
                              onChange={handleChange}
                              placeholder="e.g. Dehiwala" 
                              required 
                            />
                            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Full Address *</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">
                              <Home className="h-4 w-4" />
                            </span>
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={handleChange}
                              placeholder="House No, Street Name"
                              className="rounded-l-none"
                              required
                            />
                          </div>
                          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="landmarks">Nearby Landmarks</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">
                              <Map className="h-4 w-4" />
                            </span>
                            <Input
                              id="landmarks"
                              value={formData.landmarks}
                              onChange={handleChange}
                              placeholder="e.g. Near Temple, Behind School"
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Assistance Details Section */}
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <AlertCircle className="h-5 w-5" />
                          Assistance Details
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="urgency">Urgency Level *</Label>
                            <Select 
                              value={formData.urgency}
                              onValueChange={(value) => handleSelectChange('urgency', value)}
                              required
                            >
                              <SelectTrigger id="urgency">
                                <SelectValue placeholder="Select urgency level" />
                              </SelectTrigger>
                              <SelectContent>
                                {urgencyLevels.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.urgency && <p className="text-sm text-red-500">{errors.urgency}</p>}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="assistanceType">Type of Assistance Needed *</Label>
                            <Select 
                              value={formData.assistanceType}
                              onValueChange={(value) => handleSelectChange('assistanceType', value)}
                              required
                            >
                              <SelectTrigger id="assistanceType">
                                <SelectValue placeholder="Select assistance type" />
                              </SelectTrigger>
                              <SelectContent>
                                {assistanceTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.assistanceType && <p className="text-sm text-red-500">{errors.assistanceType}</p>}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="details">Additional Details *</Label>
                          <Textarea
                            id="details"
                            value={formData.details}
                            onChange={handleChange}
                            placeholder="Please describe your situation in detail (current conditions, special needs, etc.)"
                            className="min-h-[120px]"
                            required
                          />
                          {errors.details && <p className="text-sm text-red-500">{errors.details}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="medicalConditions">Medical Conditions/Disabilities (if any)</Label>
                          <Textarea
                            id="medicalConditions"
                            value={formData.medicalConditions}
                            onChange={handleChange}
                            placeholder="List any medical conditions, disabilities, or special needs for your family members"
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClipboardList className="h-4 w-4" />
                        <span>By submitting this form, you agree to share this information with emergency services.</span>
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline">Cancel</Button>
                        <Button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </form>
              </ErrorBoundary>
              
              {/* Information Card */}
              <Card className="mt-6 border border-green-200 dark:border-green-800">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <CardTitle className="text-lg">Important Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Emergency services will prioritize requests based on urgency level.</p>
                  <p>• Please provide accurate location information to help responders find you.</p>
                  <p>• If your situation changes or you no longer need assistance, please contact us to update your request.</p>
                  <p>• For immediate life-threatening emergencies, call 1190 (Sri Lanka emergency number).</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default VictimRequest;