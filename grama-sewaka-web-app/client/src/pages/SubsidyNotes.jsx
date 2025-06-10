import React, { useState } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, PlusCircle } from "lucide-react"
import { useSubsidyRequestStore } from "@/stores/useSubsidyRequestStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useUserStore } from "@/stores/useUserStore";

const statusVariantMap = {
  approved: "success",
  pending: "warning",
  review: "secondary",
  rejected: "destructive",
  distributed: "success",
};

function SubsidyNotes() {
  const [search, setSearch] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [addForm, setAddForm] = useState({
    house_id: "",
    subsidies_id: "",
    category: "",
    quantity: "",
    collection_place: "",
  });
  const [addErrors, setAddErrors] = useState({});
  const [viewNote, setViewNote] = useState(null);
  const [updateStatusNote, setUpdateStatusNote] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const {
    requests,
    subsidies,
    loading,
    error,
    success,
    fetchSubsidyRequests,
    fetchAvailableSubsidies,
    createSubsidyRequest,
    updateSubsidyRequestStatus,
    clearStatus,
  } = useSubsidyRequestStore();

  const { user } = useUserStore();

  React.useEffect(() => {
    fetchSubsidyRequests();
    fetchAvailableSubsidies();
  }, [fetchSubsidyRequests, fetchAvailableSubsidies]);

  const filteredNotes = requests.filter(
    (note) =>
      (note.householder_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (note.nic?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (note.note?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
    if (addErrors[name]) setAddErrors((prev) => ({ ...prev, [name]: null }));
    if (error || success) clearStatus();
  };

  const validateAdd = () => {
    const errs = {};
    if (!addForm.house_id) errs.house_id = "House is required";
    if (!addForm.subsidies_id) errs.subsidies_id = "Subsidy is required";
    if (!addForm.category) errs.category = "Category is required";
    if (!addForm.quantity || isNaN(addForm.quantity) || Number(addForm.quantity) <= 0) {
      errs.quantity = "Valid quantity is required";
    }
    if (!addForm.collection_place) errs.collection_place = "Collection place is required";
    setAddErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateAdd()) return;
    try {
      await createSubsidyRequest({
        ...addForm,
        quantity: Number(addForm.quantity),
      });
      setIsAddingNote(false);
      setAddForm({ house_id: "", subsidies_id: "", category: "", quantity: "", collection_place: "" });
      fetchSubsidyRequests();
    } catch {
      // error handled in store
    }
  };

  const handleView = (note) => setViewNote(note);
  const handleUpdateStatus = (note) => setUpdateStatusNote(note);
  const handleStatusSubmit = async () => {
    if (!updateStatusNote) return;
    setStatusLoading(true);
    try {
      await updateSubsidyRequestStatus(updateStatusNote.subsidy_house_id, "collected");
      setUpdateStatusNote(null);
      fetchSubsidyRequests();
    } catch {
      // error handled in store
    } finally {
      setStatusLoading(false);
    }
  };

  // Summary calculations
  const totalTypes = subsidies.length;
  const totalAllocated = subsidies.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
  const totalRemaining = subsidies.reduce((sum, s) => sum + (Number(s.current_quantity) || 0), 0);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Agricultural Subsidy Management
          </h1>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500" /> Total Subsidy Types
                  </CardTitle>
                  <CardDescription>Types available for this flood</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalTypes}</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" /> Total Allocated
                  </CardTitle>
                  <CardDescription>All subsidy units allocated</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{totalAllocated}</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" /> Total Remaining
                  </CardTitle>
                  <CardDescription>Units still available</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{totalRemaining}</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Table Card */}
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Subsidy Records</CardTitle>
                    <CardDescription>
                      All approved and pending agricultural subsidies
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search records..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 w-full md:w-[300px]"
                      />
                    </div>
                    {user?.role === "grama_sevaka" && (
                      <Button onClick={() => setIsAddingNote(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Record
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>House ID</TableHead>
                      <TableHead>Subsidy</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotes.length > 0 ? (
                      filteredNotes.map((note) => (
                        <TableRow key={note.subsidy_house_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <TableCell>{note.house_id}</TableCell>
                          <TableCell>{note.subsidy_name}</TableCell>
                          <TableCell>{note.category || note.subsidy_category}</TableCell>
                          <TableCell>{note.quantity}</TableCell>
                          <TableCell>
                            <Badge variant={statusVariantMap[note.subsidies_status] || "secondary"}>
                              {note.subsidies_status?.charAt(0).toUpperCase() + note.subsidies_status?.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleView(note)}>View</Button>
                            {user?.role === "grama_sevaka" && (
                              <Button size="sm" variant="default" onClick={() => handleUpdateStatus(note)}>Update Status</Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="6" className="text-center py-8">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Search className="h-8 w-8 text-muted-foreground" />
                            <p className="text-lg font-medium">No records found</p>
                            <p className="text-sm text-muted-foreground">
                              Try adjusting your search or add a new record
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          {/* Add Record Modal (only for grama_sevaka) */}
          {user?.role === "grama_sevaka" && (
            <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Subsidy Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="house_id">House ID *</Label>
                    <Input
                      id="house_id"
                      name="house_id"
                      value={addForm.house_id}
                      onChange={handleAddChange}
                      className={addErrors.house_id ? "border-red-500" : ""}
                    />
                    {addErrors.house_id && <p className="text-sm text-red-500">{addErrors.house_id}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subsidies_id">Subsidy *</Label>
                    <select
                      id="subsidies_id"
                      name="subsidies_id"
                      value={addForm.subsidies_id}
                      onChange={handleAddChange}
                      className={`w-full border rounded px-2 py-2 ${addErrors.subsidies_id ? "border-red-500" : ""}`}
                    >
                      <option value="">Select subsidy</option>
                      {subsidies.map((s) => (
                        <option key={s.subsidies_id} value={s.subsidies_id}>
                          {s.subsidy_name} ({s.category})
                        </option>
                      ))}
                    </select>
                    {addErrors.subsidies_id && <p className="text-sm text-red-500">{addErrors.subsidies_id}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      name="category"
                      value={addForm.category}
                      onChange={handleAddChange}
                      className={addErrors.category ? "border-red-500" : ""}
                    />
                    {addErrors.category && <p className="text-sm text-red-500">{addErrors.category}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={addForm.quantity}
                      onChange={handleAddChange}
                      className={addErrors.quantity ? "border-red-500" : ""}
                      min="1"
                    />
                    {addErrors.quantity && <p className="text-sm text-red-500">{addErrors.quantity}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collection_place">Collection Place *</Label>
                    <Input
                      id="collection_place"
                      name="collection_place"
                      value={addForm.collection_place}
                      onChange={handleAddChange}
                      className={addErrors.collection_place ? "border-red-500" : ""}
                    />
                    {addErrors.collection_place && <p className="text-sm text-red-500">{addErrors.collection_place}</p>}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                      {loading ? "Saving..." : "Add Request"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {/* View Modal */}
          <Dialog open={!!viewNote} onOpenChange={() => setViewNote(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Subsidy Request Details</DialogTitle>
              </DialogHeader>
              {viewNote && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">House ID</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{viewNote.house_id}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Subsidy</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{viewNote.subsidy_name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Category</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{viewNote.category || viewNote.subsidy_category}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Quantity</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{viewNote.quantity}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Collection Place</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{viewNote.collection_place}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                    <span className="font-semibold">
                      <Badge variant={statusVariantMap[viewNote.subsidies_status] || "secondary"}>
                        {viewNote.subsidies_status?.charAt(0).toUpperCase() + viewNote.subsidies_status?.slice(1)}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Address</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{viewNote.house_address}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Flood</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{viewNote.flood_name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Grama Sevaka ID</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{viewNote.grama_sevaka_id}</span>
                  </div>
                </div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Update Status Modal */}
          {user?.role === "grama_sevaka" && (
            <Dialog open={!!updateStatusNote} onOpenChange={() => setUpdateStatusNote(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Status</DialogTitle>
                </DialogHeader>
                <div>Are you sure you want to mark this request as <b>collected</b>?</div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleStatusSubmit} disabled={statusLoading}>
                    {statusLoading ? "Updating..." : "Mark as Collected"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default SubsidyNotes;