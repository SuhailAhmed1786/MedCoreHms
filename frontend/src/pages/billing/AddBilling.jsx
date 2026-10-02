import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./css/AddBilling.css";

const AddBilling = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    appointment: "",
    discount: 0,
    tax: 0,
    paidAmount: 0,
    paymentMethod: "",
    notes: "",
  });

  const [items, setItems] = useState([
    {
      description: "Consultation",
      quantity: 1,
      amount: 0,
    },
  ]);

  // --------------------------------
  // Get completed appointments
  // --------------------------------

  const getAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const response = await api.get("/appointments");

      if (response.data.success) {
        const completedAppointments =
          response.data.data.filter(
            (appointment) =>
              appointment.status === "COMPLETED"
          );

        setAppointments(completedAppointments);
      }
    } catch (error) {
      console.error("Get Appointments Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load appointments"
      );
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // --------------------------------
  // Selected appointment
  // --------------------------------

  const selectedAppointment = appointments.find(
    (appointment) =>
      appointment._id === formData.appointment
  );

  // --------------------------------
  // Input change
  // --------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------
  // Item change
  // --------------------------------

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "quantity" ||
                field === "amount"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  // --------------------------------
  // Add item
  // --------------------------------

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        description: "",
        quantity: 1,
        amount: 0,
      },
    ]);
  };

  // --------------------------------
  // Remove item
  // --------------------------------

  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    setItems((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // --------------------------------
  // Calculations
  // --------------------------------

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 0) *
        Number(item.amount || 0),
    0
  );

  const discount = Number(formData.discount || 0);

  const tax = Number(formData.tax || 0);

  const totalAmount = Math.max(
    0,
    subtotal - discount + tax
  );

  // --------------------------------
  // Create billing
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.appointment) {
      setError("Please select an appointment");
      return;
    }

    if (!selectedAppointment) {
      setError("Selected appointment not found");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one billing item");
      return;
    }

    const invalidItem = items.some(
      (item) =>
        !item.description.trim() ||
        Number(item.quantity) <= 0 ||
        Number(item.amount) < 0
    );

    if (invalidItem) {
      setError(
        "Please enter valid billing item details"
      );
      return;
    }

    const paidAmount = Number(
      formData.paidAmount || 0
    );

    if (paidAmount < 0 || paidAmount > totalAmount) {
      setError(
        "Paid amount cannot be greater than total amount"
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        patient:
          selectedAppointment.patient?._id ||
          selectedAppointment.patient,

        doctor:
          selectedAppointment.doctor?._id ||
          selectedAppointment.doctor,

        appointment: selectedAppointment._id,

        items,

        discount,

        tax,

        paidAmount,

        paymentMethod:
          formData.paymentMethod || undefined,

        notes: formData.notes,
      };

      const response = await api.post(
        "/billing",
        payload
      );

      if (response.data.success) {
        alert("Billing created successfully");

        navigate(
          `/billing/${response.data.data._id}`
        );
      }
    } catch (error) {
      console.error("Create Billing Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create billing"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-billing-page">

      <div className="page-header">
        <div>
          <h1>Create Billing</h1>
          <p>
            Create an invoice for a completed
            appointment
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/billing")}
        >
          Back
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Appointment */}

        <div className="form-section">
          <h2>Appointment Details</h2>

          {appointmentsLoading ? (
            <p>Loading appointments...</p>
          ) : (
            <select
              name="appointment"
              value={formData.appointment}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Completed Appointment
              </option>

              {appointments.map((appointment) => (
                <option
                  key={appointment._id}
                  value={appointment._id}
                >
                  {appointment.patient?.user?.name ||
                    appointment.patient?.user
                      ?.username ||
                    "Patient"}{" "}
                  -{" "}
                  {appointment.doctor?.user?.name ||
                    appointment.doctor?.user
                      ?.username ||
                    "Doctor"}{" "}
                  -{" "}
                  {new Date(
                    appointment.appointmentDate
                  ).toLocaleDateString("en-IN")}
                </option>
              ))}
            </select>
          )}

          {selectedAppointment && (
            <div className="appointment-info">

              <div>
                <strong>Patient:</strong>{" "}
                {selectedAppointment.patient?.user
                  ?.name ||
                  selectedAppointment.patient?.user
                    ?.username ||
                  "N/A"}
              </div>

              <div>
                <strong>Doctor:</strong>{" "}
                {selectedAppointment.doctor?.user
                  ?.name ||
                  selectedAppointment.doctor?.user
                    ?.username ||
                  "N/A"}
              </div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(
                  selectedAppointment.appointmentDate
                ).toLocaleString("en-IN")}
              </div>

              <div>
                <strong>Reason:</strong>{" "}
                {selectedAppointment.reason ||
                  "N/A"}
              </div>

            </div>
          )}
        </div>

        {/* Billing Items */}

        <div className="form-section">

          <div className="section-header">
            <h2>Billing Items</h2>

            <button
              type="button"
              onClick={addItem}
            >
              + Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div
              className="billing-item"
              key={index}
            >

              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "description",
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "quantity",
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "amount",
                    e.target.value
                  )
                }
              />

              <div>
                ₹
                {Number(item.quantity || 0) *
                  Number(item.amount || 0)}
              </div>

              <button
                type="button"
                onClick={() =>
                  removeItem(index)
                }
              >
                Remove
              </button>

            </div>
          ))}
        </div>

        {/* Amount */}

        <div className="form-section">

          <h2>Payment Details</h2>

          <div className="amount-row">
            <label>Subtotal</label>

            <strong>
              ₹{subtotal.toFixed(2)}
            </strong>
          </div>

          <div className="form-group">
            <label>Discount</label>

            <input
              type="number"
              min="0"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Tax</label>

            <input
              type="number"
              min="0"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
            />
          </div>

          <div className="amount-row total">
            <label>Total Amount</label>

            <strong>
              ₹{totalAmount.toFixed(2)}
            </strong>
          </div>

          <div className="form-group">
            <label>Paid Amount</label>

            <input
              type="number"
              min="0"
              max={totalAmount}
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">
                Select Payment Method
              </option>

              <option value="CASH">
                Cash
              </option>

              <option value="CARD">
                Card
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="ONLINE">
                Online
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes</label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Billing notes..."
              rows="4"
            />
          </div>

        </div>

        {/* Submit */}

        <div className="form-actions">

          <button
            type="button"
            onClick={() =>
              navigate("/billing")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Bill"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default AddBilling;