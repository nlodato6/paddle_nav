import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { favoriteLocation, unfavoriteLocation } from '../api/authApi';

const LocationCard = ({ location, onFavoriteChange }) => {
  const [isFavorited, setIsFavorited] = useState(location.is_favorited || false);
  const [loading, setLoading] = useState(false);

  if (!location) return null; 

const handleFavoriteClick = async () => {
  setLoading(true);
  try {
    if (!isFavorited) {
      if (location.id) {
        // Local DB location
        await favoriteLocation(location.id);
      } else if (location.OBJECTID) {
        // External ArcGIS location
        await favoriteOfficialLocation(location.OBJECTID);
      } else {
        throw new Error("No pk or OBJECTID provided");
      }
      setIsFavorited(true);
    } else {
      if (location.id) {
        await unfavoriteLocation(location.id);
      }
      setIsFavorited(false);
    }
    if (onFavoriteChange) onFavoriteChange(location.id || location.OBJECTID, !isFavorited);
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
          <p><strong>Recreation Category:</strong> {location.recreation_type || "N/A"}</p>
          <p><strong>Location Category:</strong> {location.location_category || "N/A"}</p>
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
