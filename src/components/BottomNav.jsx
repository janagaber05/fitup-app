import { Link } from "react-router-dom";
import "./BottomNav.css";

function BottomNav({ activeTab = "home" }) {
  const tabClass = (id) =>
    `nav-tab${activeTab && activeTab === id ? " active-tab" : ""}`;

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <Link to="/gyms" className={tabClass("home")}>
        <span className="nav-icon-wrap">
          <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
            <path
              d="M4 11.5L12 4l8 7.5V20h-5.2v-4.9H9.2V20H4v-8.5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="nav-label">Home</span>
      </Link>
      <Link to="/my-gym" className={tabClass("my-gym")}>
        <span className="nav-icon-wrap">
          <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
            <g transform="translate(12, 12) rotate(-42) translate(-12, -12)">
              <rect
                x="3"
                y="8"
                width="4"
                height="8"
                rx="1.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="17"
                y="8"
                width="4"
                height="8"
                rx="1.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M7 12h10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </span>
        <span className="nav-label">My Gym</span>
      </Link>
      <Link to="/profile" className={tabClass("profile")}>
        <span className="nav-icon-wrap">
          <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <path
              d="M4.5 20c1.5-3.5 4.2-5 7.5-5s6 1.5 7.5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="nav-label">Profile</span>
      </Link>
      <Link to="/book" className={tabClass("book")}>
        <span className="nav-icon-wrap">
          <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
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
        <span className="nav-label">Book</span>
      </Link>
      <Link
        to="/notifications"
        className={tabClass("notifications")}
        aria-label="Notifications"
      >
        <span className="nav-icon-wrap">
          <svg viewBox="0 0 24 24" className="nav-icon nav-icon-bell" aria-hidden="true">
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
            <circle className="nav-bell-dot" cx="17.5" cy="7.5" r="2.2" />
          </svg>
        </span>
        <span className="nav-label nav-label-notifications">Notifications</span>
      </Link>
    </nav>
  );
}

export default BottomNav;
