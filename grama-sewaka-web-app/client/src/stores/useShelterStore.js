import { create } from "zustand";
import axios from "axios";

// Helper to decode JWT and extract role
function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export const useShelterStore = create((set, get) => ({
  shelters: [],
  loading: false,
  error: null,
  editingShelter: null,
  createStatus: null,
  updateStatus: null,
  // New state for requests
  pendingRequests: [],
  approvedRequests: [],
  requests: [], // Combined for UI compatibility

  fetchShelters: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      // Always use the endpoint that returns all shelters for the user's divisional secretariat
      const res = await axios.get("/api/shelter/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ shelters: res.data.data, loading: false });
    } catch (error) {
      set({ shelters: [], loading: false, error: error.response?.data?.message || error.message });
    }
  },

  // Fetch pending requests based on role
  fetchPendingRequests: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      // Use JWT to determine role
      const role = getRoleFromToken() || localStorage.getItem("role");
      let url = "/api/shelter/officer/requests/pending";
      if (role === "grama_sevaka") {
        url = "/api/shelter/gs/requests/pending";
      }
      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ pendingRequests: res.data.data || [], loading: false });
      return res.data.data || [];
    } catch (error) {
      set({ pendingRequests: [], loading: false, error: error.response?.data?.message || error.message });
      return [];
    }
  },

  // Fetch approved requests based on role
  fetchApprovedRequests: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const role = getRoleFromToken() || localStorage.getItem("role");
      let url = "/api/shelter/officer/requests/approved";
      if (role === "grama_sevaka") {
        url = "/api/shelter/gs/requests/approved";
      }
      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ approvedRequests: res.data.data || [], loading: false });
      return res.data.data || [];
    } catch (error) {
      set({ approvedRequests: [], loading: false, error: error.response?.data?.message || error.message });
      return [];
    }
  },

  // For requests page compatibility
  fetchShelterRequests: async () => {
    set({ loading: true, error: null });
    try {
      const [pending, approved] = await Promise.all([
        get().fetchPendingRequests(),
        get().fetchApprovedRequests(),
      ]);
      // Combine for UI compatibility
      set({
        requests: [...pending, ...approved],
        loading: false,
      });
    } catch (error) {
      set({
        requests: [],
        loading: false,
        error: error.response?.data?.message || error.message,
      });
    }
  },

  createShelter: async (payload) => {
    set({ createStatus: null, error: null });
    try {
      // Ensure all required fields are present and valid
      const {
        shelter_name,
        shelter_size,
        shelter_address,
        available,
        shelter_status,
      } = payload;
      if (
        !shelter_name ||
        !shelter_size ||
        !shelter_address ||
        available === undefined ||
        available === null ||
        !shelter_status
      ) {
        set({ createStatus: null, error: "All fields are required" });
        return;
      }
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/shelter/officer/create", // <-- updated endpoint
        {
          shelter_name,
          shelter_size,
          shelter_address,
          available,
          shelter_status,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      set({ createStatus: res.data, error: null });
      get().fetchShelters();
    } catch (error) {
      set({ createStatus: null, error: error.response?.data?.message || error.message });
    }
  },

  updateShelter: async (shelter_id, payload) => {
    set({ updateStatus: null, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/shelter/officer/update/${shelter_id}`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ updateStatus: res.data, error: null });
      await get().fetchShelters();
    } catch (error) {
      set({ updateStatus: null, error: error.response?.data?.message || error.message });
    }
  },

  updateShelterRequestStatus: async (shelter_request_id, shelter_id, status) => {
    set({ updateStatus: null, error: null });
    try {
      const token = localStorage.getItem("token");
      const role = getRoleFromToken() || localStorage.getItem("role");
      let url;
      let body;
      if (shelter_id) {
        url = role === "grama_sevaka"
          ? `/api/shelter/gs/approve/${shelter_request_id}`
          : `/api/shelter/officer/approve/${shelter_request_id}`;
        body = { shelter_id };
      } else if (status === "rejected") {
        url = role === "grama_sevaka"
          ? `/api/shelter/gs/update-status/${shelter_request_id}`
          : `/api/shelter/officer/update-status/${shelter_request_id}`;
        body = { status: "rejected" };
      } else {
        throw new Error("Invalid arguments for updateShelterRequestStatus");
      }
      const res = await axios.post(
        url,
        body,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      set({ updateStatus: res.data, error: null });
      await get().fetchShelterRequests();
    } catch (error) {
      set({ updateStatus: null, error: error.response?.data?.message || error.message });
    }
  },

  setEditingShelter: (shelter) => set({ editingShelter: shelter }),
  clearEditingShelter: () => set({ editingShelter: null }),
}));
