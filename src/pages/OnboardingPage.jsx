import OnboardingCard from "../components/OnboardingCard";
import "./OnboardingPage.css";

function OnboardingPage() {
  return (
    <main className="onboarding-page">
      <section className="onboarding-hero">
        <OnboardingCard
          title="Find Your Perfect Gym"
          subtitle="Discover top-tier facilities near you with real-time capacity tracking."
          currentStep={1}
          totalSteps={3}
          nextPath="/onboarding-experts"
        />
      </section>
    </main>
  );
}

export default OnboardingPage;
