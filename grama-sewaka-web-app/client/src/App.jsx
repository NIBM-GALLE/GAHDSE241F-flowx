import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { ThemeProvider } from "./components/ui/theme-provider";

// pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NewVictim from "./pages/NewVictimReq"; 
import ApprovedVictimsReq from "./pages/ApprovedVictimsReq";
import VictimHistory from "./pages/VictimsHistory"; 

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/victims/new" element={<NewVictim />} /> 
          <Route path="/victims/approved" element={<ApprovedVictimsReq />} />
          <Route path="/victims/history" element={<VictimHistory />} />

        </Routes>
    </ThemeProvider>
  );
}

export default App;
