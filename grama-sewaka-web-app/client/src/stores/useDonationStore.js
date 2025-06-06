import { create } from "zustand";
import axios from "axios";

export const useDonationStore = create((set) => ({
  newDonations: [],
  pendingDonations: [],
  loading: false,
  error: null,
  success: null,
  selectedDonation: null,

  async fetchNewDonations() {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/donation/new", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ newDonations: res.data.donations || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || err.message, loading: false, newDonations: [] });
    }
  },

  async fetchPendingDonations() {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/donation/pending", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ pendingDonations: res.data.donations || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || err.message, loading: false, pendingDonations: [] });
    }
  },

  async getDonationById(id) {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/donation/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ selectedDonation: res.data.donation, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || err.message, loading: false });
    }
  },

  async updateDonationStatus(id, status) {
    set({ loading: true, error: null, success: null });
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/donation/${id}/status`,
        { donations_status: status },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      set({ success: "Donation status updated!", loading: false });
      // Optionally refetch new donations
    } catch (err) {
      set({ error: err.response?.data?.error || err.message, loading: false });
    }
  },

  clearStatus: () => set({ error: null, success: null }),
  clearSelected: () => set({ selectedDonation: null }),
}));
