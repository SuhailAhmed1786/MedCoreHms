import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./css/BillingDetails.css";

const BillingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(true);

  // --------------------------------
  // Get billing details
  // --------------------------------

  const getBillingDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/billing/${id}`);

      if (response.data.success) {
        setBilling(response.data.data);
      }
    } catch (error) {
      console.error("Get Billing Details Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch billing details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBillingDetails();
  }, [id]);

  // --------------------------------
  // Helpers
  // --------------------------------

  const getPatientName = () => {
    return (
      billing?.patient?.user?.name ||
      billing?.patient?.user?.username ||
      "N/A"
    );
  };

  const getDoctorName = () => {
    return (
      billing?.doctor?.user?.name ||
      billing?.doctor?.user?.username ||
      "N/A"
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const remainingAmount =
    Number(billing?.totalAmount || 0) -
    Number(billing?.paidAmount || 0);

  // --------------------------------
  // Record payment
  // --------------------------------

  const handlePayment = async (e) => {
    e.preventDefault();

    setError("");

    const amount = Number(paymentAmount);

    if (remainingAmount <= 0) {
      setError("No remaining amount to pay.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (amount > remainingAmount) {
      setError(
        `Payment cannot be greater than remaining amount ₹${remainingAmount.toFixed(2)}`
      );
      return;
    }

    // continue with your API call...
  };

  // --------------------------------
  // Cancel billing
  // --------------------------------

  const handleCancelBilling = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this bill?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelLoading(true);
      setError("");

      const response = await api.delete(
        `/billing/${id}`
      );

      if (response.data.success) {
        alert("Billing cancelled successfully");

        setBilling(response.data.data);
      }
    } catch (error) {
      console.error("Cancel Billing Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to cancel billing"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="billing-details-page">
        <p>Loading billing details...</p>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (!billing) {
    return (
      <div className="billing-details-page">
        <div className="error-message">
          {error || "Billing record not found"}
        </div>

        <button
          onClick={() => navigate("/billing")}
        >
          Back to Billing
        </button>
      </div>
    );
  }

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="billing-details-page">

      {/* Header */}

      <div className="page-header">

        <div>
          <h1>Billing Details</h1>

          <p>
            Invoice ID:{" "}
            <strong>{billing._id}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/billing")}
        >
          Back to Billing
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Billing Status */}

      <div className="billing-summary">

        <div>
          <span>Status</span>

          <strong
            className={`status ${billing.paymentStatus?.toLowerCase()}`}
          >
            {billing.paymentStatus}
          </strong>
        </div>

        <div>
          <span>Total Amount</span>
          <strong>
            ₹{Number(billing.totalAmount).toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Paid Amount</span>
          <strong>
            ₹{Number(billing.paidAmount).toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Remaining</span>

          <strong>
            ₹{Math.max(0, remainingAmount).toFixed(2)}
          </strong>
        </div>

      </div>

      {/* Patient & Doctor */}

      <div className="details-grid">

        <div className="details-card">
          <h2>Patient Information</h2>

          <p>
            <strong>Name:</strong>{" "}
            {getPatientName()}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {billing.patient?.user?.email || "N/A"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {billing.patient?.phone || "N/A"}
          </p>
        </div>

        <div className="details-card">
          <h2>Doctor Information</h2>

          <p>
            <strong>Name:</strong>{" "}
            {getDoctorName()}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {billing.doctor?.user?.email || "N/A"}
          </p>

          <p>
            <strong>Specialization:</strong>{" "}
            {billing.doctor?.specialization || "N/A"}
          </p>
        </div>

      </div>

      {/* Appointment */}

      <div className="details-card">

        <h2>Appointment Information</h2>

        <div className="details-grid">

          <p>
            <strong>Date:</strong>{" "}
            {formatDateTime(
              billing.appointment?.appointmentDate
            )}
          </p>

          <p>
            <strong>Reason:</strong>{" "}
            {billing.appointment?.reason || "N/A"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {billing.appointment?.status || "N/A"}
          </p>

        </div>

      </div>

      {/* Billing Items */}

      <div className="details-card">

        <h2>Billing Items</h2>

        <table className="billing-items-table">

          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>

            {billing.items?.map((item, index) => {

              const itemTotal =
                Number(item.quantity || 0) *
                Number(item.amount || 0);

              return (
                <tr key={index}>

                  <td>{index + 1}</td>

                  <td>
                    {item.description}
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    ₹
                    {Number(item.amount).toFixed(2)}
                  </td>

                  <td>
                    ₹
                    {itemTotal.toFixed(2)}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* Amount Summary */}

      <div className="details-card amount-summary">

        <div>
          <span>Subtotal</span>

          <strong>
            ₹{Number(billing.subtotal).toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Discount</span>

          <strong>
            - ₹{Number(billing.discount).toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Tax</span>

          <strong>
            + ₹{Number(billing.tax).toFixed(2)}
          </strong>
        </div>

        <hr />

        <div className="total-row">
          <span>Total</span>

          <strong>
            ₹{Number(billing.totalAmount).toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Paid</span>

          <strong>
            ₹{Number(billing.paidAmount).toFixed(2)}
          </strong>
        </div>

        <div className="remaining-row">
          <span>Remaining</span>

          <strong>
            ₹{Math.max(0, remainingAmount).toFixed(2)}
          </strong>
        </div>

      </div>

      {/* Payment */}

      {billing.paymentStatus !== "PAID" &&
        billing.paymentStatus !== "CANCELLED" &&
        remainingAmount > 0 && (
          <div className="details-card">
            <h2>Record Payment</h2>

            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>Payment Amount</label>

                <input
                  type="number"
                  min="0.01"
                  max={remainingAmount}
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => {
                    setPaymentAmount(e.target.value);
                    setError("");
                  }}
                  placeholder={`Remaining ₹${remainingAmount.toFixed(2)}`}
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>

                <select
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setError("");
                  }}
                  required
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
                  rows="3"
                  value={paymentNotes}
                  onChange={(e) =>
                    setPaymentNotes(e.target.value)
                  }
                  placeholder="Payment notes..."
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={paymentLoading}
              >
                {paymentLoading
                  ? "Processing..."
                  : "Record Payment"}
              </button>
            </form>
          </div>
        )}


      {/* Payment Information */}

      {/* Payment */}

      {billing.paymentStatus !== "PAID" &&
        billing.paymentStatus !== "CANCELLED" && (
          <div className="details-card payment-action-card">

            <div className="payment-action-content">
              <div>
                <h2>Payment</h2>

                <p>
                  Remaining Amount:{" "}
                  <strong>
                    ₹{Math.max(0, remainingAmount).toFixed(2)}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="record-payment-btn"
                onClick={() => setShowPaymentModal(true)}
              >
                Record Payment
              </button>
            </div>

          </div>
        )}

      {/* Actions */}

      <div className="billing-actions">

        {billing.paymentStatus !== "PAID" &&
          billing.paymentStatus !== "CANCELLED" && (
            <button
              type="button"
              onClick={handleCancelBilling}
              disabled={cancelLoading}
            >
              {cancelLoading
                ? "Cancelling..."
                : "Cancel Bill"}
            </button>
          )}

        <button
          type="button"
          onClick={() =>
            navigate("/billing")
          }
        >
          Back to Billing
        </button>

        {billing.paymentStatus !== "CANCELLED" && (
          <button
            type="button"
            onClick={() =>
              navigate(`/billing/${billing._id}/edit`)
            }
          >
            Edit Bill
          </button>
        )}

      </div>

      {showPaymentModal && (
        <div
          className="payment-modal-overlay"
          onClick={() => {
            if (!paymentLoading) {
              setShowPaymentModal(false);
            }
          }}
        >
          <div
            className="payment-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="payment-modal-header">

              <div>
                <h2>Record Payment</h2>

                <p>
                  Record a payment for this invoice.
                </p>
              </div>

              <button
                type="button"
                className="payment-modal-close"
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentLoading}
              >
                ×
              </button>

            </div>


            {/* Payment Summary */}

            <div className="payment-modal-summary">

              <div>
                <span>Total Amount</span>

                <strong>
                  ₹{Number(billing.totalAmount).toFixed(2)}
                </strong>
              </div>

              <div>
                <span>Paid Amount</span>

                <strong>
                  ₹{Number(billing.paidAmount).toFixed(2)}
                </strong>
              </div>

              <div className="remaining">
                <span>Remaining</span>

                <strong>
                  ₹{Math.max(0, remainingAmount).toFixed(2)}
                </strong>
              </div>

            </div>


            {/* Error */}

            {error && (
              <div className="payment-modal-error">
                {error}
              </div>
            )}


            {/* Payment Form */}

            <form onSubmit={handlePayment}>

              {/* Amount */}

              <div className="form-group">

                <label>
                  Payment Amount
                </label>

                <input
                  type="number"
                  min="1"
                  max={remainingAmount}
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => {
                    setPaymentAmount(e.target.value);
                    setError("");
                  }}
                  placeholder={`Remaining ₹${remainingAmount.toFixed(2)}`}
                  required
                  disabled={paymentLoading}
                />

              </div>


              {/* Payment Method */}

              <div className="form-group">

                <label>
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setError("");
                  }}
                  disabled={paymentLoading}
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


              {/* Notes */}

              <div className="form-group">

                <label>
                  Notes
                </label>

                <textarea
                  rows="3"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Payment notes..."
                  disabled={paymentLoading}
                />

              </div>


              {/* Modal Actions */}

              <div className="payment-modal-actions">

                <button
                  type="button"
                  className="payment-modal-cancel"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={paymentLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="payment-modal-submit"
                  disabled={paymentLoading}
                >
                  {paymentLoading
                    ? "Processing..."
                    : "Record Payment"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default BillingDetails;