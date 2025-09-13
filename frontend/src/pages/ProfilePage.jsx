import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert, Container, Card, Col } from "react-bootstrap";
import AuthCheck from "../components/AuthCheck";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost/api/accounts/me", {
          headers: { Authorization: `Token ${token}` },
        });
        console.log("User API response:", res.data); 
        
        setUsername(res.data.username);
        setEmail(res.data.email); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.patch(
        "http://localhost/api/accounts/me",
        { email, ...(password ? { password } : {}) },
        { headers: { Authorization: `Token ${token}` } }
      );

      setMessage("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  return (
  <>
  <Container className="bg-light min-vh-100 py-5">
    {/* Title */}  
        <h2 className="fw-bold text-dark mb-4">
          <img
            alt="logo"
            src="/profile.png"
            width="50"
            height="50"
            className="me-2"
          />
          Profile
        </h2>
  <AuthCheck message="Please login to see your Profile.">
    
      <Card className="shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <div className="text-center mb-4">
            <img
              alt="logo"
              src="/update.png"
              width="35"
              height="35"
              className="me-2"
            />
            <h3 className="fw-bold text-dark d-inline">Update Profile</h3>
          </div>

          {/* Alerts */}
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={username} disabled readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                placeholder="Enter new password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                placeholder="Confirm new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" variant="info">
                Update Profile
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      </AuthCheck>
    </Container>
  
  </>
)
};
