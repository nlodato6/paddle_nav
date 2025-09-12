// src/pages/LoginPage.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { setAuth } from "../api/authApi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost/api/accounts/api-token-auth/",
        { username, password }
      );
      const token = res.data.token;
      setAuth(token, username);
      navigate("/locations"); // Redirect after login
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <Container className="d-flex justify-content-center py-5">

      <Card className="shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <div className="text-center mb-4">
            <img
              alt="logo"
              src="/profile.png"
              width="50"
              height="50"
              className="mb-2"
            />
            <h2 className="fw-bold text-dark">Login</h2>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="info"
              className="w-100 fw-bold"
            >
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
