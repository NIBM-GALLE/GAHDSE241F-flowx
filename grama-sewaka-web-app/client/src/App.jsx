import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./components/ui/theme-provider";

// pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NewVictimRequests from "./pages/NewVictimRequests";
import ApprovedVictimRequests from "./pages/ApprovedVictimRequests";
import VictimRequestsHistory from "./pages/VictimRequestsHistory";
import CreateAnnouncement from "./pages/CreateAnnouncement";
import PendingDonations from "./pages/PendingDonations";
import NewDonationRequests from "./pages/NewDonationRequests";
import DonationHistory from "./pages/DonationHistory";
import SubsidyGivers from "./pages/SubsidyGivers";
import SubsidyNotes from "./pages/SubsidyNotes";
import Profile from "./pages/Profile";
import ShelterRequest from "./pages/ShelterRequests";
import CreateShelter from "./pages/CreateShelter";
import AnnouncementList from "./pages/AnnouncementList";
import AddSubsidy from "./pages/AddSubsidy";
import CreateFloodEvent from "./pages/CreateFloodEvent";
import FloodDetails from "./pages/FloodDetails";
import FloodEvents from "./pages/FloodEvents";
import CreateFloodDetails from "./pages/CreateFloodDetails";
import Statistics from "./pages/Statistics";

// components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/victims/new" element={<NewVictimRequests />} />
          <Route path="/victims/approved" element={<ApprovedVictimRequests />} />
          <Route path="/victims/history" element={<VictimRequestsHistory />} />

          <Route path="/announcements/create" element={<CreateAnnouncement />} />
          <Route path="/announcements/list" element={<AnnouncementList />} />

          <Route path="/donations/pending" element={<PendingDonations />} />
          <Route path="/donations/new-requests" element={<NewDonationRequests />} />
          <Route path="/donations/history" element={<DonationHistory />} />

          <Route path="/subsidy-givers" element={<SubsidyGivers />} />
          <Route path="/subsidy-notes" element={<SubsidyNotes />} />
          <Route path="/subsidy/add" element={<AddSubsidy />} />

          <Route path="/shelter-request" element={<ShelterRequest />} />
          <Route path="/create-shelter" element={<CreateShelter />} />

          <Route path="/create-flood-event" element={<CreateFloodEvent />} />
          <Route path="/flood-events" element={<FloodEvents />} />

          <Route path="/create-flood-details" element={<CreateFloodDetails />} />
          <Route path="/flood-details" element={<FloodDetails />} />

          <Route path="/statistics" element={<Statistics /> } />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
