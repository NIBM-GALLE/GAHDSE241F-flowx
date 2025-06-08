import { useState } from "react";
import axios from "axios";

export function useFloodStore() {
  const [floods, setFloods] = useState([]);
  const [floodDetails, setFloodDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFlood, setCurrentFlood] = useState(null);
  const [pastFloods, setPastFloods] = useState([]);

  // Create a new flood event
  async function createFloodEvent(data, token) {
    setLoading(true);
    try {
      const res = await axios.post("/api/flood", data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data || err;
    }
  }

  // Create new flood details
  async function createFloodDetails(data, token) {
    setLoading(true);
    try {
      const res = await axios.post("/api/flood/details", data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data || err;
    }
  }

  // Get all floods
  async function getAllFloods(token) {
    setLoading(true);
    try {
      const res = await axios.get("/api/flood", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setFloods(res.data.data || []);
      setLoading(false);
      return res.data.data || [];
    } catch (err) {
      setLoading(false);
      throw err.response?.data || err;
    }
  }

  // Get flood details (optionally by flood_id)
  async function getFloodDetails(flood_id, token) {
    setLoading(true);
    try {
      const res = await axios.get(`/api/flood/${flood_id}/details`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setFloodDetails(res.data.data || []);
      setLoading(false);
      return res.data.data || [];
    } catch (err) {
      setLoading(false);
      throw err.response?.data || err;
    }
  }

  // Update flood status
  async function updateFloodStatus(flood_id, status, token) {
    setLoading(true);
    try {
      const res = await axios.put(`/api/flood/${flood_id}/status`, { flood_status: status }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data || err;
    }
  }

  // Update flood details
  async function updateFloodDetails(flood_details_id, details, token) {
    setLoading(true);
    try {
      const res = await axios.put(`/api/flood/details/${flood_details_id}`, details, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data || err;
    }
  }

  // Update main flood event (name, status, end_date, description)
  async function updateFlood(flood_id, updates, token) {
    setLoading(true);
    try {
      const res = await axios.put(`/api/flood/${flood_id}`, updates, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data || err;
    }
  }

  // Get current flood (from new endpoint)
  async function getCurrentFlood(token) {
    setLoading(true);
    try {
      const res = await axios.get("/api/flood/current", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCurrentFlood(res.data.data || null);
      setLoading(false);
      return res.data.data || null;
    } catch (err) {
      setLoading(false);
      throw err.response?.data || err;
    }
  }

  // Get past floods (from new endpoint)
  async function getPastFloods(token) {
    setLoading(true);
    try {
      const res = await axios.get("/api/flood/past", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPastFloods(res.data.data || []);
      setLoading(false);
      return res.data.data || [];
    } catch (err) {
      setLoading(false);
      throw err.response?.data || err;
    }
  }

  return {
    floods,
    floodDetails,
    loading,
    createFloodEvent,
    createFloodDetails,
    getAllFloods,
    getFloodDetails,
    updateFloodStatus,
    updateFloodDetails,
    updateFlood,
    getCurrentFlood,
    getPastFloods,
    currentFlood,
    pastFloods,
  };
}
