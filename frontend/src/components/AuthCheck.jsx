
import { Container, Card } from "react-bootstrap";

export default function AuthCheck({ children, message = "Please login to view this page." }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Container fluid className="bg-light min-vh-100 py-5">
        <Card className="text-center p-5 shadow-sm">
          <Card.Body className="text-center">
            <Card.Text className="text-muted mb-4">
              {message}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return <>{children}</>;
}
