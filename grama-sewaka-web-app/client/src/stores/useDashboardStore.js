import { useState } from "react";
import axios from "axios";

export function useDashboardStore(token) {
  // Flood summary (today's details)
  const [floodSummary, setFloodSummary] = useState(null);
  const [floodSummaryLoading, setFloodSummaryLoading] = useState(false);
  const [floodSummaryError, setFloodSummaryError] = useState(null);

  // Donations
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donationsError, setDonationsError] = useState(null);

  // Victim Requests
  const [victimRequests, setVictimRequests] = useState([]);
  const [victimRequestsLoading, setVictimRequestsLoading] = useState(false);
  const [victimRequestsError, setVictimRequestsError] = useState(null);

  // Subsidies
  const [subsidies, setSubsidies] = useState([]);
  const [subsidiesLoading, setSubsidiesLoading] = useState(false);
  const [subsidiesError, setSubsidiesError] = useState(null);

  // Fetch flood summary (today's details)
  async function fetchFloodSummary() {
    setFloodSummaryLoading(true);
    setFloodSummaryError(null);
    try {
      const res = await axios.get("/api/flood/details/current", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setFloodSummary(res.data.data || null);
    } catch (err) {
      setFloodSummaryError(err.message || "Failed to fetch flood summary");
    } finally {
      setFloodSummaryLoading(false);
    }
  }

  // Fetch donations (new/pending for current flood)
  async function fetchDonations() {
    setDonationsLoading(true);
    setDonationsError(null);
    try {
      const res = await axios.get("/api/donation/new", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setDonations(res.data.donations || []);
    } catch (err) {
      setDonationsError(err.message || "Failed to fetch donations");
    } finally {
      setDonationsLoading(false);
    }
  }

  // Fetch victim requests (pending/approved for current flood)
  async function fetchVictimRequests() {
    setVictimRequestsLoading(true);
    setVictimRequestsError(null);
    try {
      let endpoint = "/api/victim-requests/grama-sevaka/requests/pending";
      // Optionally, you can check the user's role and use the government officer endpoint if needed
      const res = await axios.get(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setVictimRequests(res.data.data || []);
    } catch (err) {
      setVictimRequestsError(err.message || "Failed to fetch victim requests");
    } finally {
      setVictimRequestsLoading(false);
    }
  }

  // Fetch subsidies (new for current flood)
  async function fetchSubsidies() {
    setSubsidiesLoading(true);
    setSubsidiesError(null);
    try {
      // Use the correct endpoint for current subsidies
      const res = await axios.get("/api/subsidy/current", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSubsidies(res.data.subsidies || []);
    } catch (err) {
      setSubsidiesError(err.message || "Failed to fetch subsidies");
    } finally {
      setSubsidiesLoading(false);
    }
  }

  return {
    // Flood summary
    floodSummary,
    floodSummaryLoading,
    floodSummaryError,
    fetchFloodSummary,
    // Donations
    donations,
    donationsLoading,
    donationsError,
    fetchDonations,
    // Victim Requests
    victimRequests,
    victimRequestsLoading,
    victimRequestsError,
    fetchVictimRequests,
    // Subsidies
    subsidies,
    subsidiesLoading,
    subsidiesError,
    fetchSubsidies,
  };
}
