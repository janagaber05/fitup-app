import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./MyGymPage.css";

const HERO_IMG =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80";

function FacilityWifi() {
  return (
    <svg viewBox="0 0 24 24" className="facility-icon" aria-hidden="true">
      <path
        d="M5 12.55a11 11 0 0 1 14.08 0M8.53 16.11a6.95 6.95 0 0 1 6.94 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="20" r="1.35" fill="currentColor" />
    </svg>
  );
}

function FacilitySauna() {
  return (
    <svg viewBox="0 0 24 24" className="facility-icon" aria-hidden="true">
      <path
        d="M7 5.5Q5 10 6.5 14Q7.5 16 8.5 14Q10 10 8 5.5Q7.5 4 7 5.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4Q10 10 11.5 15.2Q12 17 12.5 15.2Q14 10 13 4Q12.5 3 12 4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 5.5Q19 10 17.5 14Q16.5 16 15.5 14Q14 10 16 5.5Q16.5 4 17 5.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacilityWeights() {
  return (
    <svg viewBox="0 0 24 24" className="facility-icon" aria-hidden="true">
      <g transform="translate(12, 12) rotate(-42) translate(-12, -12)">
        <rect x="2.5" y="9" width="5" height="6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="16.5" y="9" width="5" height="6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M7.5 12h9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function FacilityParking() {
  return (
    <svg viewBox="0 0 24 24" className="facility-icon" aria-hidden="true">
      <path
        d="M4 16.5h2.3l1.2-3h8.9l1.3 3H20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.8 13.5h12.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.2 16.5v1.8h2.6v-1.8M15.2 16.5v1.8h2.6v-1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="16.5" r="1.15" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.5" cy="16.5" r="1.15" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function FacilityJuice() {
  return (
    <svg viewBox="0 0 24 24" className="facility-icon" aria-hidden="true">
      <path
        d="M8 6.5Q8 4.5 7 2.5M12 6.5Q12 3.5 11 1.5M16 6.5Q16 4.5 17 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M7 9V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 9l1 10a2 2 0 0 0 2 1.5h4a2 2 0 0 0 2-1.5l1-10H7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M17 11h1.2a2.8 2.8 0 0 1 0 5.6H17"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FacilityLockers() {
  return (
    <svg viewBox="0 0 24 24" className="facility-icon" aria-hidden="true">
      <path
        d="M8.5 11V7.5a3.5 3.5 0 0 1 7 0V11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="6"
        y="11"
        width="12"
        height="10"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="16" r="1.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

const FACILITIES = [
  { id: "wifi", label: "Free Wi-Fi", icon: FacilityWifi },
  { id: "sauna", label: "Sauna", icon: FacilitySauna },
  { id: "weights", label: "Free Weights", icon: FacilityWeights },
  { id: "parking", label: "Parking", icon: FacilityParking },
  { id: "juice", label: "Juice Bar", icon: FacilityJuice },
  { id: "lockers", label: "Lockers", icon: FacilityLockers },
];

function StarRow() {
  return (
    <div className="rating-stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="rating-star">
          <path
            d="M12 2.5l2.8 5.7 6.3.9-4.5 4.4 1.1 6.3L12 17.9l-5.7 3 1.1-6.3-4.5-4.4 6.3-.9z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}

function MyGymPage() {
  return (
    <main className="my-gym-page">
      <div className="my-gym-scroll">
        <header className="gym-hero">
          <img className="gym-hero-img" src={HERO_IMG} alt="" />
          <div className="gym-hero-scrim" />
          <Link to="/gyms" className="gym-back" aria-label="Back to home">
            <svg className="gym-back-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div className="gym-hero-bottom">
            <div className="gym-hero-left">
              <span className="gym-open-badge">Open Now</span>
              <h1 className="gym-title">FITUP Premier</h1>
              <button type="button" className="gym-location-row">
                <svg viewBox="0 0 24 24" className="gym-pin" aria-hidden="true">
                  <path
                    d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="11" r="2.5" fill="currentColor" />
                </svg>
                <span>Downtown Branch</span>
                <svg viewBox="0 0 24 24" className="gym-chevron" aria-hidden="true">
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="gym-rating-box">
              <span className="gym-rating-num">4.8</span>
              <StarRow />
            </div>
          </div>
        </header>

        <div className="my-gym-body">
          <section className="gym-section">
            <h2 className="gym-section-title">About</h2>
            <p className="gym-section-text">
              Three floors of premium equipment, a rooftop yoga studio, and full recovery
              amenities including sauna, cold plunge, and massage suites — built for serious
              training and serious recovery.
            </p>
          </section>

          <section className="gym-section">
            <h2 className="gym-section-title">Facilities</h2>
            <div className="facilities-grid">
              {FACILITIES.map(({ id, label, icon: Icon }) => (
                <article key={id} className="facility-card">
                  <Icon />
                  <span className="facility-label">{label}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="gym-section">
            <h2 className="gym-section-title">Special Services</h2>
            <Link to="/ems-training" className="ems-card">
              <span className="ems-icon-wrap">
                <svg viewBox="0 0 24 24" className="ems-bolt" aria-hidden="true">
                  <path
                    d="M13 2L5 14h6l-1 8 9-12h-6l1-8z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="ems-copy">
                <strong>EMS Training</strong>
                <span>20 mins = 90 mins workout</span>
              </span>
              <svg viewBox="0 0 24 24" className="ems-chevron" aria-hidden="true">
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          </section>

          <section className="gym-section">
            <h2 className="gym-section-title">Opening Hours</h2>
            <div className="hours-card">
              <div className="hours-row">
                <span>Monday – Friday</span>
                <strong>5:00 AM – 11:00 PM</strong>
              </div>
              <div className="hours-row">
                <span>Saturday</span>
                <strong>6:00 AM – 10:00 PM</strong>
              </div>
              <div className="hours-row">
                <span>Sunday</span>
                <strong>7:00 AM – 9:00 PM</strong>
              </div>
            </div>
          </section>

          <section className="gym-section gym-section-last">
            <h2 className="gym-section-title">Contact</h2>
            <div className="contact-row">
              <a className="contact-btn" href="tel:+15551234567">
                <svg viewBox="0 0 24 24" className="contact-btn-icon" aria-hidden="true">
                  <path
                    d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.11a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.9z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
                Call Us
              </a>
              <a
                className="contact-btn"
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" className="contact-btn-icon" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Website
              </a>
            </div>
          </section>
        </div>
      </div>
      <BottomNav activeTab="my-gym" />
    </main>
  );
}

export default MyGymPage;
