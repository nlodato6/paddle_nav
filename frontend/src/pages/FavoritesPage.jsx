// src/pages/FavoritesPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Card,
} from "react-bootstrap";
import { getFavorites } from "../api/authApi";
import ListFavorites from "./ListFavorites";

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

  if (!token) {
    return (
      <Container fluid className="bg-light min-vh-100 py-5">
  
            <Col className="d-flex align-items-center">
              <img
                alt="logo"
                src="/favorites.png"
                width="50"
                height="50"
                className="me-2"
              />
              <h2 className="fw-bold text-dark m-0">Favorites</h2>
            </Col>
         
          <Card className="text-center p-5 shadow-sm">
            <Card.Body>
              <Card.Text className="text-muted mb-4">
                Please login to see your favorites.
              </Card.Text>
            </Card.Body>
          </Card>
        
      </Container>
    );
  }

  return (
    <Container fluid className="bg-light min-vh-100 py-5">
        
        {/*Title */}
        <Row className="align-items-center mb-4">
          <Col className="d-flex align-items-center">
            <img
              alt="logo"
              src="/favorites.png"
              width="50"
              height="50"
              className="me-2"
            />
            <h2 className="fw-bold text-dark m-0">My Favorites</h2>
          </Col>
        </Row>

        {/* Error */}
        {error && (
          <Card className="text-center p-4 shadow-sm mb-4">
            <Card.Body>
              <Card.Text className="text-danger">{error}</Card.Text>
            </Card.Body>
          </Card>
        )}

        {/* Page Loading */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="secondary" role="status" />
            <p className="mt-3">Loading favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          /* Favorites grid */
          <Row xs={1} md={2} lg={3} className="g-4">
            <ListFavorites favorites={favorites} />
          </Row>
        ) : (
          /* No favorites */
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
      
    </Container>
  );
}
