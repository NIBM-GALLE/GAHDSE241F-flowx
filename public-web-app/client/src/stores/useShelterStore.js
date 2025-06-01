import { create } from "zustand";
import axios from "axios";

export const useShelterStore = create((set) => ({
  requestStatus: null,
  requestError: null,
  isRequesting: false,
  shelterHistory: [],
  loadingHistory: false,
  errorHistory: null,
  relatedShelters: [],
  loadingRelated: false,
  errorRelated: null,

  requestShelter: async (payload) => {
    set({ isRequesting: true, requestError: null, requestStatus: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/shelters/request", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ requestStatus: res.data, isRequesting: false });
    } catch (error) {
      set({ requestError: error.response?.data?.message || error.message, isRequesting: false });
    }
  },

  fetchShelterHistory: async () => {
    set({ loadingHistory: true, errorHistory: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/shelters/history", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ shelterHistory: res.data.data.requestHistory, loadingHistory: false });
    } catch (error) {
      set({ shelterHistory: [], loadingHistory: false, errorHistory: error.response?.data?.message || error.message });
    }
  },

  fetchRelatedShelters: async () => {
    set({ loadingRelated: true, errorRelated: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("api/shelters/related", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ relatedShelters: res.data.data.relatedShelters, loadingRelated: false });
    } catch (error) {
      set({ relatedShelters: [], loadingRelated: false, errorRelated: error.response?.data?.message || error.message });
    }
  },
}));
