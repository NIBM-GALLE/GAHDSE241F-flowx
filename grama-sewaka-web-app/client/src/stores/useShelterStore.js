import { create } from "zustand";
import axios from "axios";

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
      // Determine role from token or localStorage (assume role is stored)
      const role = localStorage.getItem("role");
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
      const role = localStorage.getItem("role");
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
        "/api/shelter/create",
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
      const res = await axios.put(`/api/shelter/update/${shelter_id}`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ updateStatus: res.data, error: null });
      await get().fetchShelters();
    } catch (error) {
      set({ updateStatus: null, error: error.response?.data?.message || error.message });
    }
  },

  updateShelterRequestStatus: async (shelter_request_id, newStatus) => {
    set({ updateStatus: null, error: null });
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      let url = `/api/shelter/officer/approve/${shelter_request_id}`;
      if (role === "grama_sevaka") {
        url = `/api/shelter/gs/approve/${shelter_request_id}`;
      }
      // For status update, send { status: newStatus }
      const res = await axios.post(
        url,
        { status: newStatus },
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
