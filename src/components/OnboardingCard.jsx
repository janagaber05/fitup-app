import { Link } from "react-router-dom";
import PaginationDots from "./PaginationDots";
import "./OnboardingCard.css";

function OnboardingCard({
  title,
  subtitle,
  currentStep,
  totalSteps,
  nextPath,
  buttonText = "Next",
}) {
  return (
    <div className="onboarding-card">
      <PaginationDots currentStep={currentStep} totalSteps={totalSteps} />
      <h1 className="onboarding-title">{title}</h1>
      <p className="onboarding-subtitle">{subtitle}</p>
      <Link className="onboarding-button" to={nextPath}>
        {buttonText} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export default OnboardingCard;
