import { useState, useEffect } from 'react';
import LocationCard from '../components/LocationCard';
import { getLocations } from '../api/authApi';
import Container from 'react-bootstrap/Container';

export default function ListLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError('Failed to fetch locations');
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading locations...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <Container fluid className="mt-8">
      <h2 className="text-center mb-6">Explore Locations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
        {locations.map((location, i) => (
          <LocationCard key={i} location={location} />
        ))}
      </div>
    </Container>
  );
}
