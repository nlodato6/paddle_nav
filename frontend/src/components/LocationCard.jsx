import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {
  favoriteLocation,
  unfavoriteLocation,
  favoriteOfficialLocation,
  unfavoriteOfficialLocation,
  isLoggedIn
} from "../api/authApi";

const LocationCard = ({ location, onFavoriteChange, showEdit = false, onEdit }) => {
  const [isFavorited, setIsFavorited] = useState(location?.is_favorited || false);
  const [loading, setLoading] = useState(false);

  if (!location) return null;

const handleFavoriteClick = async () => {
  setLoading(true);
  try {
    if (!isFavorited) {
      // FAVORITE
      if (location.is_official_data === false && location.id) {
        // DB location
        await favoriteLocation(location.id);
      } else if (location.is_official_data === true && location.OBJECTID) {
        // API location
        await favoriteOfficialLocation(location.OBJECTID, location.name);
      } else {
        throw new Error("Invalid location object");
      }
      setIsFavorited(true);
    } else {
      // UNFAVORITE
      if (location.is_official_data === false && location.id) {
        await unfavoriteLocation(location.id);
      } else if (location.is_official_data === true && location.OBJECTID) {
        await unfavoriteOfficialLocation(location.OBJECTID);
      }
      setIsFavorited(false);
    }

    if (onFavoriteChange) {
      onFavoriteChange(location.id || location.OBJECTID, !isFavorited);
    }
  } catch (error) {
    console.error("Error updating favorite:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        {/* Title */}
        <Card.Title className="text-center">
          {location.name || "Unnamed Location"}
        </Card.Title>

        {/* Details */}
        <div className="p-3 border rounded bg-light">
          <p><strong>Recreation Category:</strong> {location.recreation_type || "N/A"}</p>
          <p><strong>Location Category:</strong> {location.location_category || "N/A"}</p>
          <p><strong>Description:</strong> {location.description || "N/A"}</p>
          <p><strong>Address:</strong> {location.address || "N/A"}</p>
          <p><strong>City:</strong> {location.city || "N/A"}</p>
          <p><strong>State:</strong> {location.state || "N/A"}</p>
          <p><strong>Zip Code:</strong> {location.zip_code || "N/A"}</p>
          <p><strong>Phone:</strong> {location.phone_number || "N/A"}</p>
          

          
          <div className="d-flex justify-content-evenly mt-3">
            {isLoggedIn() && (
            <Button
              variant={isFavorited ? "danger" : "success"}
              onClick={handleFavoriteClick}
              disabled={loading}
            >
              {isFavorited ? "Unfavorite" : "Favorite"}
            </Button>
            )}

            {showEdit && (
              <Button
                variant="outline-secondary"
                onClick={() => onEdit && onEdit(location)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
export default LocationCard;
