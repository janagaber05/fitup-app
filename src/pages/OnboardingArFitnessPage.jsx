import OnboardingCard from "../components/OnboardingCard";
import "./OnboardingArFitnessPage.css";

function OnboardingArFitnessPage() {
  return (
    <main className="onboarding-ar-page">
      <section className="onboarding-ar-hero">
        <OnboardingCard
          title="AR Fitness Experience"
          subtitle="Use augmented reality to perfect your form and visualize exercises."
          currentStep={3}
          totalSteps={3}
          nextPath="/gyms"
          buttonText="Get Started"
        />
      </section>
    </main>
  );
}

export default OnboardingArFitnessPage;
