import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { isAbortError } from "../services/api";
import { searchHotels } from "../services/HotelService";

function SearchResults() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query || !checkIn || !checkOut) {
      setLoading(false);
      setError("Missing search parameters.");
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError("");

    searchHotels({ query, checkIn, checkOut }, { signal: controller.signal })
      .then((data) => {
        setResults(data || []);
        setError("");
      })
      .catch((err) => {
        if (isAbortError(err)) return;
        console.error("Search error:", err);
        setError("Unable to load hotels.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [query, checkIn, checkOut]);

  return (
    <div className="page">
      <h2>Search results</h2>

      <p className="search-summary">
        Hotel: <strong>{query}</strong> | Check In: <strong>{checkIn}</strong> | Check Out: <strong>{checkOut}</strong>
      </p>

      {loading && <p className="empty-state">Loading hotels...</p>}

      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="empty-state">No hotels found.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="hotel-list">
          {results.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <h3>{hotel.name}</h3>
              <p>{hotel.location}</p>
              <p>Available rooms: <strong>{hotel.availableRooms}</strong></p>
              {hotel.minPrice > 0 && (
                <p>From: <strong>{hotel.minPrice} €</strong> / night</p>
              )}
              <Link to={`/hotels/${hotel.id}?checkIn=${checkIn}&checkOut=${checkOut}`}>
                View rooms
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
