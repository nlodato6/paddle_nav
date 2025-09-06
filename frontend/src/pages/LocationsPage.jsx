import Container from 'react-bootstrap/Container';
import ListLocations from './ListLocations';

export default function LocationsPage() {
  return (
    <Container fluid className="mt-8">
      <h2 className="text-center text-2xl font-bold mb-6">All Locations</h2>
      <ListLocations />
    </Container>
  );
}
