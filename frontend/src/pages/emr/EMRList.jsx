
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const EMRList = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [emrs, setEMRs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/patients");

        setPatients(response.data.data || []);
        // console.log("patienssget", response.data)
      } catch (error) {
        console.error(error);
        setError("Failed to load patients");
      }
    };

    fetchPatients();
  }, []);

  // Load EMRs when patient changes
  useEffect(() => {
    if (!selectedPatient) {
      setEMRs([]);
      return;
    }

    const fetchEMRs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/emr/patient/${selectedPatient}`
        );

        setEMRs(response.data.data || []);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Failed to load EMR records"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEMRs();
  }, [selectedPatient]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Electronic Medical Records</h2>
          <p className="text-muted mb-0">
            View and manage patient medical records
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/emr/add")}
        >
          + Add EMR
        </button>
      </div>

      {/* Patient Select */}
      <div className="card mb-4">
        <div className="card-body">
          <label className="form-label fw-semibold">
            Select Patient
          </label>

          <select
            className="form-select"
            value={selectedPatient}
            onChange={(e) =>
              setSelectedPatient(e.target.value)
            }
          >
            <option value="">Select a patient</option>

            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.emergencyContact?.name || "Unknown Patient"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!selectedPatient && (
        <div className="alert alert-info">
          Please select a patient to view medical records.
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          Loading EMR records...
        </div>
      )}

      {!loading &&
        selectedPatient &&
        emrs.length === 0 && (
          <div className="alert alert-warning">
            No medical records found for this patient.
          </div>
        )}

      {/* EMR Cards */}
      <div className="row g-4">
        {emrs.map((emr) => (
          <div className="col-md-6" key={emr._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title">
                    {emr.diagnosis || "No diagnosis"}
                  </h5>

                  <span className="badge bg-success">
                    EMR
                  </span>
                </div>

                <p className="mb-2">
                  <strong>Doctor:</strong>{" "}
                  {emr.doctor?.user?.username ||
                    "Unknown"}
                </p>

                <p className="mb-2">
                  <strong>Symptoms:</strong>{" "}
                  {emr.symptoms || "N/A"}
                </p>

                <p className="mb-2">
                  <strong>Date:</strong>{" "}
                  {new Date(
                    emr.createdAt
                  ).toLocaleDateString()}
                </p>

                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() =>
                    navigate(`/emr/${emr._id}`)
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EMRList;