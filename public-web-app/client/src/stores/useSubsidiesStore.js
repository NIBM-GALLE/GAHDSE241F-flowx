import { create } from "zustand";
import axios from "axios";

export const useSubsidiesStore = create((set) => ({
  newSubsidies: [],
  allSubsidies: [],
  floodId: null,
  houseId: null,
  loadingNew: false,
  loadingAll: false,
  errorNew: null,
  errorAll: null,
  subsidiesHistory: [],
  loadingHistory: false,
  errorHistory: null,

  fetchNewSubsidies: async () => {
    set({ loadingNew: true, errorNew: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/subsidies/available", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data.success) {
        set({
          newSubsidies: res.data.data.subsidies,
          floodId: res.data.data.floodId,
          houseId: res.data.data.houseId,
          loadingNew: false,
        });
      } else {
        set({ newSubsidies: [], loadingNew: false, errorNew: res.data.message });
      }
    } catch (error) {
      set({ newSubsidies: [], loadingNew: false, errorNew: error.message });
    }
  },

  fetchAllSubsidiesForFlood: async () => {
    set({ loadingAll: true, errorAll: null });
    try {
      const res = await axios.get("api/subsidies/all-for-flood");
      if (res.data.success) {
        set({
          allSubsidies: res.data.data.subsidies,
          floodId: res.data.data.floodId,
          loadingAll: false,
        });
      } else {
        set({ allSubsidies: [], loadingAll: false, errorAll: res.data.message });
      }
    } catch (error) {
      set({ allSubsidies: [], loadingAll: false, errorAll: error.message });
    }
  },

  fetchSubsidiesHistory: async () => {
    set({ loadingHistory: true, errorHistory: null });
    try {
      // Get token from localStorage (or your auth context)
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/subsidies/history", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data.success) {
        set({
          subsidiesHistory: res.data.data.subsidiesHistory,
          loadingHistory: false,
        });
      } else {
        set({ subsidiesHistory: [], loadingHistory: false, errorHistory: res.data.message });
      }
    } catch (error) {
      set({ subsidiesHistory: [], loadingHistory: false, errorHistory: error.message });
    }
  },
}));
