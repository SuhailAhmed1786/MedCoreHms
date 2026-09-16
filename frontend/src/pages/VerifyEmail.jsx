import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const VerifyEmail = () => {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(
          `/auth/verify-email/${token}`
        );

        setSuccess(true);
        setMessage(response.data.message);

      } catch (error) {
        setSuccess(false);

        setMessage(
          error.response?.data?.message ||
            "Email verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
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