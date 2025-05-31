import { create } from 'zustand';
import axios from 'axios';

export const useVictimRequestStore = create((set) => ({
  loading: false,
  error: null,
  submitSuccess: false,
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
  reset: () => set({ loading: false, error: null, submitSuccess: false }),
}));
