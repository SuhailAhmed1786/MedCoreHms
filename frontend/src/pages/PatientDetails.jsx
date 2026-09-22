import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/patients/${id}`);

        setPatient(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load patient"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading patient...</p>
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
          onClick={() => navigate("/patients")}
        >
          Back to Patients
        </button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mt-4">
        <p>Patient not found.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Patient Details</h2>
          <p className="text-muted">
            View patient information
          </p>
        </div>

        <div>
          <button
            className="btn btn-secondary me-2"
            onClick={() => navigate("/patients")}
          >
            Back
          </button>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/patients/${id}/edit`)
            }
          >
            Edit Patient
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">

          <h5 className="mb-4">
            Personal Information
          </h5>

          <div className="row">

            <div className="col-md-6 mb-3">
              <strong>Username</strong>
              <p>
                {patient.user?.username || "-"}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Email</strong>
              <p>
                {patient.user?.email || "-"}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Date of Birth</strong>
              <p>
                {patient.dateOfBirth
                  ? new Date(
                      patient.dateOfBirth
                    ).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Gender</strong>
              <p>
                {patient.gender || "-"}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Phone</strong>
              <p>
                {patient.phone || "-"}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Blood Group</strong>
              <p>
                {patient.bloodGroup || "-"}
              </p>
            </div>

            <div className="col-md-12 mb-3">
              <strong>Address</strong>
              <p>
                {patient.address || "-"}
              </p>
            </div>

          </div>

          <hr />

          <h5 className="mb-4">
            Emergency Contact
          </h5>

          <div className="row">

            <div className="col-md-4 mb-3">
              <strong>Name</strong>
              <p>
                {patient.emergencyContact?.name || "-"}
              </p>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Phone</strong>
              <p>
                {patient.emergencyContact?.phone || "-"}
              </p>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Relationship</strong>
              <p>
                {patient.emergencyContact?.relationship || "-"}
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientDetails;