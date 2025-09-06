import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function Title() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar className="bg-body-tertiary" data-bs-theme="dark">
        <Container className="d-flex justify-content-between align-items-center">
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <img
              alt="logo"
              src="/nav_logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />
            PaddleNav
          </Navbar.Brand>

          <div>
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="light"
              onClick={() => navigate('/signup')}
            >
              Signup
            </Button>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default Title;
