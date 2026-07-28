import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom";
import { getToken } from "../services/AuthService";
import API_BASE_URL from "../services/api";

function HotelDetails() {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [availableRoomIds, setAvailableRoomIds] = useState([]);

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/api/hotels/${hotelId}`)
      .then(res => res.json())
      .then(data => setHotel(data));
  }, [hotelId])

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/api/rooms?hotelId=${hotelId}`)
      .then(res => res.json())
      .then(data => setRooms(data))
  }, [hotelId])

  useEffect(() => {
    if (!checkIn || !checkOut) return;

    fetch(
      `${API_BASE_URL}/api/availability?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}`)
      .then(res => res.json())
      .then(data => setAvailableRoomIds(data.map(room => room.id)));
  }, [hotelId, checkIn, checkOut])

  function handleReserve(roomId) {
    const token = getToken();

    if (!token) {
      alert("You have to be logged in to make a reservation.");
      return;
    }

    fetch(`${API_BASE_URL}/api/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Reservation failed.");
        alert("Reservation successful.");
      })
      .catch(err => alert(err.message));
  }

  if (!hotel) return <p>Loading...</p>;

  return (
    <div className="hotel-details-header">
      <h2>{hotel.name}</h2>
      <p>{hotel.location}</p>

      <h3>Rooms</h3>

      <ul>
        {rooms.map(room => {
          const isAvailable = availableRoomIds.includes(room.id);

          return (
            <li key={room.id} className="room-list">
              <span>Room no.{room.roomNumber}</span>
              <span>Price: {room.roomPrice} €</span>

              {isAvailable ? (
                <span style={{ color: "green", fontWeight: "bold" }}>Available</span>
              ) : (
                <span style={{ color: "red", fontWeight: "bold" }}>Not available</span>
              )}

              {isAvailable && (
                <button onClick={() => handleReserve(room.id)}>Reserve</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default HotelDetails;