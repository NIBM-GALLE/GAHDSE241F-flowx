import React, { useEffect, useState } from "react";
import {
  Home,
  MapPin,
  Users,
  User,
  Phone,
  CalendarDays,
  AlertCircle,
  ClipboardList,
  Info,
  History,
  Loader2,
  ChevronDown,
  ChevronUp,
  Badge
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useShelterStore } from "@/stores/useShelterStore";

function ShelterRequest() {
  const [formData, setFormData] = useState({
    shelter_request_title: '',
    shelter_request_message: '',
    shelter_request_needs: '',
    emergency_level: 'medium',
  });
  const [errors, setErrors] = useState({});
  const [expandedShelter, setExpandedShelter] = useState(null);

  const {
    requestShelter,
    isRequesting,
    requestStatus,
    requestError,
    fetchRelatedShelters,
    relatedShelters,
    loadingRelated,
    errorRelated
  } = useShelterStore();

  useEffect(() => {
    fetchRelatedShelters();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  const handleSelectChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.shelter_request_title) newErrors.shelter_request_title = 'Title is required';
    if (!formData.shelter_request_message) newErrors.shelter_request_message = 'Message is required';
    if (!formData.shelter_request_needs) newErrors.shelter_request_needs = 'Needs are required';
    if (!formData.emergency_level) newErrors.emergency_level = 'Emergency level is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await requestShelter(formData);
  };
  const toggleExpandShelter = (id) => {
    setExpandedShelter(expandedShelter === id ? null : id);
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case "full":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Full</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (requestStatus) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Request Shelter</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
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
                        {requestStatus.message || 'Thank you for your shelter request. Emergency services will contact you soon.'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Your request has been received and will be processed as soon as possible. 
                    Please keep your phone nearby for updates.
                  </p>
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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Request Shelter</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-4 bg-white dark:bg-gray-900">
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <CardTitle>Emergency Shelter Request</CardTitle>
                      <CardDescription>
                        Fill out this form to request shelter assistance
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    {requestError && (
                      <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 rounded-md">
                        {requestError}
                      </div>
                    )}
                    <div className="space-y-4">
                      <Label htmlFor="shelter_request_title">Title *</Label>
                      <Input 
                        id="shelter_request_title" 
                        value={formData.shelter_request_title}
                        onChange={handleChange}
                        placeholder="e.g. Flooded house, need urgent help" 
                        required 
                      />
                      {errors.shelter_request_title && <p className="text-sm text-red-500">{errors.shelter_request_title}</p>}
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="shelter_request_message">Message *</Label>
                      <Textarea
                        id="shelter_request_message"
                        value={formData.shelter_request_message}
                        onChange={handleChange}
                        placeholder="Describe your situation..."
                        required
                      />
                      {errors.shelter_request_message && <p className="text-sm text-red-500">{errors.shelter_request_message}</p>}
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="shelter_request_needs">Needs *</Label>
                      <Input
                        id="shelter_request_needs"
                        value={formData.shelter_request_needs}
                        onChange={handleChange}
                        placeholder="e.g. Temporary shelter for 4, medical help"
                        required
                      />
                      {errors.shelter_request_needs && <p className="text-sm text-red-500">{errors.shelter_request_needs}</p>}
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="emergency_level">Emergency Level *</Label>
                      <Select value={formData.emergency_level} onValueChange={v => handleSelectChange('emergency_level', v)} required>
                        <SelectTrigger id="emergency_level">
                          <SelectValue placeholder="Select emergency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.emergency_level && <p className="text-sm text-red-500">{errors.emergency_level}</p>}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <ClipboardList className="h-4 w-4" />
                      <span>By submitting this form, you agree to share this information with emergency services.</span>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button type="submit" className="bg-blue-400 hover:bg-blue-700" disabled={isRequesting}>
                        {isRequesting ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Card>
              {/* Related Shelters Section */}
              <Card className="mt-6 border border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Related Shelters Near You</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingRelated ? (
                    <div className="flex items-center gap-2 text-blue-600"><Loader2 className="animate-spin" /> Loading shelters...</div>
                  ) : errorRelated ? (
                    <div className="text-red-600">{errorRelated}</div>
                  ) : (
                    <div className="space-y-3">
                      {relatedShelters && relatedShelters.length > 0 ? (
                        relatedShelters.map((shelter) => (
                          <Card key={shelter.shelter_id} className="border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => toggleExpandShelter(shelter.shelter_id)}>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900 dark:text-white">{shelter.shelter_name}</h3>
                                  {getStatusBadge(shelter.shelter_status)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{shelter.shelter_address}</div>
                              </div>
                              <div>
                                {expandedShelter === shelter.shelter_id ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                              </div>
                            </div>
                            {expandedShelter === shelter.shelter_id && (
                              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                  <div><b>Capacity:</b> {shelter.shelter_size}</div>
                                  <div><b>Available:</b> {shelter.available}</div>
                                  <div><b>Status:</b> {shelter.shelter_status}</div>
                                  {shelter.flood_name && <div><b>Flood:</b> {shelter.flood_name} ({shelter.start_date} - {shelter.end_date || 'Ongoing'})</div>}
                                  <div><b>Divisional Secretariat ID:</b> {shelter.divisional_secretariat_id}</div>
                                  {shelter.shelter_house_id && <div><b>Assigned to your house</b></div>}
                                </div>
                              </div>
                            )}
                          </Card>
                        ))
                      ) : (
                        <div className="text-gray-500">No related shelters found.</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Information Card (unchanged) */}
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