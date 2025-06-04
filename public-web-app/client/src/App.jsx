import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./components/ui/theme-provider";
import ProtectedRoute from "./components/ProtectedRoute";

//pages
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import FloodPredictionDetails from "./pages/FloodPredictionDetails";
import Announcements from "./pages/Announcements";
import VictimRequest from "./pages/VictimsRequest";
import VictimsHistory from "./pages/VictimsHistory";
import NewSubsidies from "./pages/NewSubsidies";
import SubsidyHistory from "./pages/SubsidyHistory";
import ShelterRequest from "./pages/ShelterRequest";
import Contact from "./pages/Contact";
import ShelterInformation from "./pages/ShelterInformation";
import UserProfile from "./pages/UserProfile";

function App() {
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/flood-prediction" element={
            <ProtectedRoute>
              <FloodPredictionDetails />
            </ProtectedRoute>
          } />
          <Route path="/announcements" element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          } />
          <Route path="/victim-request" element={
            <ProtectedRoute>
              <VictimRequest />
            </ProtectedRoute>
          } />
          <Route path="/victims-history" element={
            <ProtectedRoute>
              <VictimsHistory />
            </ProtectedRoute>
          } />
          <Route path="/new-subsidies" element={
            <ProtectedRoute>
              <NewSubsidies />
            </ProtectedRoute>
          } />
          <Route path="/subsidy-history" element={
            <ProtectedRoute>
              <SubsidyHistory />
            </ProtectedRoute>
          } />
          <Route path="/shelter-request" element={
            <ProtectedRoute>
              <ShelterRequest />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shelter-information" element={
            <ProtectedRoute>
              <ShelterInformation />
            </ProtectedRoute>
          } />
          <Route path="/user-profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
