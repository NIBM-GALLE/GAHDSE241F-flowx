import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { ThemeProvider } from "./components/ui/theme-provider";

//pages
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";


function App() {
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
