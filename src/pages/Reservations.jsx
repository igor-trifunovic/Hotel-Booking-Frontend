import { useEffect, useState } from "react";
import { getToken } from "../services/AuthService";
import API_BASE_URL from "../services/api";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setError("You must be logged in to view your reservations.");
      return;
    }

    fetch(`${API_BASE_URL}/api/reservations/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reservations.");
        return res.json();
      })
      .then((data) => {
        setReservations(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load reservations.");
      });
  }, []);

  return (
    <div className="page">
      <h2>My Reservations</h2>

      {error && <p className="error-text">{error}</p>}

      {!error && reservations.length === 0 && (
        <p className="empty-state">No reservations yet.</p>
      )}

      {!error && reservations.length > 0 && (
        <div className="reservation-list">
          {reservations.map((res) => (
            <div key={res.id} className="reservation-card">
              <h4>{res.room.hotel.name}</h4>
              <p>Room No. {res.room.roomNumber}</p>
              <p>Check-in: <strong>{res.checkInDate}</strong></p>
              <p>Check-out: <strong>{res.checkOutDate}</strong></p>
              <p>Total: <strong>{res.totalPrice} €</strong></p>
              <p>
                Status:{" "}
                <span style={{ color: res.reservationStatus === "CANCELLED" ? "red" : "green", fontWeight: "bold" }}>
                  {res.reservationStatus}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reservations;
