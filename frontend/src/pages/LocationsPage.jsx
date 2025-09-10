import { useState, useEffect } from "react";
import { getLocations } from "../api/authApi";
import LocationCard from "../components/LocationCard";

export default function ListLocations() {
  const [locations, setLocations] = useState([]);
  const [filter, setFilter] = useState("all"); // all, official, non-official, user
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLocations = locations.filter((loc) => {
    if (filter === "official") return loc.is_official_data;
    if (filter === "non-official") return !loc.is_official_data;
    if (filter === "user") return loc.submitted_by === username;
    return true; // all
  });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <h2 className="text-center"> 
          <img
            alt="logo"
            src="/nav_logo.svg"
            width="50"
            height="50"
            className="d-inline-block align-top"
          />{" "}
          Explore</h2>

        <button
          className={`px-4 py-2 rounded font-semibold ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${
            filter === "official" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("official")}
        >
          Official
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${
            filter === "non-official" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("non-official")}
        >
          Non-Official
        </button>
        {token && (
          <button
            className={`px-4 py-2 rounded font-semibold ${
              filter === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("user")}
          >
            My Locations
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading locations...</p>
      ) : filteredLocations.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      ) : (
        <p>No locations found.</p>
      )}
    </div>
  );
}
