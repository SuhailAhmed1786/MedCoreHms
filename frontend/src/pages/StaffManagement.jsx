import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const StaffManagement = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "DOCTOR",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post(
        "/users/staff",
        formData
      );

      setMessage(response.data.message);

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "DOCTOR",
      });

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to create staff account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2>Create Staff Account</h2>
          <p className="text-muted">
            Create Doctor or Receptionist accounts
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>

      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="card shadow-sm">

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            {/* Username */}

            <div className="mb-3">
              <label className="form-label">
                Username
              </label>

              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>

            {/* Email */}

            <div className="mb-3">
              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            {/* Password */}

            <div className="mb-3">
              <label className="form-label">
                Temporary Password
              </label>

              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter temporary password"
                minLength={6}
                required
              />
            </div>

            {/* Role */}

            <div className="mb-3">
              <label className="form-label">
                Role
              </label>

              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="DOCTOR">
                  Doctor
                </option>

                <option value="RECEPTIONIST">
                  Receptionist
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default StaffManagement;