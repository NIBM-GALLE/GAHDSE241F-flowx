import { create } from 'zustand';
import axios from 'axios';

export const useVictimRequestStore = create((set) => ({
  loading: false,
  error: null,
  submitSuccess: false,
  requests: [],
  historyLoading: false,
  historyError: null,
  async submitVictimRequest({ title, message, emergency_level, needs }) {
    set({ loading: true, error: null, submitSuccess: false });
    try {
      const res = await axios.post('/api/victims/request', {
        title,
        message,
        emergency_level,
        needs,
      });
      set({ loading: false, submitSuccess: true });
      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to submit request',
        submitSuccess: false,
      });
      throw error;
    }
  },
  async fetchVictimHistory() {
    set({ historyLoading: true, historyError: null });
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get('/api/victims/history', { headers });
      if (!res.data?.data?.allHouseRequests) {
        throw new Error('No requests found');
      }
      set({
        requests: res.data?.data?.allHouseRequests || [],
        historyLoading: false,
        historyError: null,
      });
    } catch (error) {
      set({
        historyLoading: false,
        historyError:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to load history',
      });
    }
  },
  reset: () => set({ loading: false, error: null, submitSuccess: false }),
}));
