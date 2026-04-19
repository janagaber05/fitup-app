import "./PaginationDots.css";

function PaginationDots({ currentStep, totalSteps }) {
  const dots = Array.from({ length: totalSteps }, (_, index) => {
    const step = index + 1;
    const active = step === currentStep;

    return <span key={step} className={`dot ${active ? "dot-active" : ""}`} />;
  });

  return <div className="dots-row">{dots}</div>;
}

export default PaginationDots;
