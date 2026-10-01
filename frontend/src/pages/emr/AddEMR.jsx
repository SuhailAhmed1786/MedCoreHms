import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"

const AddEMR = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    appointment: "",

    symptoms: "",
    diagnosis: "",
    medicalHistory: "",
    allergies: "",

    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",

    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: "",
    height: "",

    clinicalNotes: "",
    treatmentPlan: "",
    followUpDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // Load patients, doctors and appointments
  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);

        const [patientsRes, doctorsRes, appointmentsRes] =
          await Promise.all([
            api.get("/patients"),
            api.get("/doctors"),
            api.get("/appointments"),
          ]);

        setPatients(patientsRes.data.data || []);
        console.log("patienss", patientsRes.data)
        setDoctors(doctorsRes.data.data || []);
        setAppointments(appointmentsRes.data.data || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message |
            "Failed to load required data"
        );
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit EMR
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.patient ||
      !formData.doctor ||
      !formData.appointment
    ) {
      setError(
        "Patient, doctor and appointment are required"
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        patient: formData.patient,
        doctor: formData.doctor,
        appointment: formData.appointment,

        symptoms: formData.symptoms,
        diagnosis: formData.diagnosis,
        medicalHistory: formData.medicalHistory,

        allergies: formData.allergies
          ? formData.allergies
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],

        medications: formData.medicationName
          ? [
              {
                name: formData.medicationName,
                dosage: formData.dosage,
                frequency: formData.frequency,
                duration: formData.duration,
              },
            ]
          : [],

        vitals: {
          temperature: formData.temperature
            ? Number(formData.temperature)
            : undefined,

          bloodPressure: formData.bloodPressure,

          heartRate: formData.heartRate
            ? Number(formData.heartRate)
            : undefined,

          respiratoryRate: formData.respiratoryRate
            ? Number(formData.respiratoryRate)
            : undefined,

          oxygenSaturation: formData.oxygenSaturation
            ? Number(formData.oxygenSaturation)
            : undefined,

          weight: formData.weight
            ? Number(formData.weight)
            : undefined,

          height: formData.height
            ? Number(formData.height)
            : undefined,
        },

        clinicalNotes: formData.clinicalNotes,
        treatmentPlan: formData.treatmentPlan,
        followUpDate: formData.followUpDate || undefined,
      };

      const response = await api.post("/emr", payload);

      if (response.data.success) {
        navigate(`/emr/${response.data.data._id}`);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create EMR"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="container py-5 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate("/emr")}
        >
          ← Back
        </button>

        <h2>Create Medical Record</h2>

        <p className="text-muted">
          Add patient's clinical information
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Appointment Information */}
        <div className="card shadow-sm mb-4">

          <div className="card-header fw-bold">
            Appointment Information
          </div>

          <div className="card-body">

            <div className="row g-3">

              {/* Patient */}
              <div className="col-md-4">
                <label className="form-label">
                  Patient *
                </label>

                <select
                  name="patient"
                  className="form-select"
                  value={formData.patient}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Patient
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient._id}
                      value={patient._id}
                    >
                      {patient.user?.username ||
                        "Unknown Patient"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div className="col-md-4">
                <label className="form-label">
                  Doctor *
                </label>

                <select
                  name="doctor"
                  className="form-select"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Doctor
                  </option>

                  {doctors.map((doctor) => (
                    <option
                      key={doctor._id}
                      value={doctor._id}
                    >
                      Dr.{" "}
                      {doctor.user?.username ||
                        "Unknown Doctor"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Appointment */}
              <div className="col-md-4">
                <label className="form-label">
                  Completed Appointment *
                </label>

                <select
                  name="appointment"
                  className="form-select"
                  value={formData.appointment}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Appointment
                  </option>

                  {appointments
                    .filter(
                      (appointment) =>
                        appointment.status === "COMPLETED"
                    )
                    .map((appointment) => (
                      <option
                        key={appointment._id}
                        value={appointment._id}
                      >
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleString()}
                      </option>
                    ))}
                </select>

                <small className="text-muted">
                  Only completed appointments can have
                  an EMR.
                </small>
              </div>

            </div>
          </div>
        </div>

        {/* Clinical Information */}
        <div className="card shadow-sm mb-4">

          <div className="card-header fw-bold">
            Clinical Information
          </div>

          <div className="card-body">

            {/* Symptoms */}
            <div className="mb-3">
              <label className="form-label">
                Symptoms
              </label>

              <textarea
                name="symptoms"
                className="form-control"
                rows="3"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Enter patient symptoms"
              />
            </div>

            {/* Diagnosis */}
            <div className="mb-3">
              <label className="form-label">
                Diagnosis
              </label>

              <textarea
                name="diagnosis"
                className="form-control"
                rows="3"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Enter diagnosis"
              />
            </div>

            {/* Medical History */}
            <div className="mb-3">
              <label className="form-label">
                Medical History
              </label>

              <textarea
                name="medicalHistory"
                className="form-control"
                rows="3"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Enter medical history"
              />
            </div>

            {/* Allergies */}
            <div>
              <label className="form-label">
                Allergies
              </label>

              <input
                type="text"
                name="allergies"
                className="form-control"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Example: Penicillin, Dust"
              />

              <small className="text-muted">
                Separate multiple allergies with commas.
              </small>
            </div>

          </div>
        </div>

        {/* Medication */}
        <div className="card shadow-sm mb-4">

          <div className="card-header fw-bold">
            Medication
          </div>

          <div className="card-body">

            <div className="row g-3">

              <div className="col-md-3">
                <label className="form-label">
                  Medicine
                </label>

                <input
                  type="text"
                  name="medicationName"
                  className="form-control"
                  value={formData.medicationName}
                  onChange={handleChange}
                  placeholder="Medicine name"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Dosage
                </label>

                <input
                  type="text"
                  name="dosage"
                  className="form-control"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder="500mg"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Frequency
                </label>

                <input
                  type="text"
                  name="frequency"
                  className="form-control"
                  value={formData.frequency}
                  onChange={handleChange}
                  placeholder="Twice daily"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  className="form-control"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="5 days"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="card shadow-sm mb-4">

          <div className="card-header fw-bold">
            Vital Signs
          </div>

          <div className="card-body">

            <div className="row g-3">

              <div className="col-md-4">
                <label className="form-label">
                  Temperature (°C)
                </label>

                <input
                  type="number"
                  step="any"
                  name="temperature"
                  className="form-control"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="36.5"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Blood Pressure
                </label>

                <input
                  type="text"
                  name="bloodPressure"
                  className="form-control"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="120/80"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Heart Rate (bpm)
                </label>

                <input
                  type="number"
                  name="heartRate"
                  className="form-control"
                  value={formData.heartRate}
                  onChange={handleChange}
                  placeholder="72"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Respiratory Rate
                </label>

                <input
                  type="number"
                  name="respiratoryRate"
                  className="form-control"
                  value={formData.respiratoryRate}
                  onChange={handleChange}
                  placeholder="18"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Oxygen Saturation (%)
                </label>

                <input
                  type="number"
                  name="oxygenSaturation"
                  className="form-control"
                  value={formData.oxygenSaturation}
                  onChange={handleChange}
                  placeholder="98"
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Weight (kg)
                </label>

                <input
                  type="number"
                  step="any"
                  name="weight"
                  className="form-control"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="70"
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Height (cm)
                </label>

                <input
                  type="number"
                  step="any"
                  name="height"
                  className="form-control"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="175"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Treatment */}
        <div className="card shadow-sm mb-4">

          <div className="card-header fw-bold">
            Treatment & Notes
          </div>

          <div className="card-body">

            <div className="mb-3">
              <label className="form-label">
                Clinical Notes
              </label>

              <textarea
                name="clinicalNotes"
                className="form-control"
                rows="4"
                value={formData.clinicalNotes}
                onChange={handleChange}
                placeholder="Enter clinical notes"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Treatment Plan
              </label>

              <textarea
                name="treatmentPlan"
                className="form-control"
                rows="4"
                value={formData.treatmentPlan}
                onChange={handleChange}
                placeholder="Enter treatment plan"
              />
            </div>

            <div>
              <label className="form-label">
                Follow-up Date
              </label>

              <input
                type="date"
                name="followUpDate"
                className="form-control"
                value={formData.followUpDate}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2 mb-4">

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/emr")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save EMR"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default AddEMR;

