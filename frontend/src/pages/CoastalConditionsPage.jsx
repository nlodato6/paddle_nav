import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Spinner, Card } from "react-bootstrap";
 import { getMetStations, getTideSummary, getWaterAtlasSummary } from "../api/authApi";

export default function CoastalConditions() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const token = localStorage.getItem("token");


  useEffect(() => {
    async function fetchStations() {
      try {
        const data = await getMetStations();
        setStations(data);
      } catch (err) {
        console.error("Failed to load stations:", err);
      }
    }
    fetchStations();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedStation || !beginDate) return;

  setLoading(true);
  setSummary(null);

  const beginDateFormatted = beginDate.replace(/-/g, "");
  const endDateFormatted = endDate ? endDate.replace(/-/g, "") : beginDateFormatted;

  try {
    // Run both requests in parallel for speed
    const [tideRes, waterRes] = await Promise.all([
      getTideSummary(selectedStation, beginDateFormatted, endDateFormatted),
      getWaterAtlasSummary(selectedStation, beginDateFormatted, endDateFormatted),
    ]);

    // Combine summaries into one
    setSummary({
      tide: tideRes.summary || "No tide data available.",
      water: waterRes.summary || "No water quality concerns found.",
    });
  } catch (error) {
    console.error("Error fetching conditions:", error);
    setSummary({
      tide: "Error fetching tide summary.",
      water: "Error fetching water quality summary.",
    });
  } finally {
    setLoading(false);
  }
};

if (!token) {
    return (
      <Container fluid className="bg-light min-vh-100 py-5">
  
            <Col className="d-flex align-items-center">
             <img alt="logo" 
             src="/water.png" 
             width="50" 
             height="50" 
             className="me-2" 
             />
          <h2 className="fw-bold text-dark d-inline m-4">Coastal Conditions</h2>
            </Col>
         
          <Card className="text-center p-5 shadow-sm">
            <Card.Body>
              <Card.Text className="text-muted mb-4">
                Please login to see Coastal Conditions.
              </Card.Text>
            </Card.Body>
          </Card>
        
      </Container>
    );
  }

  return (
    <Container fluid className="bg-light min-vh-100 py-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <img alt="logo" 
          src="/water.png" 
          width="50" 
          height="50" 
          className="me-2" 
          />
          <h2 className="fw-bold text-dark d-inline">Coastal Conditions</h2>
        </Col>
      </Row>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Select Station</Form.Label>
                  <Form.Select
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                  >
                    <option value="">-- Choose a station --</option>
                    {stations.map((s) => (
                      <option key={s.station_id} value={s.station_id}>
                         {s.name}{s.state ? ` (${s.state})` : ""}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={beginDate}
                    onChange={(e) => setBeginDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={2} className="d-flex align-items-end">
                <Button type="submit" variant="info" className="w-100">
                  {loading ? <Spinner animation="border" size="sm" /> : "Get Conditions"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

     {/* Display both summaries */}
     {summary && (
  <Card className="shadow-sm mt-4">
    <Card.Body>
      <h5 className="fw-bold">Tide Summary</h5>
      <pre style={{ whiteSpace: "pre-wrap" }}>{summary.tide}</pre>

      <h5 className="fw-bold mt-4">Water Quality Summary</h5>
      <pre style={{ whiteSpace: "pre-wrap" }}>{summary.water}</pre>
    </Card.Body>
  </Card>
)}

    </Container>
  );
}
