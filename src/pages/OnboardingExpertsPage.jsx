import OnboardingCard from "../components/OnboardingCard";
import "./OnboardingExpertsPage.css";

function OnboardingExpertsPage() {
  return (
    <main className="onboarding-experts-page">
      <section className="onboarding-experts-hero">
        <OnboardingCard
          title="Train With Experts"
          subtitle="Book sessions with certified personal trainers tailored to your goals."
          currentStep={2}
          totalSteps={3}
          nextPath="/onboarding-ar-fitness"
        />
      </section>
    </main>
  );
}

export default OnboardingExpertsPage;
