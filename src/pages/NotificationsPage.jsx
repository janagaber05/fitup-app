import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./NotificationsPage.css";

const NOTIFICATIONS = [
  {
    id: "1",
    variant: "calendar",
    title: "Class Reminder",
    titleAccent: true,
    body: "Your HIIT Advanced class starts in 1 hour.",
    timeLabel: "55 min ago",
  },
  {
    id: "2",
    variant: "info",
    title: "Gym Capacity Update",
    titleAccent: false,
    body: "Downtown Branch is currently very busy (85%).",
    timeLabel: "2 hours ago",
  },
  {
    id: "3",
    variant: "success",
    title: "Payment Successful",
    titleAccent: false,
    body: "Your monthly subscription has been renewed.",
    timeLabel: "1 day ago",
  },
];

function NotifIcon({ variant }) {
  if (variant === "calendar") {
    return (
      <svg viewBox="0 0 24 24" className="notif-icon-svg" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === "info") {
    return (
      <svg viewBox="0 0 24 24" className="notif-icon-svg" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 11v5M12 8h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="notif-icon-svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
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

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function NotificationsPage() {
  return (
    <main className="notifications-page">
      <div className="notifications-scroll">
        <header className="notifications-header">
          <Link to="/gyms" className="notifications-back" aria-label="Back">
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
          <h1 className="notifications-title">Notifications</h1>
        </header>

        <ul className="notifications-list">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id}>
              <article className="notif-card">
                <div className={`notif-icon notif-icon--${n.variant}`}>
                  <NotifIcon variant={n.variant} />
                </div>
                <div className="notif-body">
                  <div className="notif-top">
                    <p
                      className={`notif-card-title${n.titleAccent ? " notif-card-title--accent" : ""}`}
                    >
                      {n.title}
                    </p>
                    <span className="notif-meta">
                      <ClockIcon />
                      {n.timeLabel}
                    </span>
                  </div>
                  <p className="notif-desc">{n.body}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <Link to="/updates" className="notifications-updates-link">
          <span className="notifications-updates-text">
            <span className="notifications-updates-label">Gym updates & news</span>
            <span className="notifications-updates-hint">Announcements, offers, and urgent notices</span>
          </span>
          <span className="notifications-updates-chevron" aria-hidden="true">
            ›
          </span>
        </Link>
      </div>
      <BottomNav activeTab="notifications" />
    </main>
  );
}

export default NotificationsPage;
