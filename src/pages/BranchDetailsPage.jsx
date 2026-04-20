import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./BranchDetailsPage.css";

const BRANCH_IMAGE =
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80";
const BRANCH_IS_LADIES_ONLY = true;
const BRANCH_PHOTOS = [
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?auto=format&fit=crop&w=900&q=80",
];

const AMENITIES = [
  "Free Weights Zone",
  "Cardio Theater",
  "Women-Only Area",
  "Sauna & Steam",
  "Locker Rooms",
  "Free Parking",
];

const CLASSES = [
  { name: "HIIT Burn", time: "7:00 AM", coach: "Sarah Connor" },
  { name: "Power Yoga", time: "9:30 AM", coach: "Maya Patel" },
  { name: "Strength 101", time: "6:00 PM", coach: "Layla Hassan" },
];

const COACHES = [
  { name: "Sarah Connor", specialty: "Fat Loss & Conditioning" },
  { name: "Layla Hassan", specialty: "Strength & Athletic Performance" },
  { name: "Maya Patel", specialty: "Mobility & Recovery" },
];

function BranchDetailsPage() {
  return (
    <main className="branch-page">
      <div className="branch-scroll">
        <header className="branch-hero">
          <img src={BRANCH_IMAGE} alt="" className="branch-hero-img" />
          <div className="branch-hero-scrim" />
          <Link to="/gyms" className="branch-back" aria-label="Back to home">
            ←
          </Link>
          <div className="branch-hero-content">
            <span className="branch-badge">Open Now</span>
            <h1>FitUp Downtown Branch</h1>
            <p>4.8 ★ (1,248 reviews)</p>
            {BRANCH_IS_LADIES_ONLY ? <span className="branch-ladies-badge">Ladies Only</span> : null}
          </div>
        </header>

        <section className="branch-section">
          <h2>Branch Information</h2>
          <div className="branch-card">
            <div className="branch-row"><span>Address</span><strong>12 Nile Street, Downtown, Cairo</strong></div>
            <div className="branch-row"><span>Phone</span><strong>+20 100 123 4567</strong></div>
            <div className="branch-row"><span>Email</span><strong>downtown@fitup.app</strong></div>
            <div className="branch-row"><span>Branch Type</span><strong>{BRANCH_IS_LADIES_ONLY ? "Ladies Only" : "Mixed"}</strong></div>
          </div>
        </section>

        <section className="branch-section">
          <h2>Branch Photos</h2>
          <div className="branch-photos-row">
            {BRANCH_PHOTOS.map((src, idx) => (
              <img key={idx} className="branch-photo" src={src} alt={`Branch view ${idx + 1}`} />
            ))}
          </div>
        </section>

        <section className="branch-section">
          <h2>Opening Hours</h2>
          <div className="branch-card">
            <div className="branch-row"><span>Mon - Fri</span><strong>5:00 AM - 11:00 PM</strong></div>
            <div className="branch-row"><span>Saturday</span><strong>6:00 AM - 10:00 PM</strong></div>
            <div className="branch-row"><span>Sunday</span><strong>7:00 AM - 9:00 PM</strong></div>
          </div>
        </section>

        <section className="branch-section">
          <h2>Amenities</h2>
          <div className="branch-chip-grid">
            {AMENITIES.map((item) => (
              <span key={item} className="branch-chip">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="branch-section">
          <h2>Today Classes</h2>
          <div className="branch-list">
            {CLASSES.map((item) => (
              <article key={item.name} className="branch-list-item">
                <div>
                  <p className="branch-list-title">{item.name}</p>
                  <p className="branch-list-sub">Coach: {item.coach}</p>
                </div>
                <span className="branch-time">{item.time}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="branch-section">
          <h2>Branch Coaches</h2>
          <div className="branch-list">
            {COACHES.map((coach) => (
              <article key={coach.name} className="branch-list-item">
                <div>
                  <p className="branch-list-title">{coach.name}</p>
                  <p className="branch-list-sub">{coach.specialty}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <BottomNav activeTab="home" />
    </main>
  );
}

export default BranchDetailsPage;
