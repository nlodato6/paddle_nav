// /pages/ListFavorites.jsx
import { useState, useEffect } from 'react';
import { getFavorites } from '../api/authApi';
import LocationCard from '../components/LocationCard';

export default function ListFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (loading) return <p>Loading favorites...</p>;
  if (!favorites.length) return <p>No favorites yet.</p>;

  return favorites.map((location) => (
    <LocationCard key={location.id} location={location} />
  ));
}
