import {
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaFileInvoiceDollar,
  FaChartLine,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaNotesMedical,
  FaPlus,
  FaBars,
  FaTimes,
  FaUsers
} from "react-icons/fa";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services//api";
const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const appointments = dashboardData?.todaysAppointments || [];
  const patients = dashboardData?.recentPatients || [];
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await api.get("/dashboard");

        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Dashboard API Error:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user.role;

  return (
    <div className="dashboard-wrapper">

      {/* Sidebar */}

      <aside
        className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""
          }`}
      >
        <div className="sidebar-logo">

          <div className="medical-logo">
            +
          </div>

          <div>
            <h4>MedCore</h4>
            <span>HMS</span>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>

        </div>

        <div className="sidebar-menu">

          <p className="menu-title">
            MAIN MENU
          </p>

          {/* Dashboard - All logged-in users */}
          <button
            className="menu-item active"
            onClick={() => navigate("/dashboard")}
          >
            <FaChartLine />
            Dashboard
          </button>

          {/* Patients - All logged-in users */}
          <button
            className="menu-item"
            onClick={() => navigate("/patients")}
          >
            <FaUserInjured />
            Patients
          </button>

          {/* Doctors - ADMIN only */}
          {role === "ADMIN" && (
            <button
              className="menu-item"
              onClick={() => navigate("/doctors")}
            >
              <FaUserMd />
              Doctors
            </button>
          )}

          {/* Appointments */}
          {["ADMIN", "DOCTOR", "RECEPTIONIST"].includes(role) && (
            <button
              className="menu-item"
              onClick={() => navigate("/appointments")}
            >
              <FaCalendarCheck />
              Appointments
            </button>
          )}

          {role === "ADMIN" && (
            <button
              className="menu-item"
              onClick={() => navigate("/staff")}
            >
              <FaUsers />
              Staff Management
            </button>
          )}

          {/* EMR - ADMIN + DOCTOR */}
          {["ADMIN", "DOCTOR"].includes(role) && (
            <button
              className="menu-item"
              onClick={() => navigate("/emr")}
            >
              <FaNotesMedical />
              EMR
            </button>
          )}

          {/* Billing - ADMIN + RECEPTIONIST */}
          {["ADMIN", "RECEPTIONIST"].includes(role) && (
            <button
              className="menu-item"
              onClick={() => navigate("/billing")}
            >
              <FaFileInvoiceDollar />
              Billing
            </button>
          )}

          <p className="menu-title mt-4">
            SYSTEM
          </p>

          {/* Settings - ADMIN only */}
          {role === "ADMIN" && (
            <button
              className="menu-item"
              onClick={() => navigate("/settings")}
            >
              <FaCog />
              Settings
            </button>
          )}

          {/* Logout - All users */}
          <button
            className="menu-item logout-item"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>
      </aside>

      {/* Main */}

      <main className="dashboard-main">

        {loading && (
          <div className="dashboard-loading">
            Loading dashboard...
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* Header */}

        <header className="dashboard-header">

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <FaBars />
          </button>

          <div>
            <h5>Dashboard</h5>
            <small>
              MedCore Hospital Management System
            </small>
          </div>

          <div className="header-right">

            <button className="notification-btn">
              <FaBell />
              <span></span>
            </button>

            <div className="profile-info">

              <div className="profile-avatar">
                {user.username
                  ? user.username
                    .charAt(0)
                    .toUpperCase()
                  : "U"}
              </div>

              <div>
                <strong>
                  {user.username || "User"}
                </strong>

                <small>
                  {user.role || "PATIENT"}
                </small>
              </div>

            </div>

          </div>

        </header>

        {/* Content */}

        <div className="dashboard-content">

          {/* Welcome */}

          <div className="welcome-section">

            <div>
              <h2>
                Good morning,{" "}
                {user.username || "User"} 👋
              </h2>

              <p>
                Here's what's happening in
                your hospital today.
              </p>
            </div>

            
                <button
              className="primary-btn"
              onClick={() =>
                navigate("/appointments")
              }
            >
              <FaPlus />
              New Appointment
            </button>
            
            

          </div>

          {/* Statistics */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon patients">
                <FaUserInjured />
              </div>

              <h3>
                {dashboardData?.statistics?.totalPatients ?? 0}
              </h3>

              <span className="neutral">
                Total registered patients
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-icon doctors">
                <FaUserMd />
              </div>

              <h3>
                {dashboardData?.statistics?.totalDoctors ?? 0}
              </h3>

              <span className="neutral">
                {dashboardData?.statistics?.activeDoctors ?? 0} available
              </span>

            </div>

            <div className="stat-card">
              <div className="stat-icon appointments">
                <FaCalendarCheck />
              </div>

              <h3>
                {dashboardData?.statistics?.todaysAppointments ?? 0}
              </h3>

              <span className="neutral">
                Today
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-icon billing">
                <FaFileInvoiceDollar />
              </div>

              <h3>
                ₹
                {(
                  dashboardData?.statistics?.todaysRevenue || 0
                ).toLocaleString("en-IN")}
              </h3>

              <span className="neutral">
                Today's collected amount
              </span>

            </div>

          </div>

          {/* Appointments */}

          <div className="dashboard-grid">

            <div className="dashboard-card appointment-card">

              <div className="card-header">

                <div>
                  <h4>
                    Today's Appointments
                  </h4>

                  <p>
                    Scheduled appointments for today
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate("/appointments")
                  }
                >
                  View All
                </button>

              </div>

              <div className="appointment-table">

                <div className="table-header">
                  <span>Patient</span>
                  <span>Doctor</span>
                  <span>Time</span>
                  <span>Status</span>
                </div>

                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div
                      className="table-row"
                      key={appointment._id}
                    >
                      <span className="patient-name">
                        {appointment.patient?.user?.name ||
                          appointment.patient?.user?.username ||
                          "Unknown Patient"}
                      </span>

                      <span>
                        {appointment.doctor?.user?.name ||
                          appointment.doctor?.user?.username ||
                          "Unknown Doctor"}
                      </span>

                      <span>
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      <span>
                        <span
                          className={`status ${appointment.status.toLowerCase()}`}
                        >
                          {appointment.status}
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    No appointments scheduled for today.
                  </div>
                )}

              </div>

            </div>

            {/* Quick Actions */}

           
                <div className="dashboard-card">

              <div className="card-header">
                <div>
                  <h4>Quick Actions</h4>
                  <p>
                    Frequently used actions
                  </p>
                </div>
              </div>

              <div className="quick-actions">

                <button
                  onClick={() => navigate("/patients/add")
                  }
                >
                  <FaUserInjured />
                  <div>
                    <strong>
                      Add Patient
                    </strong>
                    <small>
                      Register a new patient
                    </small>
                  </div>
                </button>

                <button
                  onClick={() =>
                    navigate("/appointments/add")
                  }
                >
                  <FaCalendarCheck />
                  <div>
                    <strong>
                      Book Appointment
                    </strong>
                    <small>
                      Schedule consultation
                    </small>
                  </div>
                </button>

                <strong>
                  Manage Doctors
                </strong>

                <small>
                  View and manage doctors
                </small>

                <button
                  onClick={() =>
                    navigate("/billing/add")
                  }
                >
                  <FaFileInvoiceDollar />
                  <div>
                    <strong>
                      Create Invoice
                    </strong>
                    <small>
                      Generate patient invoice
                    </small>
                  </div>
                </button>

              </div>

            </div>
            

          </div>

          {/* Bottom Section */}

          <div className="dashboard-grid bottom-grid">
            {/* Recent Patients */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h4>
                    Recent Patients
                  </h4>
                  <p>
                    Recently registered patients
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate("/patients")
                  }
                >
                  View All
                </button>

              </div>

              <div className="patient-list">

                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <div
                      className="patient-item"
                      key={patient._id}
                    >
                      <div className="patient-avatar">
                        {(
                          patient.user?.name ||
                          patient.user?.username ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="patient-details">
                        <strong>
                          {patient.user?.name ||
                            patient.user?.username ||
                            "Unknown Patient"}
                        </strong>

                        <small>
                          {patient.user?.email || "No email"}
                        </small>
                      </div>

                      <span>
                        {patient.gender || "N/A"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    No patients found.
                  </div>
                )}

              </div>

            </div>

            {/* Hospital Summary */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h4>
                    Hospital Overview
                  </h4>

                  <p>
                    Current hospital statistics
                  </p>
                </div>

              </div>

              <div className="overview-list">

                <div>
                  <span>Available Beds</span>
                  <strong>42 / 80</strong>
                </div>

                <div>
                  <span>Active Doctors</span>

                  <strong>
                    {dashboardData?.statistics?.activeDoctors || 0}
                    {" / "}
                    {dashboardData?.statistics?.totalDoctors || 0}
                  </strong>
                </div>

                <div>
                  <span>Pending Bills</span>

                  <strong>
                    ₹
                    {(
                      dashboardData?.statistics
                        ?.pendingBillsAmount || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>Emergency Cases</span>
                  <strong>06</strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Dashboard;