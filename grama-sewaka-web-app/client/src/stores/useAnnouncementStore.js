import { create } from "zustand";
import axios from "axios";

export const useAnnouncementStore = create((set) => ({
  loading: false,
  error: null,
  success: null,

  // userType: 'admin' | 'government_officer' | 'grama_sevaka'
  async createAnnouncement({ title, description, emergency_level, user_id, userType = "government_officer" }) {
    set({ loading: true, error: null, success: null });
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/announcement/${userType}`,
        { title, description, emergency_level, user_id },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      set({ success: "Announcement created successfully!", loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  clearStatus: () => set({ error: null, success: null }),
}));