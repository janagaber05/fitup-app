import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import PhotoLightbox from "../components/PhotoLightbox";
import { GYM_COACHES, getCoachByName } from "../data/gymCoaches";
import { BRANCH_HERO_IMAGE, GYM_PHOTOS } from "../data/gymPhotos";
import "./BranchDetailsPage.css";

const BRANCH_IS_LADIES_ONLY = true;

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

const COACHES = GYM_COACHES.filter((coach) =>
  ["Sarah Connor", "Layla Hassan", "Maya Patel"].includes(coach.name),
);

function BranchDetailsPage() {
  const [photoIndex, setPhotoIndex] = useState(-1);

  const openPhoto = useCallback((index) => {
    setPhotoIndex(index);
  }, []);

  const closePhoto = useCallback(() => {
    setPhotoIndex(-1);
  }, []);

  const changePhoto = useCallback((nextIndex) => {
    if (nextIndex < 0 || nextIndex >= GYM_PHOTOS.length + 1) return;
    setPhotoIndex(nextIndex);
  }, []);

  const branchPhotos = [{ id: "hero", src: BRANCH_HERO_IMAGE, caption: "FitUp Downtown Branch" }, ...GYM_PHOTOS];

  return (
    <main className="branch-page">
      <div className="branch-scroll">
        <header className="branch-hero">
          <button type="button" className="branch-hero-photo-btn" onClick={() => openPhoto(0)} aria-label="Open branch photos">
            <img src={BRANCH_HERO_IMAGE} alt="" className="branch-hero-img" />
          </button>
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
            {GYM_PHOTOS.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                className="branch-photo-btn"
                onClick={() => openPhoto(idx + 1)}
                aria-label={`Open photo: ${photo.caption}`}
              >
                <img className="branch-photo" src={photo.src} alt="" loading="lazy" />
              </button>
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
            {CLASSES.map((item) => {
              const coachProfile = getCoachByName(item.coach);
              return (
                <article key={item.name} className="branch-list-item">
                  <div>
                    <p className="branch-list-title">{item.name}</p>
                    <p className="branch-list-sub">
                      Coach:{" "}
                      {coachProfile ? (
                        <Link to={`/coach/${coachProfile.id}`} className="branch-coach-link">
                          {item.coach}
                        </Link>
                      ) : (
                        item.coach
                      )}
                    </p>
                  </div>
                  <span className="branch-time">{item.time}</span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="branch-section">
          <h2>Branch Coaches</h2>
          <div className="branch-list">
            {COACHES.map((coach) => (
              <Link key={coach.id} to={`/coach/${coach.id}`} className="branch-list-item branch-coach-item">
                <img className="branch-coach-avatar" src={coach.image} alt="" />
                <div className="branch-coach-copy">
                  <p className="branch-list-title">{coach.name}</p>
                  <p className="branch-list-sub">{coach.specialty}</p>
                  <p className="branch-coach-meta">{coach.rating.toFixed(1)} ★ · View Profile</p>
                </div>
                <span className="branch-coach-chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <PhotoLightbox photos={branchPhotos} index={photoIndex} onClose={closePhoto} onChange={changePhoto} />
      <BottomNav activeTab="home" />
    </main>
  );
}

export default BranchDetailsPage;
