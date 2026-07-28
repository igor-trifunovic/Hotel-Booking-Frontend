import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import API_BASE_URL from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-form-panel" style={{ flex: 1 }}>
          <div className="auth-form-inner">
            <h1 className="auth-form-title">Invalid link</h1>
            <p className="auth-form-subtitle">
              This password reset link is missing or invalid.
            </p>
            <Link to="/forgot-password" className="auth-submit-btn" style={{ display: "block", textAlign: "center", marginTop: "24px" }}>
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const data = await res.json();
        setError(data.message || "This link is invalid or has expired. Please request a new one.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-logo">🔐</div>
          <h2>Set a new password</h2>
          <p>
            Choose a strong password that you haven't used before.
          </p>
          <ul className="auth-panel-perks">
            <li>✓ At least 8 characters</li>
            <li>✓ Link is single-use</li>
            <li>✓ You'll be signed in after resetting</li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner">
          {success ? (
            <div className="reset-success">
              <div className="reset-success-icon">✅</div>
              <h1 className="auth-form-title">Password updated!</h1>
              <p className="auth-form-subtitle">
                Your password has been changed successfully. Redirecting you to
                the login page…
              </p>
              <Link to="/login" className="auth-submit-btn" style={{ display: "block", textAlign: "center", marginTop: "24px" }}>
                Go to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="auth-form-title">New password</h1>
              <p className="auth-form-subtitle">
                Enter your new password below.
              </p>

              {error && <div className="auth-error">{error}</div>}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="newPassword">New password</label>
                  <div className="password-input-wrapper">
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      placeholder="Min. 8 characters"
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm new password</label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    placeholder="Repeat your password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? "Updating…" : "Set new password"}
                </button>
              </form>

              <p className="auth-form-subtitle" style={{ marginTop: "16px" }}>
                <Link to="/forgot-password" className="auth-link">
                  Request a new reset link
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
