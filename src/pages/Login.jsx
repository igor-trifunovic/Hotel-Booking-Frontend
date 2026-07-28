import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveToken } from "../services/AuthService";
import API_BASE_URL from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveToken(data.token);
        navigate("/");
      } else {
        throw new Error("Login failed.");
      }
    } catch {
      setError("Invalid email or password. Please try again.");
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
          <h2>Welcome back</h2>
          <p>Sign in to manage your bookings, explore new destinations, and enjoy exclusive member deals.</p>
          <ul className="auth-panel-perks">
            <li>✓ View and manage your reservations</li>
            <li>✓ Exclusive member pricing</li>
            <li>✓ Fast, secure checkout</li>
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h1 className="auth-form-title">Sign in</h1>
          <p className="auth-form-subtitle">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">Create one</Link>
          </p>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
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

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="auth-form-footer">
              <Link to="/forgot-password" className="auth-link forgot-link">
                Forgot password?
              </Link>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;