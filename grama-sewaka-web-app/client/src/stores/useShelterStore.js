import { create } from "zustand";
import axios from "axios";

export const useShelterStore = create((set, get) => ({
  shelters: [],
  loading: false,
  error: null,
  editingShelter: null,
  createStatus: null,
  updateStatus: null,

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
      const res = await axios.put(`/api/shelters/update/${shelter_id}`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ updateStatus: res.data, error: null });
      get().fetchShelters();
    } catch (error) {
      set({ updateStatus: null, error: error.response?.data?.message || error.message });
    }
  },

  setEditingShelter: (shelter) => set({ editingShelter: shelter }),
  clearEditingShelter: () => set({ editingShelter: null }),
}));
