import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { ThemeProvider } from "./components/ui/theme-provider";

//pages
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import FloodPredictionDetails from "./pages/FloodPredictionDetails";
import Announcements from "./pages/Announcements";
import VictimRequest from "./pages/VictimsRequest";
import VictimsHistory from "./pages/VictimsHistory";


function App() {
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flood-prediction" element={<FloodPredictionDetails />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/victim-request" element={<VictimRequest />} />
          <Route path="/victims-history" element={<VictimsHistory />} />
  
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
