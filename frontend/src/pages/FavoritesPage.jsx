// src/pages/FavoritesPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Button,
  Spinner,
  Card,
} from "react-bootstrap";
import { getFavorites } from "../api/authApi";
import ListFavorites from "./ListFavorites";
import AuthCheck from "../components/AuthCheck";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const data = await getFavorites(token);
        setFavorites(data);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        setError("Could not fetch favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  return (
    
      <Container fluid className="bg-light min-vh-100 py-5">
        <h2 className="fw-bold text-dark mb-4">
          <img
            alt="logo"
            src="/favorites.png"
            width="50"
            height="50"
            className="me-2"
          />
          Favorites
        </h2>

        <AuthCheck message="Please login to see your favorites.">
          
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="secondary" role="status" />
            <p className="mt-3">Loading favorites...</p>
          </div>
        ) : error ? (
          <Card className="text-center p-5 shadow-sm">
            <Card.Body>
              <Card.Text className="text-danger mb-4">{error}</Card.Text>
            </Card.Body>
          </Card>
        ) : favorites.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            <ListFavorites favorites={favorites} />
          </Row>
        ) : (
          <Card className="text-center p-5 shadow-sm">
            <Card.Body>
              <Card.Text className="text-muted mb-4">
                You don’t have any favorites yet.
              </Card.Text>
              <Button variant="primary" href="/explore">
                Find Locations
              </Button>
            </Card.Body>
          </Card>
        )}
        </AuthCheck>
      </Container>
    
  );
}
