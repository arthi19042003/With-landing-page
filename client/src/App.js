// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import "./App.css";

// ==================== Core Pages ====================
import LandingPage from "./pages/LandingPage"; 

// ==================== Auth Pages ====================
import Login from "./pages/Login";
import EmployerLogin from "./pages/EmployerLogin";
import HiringManagerLogin from "./pages/HiringManagerLogin";
import Register from "./pages/Register";
import EmployerRegister from "./pages/EmployerRegister";
import HiringManagerRegister from "./pages/HiringManagerRegister";
import RecruiterRegister from "./pages/RecruiterRegister"; 

// ==================== Candidate Pages ====================
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ResumeUpload from "./pages/ResumeUpload";
import InterviewDetails from "./pages/InterviewDetails";

// ==================== Employer Pages ====================
import EmployerDashboard from "./pages/Dashboard"; 
import EmployerProfile from "./pages/EmployerProfile";
import CreatePosition from "./pages/CreatePosition"; // ✅ NEW

// ==================== Recruiter Pages ====================
import RecruiterProfile from "./pages/RecruiterProfile"; 
import SubmitCandidate from "./pages/SubmitCandidate"; // ✅ NEW

// ==================== Hiring Manager Pages ====================
import HiringManagerDashboard from "./pages/HiringDashboard"; 
import Inbox from "./pages/Inbox";
import OpenPositions from "./pages/Positions"; 
import CandidateDetails from "./pages/Candidates"; 
import ScheduleInterview from "./pages/InterviewDetails"; 
import Onboarding from "./pages/Onboarding"; 
import HiringReports from "./pages/PurchaseOrders"; 

// ==================== Role-Based Dashboard Redirect ====================
function RoleBasedDashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const role = (user.role || user.userType || "").toLowerCase();

  if (role === "employer") return <Navigate to="/employer/dashboard" />;
  if (role === "recruiter") return <Navigate to="/dashboard" />; // Recruiters use a dashboard too
  if (role === "hiringmanager") return <Navigate to="/hiring-manager/dashboard" />;
  
  return <Dashboard />; // candidate default
}

// ==================== Main App ====================
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />

          <Routes>
            {/* ==================== Public Routes ==================== */}
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/login/employer" element={<EmployerLogin />} />
            <Route path="/login/hiring-manager" element={<HiringManagerLogin />} />

            <Route path="/register" element={<Register />} />
            <Route path="/register/employer" element={<EmployerRegister />} />
            <Route path="/register/hiring-manager" element={<HiringManagerRegister />} />
            <Route path="/register/recruiter" element={<RecruiterRegister />} /> 

            {/* ==================== Role-Based Dashboard ==================== */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <RoleBasedDashboard />
                </PrivateRoute>
              }
            />

            {/* ==================== Candidate Routes ==================== */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/resume"
              element={
                <PrivateRoute>
                  <ResumeUpload />
                </PrivateRoute>
              }
            />
            <Route
              path="/interviews"
              element={
                <PrivateRoute>
                  <InterviewDetails />
                </PrivateRoute>
              }
            />

            {/* ==================== Employer Routes ==================== */}
            <Route
              path="/employer/dashboard"
              element={
                <PrivateRoute>
                  <EmployerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/employer/profile"
              element={
                <PrivateRoute>
                  <EmployerProfile />
                </PrivateRoute>
              }
            />
             {/* Shared route for Employers and Managers */}
            <Route
              path="/positions/new"
              element={
                <PrivateRoute>
                  <CreatePosition />
                </PrivateRoute>
              }
            />
            
            {/* ==================== Recruiter Routes ==================== */}
             <Route
              path="/recruiter/profile"
              element={
                <PrivateRoute>
                  <RecruiterProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/recruiter/submit"
              element={
                <PrivateRoute>
                  <SubmitCandidate />
                </PrivateRoute>
              }
            />

            {/* ==================== Hiring Manager Routes ==================== */}
            <Route
              path="/hiring-manager/dashboard"
              element={
                <PrivateRoute>
                  <HiringManagerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/hiring-manager/inbox"
              element={
                <PrivateRoute>
                  <Inbox />
                </PrivateRoute>
              }
            />
            <Route
              path="/hiring-manager/open-positions"
              element={
                <PrivateRoute>
                  <OpenPositions />
                </PrivateRoute>
              }
            />
            <Route
              path="/hiring-manager/candidate/:id"
              element={
                <PrivateRoute>
                  <CandidateDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/hiring-manager/schedule"
              element={
                <PrivateRoute>
                  <ScheduleInterview />
                </PrivateRoute>
              }
            />
            <Route
              path="/hiring-manager/onboarding"
              element={
                <PrivateRoute>
                  <Onboarding />
                </PrivateRoute>
              }
            />
            <Route
              path="/hiring-manager/reports"
              element={
                <PrivateRoute>
                  <HiringReports />
                </PrivateRoute>
              }
            />

            {/* ==================== Default Redirect ==================== */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: "center", marginTop: "120px" }}>
                  <h2 style={{ fontSize: "2rem", color: "#333" }}>⚠️ 404 - Page Not Found</h2>
                  <p style={{ marginBottom: "20px", color: "#666" }}>
                    The page you are looking for doesn’t exist.
                  </p>
                  <Link
                    to="/"
                    style={{ color: "#007bff", textDecoration: "none", fontWeight: "600" }}
                  >
                    ⬅ Go back to Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;