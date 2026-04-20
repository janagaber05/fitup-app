import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./BookSessionPage.css";

const MAIN_TABS = [
  { id: "classes", label: "Classes" },
  { id: "wellness", label: "Wellness" },
  { id: "private", label: "Private" },
];

const CATEGORY_CHIPS = [
  { id: "all", label: "All" },
  { id: "yoga", label: "Yoga" },
  { id: "hit", label: "HIIT" },
  { id: "strength", label: "Strength" },
  { id: "cardio", label: "Cardio" },
];

const DATES = [
  { id: "thu12", day: "THU", num: "12" },
  { id: "fri13", day: "FRI", num: "13" },
  { id: "sat14", day: "SAT", num: "14" },
  { id: "sun15", day: "SUN", num: "15" },
  { id: "mon16", day: "MON", num: "16" },
  { id: "tue17", day: "TUE", num: "17" },
  { id: "wed18", day: "WED", num: "18" },
];

const PRIVATE_COACH_SLOTS = ["08:00 AM", "10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"];
const WELLNESS_SERVICE_SLOTS = ["09:00 AM", "11:00 AM", "02:00 PM", "05:00 PM", "08:00 PM"];

const SESSIONS = [
  {
    id: "1",
    category: "yoga",
    name: "Morning Flow Yoga",
    time: "07:00 AM",
    instructor: "Elena Ray",
    duration: "60 min",
    room: "Studio A",
    spots: 5,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=75",
  },
  {
    id: "2",
    category: "hit",
    name: "HIIT Blast",
    time: "08:30 AM",
    instructor: "Nora Blake",
    duration: "45 min",
    room: "Studio B",
    spots: 3,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=75",
  },
  {
    id: "3",
    category: "strength",
    name: "Power Lifting Lab",
    time: "10:00 AM",
    instructor: "Layla Hassan",
    duration: "75 min",
    room: "Floor 2",
    spots: 8,
    image:
      "https://images.unsplash.com/photo-1581009146145-b5e850e2e961?auto=format&fit=crop&w=800&q=75",
  },
  {
    id: "4",
    category: "cardio",
    name: "Spin & Core",
    time: "12:15 PM",
    instructor: "Ava Rivera",
    duration: "50 min",
    room: "Cycle Room",
    spots: 2,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=75",
  },
];

const PRIVATE_SERVICES = [
  {
    id: "p1",
    title: "EMS Training",
    priceLabel: "$40",
    description:
      "Full-body electro-muscle stimulation in a guided 20-minute session — efficient strength and recovery.",
    icon: "bolt",
  },
  {
    id: "p2",
    title: "Infrared Sauna",
    priceLabel: "$40",
    description:
      "Deep heat therapy to boost circulation, ease soreness, and support detox in a private cabin.",
    icon: "drops",
  },
  {
    id: "p3",
    title: "Hydrotherapy Jacuzzi",
    priceLabel: "$Free",
    description:
      "Warm hydro jets for active recovery — complimentary for members when booked in advance.",
    icon: "drops",
  },
  {
    id: "p4",
    title: "Sports Massage",
    priceLabel: "$Free",
    description:
      "Targeted soft-tissue work with our therapists. Complimentary 15-minute slots on select days.",
    icon: "pulse",
  },
];

const COACHES = [
  {
    id: "c1",
    name: "Nina Carter",
    specialty: "Strength & Conditioning",
    rating: 4.9,
    price: 80,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "c2",
    name: "Elena Ray",
    specialty: "Yoga & Mobility",
    rating: 4.8,
    price: 65,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "c3",
    name: "Nora Blake",
    specialty: "HIIT & MetCon",
    rating: 5.0,
    price: 75,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "c4",
    name: "Layla Hassan",
    specialty: "Olympic Lifting",
    rating: 4.7,
    price: 90,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
];

function PrivateServiceIcon({ type }) {
  if (type === "bolt") {
    return (
      <svg viewBox="0 0 24 24" className="private-service-icon-svg" aria-hidden="true">
        <path
          d="M13 2L5 14h6l-1 8 9-12h-6l1-8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "drops") {
    return (
      <svg viewBox="0 0 24 24" className="private-service-icon-svg" aria-hidden="true">
        <path
          d="M9 6.5c-1 1.8-3 4-3 6.8a3 3 0 0 0 6 0c0-2.8-2-5-3-6.8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinejoin="round"
        />
        <path
          d="M16 5c-1.1 2-3.2 4.4-3.2 7.2a2.8 2.8 0 0 0 5.6 0C18.4 9.4 16.2 7 16 5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="private-service-icon-svg" aria-hidden="true">
      <path
        d="M3 12h4l2-5 4 10 2-5h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CoachStars() {
  return (
    <span className="coach-stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="coach-star">
          <path
            d="M12 2.5l2.8 5.7 6.3.9-4.5 4.4 1.1 6.3L12 17.9l-5.7 3 1.1-6.3-4.5-4.4 6.3-.9z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}

function BookSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mainTab, setMainTab] = useState("private");
  const [dateId, setDateId] = useState("thu12");
  const [category, setCategory] = useState("all");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [selectedBookingSlot, setSelectedBookingSlot] = useState("");
  const [bookingNotice, setBookingNotice] = useState("");

  const filtered = useMemo(() => {
    if (mainTab !== "classes") return [];
    if (category === "all") return SESSIONS;
    return SESSIONS.filter((s) => s.category === category);
  }, [mainTab, category]);

  const showDates = mainTab === "classes" || mainTab === "wellness" || mainTab === "private";

  useEffect(() => {
    if (!location.state?.bookingPaymentNotice) return;
    setBookingNotice(location.state.bookingPaymentNotice);
    navigate("/book", { replace: true });
  }, [location.state, navigate]);

  useEffect(() => {
    if (!bookingDetails && !bookingConfirmation) return undefined;
    const prev = document.body.style.overflow;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (bookingConfirmation) {
        setBookingConfirmation(null);
        return;
      }
      setBookingDetails(null);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [bookingDetails, bookingConfirmation]);

  const openClassDetails = (s) => {
    setBookingDetails({
      kind: "Class",
      title: s.name,
      subtitle: `Coach ${s.instructor}`,
      priceLabel: "Included in membership",
      when: s.time,
      duration: s.duration,
      location: s.room,
      availability: `${s.spots} spots left`,
      description: "Guided class session with warm-up, focused training blocks, and cooldown.",
      image: s.image,
      availableSlots: [],
    });
    setSelectedBookingSlot(s.time);
  };

  const openCoachDetails = (c) => {
    setBookingDetails({
      kind: "Personal Training",
      title: c.name,
      subtitle: c.specialty,
      priceLabel: `$${c.price}/session`,
      when: "Pick your preferred slot",
      duration: "60 min",
      location: "Private Training Zone",
      availability: "Limited slots this week",
      description: "1:1 coaching plan tailored to your goals, level, and recovery needs.",
      image: c.image,
      availableSlots: PRIVATE_COACH_SLOTS,
    });
    setSelectedBookingSlot(PRIVATE_COACH_SLOTS[0]);
  };

  const openServiceDetails = (svc) => {
    setBookingDetails({
      kind: "Private Service",
      title: svc.title,
      subtitle: "Premium wellness service",
      priceLabel: svc.priceLabel,
      when: "Available daily",
      duration: svc.id === "p1" ? "20 min" : "45 min",
      location: "Recovery & Wellness Area",
      availability: "Advance booking recommended",
      description: svc.description,
      image: null,
      availableSlots: WELLNESS_SERVICE_SLOTS,
    });
    setSelectedBookingSlot(WELLNESS_SERVICE_SLOTS[0]);
  };

  const confirmBooking = () => {
    if (!bookingDetails) return;
    const selectedDate = DATES.find((d) => d.id === dateId);
    const dateLabel = selectedDate ? `${selectedDate.day} ${selectedDate.num}` : "Selected day";
    const bookingRef = `BK-${Date.now().toString().slice(-6)}`;
    const chosenTime = selectedBookingSlot || bookingDetails.when;
    const isPaidBooking =
      bookingDetails.priceLabel.startsWith("$") &&
      bookingDetails.priceLabel !== "$Free" &&
      bookingDetails.priceLabel !== "Included in membership";

    if (isPaidBooking) {
      navigate("/membership/payment", {
        state: {
          paymentMode: "booking",
          booking: {
            bookingRef,
            title: bookingDetails.title,
            subtitle: bookingDetails.subtitle,
            priceLabel: bookingDetails.priceLabel,
            dateLabel,
            timeLabel: chosenTime,
            location: bookingDetails.location,
            kind: bookingDetails.kind,
          },
        },
      });
      setBookingDetails(null);
      return;
    }

    setBookingConfirmation({
      ...bookingDetails,
      dateLabel,
      bookingRef,
      confirmedAt: new Date().toLocaleString(),
      status: "Confirmed",
      when: chosenTime,
    });
    setBookingNotice(`${bookingDetails.title} booked successfully.`);
    setBookingDetails(null);
  };

  return (
    <main className="book-page">
      <div className="book-scroll">
        <header className="book-header">
          <Link to="/gyms" className="book-back" aria-label="Back">
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
          <h1 className="book-title">Book Session</h1>
        </header>

        <div className="book-main-tabs" role="tablist">
          {MAIN_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mainTab === id}
              className={`book-main-tab${mainTab === id ? " book-main-tab-active" : ""}`}
              onClick={() => setMainTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {showDates && (
          <div className="book-dates" role="listbox" aria-label="Select date">
            {DATES.map(({ id, day, num }) => (
              <button
                key={id}
                type="button"
                role="option"
                aria-selected={dateId === id}
                className={`book-date-card${dateId === id ? " book-date-card-active" : ""}`}
                onClick={() => setDateId(id)}
              >
                <span className="book-date-day">{day}</span>
                <span className="book-date-num">{num}</span>
              </button>
            ))}
          </div>
        )}

        {mainTab === "classes" && (
          <>
            <div className="book-chips" role="tablist" aria-label="Class type">
              {CATEGORY_CHIPS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={category === id}
                  className={`book-chip${category === id ? " book-chip-active" : ""}`}
                  onClick={() => setCategory(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <ul className="book-class-list">
              {filtered.map((s) => (
                <li key={s.id}>
                  <article className="book-class-card">
                    <div className="book-card-visual">
                      <img
                        className="book-card-img"
                        src={s.image}
                        alt=""
                        loading="lazy"
                      />
                      <div className="book-card-visual-overlay" aria-hidden="true" />
                      <span className="book-spots-badge">{s.spots} spots left</span>
                    </div>
                    <div className="book-card-body">
                      <div className="book-card-topline">
                        <h2 className="book-class-name">{s.name}</h2>
                        <span className="book-class-time">{s.time}</span>
                      </div>
                      <p className="book-instructor">
                        <svg viewBox="0 0 24 24" className="book-inline-icon" aria-hidden="true">
                          <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
                          <path
                            d="M5 19c1.5-4 5.5-6 7-6s5.5 2 7 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        {s.instructor}
                      </p>
                      <div className="book-card-footer">
                        <div className="book-meta">
                          <span className="book-meta-item">
                            <svg viewBox="0 0 24 24" className="book-inline-icon" aria-hidden="true">
                              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                              <path
                                d="M12 7v6l3 2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                            {s.duration}
                          </span>
                          <span className="book-meta-item">
                            <svg viewBox="0 0 24 24" className="book-inline-icon" aria-hidden="true">
                              <path
                                d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinejoin="round"
                              />
                              <circle cx="12" cy="11" r="2" fill="currentColor" />
                            </svg>
                            {s.room}
                          </span>
                        </div>
                        <button type="button" className="book-btn-small" onClick={() => openClassDetails(s)}>
                          Book
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </>
        )}

        {mainTab === "private" && (
          <section className="book-coaches-section" aria-labelledby="coaches-heading">
            <h2 id="coaches-heading" className="book-coaches-heading">
              Available Coaches
            </h2>
            <ul className="book-coach-list">
              {COACHES.map((c) => (
                <li key={c.id}>
                  <button type="button" className="book-coach-card" onClick={() => openCoachDetails(c)}>
                    <img className="coach-avatar" src={c.image} alt="" loading="lazy" />
                    <div className="coach-middle">
                      <span className="coach-name">{c.name}</span>
                      <span className="coach-specialty">{c.specialty}</span>
                      <div className="coach-rating-row">
                        <span className="coach-rating-num">{c.rating.toFixed(1)}</span>
                        <CoachStars />
                      </div>
                    </div>
                    <span className="coach-price">${c.price}/session</span>
                    <span className="coach-chevron" aria-hidden="true">
                      ›
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {mainTab === "wellness" && (
          <ul className="private-service-list">
            {PRIVATE_SERVICES.map((svc) => (
              <li key={svc.id}>
                {svc.id === "p1" ? (
                  <article className="private-service-card">
                    <div className="private-service-top">
                      <span className="private-service-icon-wrap">
                        <PrivateServiceIcon type={svc.icon} />
                      </span>
                      <div className="private-service-copy">
                        <div className="private-service-title-row">
                          <h2 className="private-service-title">{svc.title}</h2>
                          <span className="private-service-price">{svc.priceLabel}</span>
                        </div>
                        <p className="private-service-desc">{svc.description}</p>
                      </div>
                    </div>
                    <button type="button" className="private-service-cta" onClick={() => openServiceDetails(svc)}>
                      Book Now
                    </button>
                  </article>
                ) : (
                  <article className="private-service-card">
                    <div className="private-service-top">
                      <span className="private-service-icon-wrap">
                        <PrivateServiceIcon type={svc.icon} />
                      </span>
                      <div className="private-service-copy">
                        <div className="private-service-title-row">
                          <h2 className="private-service-title">{svc.title}</h2>
                          <span className="private-service-price">{svc.priceLabel}</span>
                        </div>
                        <p className="private-service-desc">{svc.description}</p>
                      </div>
                    </div>
                    <button type="button" className="private-service-cta" onClick={() => openServiceDetails(svc)}>
                      Book Now
                    </button>
                  </article>
                )}
              </li>
            ))}
          </ul>
        )}
        {bookingNotice ? <p className="book-notice">{bookingNotice}</p> : null}
      </div>
      {bookingDetails ? (
        <div className="book-detail-wrap" role="presentation">
          <button type="button" className="book-detail-backdrop" aria-label="Close details" onClick={() => setBookingDetails(null)} />
          <div className="book-detail-modal" role="dialog" aria-modal="true" aria-label="Booking details">
            <header className="book-detail-head">
              <h2>{bookingDetails.title}</h2>
              <button type="button" className="book-detail-close" onClick={() => setBookingDetails(null)} aria-label="Close">
                ✕
              </button>
            </header>
            <p className="book-detail-sub">
              {bookingDetails.kind} · {bookingDetails.subtitle}
            </p>
            {bookingDetails.image ? <img src={bookingDetails.image} alt="" className="book-detail-img" /> : null}
            <div className="book-detail-list">
              <div><span>Price</span><strong>{bookingDetails.priceLabel}</strong></div>
              <div><span>When</span><strong>{bookingDetails.when}</strong></div>
              <div><span>Duration</span><strong>{bookingDetails.duration}</strong></div>
              <div><span>Location</span><strong>{bookingDetails.location}</strong></div>
              <div><span>Availability</span><strong>{bookingDetails.availability}</strong></div>
            </div>
            {bookingDetails.availableSlots?.length ? (
              <div className="book-slot-block">
                <p className="book-slot-title">Choose time slot</p>
                <div className="book-slot-grid">
                  {bookingDetails.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`book-slot-chip${selectedBookingSlot === slot ? " book-slot-chip-active" : ""}`}
                      onClick={() => setSelectedBookingSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <p className="book-detail-desc">{bookingDetails.description}</p>
            <div className="book-detail-actions">
              <button type="button" className="book-detail-cancel" onClick={() => setBookingDetails(null)}>
                Cancel
              </button>
              <button type="button" className="book-detail-confirm" onClick={confirmBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {bookingConfirmation ? (
        <div className="book-confirm-wrap" role="presentation">
          <button
            type="button"
            className="book-confirm-backdrop"
            aria-label="Close booking confirmation"
            onClick={() => setBookingConfirmation(null)}
          />
          <div className="book-confirm-modal" role="dialog" aria-modal="true" aria-label="Booking confirmation details">
            <header className="book-confirm-head">
              <h2>Booking Confirmation</h2>
              <button type="button" className="book-confirm-close" onClick={() => setBookingConfirmation(null)} aria-label="Close">
                ✕
              </button>
            </header>
            <p className="book-confirm-ok">Your booking is confirmed.</p>
            <div className="book-confirm-list">
              <div><span>Booking ID</span><strong>{bookingConfirmation.bookingRef}</strong></div>
              <div><span>Status</span><strong>{bookingConfirmation.status}</strong></div>
              <div><span>Type</span><strong>{bookingConfirmation.kind}</strong></div>
              <div><span>Title</span><strong>{bookingConfirmation.title}</strong></div>
              <div><span>With</span><strong>{bookingConfirmation.subtitle}</strong></div>
              <div><span>Date</span><strong>{bookingConfirmation.dateLabel}</strong></div>
              <div><span>Time</span><strong>{bookingConfirmation.when}</strong></div>
              <div><span>Duration</span><strong>{bookingConfirmation.duration}</strong></div>
              <div><span>Location</span><strong>{bookingConfirmation.location}</strong></div>
              <div><span>Amount</span><strong>{bookingConfirmation.priceLabel}</strong></div>
              <div><span>Confirmed At</span><strong>{bookingConfirmation.confirmedAt}</strong></div>
            </div>
            <button type="button" className="book-confirm-done" onClick={() => setBookingConfirmation(null)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
      <BottomNav activeTab="book" />
    </main>
  );
}

export default BookSessionPage;
