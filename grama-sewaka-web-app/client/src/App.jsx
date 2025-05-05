import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { ThemeProvider } from "./components/ui/theme-provider";

// pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
