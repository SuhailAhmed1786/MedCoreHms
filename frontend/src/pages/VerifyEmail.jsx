
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const VerifyEmail = () => {
  const { token } = useParams();

  const verificationStarted = useRef(false);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const verifyEmail = async () => {
      if (!token) {
        setSuccess(false);
        setMessage("Verification token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/auth/verify-email/${token}`
        );

        console.log(
          "Email verification response:",
          response.data
        );

        setSuccess(true);

        setMessage(
          response.data.message ||
            "Email verified successfully."
        );
      } catch (error) {
        console.error(
          "Email verification error:",
          error
        );

        setSuccess(false);

        setMessage(
          error.response?.data?.message ||
            "Email verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card text-center">
        <div className="logo-icon">
          {loading ? "..." : success ? "✓" : "!"}
        </div>

        <h2 className="fw-bold mt-4">
          Email Verification
        </h2>

        <p className="text-muted mt-3">
          {loading
            ? "Verifying your email..."
            : message}
        </p>

        {!loading && success && (
          <Link
            to="/login"
            className="btn btn-primary w-100 mt-3"
          >
            Go to Login
          </Link>
        )}

        {!loading && !success && (
          <Link
            to="/register"
            className="btn btn-secondary w-100 mt-3"
          >
            Back to Registration
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;