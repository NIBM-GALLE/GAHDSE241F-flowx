import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Users,
  Shield,
  HeartHandshake,
  Info,
  Clock
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  
} from "@/components/ui/card";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

function Contact() {
  const emergencyContacts = [
    {
      id: "EMG-001",
      name: "National Emergency Hotline",
      number: "1190",
      description: "For all life-threatening emergencies",
      available: "24/7",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />
    },
    {
      id: "EMG-002",
      name: "Disaster Management Center",
      number: "117",
      description: "Flood-related emergencies and information",
      available: "24/7",
      icon: <Shield className="h-5 w-5 text-blue-500" />
    },
    {
      id: "EMG-003",
      name: "Red Cross Ambulance",
      number: "1100",
      description: "Medical emergencies and ambulance service",
      available: "24/7",
      icon: <HeartHandshake className="h-5 w-5 text-red-500" />
    }
  ];

  const districtContacts = [
    {
      id: "DIST-001",
      district: "Colombo",
      contact: "0112 345 678",
      officer: "Mr. Perera",
      available: "6:00 AM - 10:00 PM"
    },
    {
      id: "DIST-002",
      district: "Gampaha",
      contact: "0332 345 678",
      officer: "Ms. Fernando",
      available: "6:00 AM - 10:00 PM"
    },
    {
      id: "DIST-003",
      district: "Kalutara",
      contact: "0342 345 678",
      officer: "Mr. Silva",
      available: "6:00 AM - 10:00 PM"
    },
    {
      id: "DIST-004",
      district: "Galle",
      contact: "0912 345 678",
      officer: "Ms. Rathnayake",
      available: "6:00 AM - 10:00 PM"
    },
    {
      id: "DIST-005",
      district: "Matara",
      contact: "0412 345 678",
      officer: "Mr. Bandara",
      available: "6:00 AM - 10:00 PM"
    }
  ];

  const supportServices = [
    {
      id: "SUP-001",
      service: "Psychological Support",
      contact: "1333",
      description: "Mental health support for disaster victims",
      available: "8:00 AM - 8:00 PM",
      icon: <Users className="h-5 w-5 text-purple-500" />
    },
    {
      id: "SUP-002",
      service: "Women & Child Protection",
      contact: "1938",
      description: "Support for vulnerable women and children",
      available: "24/7",
      icon: <Shield className="h-5 w-5 text-pink-500" />
    },
    {
      id: "SUP-003",
      service: "Elderly Care Hotline",
      contact: "1920",
      description: "Special assistance for elderly citizens",
      available: "8:00 AM - 8:00 PM",
      icon: <HeartHandshake className="h-5 w-5 text-orange-500" />
    }
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 text-black dark:text-white">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">
            Emergency Contacts
          </h1>
        </header>

        <main className="p-4 bg-white dark:bg-gray-900">
          <div className="flex-1 p-4 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Contact Information
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Important numbers and contacts for flood emergencies
                  </p>
                </div>
              </div>

              {/* Emergency Contacts Card */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Emergency Hotlines
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Immediate response for life-threatening situations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {emergencyContacts.map((contact) => (
                      <div key={contact.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          {contact.icon}
                          <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{contact.number}</p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{contact.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>{contact.available}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* District Contacts Card */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      District Flood Relief Coordinators
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Local contacts for flood-related assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            District
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Contact Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Contact Person
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Available Hours
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {districtContacts.map((contact) => (
                          <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {contact.district}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {contact.contact}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {contact.officer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {contact.available}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Support Services Card */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                      Support Services
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Specialized assistance for flood victims
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {supportServices.map((service) => (
                      <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          {service.icon}
                          <h3 className="font-medium text-gray-900 dark:text-white">{service.service}</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{service.contact}</p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>{service.available}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information Card */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Additional Information
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        <Mail className="h-5 w-5 inline mr-2 text-blue-600 dark:text-blue-400" />
                        Email Contacts
                      </h3>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p>
                          <span className="font-medium">General Inquiries:</span> floodhelp@disaster.gov.lk
                        </p>
                        <p>
                          <span className="font-medium">Volunteer Coordination:</span> floodvolunteers@redcross.lk
                        </p>
                        <p>
                          <span className="font-medium">Donations:</span> flooddonations@disaster.gov.lk
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        <MapPin className="h-5 w-5 inline mr-2 text-blue-600 dark:text-blue-400" />
                        Regional Offices
                      </h3>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p>
                          <span className="font-medium">Western Province:</span> 123 Disaster Management Rd, Colombo
                        </p>
                        <p>
                          <span className="font-medium">Southern Province:</span> 456 Flood Relief Ave, Galle
                        </p>
                        <p>
                          <span className="font-medium">Central Province:</span> 789 Emergency Lane, Kandy
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
            
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Contact;