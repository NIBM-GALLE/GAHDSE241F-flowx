import { create } from "zustand";
import axios from "axios";

export const useAnnouncementStore = create((set) => ({
  announcements: [],
  loading: false,
  error: null,
  success: null,

  // userType must be provided: 'admin' | 'government_officer' | 'grama_sevaka'
  async createAnnouncement({ title, description, emergency_level, user_id, userType }) {
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

  async fetchAnnouncements(userType) {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/announcement/${userType}?limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ announcements: res.data.data || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false, announcements: [] });
    }
  },

  async updateAnnouncement({ id, userType, ...fields }) {
    set({ loading: true, error: null, success: null });
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/announcement/${userType}/${id}`,
        fields,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      set({ success: "Announcement updated!", loading: false });
      set((state) => ({ announcements: state.announcements.map(a => a.id === id ? { ...a, ...fields } : a) }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  async deleteAnnouncement(id, userType) {
    set({ loading: true, error: null, success: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/announcement/${userType}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ success: "Announcement deleted!", loading: false });
      set((state) => ({ announcements: state.announcements.filter(a => a.id !== id) }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  clearStatus: () => set({ error: null, success: null }),
}));