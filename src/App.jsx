import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import OnboardingExpertsPage from "./pages/OnboardingExpertsPage";
import OnboardingArFitnessPage from "./pages/OnboardingArFitnessPage";
import GymsPage from "./pages/GymsPage";
import MembershipPage from "./pages/MembershipPage";
import ProfilePage from "./pages/ProfilePage";
import MyGymPage from "./pages/MyGymPage";
import NotificationsPage from "./pages/NotificationsPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ProgressTrackingPage from "./pages/ProgressTrackingPage";
import BookSessionPage from "./pages/BookSessionPage";
import EmsTrainingPage from "./pages/EmsTrainingPage";
import "./App.css";

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
          <Route path="/gyms" element={<GymsPage />} />
          <Route path="/progress" element={<ProgressTrackingPage />} />
          <Route path="/my-gym" element={<MyGymPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/announcements"
            element={<Navigate to="/updates" replace />}
          />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/updates" element={<AnnouncementsPage />} />
          <Route path="/book" element={<BookSessionPage />} />
          <Route path="/ems-training" element={<EmsTrainingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
