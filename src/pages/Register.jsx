import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, birthDate }),
      });

      if (!response.ok) throw new Error("Registration failed");

      setIsError(false);
      setMessage("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setIsError(true);
      setMessage("Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-logo">🏨</div>
          <h2>Join us today</h2>
          <p>Create a free account and start exploring thousands of hotels at the best prices.</p>
          <ul className="auth-panel-perks">
            <li>✓ Instant booking confirmation</li>
            <li>✓ Manage all reservations in one place</li>
            <li>✓ Member-only discounts</li>
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h1 className="auth-form-title">Create account</h1>
          <p className="auth-form-subtitle">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">Full name *</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Date of birth *</label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address *</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {message && (
              <p className={isError ? "auth-error" : "auth-success"}>{message}</p>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
