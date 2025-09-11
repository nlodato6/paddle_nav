import { useState, useEffect } from "react";
import { getLocations } from "../api/authApi";
import LocationCard from "../components/LocationCard";
import CreateLocationsForm from "../components/CreateLocationForm";
import EditLocationForm from "../components/EditLocationForm"; // ✅ import the edit form
import { Container, Row, Col, Button, Spinner, Card } from "react-bootstrap";

export default function MyLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // create location form
  const [editingLocation, setEditingLocation] = useState(null); // edit location form

  const username = localStorage.getItem("username");

  // Fetch user's locations
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await getLocations();
      const userLocations = data.filter(
        (loc) => loc.submitted_by === username
      );
      setLocations(userLocations);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchLocations();
    }
  }, [username]);

  const handleCreateClick = () => {
    setShowForm((prev) => !prev); // ✅ Toggle the form
  };

  return (
    <Container fluid className="bg-light min-vh-100 py-5">
      <Container>
        {/* Header */}
        <Row className="align-items-center mb-4">
          <Col className="d-flex align-items-center">
            <img
              alt="logo"
              src="/mylocations.png"
              width="50"
              height="50"
              className="me-2"
            />
            <h2 className="fw-bold text-dark m-0">My Locations</h2>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={handleCreateClick}>
              {showForm ? "Cancel" : "Create New Location"}
            </Button>
          </Col>
        </Row>

        {/* Show Create Form */}
        {showForm && (
          <div className="mb-5">
            <CreateLocationsForm
              onSuccess={() => {
                fetchLocations();
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* Show Edit Form */}
        {editingLocation && (
          <div className="mb-5">
            <EditLocationForm
              location={editingLocation}
              onSuccess={() => {
                fetchLocations();
                setEditingLocation(null);
              }}
              onCancel={() => setEditingLocation(null)}
            />
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="secondary" role="status" />
            <p className="mt-3">Loading locations...</p>
          </div>
        ) : locations.length > 0 ? (
          /* Locations Grid */
          <Row xs={1} md={2} lg={3} className="g-4">
            {locations.map((loc) => (
              <Col key={loc.id}>
                <LocationCard
                  location={loc}
                  onEdit={setEditingLocation} // ✅ handle edit click
                  showEdit={username && !loc.is_official_data} // ✅ only show if user + non-official
                />
              </Col>
            ))}
          </Row>
        ) : (
          /* Empty State */
          !showForm && !editingLocation && ( // Only show empty state if no forms are visible
            <Card className="text-center p-5 shadow-sm">
              <Card.Body>
                <Card.Text className="text-muted mb-4">
                  You have not created any locations yet.
                </Card.Text>
                <Button variant="primary" onClick={handleCreateClick}>
                  Create Your First Location
                </Button>
              </Card.Body>
            </Card>
          )
        )}
      </Container>
    </Container>
  );
}
