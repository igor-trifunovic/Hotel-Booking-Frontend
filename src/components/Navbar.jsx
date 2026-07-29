import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeToken } from "../services/AuthService";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">BookIT</Link>
      </div>

      <div className="navbar-links">
        {loggedIn ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/reservations">My Reservations</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;