import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./GymsPage.css";

function GymsPage() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-content">
        <section className="membership-section">
          <header className="top-bar">
            <div className="profile-wrap">
              <div className="avatar-ring">
                <img
                  className="avatar"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Alex Morgan"
                />
              </div>
              <div>
                <h1 className="profile-name">Alex Morgan</h1>
                <p className="profile-subtitle">GOOD MORNING</p>
              </div>
            </div>
            <button
              className="icon-btn"
              type="button"
              aria-label="Notifications"
            >
              <svg
                className="bell-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M18 16H6l1.4-1.7c.4-.5.6-1.1.6-1.7V10a4 4 0 1 1 8 0v2.6c0 .6.2 1.2.6 1.7L18 16Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 18.6a2 2 0 0 0 4 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="17.5" cy="7.5" r="2.6" fill="#ff6f50" />
              </svg>
            </button>
          </header>

          <section className="plan-card">
            <div className="plan-head">
              <div>
                <p className="muted-label">Current Plan</p>
                <h2 className="plan-title">Premium All-Access</h2>
              </div>
              <span className="status-pill">Active</span>
            </div>
            <div className="usage-row">
              <span>Expires in 15 days</span>
              <span>85% Used</span>
            </div>
            <div className="usage-track">
              <span className="usage-fill" />
            </div>
            <Link className="details-link" to="/membership">
              View Details ›
            </Link>
          </section>
        </section>

        <section className="section-head">
          <h3>Live Capacity</h3>
          <button type="button">View Branch</button>
        </section>

        <section className="capacity-card">
          <div className="branch-left">
            <div className="branch-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="mini-icon">
                <path
                  d="M3 12h4l2-5 4 10 2-5h6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="branch-name">Downtown Branch</p>
              <p className="branch-status">● Quote Quiet</p>
            </div>
          </div>
          <div className="capacity-right">
            <p className="capacity-value">45%</p>
            <p className="capacity-label">Capacity</p>
          </div>
        </section>

        <section className="quick-grid">
          <Link to="/book" className="quick-tile">
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="tile-svg">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 3v4M16 3v4M3 10h18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="tile-label">Book</span>
          </Link>
          <button type="button" className="quick-tile">
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="tile-svg">
                <path
                  d="M13 2L5 14h6l-1 8 9-12h-6l1-8z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="tile-label">Check In</span>
          </button>
          <button type="button" className="quick-tile">
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="tile-svg">
                <path
                  d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 7.5L12 12l8-4.5M12 12v9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <span className="tile-label">AR</span>
          </button>
          <Link to="/progress" className="quick-tile">
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="tile-svg">
                <path
                  d="M3 13h5l2-6 4 10 2-5h5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="tile-label">Progress</span>
          </Link>
        </section>

        <section className="section-head">
          <h3>Up Next</h3>
        </section>

        <section className="upnext-card">
          <div className="upnext-left">
            <p className="upnext-title">HIIT Advanced</p>
            <p className="upnext-subtitle">with Sarah Connor</p>
            <div className="upnext-meta">
              <span className="meta-item">
                <svg viewBox="0 0 24 24" className="meta-icon" aria-hidden="true">
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 8v5l3 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                45 min
              </span>
              <span className="meta-item">
                <svg viewBox="0 0 24 24" className="meta-icon" aria-hidden="true">
                  <path
                    d="M12 21s6-5.6 6-10a6 6 0 1 0-12 0c0 4.4 6 10 6 10Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="11" r="2.2" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                Studio B
              </span>
            </div>
          </div>
          <div className="upnext-right">
            <p className="today-label">Today</p>
            <p className="today-time">18:00</p>
          </div>
        </section>

        <section className="section-head">
          <h3>Updates</h3>
          <Link to="/updates" className="section-head-link">
            View All
          </Link>
        </section>

        <section className="updates-list">
          <Link to="/updates" className="update-item">
            <span className="dot dot-orange" />
            <p>Pool Maintenance Update</p>
            <span className="update-chevron">›</span>
          </Link>
          <Link to="/updates" className="update-item">
            <span className="dot dot-green" />
            <p>Summer Sale: 20% Off</p>
            <span className="update-chevron">›</span>
          </Link>
        </section>
      </section>

      <button type="button" className="fab" aria-label="Open quick action">
        <svg viewBox="0 0 24 24" className="fab-icon" aria-hidden="true">
          <path
            d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M4 7.5L12 12l8-4.5M12 12v9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>

      <BottomNav activeTab="home" />
    </main>
  );
}

export default GymsPage;
