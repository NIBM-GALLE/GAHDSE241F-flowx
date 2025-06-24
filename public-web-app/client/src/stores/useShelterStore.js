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
  assignedShelter: null,
  allShelters: [],
  loadingShelterInfo: false,
  errorShelterInfo: null,
  houseLat: null,
  houseLng: null,

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

  fetchShelterInfo: async () => {
    set({ loadingShelterInfo: true, errorShelterInfo: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/shelters/info", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({
        assignedShelter: res.data.data.assignedShelter,
        allShelters: res.data.data.allShelters,
        houseLat: res.data.data.houseLat,
        houseLng: res.data.data.houseLng,
        loadingShelterInfo: false
      });
    } catch (error) {
      set({
        assignedShelter: null,
        allShelters: [],
        houseLat: null,
        houseLng: null,
        loadingShelterInfo: false,
        errorShelterInfo: error.response?.data?.message || error.message
      });
    }
  },
}));
