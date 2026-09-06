import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom";
import { isLoggedIn } from "../services/AuthService";
import { isAbortError } from "../services/api";
import { getAvailability, getHotel, getRooms } from "../services/HotelService";
import { createReservation } from "../services/ReservationService";

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
    const controller = new AbortController();

    getHotel(hotelId, { signal: controller.signal })
      .then(data => setHotel(data))
      .catch(err => {
        if (isAbortError(err)) return;
        console.error("Failed to load hotel:", err);
      });

    return () => controller.abort();
  }, [hotelId])

  useEffect(() => {
    const controller = new AbortController();

    getRooms(hotelId, { signal: controller.signal })
      .then(data => setRooms(data || []))
      .catch(err => {
        if (isAbortError(err)) return;
        console.error("Failed to load rooms:", err);
      });

    return () => controller.abort();
  }, [hotelId])

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setAvailableRoomIds([]);
      return;
    }

    const controller = new AbortController();

    setAvailabilityLoading(true);

    getAvailability({ hotelId, checkIn, checkOut }, { signal: controller.signal })
      .then(data => setAvailableRoomIds((data || []).map(room => room.id)))
      .catch(err => {
        if (isAbortError(err)) return;
        console.error("Availability error:", err);
        setAvailableRoomIds([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setAvailabilityLoading(false);
      });

    return () => controller.abort();
  }, [hotelId, checkIn, checkOut])

  function handleReserve(roomId) {
    if (!isLoggedIn()) {
      alert("You have to be logged in to make a reservation.");
      return;
    }

    createReservation({ roomId, checkInDate: checkIn, checkOutDate: checkOut })
      .then(() => alert("Reservation successful."))
      .catch(err => alert(err.message || "Reservation failed."));
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