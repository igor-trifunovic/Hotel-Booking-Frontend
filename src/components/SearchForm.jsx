import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAbortError } from "../services/api";
import { getHotelSuggestions } from "../services/HotelService";

function SearchForm() {
  const [query, setQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query || !checkIn || !checkOut) {
      alert("Please fill in all fields.")
      return;
    }

    navigate(
      `/search?query=${encodeURIComponent(query)}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(() => {
      getHotelSuggestions(query, { signal: controller.signal })
        .then(data => {
          setSuggestions(data || []);
          setShowSuggestions(true);
        })
        .catch(err => {
          if (isAbortError(err)) return;
          setSuggestions([]);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-group" style={{ position: "relative" }}>
        <label>Hotel or destination</label>
        <input
          type="text"
          placeholder="Enter hotel name or city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {suggestions.map(s => (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseDown={() => handleSuggestionClick(s)}
                >
                  <strong>{s.name}</strong> — {s.location}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="form-group">
        <label>Check In</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Check Out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchForm;