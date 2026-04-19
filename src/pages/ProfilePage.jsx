import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./ProfilePage.css";

const AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80";
const COACH_AVATAR =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80";

const COACH_NAME = "Sarah Johnson";

const FAVORITE_GYM = "Downtown";

const PRIVATE_PACKAGES = [
  { id: "1", title: "1 Session", price: "$75" },
  { id: "5", title: "5 Session", price: "$100" },
  { id: "10", title: "10 Session", price: "$350" },
];

const PACKAGE_BLURB = "Perfect for trying out personal training";

const CHAT_INITIAL = [
  {
    id: "seed-1",
    role: "coach",
    text: "Hey Alex! How was your workout today?",
    time: "10:30 AM",
  },
  {
    id: "seed-2",
    role: "user",
    text: "It was great! Feeling stronger every day 💪",
    time: "10:32 AM",
  },
  {
    id: "seed-3",
    role: "coach",
    text: "That's awesome! Let's focus on core strength next session.",
    time: "10:35 AM",
  },
];

function formatChatTime(d = new Date()) {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

const PERSONAL_ROWS = [
  { label: "Full Name", value: "Alex Morgan" },
  { label: "Email Address", value: "alex.morgan@example.com" },
  { label: "Phone Number", value: "+1 (555) 123-4567" },
  { label: "Date of Birth", value: "January 15, 1995" },
  { label: "Gender", value: "Male" },
  { label: "Fitness Goals", value: "Build Muscle, Increase Endurance" },
];

const QUICK_ACTIONS = [
  { id: "notif", label: "Notifications", icon: "bell", danger: false },
  { id: "pay", label: "Payment Methods", icon: "card", danger: false },
  { id: "sec", label: "Security & Privacy", icon: "shield", danger: false },
  { id: "export", label: "Export My Data", icon: "download", danger: false },
  { id: "help", label: "Help & Support", icon: "help", danger: false },
  { id: "logout", label: "Log Out", icon: "logout", danger: true },
];

function QuickIcon({ type }) {
  if (type === "bell") {
    return (
      <svg viewBox="0 0 24 24" className="profile-qa-svg" aria-hidden="true">
        <path
          d="M18 16H6l1.4-1.7c.4-.5.6-1.1.6-1.7V10a4 4 0 1 1 8 0v2.6c0 .6.2 1.2.6 1.7L18 16Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M10 18.6a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "card") {
    return (
      <svg viewBox="0 0 24 24" className="profile-qa-svg" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M2 10h20" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" className="profile-qa-svg" aria-hidden="true">
        <path
          d="M12 3l8 4v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V7l8-4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "download") {
    return (
      <svg viewBox="0 0 24 24" className="profile-qa-svg" aria-hidden="true">
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 19h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "help") {
    return (
      <svg viewBox="0 0 24 24" className="profile-qa-svg" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 4.2 1.7c0 1.5-1.5 1.8-1.5 3.3V15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="17.5" r="0.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="profile-qa-svg" aria-hidden="true">
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfilePage() {
  const chatTitleId = useId();
  const bookTitleId = useId();
  const [chatOpen, setChatOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [messages, setMessages] = useState(CHAT_INITIAL);
  const [draft, setDraft] = useState("");
  const nextMsgId = useRef(0);

  const closeChat = useCallback(() => {
    setChatOpen(false);
    setDraft("");
  }, []);

  const closeBook = useCallback(() => {
    setBookOpen(false);
  }, []);

  useEffect(() => {
    const anyOpen = chatOpen || bookOpen;
    if (!anyOpen) return undefined;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (bookOpen) closeBook();
      else closeChat();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [chatOpen, bookOpen, closeChat, closeBook]);

  const sendMessage = () => {
    const t = draft.trim();
    if (!t) return;
    nextMsgId.current += 1;
    setMessages((m) => [
      ...m,
      {
        id: `u-${nextMsgId.current}`,
        role: "user",
        text: t,
        time: formatChatTime(),
      },
    ]);
    setDraft("");
  };

  return (
    <main className="profile-page">
      <div className="profile-scroll">
        <header className="profile-header">
          <Link to="/gyms" className="profile-back" aria-label="Back">
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
          <h1 className="profile-header-title">Profile</h1>
        </header>

        <section className="profile-hero-card">
          <div className="profile-hero-glow" aria-hidden="true" />
          <div className="profile-hero-top">
            <img className="profile-avatar" src={AVATAR} alt="" />
            <div className="profile-hero-text">
              <h2 className="profile-name">Alex Morgan</h2>
              <span className="profile-member-badge">Active Member</span>
            </div>
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-num">12</span>
              <span className="profile-stat-label">Sessions Completed</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-icon-row">
                <svg viewBox="0 0 24 24" className="profile-stat-dumbbell" aria-hidden="true">
                  <rect x="3" y="9" width="4" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="17" y="9" width="4" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 12h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="profile-stat-place">{FAVORITE_GYM}</span>
              </span>
              <span className="profile-stat-label">Favorite Gym</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-check-wrap" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="profile-stat-check">
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
              </span>
              <span className="profile-stat-label">Active Package</span>
            </div>
          </div>
        </section>

        <section className="profile-block">
          <h3 className="profile-section-title">Personal Information</h3>
          <div className="profile-info-card">
            {PERSONAL_ROWS.map((row, i) => (
              <div key={row.label} className={`profile-info-row${i > 0 ? " profile-info-row-border" : ""}`}>
                <span className="profile-info-label">{row.label}</span>
                <span className="profile-info-value">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-block">
          <h3 className="profile-section-title">Your Coach</h3>
          <div className="profile-coach-card">
            <div className="profile-coach-glow" aria-hidden="true" />
            <div className="profile-coach-top">
              <img className="profile-coach-avatar" src={COACH_AVATAR} alt="" />
              <div className="profile-coach-text">
                <span className="profile-coach-name">{COACH_NAME}</span>
                <span className="profile-coach-role">Strength & Conditioning</span>
                <span className="profile-coach-rating">
                  <svg viewBox="0 0 24 24" className="profile-coach-star" aria-hidden="true">
                    <path
                      d="M12 2.5l2.8 5.7 6.3.9-4.5 4.4 1.1 6.3L12 17.9l-5.7 3 1.1-6.3-4.5-4.4 6.3-.9z"
                      fill="currentColor"
                    />
                  </svg>
                  4.9
                </span>
              </div>
            </div>
            <div className="profile-coach-actions">
              <button type="button" className="profile-btn-chat" onClick={() => setChatOpen(true)}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M21 12a8 8 0 0 1-8 8H8l-5 3v-3H5a8 8 0 1 1 16-8Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
                Chat With Coach
              </button>
              <button type="button" className="profile-btn-book" onClick={() => setBookOpen(true)}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Book Session
              </button>
            </div>
          </div>
        </section>

        <section className="profile-block profile-block-last">
          <h3 className="profile-section-title">Quick Actions</h3>
          <ul className="profile-qa-list">
            {QUICK_ACTIONS.map((a) => (
              <li key={a.id}>
                <button type="button" className={`profile-qa-row${a.danger ? " profile-qa-row-danger" : ""}`}>
                  <span className="profile-qa-icon">
                    <QuickIcon type={a.icon} />
                  </span>
                  <span className="profile-qa-label">{a.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <BottomNav activeTab="profile" />

      {chatOpen ? (
        <div className="profile-chat-portal" role="presentation">
          <button
            type="button"
            className="profile-chat-backdrop"
            aria-label="Close chat"
            onClick={closeChat}
          />
          <div
            className="profile-chat-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={chatTitleId}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="profile-chat-header">
              <img className="profile-chat-header-avatar" src={COACH_AVATAR} alt="" />
              <div className="profile-chat-header-text">
                <span id={chatTitleId} className="profile-chat-header-name">
                  {COACH_NAME}
                </span>
                <span className="profile-chat-header-status">Online</span>
              </div>
              <button type="button" className="profile-chat-close" onClick={closeChat} aria-label="Close">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>
            <div className="profile-chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`profile-chat-bubble-wrap${msg.role === "user" ? " profile-chat-bubble-wrap--out" : ""}`}
                >
                  <div
                    className={`profile-chat-bubble${msg.role === "user" ? " profile-chat-bubble--out" : " profile-chat-bubble--in"}`}
                  >
                    <p className="profile-chat-bubble-text">{msg.text}</p>
                    <span className="profile-chat-bubble-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="profile-chat-input-row">
              <input
                className="profile-chat-input"
                type="text"
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                autoComplete="off"
                aria-label="Message"
              />
              <button type="button" className="profile-chat-send" onClick={sendMessage} aria-label="Send message">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    d="M12 5v14M12 5l4 4M12 5l-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {bookOpen ? (
        <div className="profile-book-portal" role="presentation">
          <button
            type="button"
            className="profile-book-backdrop"
            aria-label="Close booking"
            onClick={closeBook}
          />
          <div
            className="profile-book-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={bookTitleId}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="profile-packages-header">
              <h2 id={bookTitleId} className="profile-packages-title">
                Private Session Packages
              </h2>
              <button type="button" className="profile-chat-close" onClick={closeBook} aria-label="Close">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>
            <div className="profile-packages-body">
              <ul className="profile-packages-list">
                {PRIVATE_PACKAGES.map((pkg) => (
                  <li key={pkg.id} className="profile-package-card">
                    <div className="profile-package-top">
                      <span className="profile-package-name">{pkg.title}</span>
                      <span className="profile-package-price">{pkg.price}</span>
                    </div>
                    <p className="profile-package-desc">{PACKAGE_BLURB}</p>
                    <Link
                      to="/book"
                      className="profile-package-select"
                      onClick={closeBook}
                    >
                      Select Package
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default ProfilePage;
