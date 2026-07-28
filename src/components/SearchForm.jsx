import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchForm() {
  const [query, setQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  
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

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Hotel or destination</label>
        <input
          type="text"
          placeholder="Enter hotel name or city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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