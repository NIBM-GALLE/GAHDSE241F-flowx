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
import { useVictimRequestStore } from "@/stores/useVictimRequestStore";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
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
  // Only keep fields required by backend
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    emergency_level: '',
    needs: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const victimRequestStore = useVictimRequestStore();

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
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.message) newErrors.message = 'Description is required';
    if (!formData.emergency_level) newErrors.emergency_level = 'Urgency level is required';
    if (!formData.needs) newErrors.needs = 'Type of assistance is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await victimRequestStore.submitVictimRequest(formData);
      setSubmitSuccess(true);
      setFormData({ title: '', message: '', emergency_level: '', needs: '' });
    } catch {
      setErrors({ submit: victimRequestStore.error || 'Failed to submit form. Please try again.' });
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
                  <Button onClick={() => window.location.href = '/dashboard'} className="bg-blue-600 hover:bg-blue-700">
                    Go Back to Home
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
                      {/* Request Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title">Request Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Short summary (e.g. Need urgent rescue)"
                          required
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                      </div>
                      {/* Request Description */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Description *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Describe your situation in detail (current conditions, special needs, etc.)"
                          className="min-h-[120px]"
                          required
                        />
                        {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                      </div>
                      {/* Urgency Level */}
                      <div className="space-y-2">
                        <Label htmlFor="emergency_level">Urgency Level *</Label>
                        <Select
                          value={formData.emergency_level}
                          onValueChange={value => handleSelectChange('emergency_level', value)}
                          required
                        >
                          <SelectTrigger id="emergency_level">
                            <SelectValue placeholder="Select urgency level" />
                          </SelectTrigger>
                          <SelectContent>
                            {urgencyLevels.map(level => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.emergency_level && <p className="text-sm text-red-500">{errors.emergency_level}</p>}
                      </div>
                      {/* Assistance Type */}
                      <div className="space-y-2">
                        <Label htmlFor="needs">Type of Assistance Needed *</Label>
                        <Select
                          value={formData.needs}
                          onValueChange={value => handleSelectChange('needs', value)}
                          required
                        >
                          <SelectTrigger id="needs">
                            <SelectValue placeholder="Select assistance type" />
                          </SelectTrigger>
                          <SelectContent>
                            {assistanceTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.needs && <p className="text-sm text-red-500">{errors.needs}</p>}
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