import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await api.get(
        `/doctors/${id}`
      );

      setDoctor(response.data.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load doctor"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading doctor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/doctors")}
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mt-4">
        <p>Doctor not found.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2>Doctor Details</h2>

          <p className="text-muted mb-0">
            View doctor profile
          </p>
        </div>

        <div>

          <button
            className="btn btn-secondary me-2"
            onClick={() =>
              navigate("/doctors")
            }
          >
            Back
          </button>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(
                `/doctors/${id}/edit`
              )
            }
          >
            Edit Doctor
          </button>

        </div>

      </div>

      {/* Doctor Profile */}
      <div className="card shadow-sm">

        <div className="card-body">

          <div className="row">

            {/* Basic Information */}
            <div className="col-md-6">

              <h5 className="mb-4">
                Basic Information
              </h5>

              <div className="mb-3">
                <strong>Name</strong>
                <p>
                  Dr.{" "}
                  {doctor.user?.username || "-"}
                </p>
              </div>

              <div className="mb-3">
                <strong>Email</strong>
                <p>
                  {doctor.user?.email || "-"}
                </p>
              </div>

              <div className="mb-3">
                <strong>Phone</strong>
                <p>
                  {doctor.phone || "-"}
                </p>
              </div>

              <div className="mb-3">
                <strong>Specialization</strong>
                <p>
                  {doctor.specialization || "-"}
                </p>
              </div>

            </div>

            {/* Professional Information */}
            <div className="col-md-6">

              <h5 className="mb-4">
                Professional Information
              </h5>

              <div className="mb-3">
                <strong>
                  Qualification
                </strong>

                <p>
                  {doctor.qualification || "-"}
                </p>
              </div>

              <div className="mb-3">
                <strong>
                  License Number
                </strong>

                <p>
                  {doctor.licenseNumber || "-"}
                </p>
              </div>

              <div className="mb-3">
                <strong>
                  Consultation Fee
                </strong>

                <p>
                  {doctor.consultationFee
                    ? `₹${doctor.consultationFee}`
                    : "-"}
                </p>
              </div>

              <div className="mb-3">
                <strong>
                  Availability
                </strong>

                <p>
                  <span
                    className={`badge ${
                      doctor.available
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {doctor.available
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </p>
              </div>

            </div>

          </div>

          <hr />

          <div className="text-muted">
            Created:{" "}
            {doctor.createdAt
              ? new Date(
                  doctor.createdAt
                ).toLocaleDateString()
              : "-"}
          </div>

        </div>

      </div>

    </div>
  );
};

export default DoctorDetails;