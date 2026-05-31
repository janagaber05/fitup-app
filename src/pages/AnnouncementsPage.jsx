import { useCallback, useEffect, useMemo, useState } from "react";
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
    details: [
      "Main pool closed February 20–21 for deep cleaning and filter service.",
      "Lap swim relocates to the training pool on the mezzanine level.",
      "Aquatic group classes are cancelled; members receive session credits automatically.",
      "Sauna, steam room, and locker rooms remain open during maintenance.",
    ],
    featured: true,
  },
  {
    id: "2",
    category: "offers",
    time: "1 Day ago",
    title: "Summer Sale: 20% Off",
    body: "Save on supplements, shakes, and gear at the juice bar through the end of the month. Show this announcement at checkout.",
    details: [
      "20% off all supplements, protein shakes, and FitUp-branded gear.",
      "Valid through the end of the month at the Downtown Branch juice bar.",
      "Show this update in the app or mention code SUMMER20 at checkout.",
      "Cannot be combined with other promotions; limit one discount per visit.",
    ],
    featured: false,
  },
  {
    id: "3",
    category: "updates",
    time: "3 Days ago",
    title: "New Class Schedule",
    body: "Morning yoga now starts at 6:30 AM on weekdays. Check the app for the full studio lineup and waitlist openings.",
    details: [
      "Morning Flow Yoga moves to 6:30 AM Monday through Friday in Studio A.",
      "Evening HIIT and strength blocks are unchanged.",
      "Waitlist opens 24 hours before each class in Book Session.",
      "Premium and Elite members get priority waitlist placement.",
    ],
    featured: false,
  },
  {
    id: "4",
    category: "updates",
    time: "1 Week ago",
    title: "Gym Renovation Complete",
    body: "The weight room expansion is finished with new racks, platforms, and a dedicated functional zone. Stop by for a tour.",
    details: [
      "New squat racks, deadlift platforms, and cable stations on Floor 2.",
      "Dedicated functional training zone with sleds, ropes, and turf lane.",
      "Free member tour daily at 5:00 PM — meet at the front desk.",
      "Personal trainers available for equipment walkthroughs on request.",
    ],
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

function categoryLabel(category) {
  if (category === "urgent") return "Urgent";
  if (category === "offers") return "Offer";
  return "Update";
}

function buildShareText(item) {
  const lines = [item.title, "", item.body];
  if (item.details?.length) {
    lines.push("", ...item.details.map((point) => `• ${point}`));
  }
  lines.push("", "— FitUp Gym");
  return lines.join("\n");
}

function AnnouncementsPage() {
  const [filter, setFilter] = useState("all");
  const [detailItem, setDetailItem] = useState(null);
  const [shareNotice, setShareNotice] = useState("");

  const visible = useMemo(() => {
    if (filter === "all") return ANNOUNCEMENTS;
    if (filter === "urgent") return ANNOUNCEMENTS.filter((a) => a.category === "urgent");
    if (filter === "offers") return ANNOUNCEMENTS.filter((a) => a.category === "offers");
    if (filter === "updates") return ANNOUNCEMENTS.filter((a) => a.category === "updates");
    return ANNOUNCEMENTS;
  }, [filter]);

  const openDetails = useCallback((item) => {
    setDetailItem(item);
  }, []);

  const closeDetails = useCallback(() => {
    setDetailItem(null);
  }, []);

  const shareAnnouncement = useCallback(async (item) => {
    const text = buildShareText(item);
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text });
        setShareNotice("Shared successfully.");
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setShareNotice("Update copied — paste anywhere to share.");
    } catch {
      setShareNotice("Unable to share right now. Try again.");
    }
  }, []);

  useEffect(() => {
    if (!detailItem) return undefined;
    const prev = document.body.style.overflow;
    const onKey = (event) => {
      if (event.key === "Escape") closeDetails();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [detailItem, closeDetails]);

  useEffect(() => {
    if (!shareNotice) return undefined;
    const timer = window.setTimeout(() => setShareNotice(""), 2800);
    return () => window.clearTimeout(timer);
  }, [shareNotice]);

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
                  <button type="button" className="ann-read-more" onClick={() => openDetails(item)}>
                    Read More &gt;
                  </button>
                  <button
                    type="button"
                    className="ann-icon-btn"
                    aria-label={`Share ${item.title}`}
                    onClick={() => shareAnnouncement(item)}
                  >
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
              </article>
            </li>
          ))}
        </ul>
      </div>

      {shareNotice ? (
        <p className="ann-share-toast" role="status">
          {shareNotice}
        </p>
      ) : null}

      {detailItem ? (
        <div className="ann-detail-wrap" role="presentation">
          <button type="button" className="ann-detail-backdrop" aria-label="Close details" onClick={closeDetails} />
          <section className="ann-detail-modal" role="dialog" aria-modal="true" aria-labelledby="ann-detail-title">
            <header className="ann-detail-head">
              <span className={`ann-pill ann-pill-${detailItem.category}`}>
                <TagIcon category={detailItem.category} />
                {categoryLabel(detailItem.category)}
              </span>
              <button type="button" className="ann-detail-close" onClick={closeDetails} aria-label="Close">
                ✕
              </button>
            </header>
            <time className="ann-detail-time">{detailItem.time}</time>
            <h2 id="ann-detail-title" className="ann-detail-title">
              {detailItem.title}
            </h2>
            <p className="ann-detail-body">{detailItem.body}</p>
            {detailItem.details?.length ? (
              <ul className="ann-detail-list">
                {detailItem.details.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            <div className="ann-detail-actions">
              <button type="button" className="ann-detail-share-btn" onClick={() => shareAnnouncement(detailItem)}>
                Share update
              </button>
            </div>
          </section>
        </div>
      ) : null}

      <BottomNav activeTab="notifications" />
    </main>
  );
}

export default AnnouncementsPage;
