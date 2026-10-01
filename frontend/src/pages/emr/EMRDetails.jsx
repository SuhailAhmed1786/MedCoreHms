import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { getStoredUser } from "../../utils/auth";

const EMRDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [emr, setEMR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getStoredUser();
  const role = user?.role;

  useEffect(() => {
    const fetchEMR = async () => {
      try {
        const response = await api.get(`/emr/${id}`);

        setEMR(response.data.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load EMR"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEMR();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this EMR?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/emr/${id}`);

      navigate("/emr");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete EMR"
      );
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        Loading EMR...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!emr) {
    return null;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate("/emr")}
          >
            ← Back
          </button>

          <h2>Medical Record</h2>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-warning"
            onClick={() =>
              navigate(`/emr/${id}/edit`)
            }
          >
            Edit
          </button>

          {role === "ADMIN" && (
            <button
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Patient */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">
          Patient Information
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <strong>Name</strong>
              <p>
                {emr.patient?.user?.username ||
                  "N/A"}
              </p>
            </div>

            <div className="col-md-6">
              <strong>Email</strong>
              <p>
                {emr.patient?.user?.email ||
                  "N/A"}
              </p>
            </div>

            <div className="col-md-6">
              <strong>Phone</strong>
              <p>
                {emr.patient?.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">
          Doctor & Appointment
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <strong>Doctor</strong>
              <p>
                Dr.{" "}
                {emr.doctor?.user?.username ||
                  "N/A"}
              </p>
            </div>

            <div className="col-md-4">
              <strong>Specialization</strong>
              <p>
                {emr.doctor?.specialization ||
                  "N/A"}
              </p>
            </div>

            <div className="col-md-4">
              <strong>Appointment Date</strong>
              <p>
                {emr.appointment?.appointmentDate
                  ? new Date(
                      emr.appointment.appointmentDate
                    ).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">
          Clinical Information
        </div>

        <div className="card-body">
          <h6>Symptoms</h6>
          <p>{emr.symptoms || "N/A"}</p>

          <h6>Diagnosis</h6>
          <p>{emr.diagnosis || "N/A"}</p>

          <h6>Medical History</h6>
          <p>{emr.medicalHistory || "N/A"}</p>

          <h6>Allergies</h6>
          {emr.allergies?.length ? (
            <ul>
              {emr.allergies.map(
                (allergy, index) => (
                  <li key={index}>{allergy}</li>
                )
              )}
            </ul>
          ) : (
            <p>No allergies recorded</p>
          )}
        </div>
      </div>

      {/* Medication */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">
          Medications
        </div>

        <div className="card-body">
          {emr.medications?.length ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                  </tr>
                </thead>

                <tbody>
                  {emr.medications.map(
                    (medicine, index) => (
                      <tr key={index}>
                        <td>{medicine.name}</td>
                        <td>{medicine.dosage}</td>
                        <td>{medicine.frequency}</td>
                        <td>{medicine.duration}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No medications recorded</p>
          )}
        </div>
      </div>

      {/* Vitals */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">
          Vital Signs
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <strong>Temperature</strong>
              <p>
                {emr.vitals?.temperature ?? "N/A"} °C
              </p>
            </div>

            <div className="col-md-3">
              <strong>Blood Pressure</strong>
              <p>
                {emr.vitals?.bloodPressure || "N/A"}
              </p>
            </div>

            <div className="col-md-3">
              <strong>Heart Rate</strong>
              <p>
                {emr.vitals?.heartRate ?? "N/A"} bpm
              </p>
            </div>

            <div className="col-md-3">
              <strong>Oxygen Saturation</strong>
              <p>
                {emr.vitals?.oxygenSaturation ?? "N/A"}%
              </p>
            </div>

            <div className="col-md-3">
              <strong>Respiratory Rate</strong>
              <p>
                {emr.vitals?.respiratoryRate ?? "N/A"}
              </p>
            </div>

            <div className="col-md-3">
              <strong>Weight</strong>
              <p>
                {emr.vitals?.weight ?? "N/A"} kg
              </p>
            </div>

            <div className="col-md-3">
              <strong>Height</strong>
              <p>
                {emr.vitals?.height ?? "N/A"} cm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">
          Treatment Plan
        </div>

        <div className="card-body">
          <h6>Clinical Notes</h6>
          <p>{emr.clinicalNotes || "N/A"}</p>

          <h6>Treatment Plan</h6>
          <p>{emr.treatmentPlan || "N/A"}</p>

          <h6>Follow-up Date</h6>
          <p>
            {emr.followUpDate
              ? new Date(
                  emr.followUpDate
                ).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EMRDetails;



