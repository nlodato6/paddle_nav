import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom'; // REMOVE BrowserRouter here

import Title from "./components/Title";
import LeftNavBar from "./components/LeftNavBar";
import GeminiChat from "./components/GeminiChat";


import LoginPage from './pages/LoginPage';
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";

import LocationsPage from "./pages/LocationsPage";
import FavoritesPage from './pages/FavoritesPage';
import MylocationsPage from "./pages/MyLocationsPage";
import CoastalConditions from "./pages/CoastalConditionsPage";

function App() {
  return (
    <>
      <Title />
      <div style={{ display: "flex" }}>
        <div style={{ width: "250px" }}>
          <LeftNavBar />
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          {/* ONLY Routes, no Router here */}
          <Routes>
            <Route path="/" element={<Navigate to="/locations" replace />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/conditions" element={<CoastalConditions />} />
            <Route path="/mylocations" element={<MylocationsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
          <GeminiChat />
        </div>
      </div>
    </>
  );
}

export default App;


