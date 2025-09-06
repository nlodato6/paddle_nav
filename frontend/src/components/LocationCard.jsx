import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { favoriteLocation, unfavoriteLocation } from '../api/authApi';

const LocationCard = ({ location, onFavoriteChange }) => {
  const [isFavorited, setIsFavorited] = useState(location.is_favorited || false);
  const [loading, setLoading] = useState(false);

  if (!location) return null; // safety check

  const handleFavoriteClick = async () => {
    setLoading(true);
    try {
      if (!isFavorited) {
        await favoriteLocation(location.id);
        setIsFavorited(true);
      } else {
        await unfavoriteLocation(location.id);
        setIsFavorited(false);
      }
      if (onFavoriteChange) onFavoriteChange(location.id, !isFavorited);
    } catch (error) {
      console.error("Error updating favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body className="bg-[#00D8FF]">
        <Card.Title className="text-center">
          {location.name || "Unnamed Location"}
        </Card.Title>
        <div className="border-1 bg-white rounded-2xl p-4">
          <p><strong>Description:</strong> {location.description || "N/A"}</p>
          <p><strong>Address:</strong> {location.address || "N/A"}</p>
          <p><strong>City:</strong> {location.city || "N/A"}</p>
          <p><strong>State:</strong> {location.state || "N/A"}</p>
          <p><strong>Zip Code:</strong> {location.zip_code || "N/A"}</p>
          <p><strong>Phone:</strong> {location.phone_number || "N/A"}</p>
          <p><strong>Category:</strong> {location.location_category || "N/A"}</p>
          <p><strong>Favorited by:</strong> {location.favorited_by_count || 0}</p>

          <div className="flex justify-evenly mt-2">
            <Button
              className="w-[120px]"
              variant={isFavorited ? "danger" : "success"}
              onClick={handleFavoriteClick}
              disabled={loading}
            >
              {isFavorited ? "Unfavorite" : "Favorite"}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LocationCard;
