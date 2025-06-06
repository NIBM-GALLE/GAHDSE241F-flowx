import React, { useState } from "react";
import { 
  Home,
  Package,
  Plus,
  Save,
  Trash2,
  Filter,
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react";
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
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { Edit } from "lucide-react";
import { toast } from 'sonner';
import { useSubsidyStore } from "@/stores/useSubsidyStore";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

function AddSubsidy() {
  const { 
    subsidies, 
    createSubsidy, 
    updateSubsidy,
    loading, 
    error, 
    success, 
    fetchSubsidies,
    clearStatus 
  } = useSubsidyStore();
  
  const [form, setForm] = useState({
    subsidy_id: "",
    subsidy_name: "",
    category: "",
    quantity: "",
    status: "active"
  });
  
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [editingSubsidy, setEditingSubsidy] = useState(null);

  // Fetch subsidies on component mount
  React.useEffect(() => {
    fetchSubsidies();
  }, [fetchSubsidies]);

  // Filter subsidies based on search and status
  const filteredSubsidies = subsidies.filter(subsidy => {
    const matchesSearch =
      (subsidy.subsidy_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subsidy.subsidy_id + '').includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" ||
      (subsidy.subsidies_status || subsidy.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (error || success) clearStatus();
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.subsidy_name) errs.subsidy_name = "Subsidy name is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0) {
      errs.quantity = "Valid quantity is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (editingId) {
        await updateSubsidy(editingId, { 
          ...form, 
          quantity: Number(form.quantity), 
          subsidies_status: form.status || "active" 
        });
        toast.success("Subsidy updated successfully!");
      } else {
        await createSubsidy({ 
          ...form, 
          quantity: Number(form.quantity), 
          subsidies_status: form.status || "active" 
        });
        toast.success("Subsidy created successfully!");
      }
      setForm({ 
        subsidy_id: "",
        subsidy_name: "", 
        category: "", 
        quantity: "",
        status: "active"
      });
      setEditingId(null);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to process subsidy");
    }
  };

  const handleEdit = (subsidy) => {
    setEditingSubsidy(subsidy);
    setEditForm({
      subsidy_name: subsidy.subsidy_name,
      category: subsidy.category,
      quantity: subsidy.quantity,
      status: subsidy.subsidies_status || subsidy.status || "active"
    }); 
    setEditErrors({});
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) setEditErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleEditSelectChange = (name, value) => {
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateEdit = () => {
    const errs = {};
    if (!editForm.subsidy_name) errs.subsidy_name = "Subsidy name is required";
    if (!editForm.category) errs.category = "Category is required";
    if (!editForm.quantity || isNaN(editForm.quantity) || Number(editForm.quantity) <= 0) {
      errs.quantity = "Valid quantity is required";
    }
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEdit()) return;
    if (!editingSubsidy || !editingSubsidy.subsidy_id) {
      toast.error("No subsidy selected for editing. Please try again.");
      return;
    }
    try {
      await updateSubsidy(editingSubsidy.subsidy_id, {
        subsidy_name: editForm.subsidy_name,
        category: editForm.category,
        quantity: Number(editForm.quantity),
        subsidies_status: editForm.status || "active"
      });
      toast.success("Subsidy updated successfully!");
      setEditModalOpen(false);
      setEditingSubsidy(null);
      fetchSubsidies(); // Refresh the list after update
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to update subsidy");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ 
      subsidy_id: "",
      subsidy_name: "", 
      category: "", 
      quantity: "",
      status: "active"
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
        </Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="h-3 w-3 mr-1" /> Inactive
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 bg-blue-600 text-white">
          <SidebarTrigger className="-ml-1 text-white" />
          <h1 className="text-xl font-semibold">
            Subsidy Management
          </h1>
        </header>

        <main className="p-4 bg-white dark:bg-gray-900">
          <div className="flex-1 p-4 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Subsidy Management
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {editingId ? "Editing Subsidy" : "Create and manage subsidies"}
                  </p>
                </div>
              </div>

              {/* Subsidy Form */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle>
                    {editingId ? "Edit Subsidy" : "Create New Subsidy"}
                  </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subsidy_name">Subsidy Name *</Label>
                        <Input
                          id="subsidy_name"
                          name="subsidy_name"
                          value={form.subsidy_name}
                          onChange={handleChange}
                          placeholder="e.g. Fertilizer, School Supplies"
                          className={errors.subsidy_name ? "border-red-500" : ""}
                        />
                        {errors.subsidy_name && <p className="text-sm text-red-500">{errors.subsidy_name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={form.category}
                          onValueChange={(value) => handleSelectChange('category', value)}
                        >
                          <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Agriculture">Agriculture</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Housing">Housing</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          value={form.quantity}
                          onChange={handleChange}
                          placeholder="Enter available quantity"
                          className={errors.quantity ? "border-red-500" : ""}
                          min="1"
                        />
                        {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={form.status}
                          onValueChange={(value) => handleSelectChange('status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
                    <Button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? (
                        "Processing..."
                      ) : editingId ? (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Save Changes
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Create Subsidy
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Subsidy List */}
              <Card className="border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900 dark:text-white">All Subsidies</CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        {filteredSubsidies.length} subsidies found
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search subsidies..."
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
                          <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                            Inactive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subsidy Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Current Quantity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubsidies.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">
                              No subsidies found matching your criteria
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredSubsidies.map((subsidy, idx) => (
                            <TableRow key={subsidy.subsidy_id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell>{subsidy.subsidy_name}</TableCell>
                                <TableCell>{subsidy.category}</TableCell>
                                <TableCell>{subsidy.quantity}</TableCell>
                                <TableCell>{subsidy.current_quantity || subsidy.quantity}</TableCell>
                              <TableCell>
                                {getStatusBadge(subsidy.subsidies_status || subsidy.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit()}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Edit Subsidy Dialog */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subsidy</DialogTitle>
              <DialogDescription>
                Update the details of the selected subsidy. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_subsidy_name">Subsidy Name *</Label>
                <Input
                  id="edit_subsidy_name"
                  name="subsidy_name"
                  value={editForm.subsidy_name || ""}
                  onChange={handleEditChange}
                  className={editErrors.subsidy_name ? "border-red-500" : ""}
                />
                {editErrors.subsidy_name && <p className="text-sm text-red-500">{editErrors.subsidy_name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_category">Category *</Label>
                <Select
                  value={editForm.category || ""}
                  onValueChange={(value) => handleEditSelectChange('category', value)}
                >
                  <SelectTrigger className={editErrors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {editErrors.category && <p className="text-sm text-red-500">{editErrors.category}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_quantity">Quantity *</Label>
                <Input
                  id="edit_quantity"
                  name="quantity"
                  type="number"
                  value={editForm.quantity || ""}
                  onChange={handleEditChange}
                  className={editErrors.quantity ? "border-red-500" : ""}
                  min="1"
                />
                {editErrors.quantity && <p className="text-sm text-red-500">{editErrors.quantity}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_status">Status</Label>
                <Select
                  value={editForm.status || "active"}
                  onValueChange={(value) => handleEditSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AddSubsidy;