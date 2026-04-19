import { useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./ProgressTrackingPage.css";

const CATEGORY_TABS = [
  { id: "overview", label: "Overview" },
  { id: "body", label: "Body" },
  { id: "strength", label: "Strength" },
  { id: "cardio", label: "Cardio" },
];

const TIME_TABS = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

const CHART_DAYS = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PHOTO_URLS = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=200&q=70",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=200&q=70",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=200&q=70",
];

function ProgressTrackingPage() {
  const [category, setCategory] = useState("overview");
  const [timeRange, setTimeRange] = useState("week");

  return (
    <main className="progress-page">
      <div className="progress-scroll">
        <header className="progress-header">
          <Link to="/gyms" className="progress-back" aria-label="Back">
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
          <h1 className="progress-title">Progress Tracking</h1>
        </header>

        <section className="progress-next-card" aria-label="Next workout">
          <div className="progress-next-top">
            <div className="progress-next-left">
              <p className="progress-next-kicker">Next workout</p>
              <h2 className="progress-next-title">Upper Body Strength</h2>
              <div className="progress-next-meta">
                <span className="progress-next-meta-item">
                  <svg className="progress-next-meta-ico" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Tomorrow
                </span>
                <span className="progress-next-meta-item">
                  <svg className="progress-next-meta-ico" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  6:00 AM
                </span>
              </div>
            </div>
            <button type="button" className="progress-next-view">
              <svg className="progress-next-play" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M10.5 8.5L17 12l-6.5 3.5V8.5z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              View
            </button>
          </div>
          <div className="progress-next-actions">
            <button type="button" className="progress-next-action">
              <svg className="progress-next-action-ico" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="8" width="4" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="16" y="8" width="4" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Plan
            </button>
            <button type="button" className="progress-next-action">
              <svg className="progress-next-action-ico" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 4v16M6 7h2M6 10h2M6 13h2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M16 4l3 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Diet
            </button>
            <button type="button" className="progress-next-action">
              <svg className="progress-next-action-ico" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              Log
            </button>
          </div>
        </section>

        <section className="progress-stats-grid" aria-label="Summary stats">
          <div className="progress-stat-card progress-stat-card--calories">
            <span className="progress-stat-badge">+12%</span>
            <div className="progress-stat-icon progress-stat-icon--calories" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="progress-stat-icon-svg">
                <path
                  d="M12 3s-4.5 5.5-4.5 9.5a4.5 4.5 0 1 0 9 0c0-2.5-2-4.5-2-6.5 0-1.5 1.2-2.4 1.5-3z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="progress-stat-value">1,240</p>
            <p className="progress-stat-label">Calories</p>
          </div>

          <div className="progress-stat-card progress-stat-card--workouts">
            <span className="progress-stat-badge">+12%</span>
            <div className="progress-stat-icon progress-stat-icon--workouts" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="progress-stat-icon-svg">
                <path
                  d="M4 12h2.5l1.5-4 2 8 2-6 1.5 6H20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="progress-stat-value">12</p>
            <p className="progress-stat-label">Workouts</p>
          </div>

          <div className="progress-stat-card progress-stat-card--strength">
            <span className="progress-stat-badge progress-stat-badge--wide">Vs Last Month</span>
            <div className="progress-stat-icon progress-stat-icon--strength" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="progress-stat-icon-svg">
                <rect x="5" y="9" width="3" height="6" rx="0.8" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="16" y="9" width="3" height="6" rx="0.8" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="progress-stat-value">+15%</p>
            <p className="progress-stat-label">Strength</p>
          </div>

          <div className="progress-stat-card progress-stat-card--bpm">
            <span className="progress-stat-badge">+12%</span>
            <div className="progress-stat-icon progress-stat-icon--bpm" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="progress-stat-icon-svg">
                <path
                  d="M12 21s-4.5-4.2-4.5-9.5a4.5 4.5 0 0 1 9 0c0 5.3-4.5 9.5-4.5 9.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="progress-stat-value">142</p>
            <p className="progress-stat-label">Avg BPM</p>
          </div>
        </section>

        <div className="progress-tabs-row" role="tablist" aria-label="Metric category">
          {CATEGORY_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={category === t.id}
              className={`progress-tab${category === t.id ? " progress-tab--active" : ""}`}
              onClick={() => setCategory(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="progress-time-row" role="tablist" aria-label="Time range">
          {TIME_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={timeRange === t.id}
              className={`progress-tab${timeRange === t.id ? " progress-tab--active" : ""}`}
              onClick={() => setTimeRange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <section className="progress-weight-card" aria-label="Weight trend">
          <div className="progress-weight-head">
            <div>
              <p className="progress-weight-kicker">CURRENT WEIGHT</p>
              <p className="progress-weight-value">77.2kg</p>
            </div>
            <span className="progress-weight-trend">−1.3 kg</span>
          </div>
          <div className="progress-chart">
            <svg className="progress-chart-svg" viewBox="0 0 320 110" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="progressLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6f50" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ff6f50" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 28 L 70 38 L 130 48 L 190 62 L 250 78 L 310 88 L 310 110 L 10 110 Z"
                fill="url(#progressLineGrad)"
              />
              <polyline
                fill="none"
                stroke="#ff6f50"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,28 70,38 130,48 190,62 250,78 310,88"
              />
              {[
                [10, 28],
                [70, 38],
                [130, 48],
                [190, 62],
                [250, 78],
                [310, 88],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="4" fill="#1e1e1e" stroke="#ff6f50" strokeWidth="2" />
              ))}
            </svg>
          </div>
          <div className="progress-chart-labels">
            {CHART_DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </section>

        <section className="progress-goals" aria-label="Goals">
          <h3 className="progress-goals-title">Goal progress</h3>
          <div className="progress-goal">
            <div className="progress-goal-head">
              <span>Lose 5kg</span>
              <span>60%</span>
            </div>
            <div className="progress-goal-bar">
              <div className="progress-goal-fill progress-goal-fill--orange" />
            </div>
          </div>
          <div className="progress-goal">
            <div className="progress-goal-head">
              <span>Bench 100kg</span>
              <span>60%</span>
            </div>
            <div className="progress-goal-bar">
              <div className="progress-goal-fill progress-goal-fill--purple" />
            </div>
          </div>
          <div className="progress-goal">
            <div className="progress-goal-head">
              <span>20 Workouts</span>
              <span>60%</span>
            </div>
            <div className="progress-goal-bar">
              <div className="progress-goal-fill progress-goal-fill--green" />
            </div>
          </div>
        </section>

        <section className="progress-photos" aria-label="Progress photos">
          <div className="progress-photos-head">
            <h3 className="progress-photos-title">Progress Photos</h3>
            <button type="button" className="progress-photos-add">
              + Add
            </button>
          </div>
          <div className="progress-photos-row">
            {PHOTO_URLS.map((src, i) => (
              <img key={i} className="progress-photo-thumb" src={src} alt="" />
            ))}
            <button type="button" className="progress-photo-placeholder">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 7h4l2-3h4l2 3h4v13H4V7Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              Add New
            </button>
          </div>
        </section>
      </div>
      <BottomNav activeTab="home" />
    </main>
  );
}

export default ProgressTrackingPage;
