import { useState, useEffect } from "react";
import { useShelterStore } from "@/stores/useShelterStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Pencil, Loader2, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  } from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  } from "@/components/ui/dialog";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  } from "@/components/ui/sidebar";

const statusVariantMap = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
  distributed: "info",
  collected: "secondary",
  review: "secondary",
};

function ShelterRequests() {
  const [search, setSearch] = useState("");
  const [viewRequest, setViewRequest] = useState(null);
  const [editRequest, setEditRequest] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [selectedShelterId, setSelectedShelterId] = useState("");
  const [editError, setEditError] = useState("");
  const {
  pendingRequests,
  approvedRequests,
  loading,
  error,
  fetchShelterRequests,
  updateShelterRequestStatus,
  shelters,
  } = useShelterStore();

  useEffect(() => {
    fetchShelterRequests();
  }, [fetchShelterRequests]);

  useEffect(() => {
    if (editRequest && editStatus === "approved") {
      // Only fetch shelters if not already loaded
      if (!Array.isArray(shelters) || shelters.length === 0) {
        // fetchShelters is available from the store
        if (typeof useShelterStore.getState().fetchShelters === 'function') {
          useShelterStore.getState().fetchShelters();
        }
      }
    }
  }, [editRequest, editStatus, shelters]);

  // Filtered lists
  const filteredNew = (pendingRequests || []).filter(req => {
  const searchLower = search.toLowerCase();
  return (req.house_id?.toString().toLowerCase() || "").includes(searchLower);
  });
  const filteredApproved = (approvedRequests || []).filter(req => {
  const searchLower = search.toLowerCase();
  return (req.house_id?.toString().toLowerCase() || "").includes(searchLower);
  });

  const handleEdit = (req) => {
  setEditRequest(req);
  setEditStatus(req.shelter_request_status);
  setSelectedShelterId("");
  setEditError("");
  };

  const handleEditSubmit = async (e) => {
  e.preventDefault();
  if (!editRequest) return;
  setEditLoading(true);
  setEditError("");
  try {
    if (editStatus === "approved") {
      if (!selectedShelterId) {
        setEditError("Please select a shelter to assign.");
        setEditLoading(false);
        return;
      }
      await updateShelterRequestStatus(editRequest.shelter_request_id, selectedShelterId);
      toast.success("Request approved and shelter assigned!");
    } else if (editStatus === "rejected") {
      await updateShelterRequestStatus(editRequest.shelter_request_id, null, "rejected");
      toast.success("Request rejected.");
    } else {
      setEditError("Please select a status.");
      setEditLoading(false);
      return;
    }
    setEditRequest(null);
    fetchShelterRequests();
  } catch {
    toast.error("Failed to update status");
  } finally {
    setEditLoading(false);
  }
  };

  return (
  <SidebarProvider>
  <AppSidebar />
  <SidebarInset>
  <header className="flex h-16 items-center gap-2 px-4 border-b dark:border-gray-800">
  <SidebarTrigger />
  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
  Shelter Requests
  </h1>
  </header>
  <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-gray-50 dark:bg-gray-900 space-y-8">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full mb-6">
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 shadow-sm w-full md:w-auto">
      <Filter className="h-5 w-5 text-gray-400 mr-2" />
      <Input
        type="text"
        placeholder="Filter by House ID"
        className="w-full max-w-xs md:max-w-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>

  {/* New Requests Table */}
  <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
  <CardHeader>
    <CardTitle>New Shelter Requests</CardTitle>
  </CardHeader>
  <CardContent className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>House ID</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Emergency</TableHead>
          <TableHead>Needs</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              <Loader2 className="animate-spin mx-auto" />
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-red-500">
              {error}
            </TableCell>
          </TableRow>
        ) : filteredNew.length > 0 ? (
          filteredNew.map((req) => (
            <TableRow key={req.shelter_request_id} className="border-b dark:border-gray-700">
              <TableCell>{req.first_name} {req.last_name}</TableCell>
              <TableCell>{req.house_id}</TableCell>
              <TableCell>{req.house_address}</TableCell>
              <TableCell>{req.house_members}</TableCell>
              <TableCell>
                <Badge variant={req.emergency_level === 'high' ? 'destructive' : req.emergency_level === 'medium' ? 'warning' : 'secondary'}>
                  {req.emergency_level?.charAt(0).toUpperCase() + req.emergency_level?.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{req.shelter_request_needs}</TableCell>
              <TableCell>
                <Badge variant={statusVariantMap[req.shelter_request_status] || "secondary"}>
                  {req.shelter_request_status?.charAt(0).toUpperCase() + req.shelter_request_status?.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline" onClick={() => setViewRequest(req)}>
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleEdit(req)}>
                  <Pencil className="h-4 w-4 mr-1" /> Update
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="px-4 py-4 text-center text-gray-500">
              No new requests found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </CardContent>
  </Card>

  {/* Approved Requests Table */}
  <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
  <CardHeader>
  <CardTitle>Approved/Distributed Shelter Requests</CardTitle>
  </CardHeader>
  <CardContent className="overflow-x-auto">
  <Table>
  <TableHeader>
  <TableRow>
  <TableHead>Name</TableHead>
  <TableHead>House ID</TableHead>
  <TableHead>Shelter ID</TableHead>
  <TableHead>Shelter</TableHead>
  <TableHead>Address</TableHead>
  <TableHead>Status</TableHead>
  <TableHead className="text-right">Actions</TableHead>
  </TableRow>
  </TableHeader>
  <TableBody>
  {filteredApproved.length > 0 ? (
  filteredApproved.map((req) => (
  <TableRow key={req.shelter_request_id} className="border-b dark:border-gray-700">
  <TableCell>{req.householder_name || `${req.first_name} ${req.last_name}`}</TableCell>
  <TableCell>{req.house_id}</TableCell>
  <TableCell>{req.shelter_id || "-"}</TableCell>
  <TableCell>{req.shelter_name || "-"}</TableCell>
  <TableCell>{req.shelter_address || req.house_address}</TableCell>
  <TableCell>
  <Badge variant={statusVariantMap[req.shelter_request_status] || "secondary"}>
  {req.shelter_request_status?.charAt(0).toUpperCase() + req.shelter_request_status?.slice(1)}
  </Badge>
  </TableCell>
  <TableCell className="text-right">
  <Button size="sm" variant="outline" onClick={() => setViewRequest(req)}>
  <Eye className="h-4 w-4 mr-1" /> View
  </Button>
  </TableCell>
  </TableRow>
  ))
  ) : (
  <TableRow>
  <TableCell colSpan={7} className="px-4 py-4 text-center text-gray-500">
  No approved/distributed requests found.
  </TableCell>
  </TableRow>
  )}
  </TableBody>
  </Table>
  </CardContent>
  </Card>

  {/* View Modal */}
  <Dialog open={!!viewRequest} onOpenChange={() => setViewRequest(null)}>
  <DialogContent className="max-w-lg">
  <DialogHeader>
  <DialogTitle>Shelter Request Details</DialogTitle>
  </DialogHeader>
  {viewRequest && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Name</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.householder_name || `${viewRequest.first_name} ${viewRequest.last_name}`}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">House ID</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.house_id}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Shelter ID</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.shelter_id || "-"}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Shelter Name</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.shelter_name || "-"}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Shelter Address</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.shelter_address || "-"}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Request Title</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.shelter_request_title}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Request Message</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.shelter_request_message}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Needs</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.shelter_request_needs}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
  <span className="font-semibold">
  <Badge variant={statusVariantMap[viewRequest.shelter_request_status] || "secondary"}>
  {viewRequest.shelter_request_status?.charAt(0).toUpperCase() + viewRequest.shelter_request_status?.slice(1)}
  </Badge>
  </span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Emergency Level</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.emergency_level}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">House Address</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.house_address}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Members</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.house_members}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Contact</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.member_email || viewRequest.member_phone_number}</span>
  </div>
  <div className="flex flex-col gap-1">
  <span className="text-xs text-gray-500 dark:text-gray-400">Flood</span>
  <span className="font-semibold text-gray-900 dark:text-white">{viewRequest.flood_name} ({viewRequest.start_date?.slice(0,10)} - {viewRequest.end_date?.slice(0,10) || 'Ongoing'})</span>
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

  {/* Edit Status Modal */}
  <Dialog open={!!editRequest} onOpenChange={() => setEditRequest(null)}>
    <DialogContent className="max-w-md" aria-describedby="edit-dialog-desc">
      <DialogHeader>
        <DialogTitle>Approve or Reject Shelter Request</DialogTitle>
      </DialogHeader>
      <div id="edit-dialog-desc" className="sr-only">
        Approve and assign a shelter, or reject this request.
      </div>
      {editRequest && (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={editStatus} onValueChange={setEditStatus} aria-describedby="edit-dialog-desc">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {editStatus === "approved" && (
            <div className="space-y-2">
              <Label>Assign Shelter</Label>
              <Select value={selectedShelterId} onValueChange={setSelectedShelterId} required aria-describedby="edit-dialog-desc">
                <SelectTrigger>
                  <SelectValue placeholder="Select shelter to assign" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(shelters) && shelters.length > 0 && shelters.filter(s => s.available > 0).length > 0 ? (
                    shelters.filter(s => s.available > 0).map(shelter => (
                      <SelectItem key={shelter.shelter_id} value={String(shelter.shelter_id)}>
                        {shelter.shelter_name} ({shelter.available} available)
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-sm">No shelters available</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          {editError && <div className="text-red-500 text-sm">{editError}</div>}
          <DialogFooter>
            <Button type="submit" disabled={editLoading} aria-describedby="edit-dialog-desc">
              {editLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {editStatus === "approved" ? "Approve & Assign" : "Reject"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      )}
    </DialogContent>
  </Dialog>
  </main>
  </SidebarInset>
  </SidebarProvider>
  );
  }

export default ShelterRequests;