import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import OnboardingExpertsPage from "./pages/OnboardingExpertsPage";
import OnboardingArFitnessPage from "./pages/OnboardingArFitnessPage";
import AuthPage from "./pages/AuthPage";
import GymsPage from "./pages/GymsPage";
import MembershipPage from "./pages/MembershipPage";
import PaymentPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";
import MyGymPage from "./pages/MyGymPage";
import BranchDetailsPage from "./pages/BranchDetailsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ProgressTrackingPage from "./pages/ProgressTrackingPage";
import BookSessionPage from "./pages/BookSessionPage";
import EmsTrainingPage from "./pages/EmsTrainingPage";
import EquipmentAR from "./components/EquipmentAR";
import "./App.css";

const SESSION_KEY = "fitup-auth-session";

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.email || !parsed.memberId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function PrivateRoute({ children }) {
  return getSession() ? children : <Navigate to="/auth" replace />;
}

function IntroEntrance() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReady(true);
    }, 2000);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (ready) return <Navigate to="/onboarding" replace />;

  return (
    <main className="app-intro-screen" role="status" aria-live="polite" aria-label="Loading FitUp">
      <div className="app-preloader-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="app-preloader-bolt">
          <path
            d="M13 2L5 14h6l-1 8 9-12h-6l1-8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="app-preloader-track-wrap" aria-hidden="true">
        <span className="app-preloader-track" />
      </div>
      <p className="app-preloader-title">FitUp</p>
      <p className="app-preloader-sub">Preparing your training experience</p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-phone-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/intro" replace />} />
          <Route path="/intro" element={<IntroEntrance />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/onboarding-experts" element={<OnboardingExpertsPage />} />
          <Route
            path="/onboarding-ar-fitness"
            element={<OnboardingArFitnessPage />}
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/gyms" element={<PrivateRoute><GymsPage /></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><ProgressTrackingPage /></PrivateRoute>} />
          <Route path="/my-gym" element={<PrivateRoute><MyGymPage /></PrivateRoute>} />
          <Route path="/branch-details" element={<PrivateRoute><BranchDetailsPage /></PrivateRoute>} />
          <Route path="/membership" element={<PrivateRoute><MembershipPage /></PrivateRoute>} />
          <Route path="/membership/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route
            path="/announcements"
            element={<Navigate to="/updates" replace />}
          />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/updates" element={<PrivateRoute><AnnouncementsPage /></PrivateRoute>} />
          <Route path="/book" element={<PrivateRoute><BookSessionPage /></PrivateRoute>} />
          <Route path="/ems-training" element={<PrivateRoute><EmsTrainingPage /></PrivateRoute>} />
          <Route path="/ar-tutorial" element={<PrivateRoute><EquipmentAR /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
