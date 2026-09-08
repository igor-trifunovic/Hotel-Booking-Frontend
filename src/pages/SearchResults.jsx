import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isAbortError } from "../services/api";
import { searchHotels } from "../services/HotelService";
import { HotelCard } from "../components/HotelCard";
import { countNights } from "../utils/format";

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
        setResults(
          [...(data || [])].sort((a, b) => (a.minPrice || Infinity) - (b.minPrice || Infinity))
        );
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
        Hotel: <strong>{query}</strong> · {checkIn} → {checkOut} · {countNights(checkIn, checkOut)} nights
      </p>

      {loading && <p className="empty-state">Loading hotels...</p>}

      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="empty-state">No hotels found.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="hotel-list">
          {results.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              checkIn={checkIn}
              checkOut={checkOut}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
