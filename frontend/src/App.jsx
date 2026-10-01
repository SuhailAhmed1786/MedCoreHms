import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";

import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import PatientDetails from "./pages/PatientDetails";
import EditPatient from "./pages/EditPatient";

import StaffManagement from "./pages/StaffManagement";

import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import EditDoctor from "./pages/EditDoctor";

import Appointments from "./pages/appointments/Appointments";
import BookAppointment from "./pages/appointments/BookAppointment";
import AppointmentDetails from "./pages/appointments/AppointmentDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import PublicRoute from "./components/PublicRoute";

import EMRList from "./pages/emr/EMRList";
import AddEMR from "./pages/emr/AddEMR";
import EMRDetails from "./pages/emr/EMRDetails";
import EditEMR from "./pages/emr/EditEMR";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/verify-email/:token"
            element={<VerifyEmail />}
          />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* your other protected routes */}



          {/* ================= PATIENT ROUTES ================= */}

          <Route
            path="/patients"
            element={<Patients />}
          />

          <Route
            path="/patients/add"
            element={<AddPatient />}
          />

          <Route
            path="/patients/:id"
            element={<PatientDetails />}
          />

          <Route
            path="/patients/:id/edit"
            element={<EditPatient />}
          />


          {/* ================= STAFF ================= */}

          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN"]} />
            }
          >
            <Route
              path="/staff"
              element={<StaffManagement />}
            />
          </Route>
          <Route
            element={
              <RoleRoute
                allowedRoles={["ADMIN", "DOCTOR"]}
              />
            }
          >
            <Route path="/emr" element={<EMRList />} />
            <Route path="/emr/add" element={<AddEMR />} />
            <Route path="/emr/:id" element={<EMRDetails />} />
            <Route path="/emr/:id/edit" element={<EditEMR />} />
          </Route>


          {/* ================= APPOINTMENTS ================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "DOCTOR",
                  "RECEPTIONIST",
                ]}
              />
            }
          >
            <Route
              path="/appointments"
              element={<Appointments />}
            />

            <Route
              path="/appointments/add"
              element={<BookAppointment />}
            />

            <Route
              path="/appointments/:id"
              element={<AppointmentDetails />}
            />
          </Route>


          {/* ================= ADMIN / DOCTORS ================= */}

          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN"]} />
            }
          >

            <Route
              path="/doctors"
              element={<Doctors />}
            />

            <Route
              path="/doctors/:id"
              element={<DoctorDetails />}
            />

            <Route
              path="/doctors/:id/edit"
              element={<EditDoctor />}
            />

            <Route
              path="/settings"
              element={<div>Admin Settings</div>}
            />

          </Route>


          {/* ================= BILLING ================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "RECEPTIONIST",
                ]}
              />
            }
          >
            <Route
              path="/billing"
              element={<div>Billing</div>}
            />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

