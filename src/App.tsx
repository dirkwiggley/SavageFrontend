import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import CombatTracker from "./components/CombatTracker";
import Profile from "./components/Profile";
import Users from "./components/Users";
import ResetPwd from "./components/ResetPwd";
import DBEditor from "./components/DBEditor/DBEditor";
import Locales from "./components/Locales";
import Exit from "./components/Exit";
import Footer from "./components/Footer";
import { AuthProvider } from './components/AuthStore';

function App() {
  return (
    <Box>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/combattracker" element={<CombatTracker />} />
            <Route path="/login/:showLogin" element={<Login />} />
            <Route path="/users" element={<Users />} />
            <Route path="/resetpassword" element={<ResetPwd />} />
            <Route path="/dbeditor" element={<DBEditor />} />
            <Route path="/locales" element={<Locales />} />
            <Route path="/exit" element={<Exit />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </Box>
  );
}

export default App;
