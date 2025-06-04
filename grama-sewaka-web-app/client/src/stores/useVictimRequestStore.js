import { create } from 'zustand';
import axios from 'axios';

export const useVictimRequestStore = create((set, get) => ({
  loading: false,
  error: null,
  requests: [],
  approvedRequests: [],
  history: [],

  // Fetch new/pending requests for current user (role-based)
  async fetchPendingRequests(role) {
    set({ loading: true, error: null });
    let url = '';
    const token = localStorage.getItem("token");
    if (role === 'grama_sevaka') {
      url = '/api/victim-requests/grama-sevaka/requests/pending';
    } else if (role === 'government_officer') {
      url = '/api/victim-requests/government-officer/requests/pending';
    } else {
      set({ loading: false, error: 'Invalid role' });
      return;
    }
    try {
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      set({ requests: res.data.data || [], loading: false });
    } catch (error) {
      set({ loading: false, error: error?.response?.data?.message || error.message });
    }
  },

  // Fetch approved requests for current user (role-based)
  async fetchApprovedRequests(role) {
    set({ loading: true, error: null });
    let url = '';
    const token = localStorage.getItem("token");
    if (role === 'grama_sevaka') {
      url = '/api/victim-requests/grama-sevaka/requests/approved';
    } else if (role === 'government_officer') {
      url = '/api/victim-requests/government-officer/requests/approved';
    } else {
      set({ loading: false, error: 'Invalid role' });
      return;
    }
    try {
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      set({ approvedRequests: res.data.data || [], loading: false });
    } catch (error) {
      set({ loading: false, error: error?.response?.data?.message || error.message });
    }
  },

  // Fetch request history for current user (role-based)
  async fetchRequestHistory(role) {
    set({ loading: true, error: null });
    let url = '';
    const token = localStorage.getItem("token");
    if (role === 'grama_sevaka') {
      url = '/api/victim-requests/grama-sevaka/requests/history';
    } else if (role === 'government_officer') {
      url = '/api/victim-requests/government-officer/requests/history';
    } else {
      set({ loading: false, error: 'Invalid role' });
      return;
    }
    try {
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      set({ history: res.data.data || [], loading: false });
    } catch (error) {
      set({ loading: false, error: error?.response?.data?.message || error.message });
    }
  },

  // Approve or update request status (only for grama sevaka)
  async updateRequestStatus({ role, victim_request_id, status, remarks }) {
    if (role !== 'grama_sevaka') return;
    const token = localStorage.getItem("token");
    try {
      await axios.put(`/api/victim-requests/grama-sevaka/requests/${victim_request_id}/status`, { status, remarks }, { headers: { Authorization: `Bearer ${token}` } });
      // Optionally refetch requests
      await get().fetchPendingRequests(role);
      await get().fetchApprovedRequests(role);
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message });
    }
  },

  reset: () => set({ loading: false, error: null })
}));
