import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

const EMS_PACKAGE_KEY = "fitup-ems-active-package";
const EMS_BOOKINGS_KEY = "fitup-ems-package-bookings";

const PACKAGE_OPTIONS = [
  {
    id: "starter",
    name: "EMS Starter",
    price: 199,
    period: "/month",
    sessionsPerMonth: 4,
    features: ["4 Sessions/Month", "Basic Programs", "20min Sessions", "Progress Tracking"],
    coach: { name: "Sarah Johnson", specialty: "EMS Fundamentals", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
    popular: false,
  },
  {
    id: "pro",
    name: "EMS Pro",
    price: 299,
    period: "/month",
    sessionsPerMonth: 8,
    features: ["8 Sessions/Month", "Custom Programs", "Nutrition Guide", "Progress Tracking"],
    coach: { name: "Nora Blake", specialty: "Strength & Fat Loss", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
    popular: true,
  },
];

const UPCOMING = [
  { id: "1", title: "Full Body", when: "Mar 15, 2026 • 10:00 AM", coach: "Sarah Johnson" },
  { id: "2", title: "Full Body", when: "Mar 17, 2026 • 6:00 PM", coach: "Sarah Johnson" },
  { id: "3", title: "Full Body", when: "Mar 20, 2026 • 9:30 AM", coach: "Nora Blake" },
];

const PACKAGE_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PACKAGE_TIMES = ["09:00 AM", "11:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"];

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
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [activePackage, setActivePackage] = useState(() => {
    try {
      const raw = localStorage.getItem(EMS_PACKAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [packageBookings, setPackageBookings] = useState(() => {
    try {
      const raw = localStorage.getItem(EMS_BOOKINGS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [slotDay, setSlotDay] = useState(PACKAGE_DAYS[0]);
  const [slotTime, setSlotTime] = useState(PACKAGE_TIMES[0]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(EMS_PACKAGE_KEY, JSON.stringify(activePackage));
  }, [activePackage]);

  useEffect(() => {
    localStorage.setItem(EMS_BOOKINGS_KEY, JSON.stringify(packageBookings));
  }, [packageBookings]);

  useEffect(() => {
    if (!selectedPkg) return undefined;
    const prev = document.body.style.overflow;
    const onKey = (e) => e.key === "Escape" && setSelectedPkg(null);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [selectedPkg]);

  const packageProgress = useMemo(() => {
    if (!activePackage) return 0;
    return Math.min(100, Math.round((activePackage.usedSessions / activePackage.sessionsPerMonth) * 100));
  }, [activePackage]);

  const mergedUpcoming = packageBookings.length > 0 ? packageBookings : UPCOMING;

  const activatePackage = (pkg) => {
    const target = pkg || selectedPkg;
    if (!target) return;
    setActivePackage({
      id: target.id,
      name: target.name,
      sessionsPerMonth: target.sessionsPerMonth,
      usedSessions: 0,
      coach: target.coach,
      price: target.price,
      startedAt: new Date().toISOString(),
    });
    setSelectedPkg(null);
    setNotice(`${target.name} activated. Coach ${target.coach.name} assigned.`);
  };

  useEffect(() => {
    if (!location.state?.emsPaymentNotice) return;
    if (location.state?.emsPackageActivated) {
      activatePackage(location.state.emsPackageActivated);
    } else {
      setNotice(location.state.emsPaymentNotice);
    }
    navigate("/ems-training", { replace: true });
  }, [location.state, navigate]);

  const goToPackagePayment = () => {
    if (!selectedPkg) return;
    navigate("/membership/payment", {
      state: {
        paymentMode: "ems-package",
        emsPackage: selectedPkg,
      },
    });
  };

  const bookFromPackage = () => {
    if (!activePackage) {
      setNotice("Select a package first.");
      return;
    }
    if (activePackage.usedSessions >= activePackage.sessionsPerMonth) {
      setNotice("All package sessions are used. Upgrade or renew to continue.");
      return;
    }
    const entry = {
      id: `pkg-${Date.now()}`,
      title: "EMS Package Session",
      when: `${slotDay} • ${slotTime}`,
      coach: activePackage.coach.name,
    };
    setPackageBookings((prev) => [entry, ...prev]);
    setActivePackage((prev) => ({ ...prev, usedSessions: prev.usedSessions + 1 }));
    setNotice(`Session booked for ${slotDay} at ${slotTime}.`);
  };

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
            {PACKAGE_OPTIONS.map((pkg) => (
              <article key={pkg.id} className="ems-package-card">
                <div className="ems-package-top">
                  <div className="ems-package-title-row">
                    <h3 className="ems-package-name">{pkg.name}</h3>
                    {pkg.popular ? <span className="ems-popular-badge">Popular</span> : null}
                  </div>
                  <div className="ems-package-price">
                    <span className="ems-price-num">${pkg.price}</span>
                    <span className="ems-price-unit">{pkg.period}</span>
                  </div>
                </div>
                <p className="ems-package-sub">{pkg.sessionsPerMonth} Sessions per Month</p>
                <ul className="ems-package-list">
                  {pkg.features.map((line) => (
                    <li key={`${pkg.id}-${line}`}>
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
                <button type="button" className="ems-package-btn" onClick={() => setSelectedPkg(pkg)}>
                  Select Package
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="ems-section">
          <div className="ems-upcoming-head">
            <h2 className="ems-section-title ems-section-title-inline">My Bookings</h2>
            <button type="button" className="ems-view-all">
              View All &gt;
            </button>
          </div>
          {activePackage ? (
            <article className="ems-package-detail-card">
              <div className="ems-package-detail-top">
                <div>
                  <p className="ems-package-detail-kicker">My Package Details</p>
                  <h3 className="ems-package-detail-title">{activePackage.name}</h3>
                  <p className="ems-package-detail-meta">${activePackage.price}/month · {activePackage.sessionsPerMonth} sessions</p>
                </div>
                <div className="ems-assigned-coach">
                  <img src={activePackage.coach.avatar} alt="" className="ems-assigned-coach-avatar" />
                  <div>
                    <p className="ems-assigned-coach-name">{activePackage.coach.name}</p>
                    <p className="ems-assigned-coach-role">{activePackage.coach.specialty}</p>
                  </div>
                </div>
              </div>
              <div className="ems-track-wrap">
                <p className="ems-track-label">Session Tracking: {activePackage.usedSessions}/{activePackage.sessionsPerMonth} used</p>
                <div className="ems-track-bar"><span style={{ width: `${packageProgress}%` }} /></div>
              </div>
              <div className="ems-package-book-row">
                <select value={slotDay} onChange={(e) => setSlotDay(e.target.value)} className="ems-slot-select">
                  {PACKAGE_DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={slotTime} onChange={(e) => setSlotTime(e.target.value)} className="ems-slot-select">
                  {PACKAGE_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <button type="button" className="ems-book-from-package" onClick={bookFromPackage}>
                  Book Slot
                </button>
              </div>
            </article>
          ) : (
            <p className="ems-empty-note">No package active yet. Select a package to see details, assigned coach, and booking controls.</p>
          )}
          <ul className="ems-upcoming-list">
            {mergedUpcoming.map((row) => (
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
          {notice ? <p className="ems-notice">{notice}</p> : null}
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
      {selectedPkg ? (
        <div className="ems-package-modal-wrap" role="presentation">
          <button type="button" className="ems-package-modal-backdrop" aria-label="Close package details" onClick={() => setSelectedPkg(null)} />
          <div className="ems-package-modal" role="dialog" aria-modal="true" aria-label="Package details">
            <header className="ems-package-modal-head">
              <h2>{selectedPkg.name} Details</h2>
              <button type="button" className="ems-package-modal-close" onClick={() => setSelectedPkg(null)} aria-label="Close">✕</button>
            </header>
            <div className="ems-package-modal-body">
              <p className="ems-package-modal-sub">${selectedPkg.price}{selectedPkg.period} · {selectedPkg.sessionsPerMonth} sessions</p>
              <div className="ems-assigned-coach ems-assigned-coach--modal">
                <img src={selectedPkg.coach.avatar} alt="" className="ems-assigned-coach-avatar" />
                <div>
                  <p className="ems-assigned-coach-name">{selectedPkg.coach.name}</p>
                  <p className="ems-assigned-coach-role">{selectedPkg.coach.specialty}</p>
                </div>
              </div>
              <ul className="ems-package-list">
                {selectedPkg.features.map((line) => (
                  <li key={`modal-${line}`}>
                    <svg viewBox="0 0 24 24" className="ems-check-icon" aria-hidden="true">
                      <path d="M8.3 12.4l2.5 2.4 4.9-4.9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {line}
                  </li>
                ))}
              </ul>
              <p className="ems-package-modal-copy">
                Assigned coach will guide your progress and adapt your weekly sessions based on your goals and recovery.
              </p>
            </div>
            <div className="ems-package-modal-actions">
              <button type="button" className="ems-package-cancel" onClick={() => setSelectedPkg(null)}>Cancel</button>
              <button type="button" className="ems-package-confirm" onClick={goToPackagePayment}>Buy & Activate</button>
            </div>
          </div>
        </div>
      ) : null}
      <BottomNav activeTab="book" />
    </main>
  );
}

export default EmsTrainingPage;
