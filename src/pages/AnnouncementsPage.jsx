import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./AnnouncementsPage.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "urgent", label: "Urgent" },
  { id: "offers", label: "Offers" },
  { id: "updates", label: "Updates" },
];

const ANNOUNCEMENTS = [
  {
    id: "1",
    category: "urgent",
    time: "2 hours ago",
    title: "Pool Maintenance",
    body: "The main pool will be closed for deep cleaning and maintenance on February 20–21. Lap swim moves to the training pool.",
    featured: true,
  },
  {
    id: "2",
    category: "offers",
    time: "1 Day ago",
    title: "Summer Sale: 20% Off",
    body: "Save on supplements, shakes, and gear at the juice bar through the end of the month. Show this announcement at checkout.",
    featured: false,
  },
  {
    id: "3",
    category: "updates",
    time: "3 Days ago",
    title: "New Class Schedule",
    body: "Morning yoga now starts at 6:30 AM on weekdays. Check the app for the full studio lineup and waitlist openings.",
    featured: false,
  },
  {
    id: "4",
    category: "updates",
    time: "1 Week ago",
    title: "Gym Renovation Complete",
    body: "The weight room expansion is finished with new racks, platforms, and a dedicated functional zone. Stop by for a tour.",
    featured: false,
  },
];

function TagIcon({ category }) {
  if (category === "urgent") {
    return (
      <svg viewBox="0 0 24 24" className="ann-tag-svg" aria-hidden="true">
        <path
          d="M12 3L3 19h18L12 3z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M12 9v5M12 16h.01" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (category === "offers") {
    return (
      <svg viewBox="0 0 24 24" className="ann-tag-svg" aria-hidden="true">
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
  return (
    <svg viewBox="0 0 24 24" className="ann-tag-svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 16v-5M12 8.2h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AnnouncementsPage() {
  const [filter, setFilter] = useState("all");

  const visible = useMemo(() => {
    if (filter === "all") return ANNOUNCEMENTS;
    if (filter === "urgent") return ANNOUNCEMENTS.filter((a) => a.category === "urgent");
    if (filter === "offers") return ANNOUNCEMENTS.filter((a) => a.category === "offers");
    if (filter === "updates") return ANNOUNCEMENTS.filter((a) => a.category === "updates");
    return ANNOUNCEMENTS;
  }, [filter]);

  return (
    <main className="announcements-page">
      <div className="announcements-scroll">
        <header className="ann-header">
          <Link to="/gyms" className="ann-back" aria-label="Back">
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
          <h1 className="ann-title">Updates</h1>
        </header>

        <div className="ann-divider" />

        <div className="ann-filters" role="tablist" aria-label="Filter updates">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              className={`ann-chip${filter === id ? " ann-chip-active" : ""}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <ul className="ann-list">
          {visible.map((item) => (
            <li key={item.id}>
              <article className={`ann-card${item.featured ? " ann-card-featured" : ""}`}>
                <div className="ann-card-top">
                  <span className={`ann-pill ann-pill-${item.category}`}>
                    <TagIcon category={item.category} />
                    {item.category === "urgent" && "Urgent"}
                    {item.category === "offers" && "Offer"}
                    {item.category === "updates" && "Update"}
                  </span>
                  <time className="ann-time">{item.time}</time>
                </div>
                <h2 className="ann-card-title">{item.title}</h2>
                <p className="ann-card-body">{item.body}</p>
                <div className="ann-card-footer">
                  <button type="button" className="ann-read-more">
                    Read More &gt;
                  </button>
                  <div className="ann-actions">
                    <button type="button" className="ann-icon-btn" aria-label="Save">
                      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path
                          d="M6 4h12v16l-6-3-6 3V4z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button type="button" className="ann-icon-btn" aria-label="Share">
                      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <circle cx="18" cy="5" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="6" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="18" cy="19" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path
                          d="M8 10.5l8-4M8 13.5l8 4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <BottomNav activeTab="notifications" />
    </main>
  );
}

export default AnnouncementsPage;
