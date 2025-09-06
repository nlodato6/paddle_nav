// /pages/FavoritesPage.jsx
import Container from 'react-bootstrap/Container';
import ListFavorites from './ListFavorites';
import React, { useEffect, useState } from "react";
import { getFavorites } from "../api/authApi";


function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return; // Don't fetch if not logged in

    const fetchFavorites = async () => {
      try {
        const data = await getFavorites(token);
        setFavorites(data);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        setError("Could not fetch favorites.");
      }
    };

    fetchFavorites();
  }, [token]);

  if (!token) {
    return (
      <div className="favorites-page">
        <h2>Favorites</h2>
        <p>Please login to see favorites.</p>
      </div>
    );
  }

  return (
    <Container fluid className="mt-8">
      <h2 className="text-center">My Favorites</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
        <ListFavorites />
      </div>
    </Container>
  );
}

export default FavoritesPage;
