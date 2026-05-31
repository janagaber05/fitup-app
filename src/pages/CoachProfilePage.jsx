import { Link, useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { getCoachById } from "../data/gymCoaches";
import "./CoachProfilePage.css";

function StarRow({ rating }) {
  return (
    <div className="coach-profile-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="coach-profile-star" aria-hidden="true">
          <path
            d="M12 2.5l2.8 5.7 6.3.9-4.5 4.4 1.1 6.3L12 17.9l-5.7 3 1.1-6.3-4.5-4.4 6.3-.9z"
            fill={i <= Math.round(rating) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

function CoachProfilePage() {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const coach = getCoachById(coachId);

  if (!coach) {
    return (
      <main className="coach-profile-page">
        <div className="coach-profile-scroll">
          <header className="coach-profile-header">
            <button type="button" className="coach-profile-back" onClick={() => navigate(-1)} aria-label="Back">
              ←
            </button>
            <h1>Coach Not Found</h1>
          </header>
          <p className="coach-profile-missing">This coach profile is unavailable.</p>
          <Link to="/my-gym" className="coach-profile-book-btn">
            Back to My Gym
          </Link>
        </div>
        <BottomNav activeTab="my-gym" />
      </main>
    );
  }

  return (
    <main className="coach-profile-page">
      <div className="coach-profile-scroll">
        <header className="coach-profile-hero">
          <img className="coach-profile-hero-img" src={coach.image} alt="" />
          <div className="coach-profile-hero-scrim" />
          <button type="button" className="coach-profile-back" onClick={() => navigate(-1)} aria-label="Back">
            ←
          </button>
          <div className="coach-profile-hero-content">
            <img className="coach-profile-avatar" src={coach.image} alt="" />
            <h1 className="coach-profile-name">{coach.name}</h1>
            <p className="coach-profile-specialty">{coach.specialty}</p>
            <div className="coach-profile-rating-row">
              <StarRow rating={coach.rating} />
              <span>{coach.rating.toFixed(1)}</span>
              <span className="coach-profile-reviews">({coach.reviewCount} reviews)</span>
            </div>
          </div>
        </header>

        <section className="coach-profile-section">
          <h2>About</h2>
          <p className="coach-profile-bio">{coach.bio}</p>
        </section>

        <section className="coach-profile-section">
          <h2>Details</h2>
          <div className="coach-profile-card">
            <div className="coach-profile-row">
              <span>Experience</span>
              <strong>{coach.experience}</strong>
            </div>
            <div className="coach-profile-row">
              <span>Private Session</span>
              <strong>${coach.price}/session</strong>
            </div>
            <div className="coach-profile-row">
              <span>Languages</span>
              <strong>{coach.languages.join(", ")}</strong>
            </div>
          </div>
        </section>

        <section className="coach-profile-section">
          <h2>Certifications</h2>
          <ul className="coach-profile-tags">
            {coach.certifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="coach-profile-section coach-profile-section-last">
          <h2>Classes & Sessions</h2>
          <ul className="coach-profile-classes">
            {coach.classes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link to="/book" state={{ mainTab: "private" }} className="coach-profile-book-btn">
            Book a Session
          </Link>
        </section>
      </div>
      <BottomNav activeTab="my-gym" />
    </main>
  );
}

export default CoachProfilePage;
