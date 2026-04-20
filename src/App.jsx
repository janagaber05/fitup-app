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

function App() {
  return (
    <BrowserRouter>
      <div className="app-phone-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
