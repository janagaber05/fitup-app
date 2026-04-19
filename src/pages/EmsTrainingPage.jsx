import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./EmsTrainingPage.css";

const HERO_IMG =
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=75";

const WHY_FEATURES = [
  {
    id: "efficient",
    title: "Efficient Workouts",
    body: "20 minutes = 90 minutes traditional training.",
    tone: "orange",
    icon: "bolt",
  },
  {
    id: "time",
    title: "Time-Saving",
    body: "Maximum results in minimal time.",
    tone: "blue",
    icon: "clock",
  },
  {
    id: "muscle",
    title: "Muscle Building",
    body: "Activate up to 90% of muscle fibers.",
    tone: "gold",
    icon: "medal",
  },
  {
    id: "impact",
    title: "Low Impact",
    body: "Joint-friendly, suitable for all fitness levels.",
    tone: "green",
    icon: "check",
  },
];

const PACKAGE_FEATURES = [
  "4 Sessions/Month",
  "Basic Programs",
  "20min Sessions",
  "Progress Tracking",
];

const UPCOMING = [
  { id: "1", title: "Full Body", when: "Mar 15, 2026 • 10:00 AM", coach: "Sarah Johnson" },
  { id: "2", title: "Full Body", when: "Mar 17, 2026 • 6:00 PM", coach: "Sarah Johnson" },
  { id: "3", title: "Full Body", when: "Mar 20, 2026 • 9:30 AM", coach: "Marcus Cole" },
];

function WhyIcon({ type }) {
  if (type === "bolt") {
    return (
      <svg viewBox="0 0 24 24" className="ems-why-icon-svg" aria-hidden="true">
        <path
          d="M13 2L5 14h6l-1 8 9-12h-6l1-8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "clock") {
    return (
      <svg viewBox="0 0 24 24" className="ems-why-icon-svg" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v6l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "medal") {
    return (
      <svg viewBox="0 0 24 24" className="ems-why-icon-svg" aria-hidden="true">
        <path
          d="M12 2l2.6 5.2 5.7.8-4.1 4 1 5.7-5.2-2.7-5.2 2.7 1-5.7-4.1-4 5.7-.8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="ems-why-icon-svg" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8.3 12.4l2.5 2.4 4.9-4.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmsTrainingPage() {
  return (
    <main className="ems-page">
      <div className="ems-scroll">
        <header className="ems-hero">
          <img className="ems-hero-img" src={HERO_IMG} alt="" />
          <div className="ems-hero-scrim" />
          <div className="ems-topbar">
            <Link to="/book" className="ems-back" aria-label="Back">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path
                  d="M15 18l-6-6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <p className="ems-hero-nav-title">EMS Training</p>
          </div>
          <div className="ems-hero-content">
            <span className="ems-hero-pill">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                  d="M13 2L5 14h6l-1 8 9-12h-6l1-8z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              EMS Technology
            </span>
            <h1 className="ems-hero-headline">Electro Muscle Stimulation</h1>
            <p className="ems-hero-lede">
              Transform your body in just 20 minutes. EMS safely activates up to 90% of muscle fibers at
              once — deeper than typical gym training with less strain on joints.
            </p>
            <button type="button" className="ems-hero-link">
              <svg viewBox="0 0 24 24" className="ems-info-icon" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 16v-5M12 8h.01" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              How does EMS work?
            </button>
          </div>
        </header>

        <section className="ems-section">
          <h2 className="ems-section-title">Why EMS Training?</h2>
          <div className="ems-why-grid">
            {WHY_FEATURES.map((f) => (
              <article key={f.id} className={`ems-why-card ems-why-${f.tone}`}>
                <span className="ems-why-icon-box">
                  <WhyIcon type={f.icon} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ems-section">
          <h2 className="ems-section-title">Choose Your Package</h2>
          <div className="ems-packages">
            <article className="ems-package-card">
              <div className="ems-package-top">
                <h3 className="ems-package-name">EMS Starter</h3>
                <div className="ems-package-price">
                  <span className="ems-price-num">$199</span>
                  <span className="ems-price-unit">/month</span>
                </div>
              </div>
              <p className="ems-package-sub">4 Sessions per Month</p>
              <ul className="ems-package-list">
                {PACKAGE_FEATURES.map((line) => (
                  <li key={line}>
                    <svg viewBox="0 0 24 24" className="ems-check-icon" aria-hidden="true">
                      <path
                        d="M8.3 12.4l2.5 2.4 4.9-4.9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {line}
                  </li>
                ))}
              </ul>
              <button type="button" className="ems-package-btn">
                Select Package
              </button>
            </article>

            <article className="ems-package-card">
              <div className="ems-package-top">
                <div className="ems-package-title-row">
                  <h3 className="ems-package-name">EMS Starter</h3>
                  <span className="ems-popular-badge">Popular</span>
                </div>
                <div className="ems-package-price">
                  <span className="ems-price-num">$199</span>
                  <span className="ems-price-unit">/month</span>
                </div>
              </div>
              <p className="ems-package-sub">4 Sessions per Month</p>
              <ul className="ems-package-list">
                {PACKAGE_FEATURES.map((line) => (
                  <li key={`${line}-b`}>
                    <svg viewBox="0 0 24 24" className="ems-check-icon" aria-hidden="true">
                      <path
                        d="M8.3 12.4l2.5 2.4 4.9-4.9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {line}
                  </li>
                ))}
              </ul>
              <button type="button" className="ems-package-btn">
                Select Package
              </button>
            </article>
          </div>
        </section>

        <section className="ems-section">
          <div className="ems-upcoming-head">
            <h2 className="ems-section-title ems-section-title-inline">Upcoming Sessions</h2>
            <button type="button" className="ems-view-all">
              View All &gt;
            </button>
          </div>
          <ul className="ems-upcoming-list">
            {UPCOMING.map((row) => (
              <li key={row.id}>
                <button type="button" className="ems-upcoming-row">
                  <span className="ems-upcoming-icon">
                    <WhyIcon type="bolt" />
                  </span>
                  <span className="ems-upcoming-main">
                    <span className="ems-upcoming-class">{row.title}</span>
                    <span className="ems-upcoming-meta">{row.when}</span>
                    <span className="ems-upcoming-coach">
                      <svg viewBox="0 0 24 24" className="ems-coach-mini" aria-hidden="true">
                        <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path
                          d="M5 19c1.5-4 5.5-6 7-6s5.5 2 7 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      {row.coach}
                    </span>
                  </span>
                  <span className="ems-upcoming-chevron" aria-hidden="true">
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="ems-cta">
          <h2 className="ems-cta-title">Ready to Transform?</h2>
          <p className="ems-cta-copy">
            Book your first EMS session and feel the difference in one visit — guided by certified
            trainers.
          </p>
          <button type="button" className="ems-cta-btn">
            <svg viewBox="0 0 24 24" className="ems-cta-cal" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Book First Session
          </button>
        </section>
      </div>
      <BottomNav activeTab="book" />
    </main>
  );
}

export default EmsTrainingPage;
