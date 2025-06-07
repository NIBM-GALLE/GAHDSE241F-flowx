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
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, PlusCircle, Download } from "lucide-react"
import { useSubsidyRequestStore } from "@/stores/useSubsidyRequestStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

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

  const {
    requests,
    subsidies,
    loading,
    error,
    success,
    fetchSubsidyRequests,
    fetchAvailableSubsidies,
    createSubsidyRequest,
    clearStatus,
  } = useSubsidyRequestStore();

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
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Total Subsidies</CardTitle>
                  <CardDescription>This year</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">6</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Approved Amount</CardTitle>
                  <CardDescription>Total disbursed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">LKR 83,000</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Pending Approvals</CardTitle>
                  <CardDescription>Requiring action</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">2</p>
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
                    <Button onClick={() => setIsAddingNote(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Record
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farmer</TableHead>
                      <TableHead>NIC</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotes.length > 0 ? (
                      filteredNotes.map((note) => (
                        <TableRow key={note.subsidy_house_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <TableCell className="font-medium">{note.householder_name}</TableCell>
                          <TableCell>{note.nic}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{note.note || note.collection_place}</TableCell>
                          <TableCell>{note.amount ? `LKR ${note.amount}` : "-"}</TableCell>
                          <TableCell>
                            <Badge variant={statusVariantMap[note.subsidies_status] || "secondary"}>
                              {note.subsidies_status?.charAt(0).toUpperCase() + note.subsidies_status?.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{note.created_at ? note.created_at.split("T")[0] : "-"}</TableCell>
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
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{filteredNotes.length}</span> of <span className="font-medium">{requests.length}</span> records
                </div>
                <div className="space-x-3">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          {/* Add Record Modal */}
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default SubsidyNotes;