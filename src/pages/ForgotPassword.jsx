import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../services/AuthService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestPasswordReset(email);
    } catch {
      // Swallowed on purpose - the outcome must not reveal whether the email exists.
    } finally {
      // Always show success — never reveal whether the email exists
      setSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-logo">🔑</div>
          <h2>Password reset</h2>
          <p>
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </p>
          <ul className="auth-panel-perks">
            <li>✓ Link expires in 30 minutes</li>
            <li>✓ Each link can only be used once</li>
            <li>✓ Your account stays secure</li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner">
          {submitted ? (
            <div className="reset-success">
              <div className="reset-success-icon">✉️</div>
              <h1 className="auth-form-title">Check your email</h1>
              <p className="auth-form-subtitle">
                If <strong>{email}</strong> is registered with us, you'll receive
                a password reset link within a few minutes.
              </p>
              <p className="auth-form-subtitle" style={{ marginTop: "12px" }}>
                Didn't receive it? Check your spam folder or{" "}
                <button
                  className="auth-link-btn"
                  onClick={() => setSubmitted(false)}
                >
                  try again
                </button>
                .
              </p>
              <Link to="/login" className="auth-submit-btn" style={{ display: "block", textAlign: "center", marginTop: "24px" }}>
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="auth-form-title">Forgot password?</h1>
              <p className="auth-form-subtitle">
                Remembered it?{" "}
                <Link to="/login" className="auth-link">Sign in</Link>
              </p>

              <form className="auth-form" onSubmit={handleSubmit}>
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

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
