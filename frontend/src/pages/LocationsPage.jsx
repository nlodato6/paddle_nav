import { useState, useEffect } from "react";
import { getLocations } from "../api/authApi";
import LocationCard from "../components/LocationCard";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Spinner,
  Image,
} from "react-bootstrap";

export default function ListLocations() {
  const [locations, setLocations] = useState([]);
  const [filter, setFilter] = useState("all"); // all, official, non-official, user
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredLocations = locations.filter((loc) => {
    if (filter === "official") return loc.is_official_data;
    if (filter === "non-official") return !loc.is_official_data;
    if (filter === "user") return loc.submitted_by === username;
    return true; // all
  });

  return (
    <Container fluid className="py-5 bg-light min-vh-100">
      
        {/* Title */}
        <Row className="align-items-center mb-4">
          <Col xs="auto" className="d-flex align-items-center">
            <Image
              alt="logo"
              src="/explore.png"
              width={50}
              height={50}
              rounded
              className="me-2"
            />
            <h2 className="fw-bold text-dark mb-0">Explore</h2>
          </Col>
        </Row>

        {/* Filter Buttons */}
        <Row className="mb-4">
          <Col>
            <ButtonGroup>
              <Button
                variant={filter === "all" ? "primary" : "outline-secondary"}
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "official" ? "primary" : "outline-secondary"}
                onClick={() => setFilter("official")}
              >
                Official
              </Button>
              <Button
                variant={
                  filter === "non-official" ? "primary" : "outline-secondary"
                }
                onClick={() => setFilter("non-official")}
              >
                Non-Official
              </Button>
              {token && (
                <Button
                  variant={filter === "user" ? "primary" : "outline-secondary"}
                  onClick={() => setFilter("user")}
                >
                  My Locations
                </Button>
              )}
            </ButtonGroup>
          </Col>
        </Row>

        {/* Loading or Locations Grid */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading locations...</p>
          </div>
        ) : filteredLocations.length ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredLocations.map((loc) => (
              <Col key={loc.id}>
                <LocationCard location={loc} />
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted text-center mt-5">No locations found.</p>
        )}
  
    </Container>
  );
}
