import { create } from "zustand";
import axios from "axios";

export const useSubsidyStore = create((set) => ({
  loading: false,
  error: null,
  success: null,
  subsidies: [],

  async fetchSubsidies() {
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

  async createSubsidy({ subsidy_name, category, quantity, subsidies_status = 'active' }) {
    set({ loading: true, error: null, success: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/subsidy/new",
        { subsidy_name, category, quantity, subsidies_status },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      set({ success: res.data.message || "Subsidy created successfully!", loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.error || err.message, loading: false });
      throw err;
    }
  },

  clearStatus: () => set({ error: null, success: null }),
}));
