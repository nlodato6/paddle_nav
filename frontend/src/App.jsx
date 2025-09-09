// src/App.jsx
import React from "react";
import { Routes, Route } from 'react-router-dom'; // REMOVE BrowserRouter here

import Title from "./components/Title";
import LeftNavBar from "./components/LeftNavBar";
import Profile from "./components/profile";
import User from "./components/user";

import Home from "./pages/Home";
import LoginPage from './pages/LoginPage';
import SignupPage from "./pages/SignUpPage";

import LocationsPage from "./pages/LocationsPage";
import FavoritesPage from './pages/FavoritesPage';

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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
            {/* <Route path="/users" element={<User />} />
            <Route path="/profiles" element={<Profile />} /> */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;


