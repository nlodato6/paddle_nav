import { useState, useEffect } from "react";
import { createLocation, getCategories, getRecreationTypes } from '../api/authApi';

import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";


export default function CreateLocationsForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    county: "",
    zip_code: "",
    phone_number: "",
    location_category: "",
    recreation_type: [],
    geom: { lat: "", lng: "" },
  });
  const [categories, setCategories] = useState([]);
  const [recreationTypes, setRecreationTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories and recreation types for dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catData, recData] = await Promise.all([
          getCategories(),
          getRecreationTypes(),
        ]);
        setCategories(catData);
        setRecreationTypes(recData);
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const options = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, recreation_type: options }));
  };

  const handleGeomChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      geom: { ...prev.geom, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        geom: {
          type: "Point",
          coordinates: [parseFloat(formData.geom.lng), parseFloat(formData.geom.lat)],
        },
      };
      await createLocation(payload);
      setFormData({
        name: "",
        description: "",
        address: "",
        city: "",
        county: "",
        zip_code: "",
        phone_number: "",
        location_category: "",
        recreation_type: [],
        geom: { lat: "", lng: "" },
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error creating location:", err);
      setError("Failed to create location. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4 bg-light rounded shadow-sm">
      <h3 className="mb-4 text-primary">Create New Location</h3>
      <Form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <Form.Group className="mb-3">
          <Form.Label>Name *</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>

        {/* Address */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>County</Form.Label>
              <Form.Control
                type="text"
                name="county"
                value={formData.county}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>ZIP Code</Form.Label>
              <Form.Control
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Category & Recreation Types */}
        <Form.Group className="mb-3">
          <Form.Label>Location Category</Form.Label>
          <Form.Select
            name="location_category"
            value={formData.location_category}
            onChange={handleChange}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Recreation Types</Form.Label>
          <Form.Select
            multiple
            name="recreation_type"
            value={formData.recreation_type}
            onChange={handleMultiSelect}
          >
            {recreationTypes.map((rec) => (
              <option key={rec.id} value={rec.id}>
                {rec.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Coordinates */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                step="any"
                name="lat"
                value={formData.geom.lat}
                onChange={handleGeomChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                step="any"
                name="lng"
                value={formData.geom.lng}
                onChange={handleGeomChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Submit */}
        {error && <p className="text-danger">{error}</p>}
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" size="sm" animation="border" className="me-2" />
              Saving...
            </>
          ) : (
            "Create Location"
          )}
        </Button>
      </Form>
    </Container>
  );
}
