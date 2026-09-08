import { Link } from "react-router-dom";
import { countNights, formatEuro } from "../utils/format"

function HotelCard({ hotel, checkIn, checkOut }) {
  const nights = countNights(checkIn, checkOut);
  const rooms = hotel.availableRooms ?? 0;
  const hasPrice = hotel.minPrice > 0;
  const total = hasPrice && nights > 0 ? hotel.minPrice * nights : null;

  let availability;
  if (rooms <= 0) {
    availability = { className: "badge badge-muted", label: "No rooms for these dates" };
  } else if (rooms <= 3) {
    availability = {
      className: "badge badge-warn",
      label: `Only ${rooms} ${rooms === 1 ? "room" : "rooms"} left`,
    };
  } else {
    availability = { className: "badge badge-ok", label: `${rooms} rooms available` };
  }

  const detailsUrl = `/hotels/${encodeURIComponent(hotel.id)}?${new URLSearchParams({
    checkIn, checkOut
  })}`;

  return (
    <article className="hotel-card">
      <div className="hotel-card-main">
        <h3 className="hotel-card-name">{hotel.name}</h3>
        <p className="hotel-card-location">{hotel.location}</p>

        <div className="hotel-card-meta">
          <span className={availability.className}>{availability.label}</span>
        </div>
      </div>

      <div className="hotel-card-price">
        {hasPrice ? (
          <>
            <span className="price-from">from</span>
            <span className="price-amount">{formatEuro(hotel.minPrice)}</span>
            <span className="price-unit">per night</span>
            {total != null && (
              <span className="price-total">
                {formatEuro(total)} total * {nights} {nights === 1 ? "night" : "nights"}
              </span>
            )}
          </>
        ) : (
          <span className="price-unavailable">Price on request</span>
        )}

        {rooms > 0 ? (
          <Link className="hotel-card-cta" to={detailsUrl}>
            View rooms
          </Link>
        ) : (
          <span className="hotel-card-cta hotel-card-cta-disabled">Unavailable</span>
        )}
      </div>
    </article>
  );
}

export default HotelCard;