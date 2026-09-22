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

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user.role;

  const appointments = [
    {
      id: 1,
      patient: "John Doe",
      doctor: "Dr. Ali Khan",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      patient: "Sarah Smith",
      doctor: "Dr. Ahmed",
      time: "11:00 AM",
      status: "Scheduled",
    },
    {
      id: 3,
      patient: "David Wilson",
      doctor: "Dr. Ali Khan",
      time: "12:30 PM",
      status: "Confirmed",
    },
    {
      id: 4,
      patient: "Emily Johnson",
      doctor: "Dr. Sarah",
      time: "02:00 PM",
      status: "Pending",
    },
  ];

  const patients = [
    {
      name: "John Doe",
      email: "john@example.com",
      gender: "Male",
    },
    {
      name: "Sarah Smith",
      email: "sarah@example.com",
      gender: "Female",
    },
    {
      name: "David Wilson",
      email: "david@example.com",
      gender: "Male",
    },
  ];

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

              <div>
                <p>Total Patients</p>
                <h3>248</h3>
                <span className="positive">
                  +12% this month
                </span>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon doctors">
                <FaUserMd />
              </div>

              <div>
                <p>Total Doctors</p>
                <h3>24</h3>
                <span className="positive">
                  +2 this month
                </span>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon appointments">
                <FaCalendarCheck />
              </div>

              <div>
                <p>Appointments</p>
                <h3>18</h3>
                <span className="neutral">
                  Today
                </span>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon billing">
                <FaFileInvoiceDollar />
              </div>

              <div>
                <p>Today's Revenue</p>
                <h3>₹45,800</h3>
                <span className="positive">
                  +8.4%
                </span>
              </div>

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

                {appointments.map(
                  (appointment) => (
                    <div
                      className="table-row"
                      key={appointment.id}
                    >
                      <span className="patient-name">
                        {appointment.patient}
                      </span>

                      <span>
                        {appointment.doctor}
                      </span>

                      <span>
                        {appointment.time}
                      </span>

                      <span>
                        <span
                          className={`status ${appointment.status
                            .toLowerCase()
                            }`}
                        >
                          {appointment.status}
                        </span>
                      </span>
                    </div>
                  )
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
                    navigate("/appointments")
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

                <button
                  onClick={() =>
                    navigate("/doctors")
                  }
                >
                  <FaUserMd />
                  <div>
                    <strong>
                      Add Doctor
                    </strong>
                    <small>
                      Register a doctor
                    </small>
                  </div>
                </button>

                <button
                  onClick={() =>
                    navigate("/billing")
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

                {patients.map(
                  (patient, index) => (
                    <div
                      className="patient-item"
                      key={index}
                    >

                      <div className="patient-avatar">
                        {patient.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="patient-details">
                        <strong>
                          {patient.name}
                        </strong>

                        <small>
                          {patient.email}
                        </small>
                      </div>

                      <span>
                        {patient.gender}
                      </span>

                    </div>
                  )
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
                  <strong>18 / 24</strong>
                </div>

                <div>
                  <span>Pending Bills</span>
                  <strong>₹18,450</strong>
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