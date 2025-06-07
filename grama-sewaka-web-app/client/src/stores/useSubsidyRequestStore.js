import { create } from "zustand";
import axios from "axios";

export const useSubsidyRequestStore = create((set) => ({
  loading: false,
  error: null,
  success: null,
  requests: [],
  subsidies: [],

  async fetchSubsidyRequests() {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/subsidy/requests", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ requests: res.data.requests || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || err.message, loading: false });
    }
  },

  async fetchAvailableSubsidies() {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/subsidy/current", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ subsidies: res.data.subsidies || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || err.message, loading: false });
    }
  },

  async createSubsidyRequest(data) {
    set({ loading: true, error: null, success: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/subsidy/requests",
        data,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      set({ success: res.data.message || "Request created!", loading: false });
      return res.data;
    } catch (err) {
        console.error("Error details:", err.response?.data);
      set({ error: err.response?.data?.error || err.message, loading: false });
      throw err;
    }
  },

  async updateSubsidyRequestStatus(subsidy_house_id, subsidies_status) {
    set({ loading: true, error: null, success: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `/api/subsidy/request/${subsidy_house_id}/status`,
        { subsidies_status },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      set({ success: res.data.message || "Status updated!", loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.error || err.message, loading: false });
      throw err;
    }
  },

  clearStatus: () => set({ error: null, success: null }),
})
);
