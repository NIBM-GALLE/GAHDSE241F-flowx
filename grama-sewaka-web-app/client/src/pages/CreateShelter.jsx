import {
  Home,
  MapPin,
  Users,
  Phone,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Plus,
  Edit,
  Save,
  Trash2,
  Filter,
  Search,
  Clock
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge"; // Add this import
import { Label } from "@/components/ui/label";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useMemo, useState } from "react";
import { useShelterStore } from "@/stores/useShelterStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

function CreateShelter() {
  const {
    shelters,
    loading,
    error,
    fetchShelters,
    createShelter,
    updateShelter,
  } = useShelterStore();

  // Compute divisionalSecretariats from shelters
  const divisionalSecretariats = useMemo(() =>
    Array.from(new Set(shelters.map((s) => s.divisional_secretariat_id)))
      .map((id) => {
        const shelter = shelters.find((s) => s.divisional_secretariat_id === id);
        return shelter
          ? { id, name: shelter.divisional_secretariat_name || `DS ${id}` }
          : { id, name: `DS ${id}` };
      })
      .filter(ds => ds.id),
    [shelters]
  );

  // State for form
  const [formData, setFormData] = useState({
    shelter_name: '',
    shelter_size: '',
    shelter_address: '',
    available: '',
    shelter_status: 'active',
    // divisional_secretariat_id is NOT needed for createShelter, backend gets it from user
  });

  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    fetchShelters();
  }, [fetchShelters]);

  // Filter shelters based on search and status
  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch =
      (shelter.shelter_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shelter.shelter_id + '').includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" ||
      shelter.shelter_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    if (!formData.shelter_name) newErrors.shelter_name = 'Shelter name is required';
    if (!formData.shelter_size) newErrors.shelter_size = 'Capacity is required';
    if (!formData.shelter_address) newErrors.shelter_address = 'Address is required';
    if (formData.available === '' || formData.available === null || formData.available === undefined) newErrors.available = 'Available is required';
    if (!formData.shelter_status) newErrors.shelter_status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editingId) {
      updateShelter(editingId, formData);
      setEditingId(null);
    } else {
      // Only send fields required by backend
      createShelter({
        shelter_name: formData.shelter_name,
        shelter_size: formData.shelter_size,
        shelter_address: formData.shelter_address,
        available: formData.available,
        shelter_status: formData.shelter_status,
      });
    }
    setFormData({
      shelter_name: '',
      shelter_size: '',
      shelter_address: '',
      available: '',
      shelter_status: 'active',
    });
  };

  const handleEdit = (shelter) => {
    setEditForm({ ...shelter });
    setEditingId(shelter.shelter_id);
    setEditModalOpen(true);
    setEditErrors({});
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditForm((prev) => ({ ...prev, [id]: value }));
    if (editErrors[id]) setEditErrors((prev) => ({ ...prev, [id]: null }));
  };

  const handleEditSelectChange = (id, value) => {
    setEditForm((prev) => ({ ...prev, [id]: value }));
    if (editErrors[id]) setEditErrors((prev) => ({ ...prev, [id]: null }));
  };

  const validateEdit = () => {
    const errs = {};
    if (!editForm.shelter_name) errs.shelter_name = 'Shelter name is required';
    if (!editForm.shelter_size) errs.shelter_size = 'Capacity is required';
    if (!editForm.shelter_address) errs.shelter_address = 'Address is required';
    if (editForm.available === '' || editForm.available === null || editForm.available === undefined) errs.available = 'Available is required';
    if (!editForm.shelter_status) errs.shelter_status = 'Status is required';
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateEdit()) return;
    // Only send changed fields
    const changedFields = {};
    Object.keys(editForm).forEach((key) => {
      if (editForm[key] !== undefined && editForm[key] !== null && editForm[key] !== '' && editForm[key] !== shelters.find(s => s.shelter_id === editingId)?.[key]) {
        changedFields[key] = editForm[key];
      }
    });
    if (Object.keys(changedFields).length > 0) {
      updateShelter(editingId, changedFields);
    }
    setEditModalOpen(false);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditingId(null);
    setEditForm({});
    setEditErrors({});
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
        </Badge>;
      case "full":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="h-3 w-3 mr-1" /> Full
        </Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="h-3 w-3 mr-1" /> Maintenance
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getLocationName = (id) => {
    const location = divisionalSecretariats.find(ds => ds.id === id);
    return location ? location.name : "Unknown";
  };

  // Show loading or error state
  if (loading) return <div>Loading shelters...</div>;
  if (error) return <div>Error loading shelters: {error.message}</div>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 text-black">
          <SidebarTrigger className="-ml-1 text-black" />
          <h1 className="text-xl font-semibold">
            Shelter Management
          </h1>
        </header>

        <main className="p-2 bg-white dark:bg-gray-900">
          <div className="flex-1 p-4 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Shelter Management
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {editingId ? "Editing Shelter" : "Create and manage shelters"}
                  </p>
                </div>
              </div>

              {/* Shelter Form */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle>
                    {editingId ? "Edit Shelter" : "Create New Shelter"}
                  </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shelter_name">Shelter Name *</Label>
                        <Input
                          id="shelter_name"
                          value={formData.shelter_name}
                          onChange={handleChange}
                          placeholder="e.g. Colombo Public School"
                          required
                        />
                        {errors.shelter_name && <p className="text-sm text-red-500">{errors.shelter_name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shelter_address">Address *</Label>
                        <Input
                          id="shelter_address"
                          value={formData.shelter_address}
                          onChange={handleChange}
                          placeholder="e.g. 123 Main St, Colombo"
                          required
                        />
                        {errors.shelter_address && <p className="text-sm text-red-500">{errors.shelter_address}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shelter_size">Total Capacity *</Label>
                        <Input
                          id="shelter_size"
                          type="number"
                          value={formData.shelter_size}
                          onChange={handleChange}
                          placeholder="e.g. 250"
                          min="1"
                          required
                        />
                        {errors.shelter_size && <p className="text-sm text-red-500">{errors.shelter_size}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="available">Currently Available</Label>
                        <Input
                          id="available"
                          type="number"
                          value={formData.available}
                          onChange={handleChange}
                          placeholder="e.g. 180"
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shelter_status">Status</Label>
                        <Select
                          value={formData.shelter_status}
                          onValueChange={(value) => handleSelectChange('shelter_status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="full">Full</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3">
                    {editingId && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editingId ? (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Save Changes
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Create Shelter
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Shelter List */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900 dark:text-white">All Shelters</CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        {filteredShelters.length} shelters found
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search shelters..."
                          className="pl-8 w-[200px] border-gray-300 dark:border-gray-600"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex gap-2">
                            <Filter className="h-4 w-4" />
                            {statusFilter === "all" ? "Status" : statusFilter}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                            All Statuses
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                            Active
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("full")}>
                            Full
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("maintenance")}>
                            Maintenance
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Shelter Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Capacity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Available
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredShelters.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                              No shelters found matching your criteria
                            </td>
                          </tr>
                        ) : (
                          filteredShelters.map((shelter) => (
                            <tr key={shelter.shelter_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {shelter.shelter_id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {shelter.shelter_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {getLocationName(shelter.divisional_secretariat_id)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {shelter.shelter_size}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {shelter.available}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {getStatusBadge(shelter.shelter_status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(shelter)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>

      {/* Edit Shelter Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="px-6 py-4 rounded-t-xl">
            <DialogTitle className="text-black text-lg flex items-center gap-2">
              <Edit className="h-5 w-5" /> Edit Shelter
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6 px-6 py-6 bg-white dark:bg-gray-900 rounded-b-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="shelter_name">Shelter Name *</Label>
                <Input
                  id="shelter_name"
                  value={editForm.shelter_name || ''}
                  onChange={handleEditChange}
                  required
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {editErrors.shelter_name && <p className="text-sm text-red-500">{editErrors.shelter_name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shelter_address">Address *</Label>
                <Input
                  id="shelter_address"
                  value={editForm.shelter_address || ''}
                  onChange={handleEditChange}
                  required
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {editErrors.shelter_address && <p className="text-sm text-red-500">{editErrors.shelter_address}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="shelter_size">Total Capacity *</Label>
                <Input
                  id="shelter_size"
                  type="number"
                  value={editForm.shelter_size || ''}
                  onChange={handleEditChange}
                  min="1"
                  required
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {editErrors.shelter_size && <p className="text-sm text-red-500">{editErrors.shelter_size}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="available">Currently Available</Label>
                <Input
                  id="available"
                  type="number"
                  value={editForm.available || ''}
                  onChange={handleEditChange}
                  min="0"
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {editErrors.available && <p className="text-sm text-red-500">{editErrors.available}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shelter_status">Status</Label>
                <Select
                  value={editForm.shelter_status || ''}
                  onValueChange={(value) => handleEditSelectChange('shelter_status', value)}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                {editErrors.shelter_status && <p className="text-sm text-red-500">{editErrors.shelter_status}</p>}
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-gray-300 dark:border-gray-700">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

export default CreateShelter;