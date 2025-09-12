// src/components/Title.jsx
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { logout } from "../api/authApi";
import { useNavigate } from "react-router-dom";

function Title() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  const handleLogout = () => {
    logout();
     localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/"); // optional: redirect to home after logout
    setUsername("");
    window.location.reload()
  };

  return (
    <Navbar className="bg-body-tertiary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">
          <img
            alt="logo"
            src="/nav_logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          PaddleNav
        </Navbar.Brand>
        <div className="ms-auto">
          {isLoggedIn ? (
            <>
            <span className="text-white">Welcome, {username}! </span>
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline-light"
                onClick={() => navigate("/login")}
                className="me-2"
              >
                Login
              </Button>
              <Button
                variant="light"
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default Title;
