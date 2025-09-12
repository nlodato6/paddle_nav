import React, { useState } from "react";
import { signupUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = await signupUser(username, email, password);
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);

      navigate("/locations"); // redirect to Explore page
      window.location.reload(); // refresh navbar
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Signup failed. Try a different username or email.");
    }
  };

  return (
    <Container className="d-flex justify-content-center py-5">
      <Card style={{ maxWidth: "400px", width: "100%" }} className="shadow-sm">
        <Card.Body>
          <img
              alt="logo"
              src="/signup.png"
              width="50"
              height="50"
              className="me-2"
            />
            <h2 className="fw-bold text-dark d-inline">Sign Up </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="info" className="w-100">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
