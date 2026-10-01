import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const EditEMR = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEMR = async () => {
      try {
        const response = await api.get(`/emr/${id}`);
        const emr = response.data.data;

        const medication = emr.medications?.[0] || {};

        setFormData({
          symptoms: emr.symptoms || "",
          diagnosis: emr.diagnosis || "",
          medicalHistory: emr.medicalHistory || "",

          allergies: emr.allergies?.join(", ") || "",

          medicationName: medication.name || "",
          dosage: medication.dosage || "",
          frequency: medication.frequency || "",
          duration: medication.duration || "",

          temperature:
            emr.vitals?.temperature ?? "",

          bloodPressure:
            emr.vitals?.bloodPressure || "",

          heartRate:
            emr.vitals?.heartRate ?? "",

          respiratoryRate:
            emr.vitals?.respiratoryRate ?? "",

          oxygenSaturation:
            emr.vitals?.oxygenSaturation ?? "",

          weight: emr.vitals?.weight ?? "",
          height: emr.vitals?.height ?? "",

          clinicalNotes: emr.clinicalNotes || "",
          treatmentPlan: emr.treatmentPlan || "",

          followUpDate: emr.followUpDate
            ? new Date(emr.followUpDate)
                .toISOString()
                .split("T")[0]
            : "",
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
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

          respiratoryRate:
            formData.respiratoryRate
              ? Number(formData.respiratoryRate)
              : undefined,

          oxygenSaturation:
            formData.oxygenSaturation
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
        followUpDate:
          formData.followUpDate || undefined,
      };

      await api.put(`/emr/${id}`, payload);

      navigate(`/emr/${id}`);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update EMR"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(`/emr/${id}`)}
      >
        ← Back
      </button>

      <h2 className="mb-4">Edit Medical Record</h2>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold">
            Clinical Information
          </div>

          <div className="card-body">
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
              />
            </div>

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
              />
            </div>

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
              />
            </div>

            <div>
              <label className="form-label">
                Allergies
              </label>

              <input
                name="allergies"
                className="form-control"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Penicillin, Dust"
              />
            </div>
          </div>
        </div>

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
                  name="medicationName"
                  className="form-control"
                  value={formData.medicationName}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Dosage
                </label>

                <input
                  name="dosage"
                  className="form-control"
                  value={formData.dosage}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Frequency
                </label>

                <input
                  name="frequency"
                  className="form-control"
                  value={formData.frequency}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Duration
                </label>

                <input
                  name="duration"
                  className="form-control"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold">
            Vital Signs
          </div>

          <div className="card-body">
            <div className="row g-3">
              {[
                ["temperature", "Temperature"],
                ["bloodPressure", "Blood Pressure"],
                ["heartRate", "Heart Rate"],
                ["respiratoryRate", "Respiratory Rate"],
                ["oxygenSaturation", "Oxygen Saturation"],
                ["weight", "Weight"],
                ["height", "Height"],
              ].map(([name, label]) => (
                <div className="col-md-4" key={name}>
                  <label className="form-label">
                    {label}
                  </label>

                  <input
                    type={
                      name === "bloodPressure"
                        ? "text"
                        : "number"
                    }
                    step="any"
                    name={name}
                    className="form-control"
                    value={formData[name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold">
            Treatment
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
              />
            </div>

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

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? "Updating..." : "Update EMR"}
        </button>
      </form>
    </div>
  );
};

export default EditEMR;