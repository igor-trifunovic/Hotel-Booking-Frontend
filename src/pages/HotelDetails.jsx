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
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

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
    if (!checkIn || !checkOut) {
      setAvailableRoomIds([]);
      return;
    }

    let cancelled = false;
    setAvailabilityLoading(true);

    fetch(
      `${API_BASE_URL}/api/availability?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to check availability.");
        return res.json()
      })
      .then(data => {
        if (!cancelled) setAvailableRoomIds(data.map(room => room.id));
      })
      .catch(err => {
        if (cancelled) return;
        console.error("Availability error: ", err);
        setAvailableRoomIds([]);
      })
      .finally(() => {
        if (!cancelled) setAvailabilityLoading(false);
      });

      return () => { cancelled = true; }
  }, [hotelId, checkIn, checkOut])

  useEffect(() => {
    if (!checkIn || !checkOut) return;

    setAvailabilityLoading(true);

    fetch(
      `${API_BASE_URL}/api/availability?...`)
      .then(res => res.json())
      .then(data => {
        setAvailableRoomIds(data.map(room => room.id));
        setAvailabilityLoading(false);
      });
  }, [hotelId,checkIn, checkOut])
  
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

  const hasDates = checkIn && checkOut;

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

              {hasDates && availabilityLoading && (
                <span style={{color: "gray"}}>Checking availability...</span>
              )}

              {hasDates && isAvailable && <span style={{color:"green"}}>Available</span>}
              {hasDates && !isAvailable && <span style={{color:"red"}}>Not available</span>}
              
              {!hasDates && <span style={{color:"gray"}}>Select dates to check availability</span>}

              {hasDates && availabilityLoading && (
                <span style={{color: "gray"}}>Checking availability...</span>
              )}

              {hasDates && !availabilityLoading && (
                isAvailable ? (
                  <>
                    <span style={{color:"green"}}>Available</span>
                    <button onClick={() => handleReserve(room.id)}>Reserve</button>
                  </>
                ) : (
                  <span style={{color:"red"}}>Not available</span>
                )
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default HotelDetails;