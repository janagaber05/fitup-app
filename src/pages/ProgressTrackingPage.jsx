import { useCallback, useEffect, useId, useRef, useState } from "react";
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

const WEEKLY_PLAN = [
  { id: "mon", dayLabel: "MONDAY", title: "Upper Body Strength", duration: "60 min", completed: true },
  { id: "tue", dayLabel: "TUESDAY", title: "Cardio & Core", duration: "45 min", completed: true },
  { id: "wed", dayLabel: "WEDNESDAY", title: "Lower Body Power", duration: "60 min", completed: true },
  { id: "thu", dayLabel: "THURSDAY", title: "Rest & Recovery", duration: "30 min", completed: false },
  { id: "fri", dayLabel: "FRIDAY", title: "Full Body Circuit", duration: "50 min", completed: false },
  { id: "sat", dayLabel: "SATURDAY", title: "HIIT Training", duration: "40 min", completed: false },
  { id: "sun", dayLabel: "SUNDAY", title: "Active Recovery", duration: "20 min", completed: false },
];

const WORKOUT_LOG_STORAGE_KEY = "fitup-progress-workout-logs";

/** getDay(): 0 Sun … 6 Sat → plan row ids */
const PLAN_IDS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function getTodayPlanId() {
  return PLAN_IDS[new Date().getDay()];
}

function formatTodayTitle() {
  return new Date().toLocaleDateString(undefined, { weekday: "long" });
}

function formatDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r}s`;
  return `${m}m ${r.toString().padStart(2, "0")}s`;
}

function formatClock(ts) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" });
}

function formatLogWhen(ts) {
  return new Date(ts).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function loadWorkoutLogs() {
  try {
    const raw = localStorage.getItem(WORKOUT_LOG_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

const DIET_MACROS = [
  {
    id: "cal",
    label: "Calories",
    value: "2200",
    valueClass: "progress-diet-macro-value--cal",
    icon: "flame",
  },
  {
    id: "protein",
    label: "Protein",
    value: "165g",
    valueClass: "progress-diet-macro-value--protein",
    icon: null,
  },
  {
    id: "carbs",
    label: "Carbs",
    value: "220g",
    valueClass: "progress-diet-macro-value--carbs",
    icon: null,
  },
  {
    id: "fats",
    label: "Fats",
    value: "73g",
    valueClass: "progress-diet-macro-value--fats",
    icon: null,
  },
];

const DIET_MEALS = [
  {
    id: "b",
    title: "Breakfast",
    time: "7:00 AM",
    calLabel: "520 cal",
    items: ["Oatmeal with berries", "Protein shake", "2 boiled eggs"],
  },
  {
    id: "s",
    title: "Mid-Morning Snack",
    time: "10:30 AM",
    calLabel: "250 cal",
    items: ["Greek yogurt", "Handful of almonds"],
  },
  {
    id: "l",
    title: "Lunch",
    time: "1:00 PM",
    calLabel: "650 cal",
    items: ["Grilled chicken breast", "Brown rice", "Mixed vegetables"],
  },
  {
    id: "p",
    title: "Pre-Workout",
    time: "4:30 PM",
    calLabel: "200 cal",
    items: ["Banana", "Peanut butter"],
  },
];

function DietMacroIcon({ type }) {
  if (type !== "flame") return null;
  return (
    <svg className="progress-diet-macro-flame" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3s-4.5 5.5-4.5 9.5a4.5 4.5 0 1 0 9 0c0-2.5-2-4.5-2-6.5 0-1.5 1.2-2.4 1.5-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const WORKOUT_DETAILS = {
  mon: [
    "Bench & overhead press — 4×8 @ RPE 7",
    "Rows & face pulls — 3×12",
    "Arms superset — 3 rounds",
    "Stretch & mobility — 8 min",
  ],
  tue: ["Treadmill intervals — 6 rounds", "Plank series — 3×45s", "Bike finisher — 10 min", "Core circuit — 12 min"],
  wed: ["Squat pattern — 5×5", "RDL & split squat — 3×10 each", "Leg curl — 3×12", "Cooldown walk — 5 min"],
  thu: ["Light spin — 15 min", "Foam rolling — 10 min", "Yoga flow — 20 min", "Hydration check-in"],
  fri: ["Circuit A — 4 stations × 3 rounds", "KB swings — 30s on / 30s off", "Finisher sled push", "Walk-out cool-down"],
  sat: ["Warm-up drills — 6 min", "Tabata rounds × 8", "Battle ropes — 4×30s", "Walk & breathe — 5 min"],
  sun: ["Easy walk or swim — 15 min", "Stretching — 10 min", "Light core — 8 min", "Recovery checklist"],
};

function ProgressTrackingPage() {
  const planTitleId = useId();
  const dietTitleId = useId();
  const logTitleId = useId();
  const detailTitleId = useId();
  const summaryTitleId = useId();
  const [category, setCategory] = useState("overview");
  const [timeRange, setTimeRange] = useState("week");
  const [planOpen, setPlanOpen] = useState(false);
  const [dietOpen, setDietOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [logDayId, setLogDayId] = useState(() => getTodayPlanId());
  const [logWorkoutType, setLogWorkoutType] = useState("");
  const [logDuration, setLogDuration] = useState("60");
  const [logNotes, setLogNotes] = useState("");
  const [dayLogs, setDayLogs] = useState(loadWorkoutLogs);
  const [planDays, setPlanDays] = useState(() => WEEKLY_PLAN.map((r) => ({ ...r })));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const [detailDay, setDetailDay] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [sessionNow, setSessionNow] = useState(() => Date.now());
  const [finishSummary, setFinishSummary] = useState(null);

  const todayId = getTodayPlanId();

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 4200);
  }, []);

  const closePlan = useCallback(() => {
    setPlanOpen(false);
    setDetailDay(null);
  }, []);

  const closeDiet = useCallback(() => setDietOpen(false), []);

  const closeLog = useCallback(() => setLogOpen(false), []);

  useEffect(() => {
    if (!logOpen) return undefined;
    setLogDayId(getTodayPlanId());
    setLogWorkoutType("");
    setLogDuration("60");
    setLogNotes("");
    return undefined;
  }, [logOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(WORKOUT_LOG_STORAGE_KEY, JSON.stringify(dayLogs));
    } catch {
      /* ignore quota */
    }
  }, [dayLogs]);

  const submitWorkoutLog = useCallback(
    (e) => {
      e.preventDefault();
      const type = logWorkoutType.trim();
      if (!type) {
        showToast("Add a workout type so this entry is easy to spot later.");
        return;
      }
      const mins = parseInt(logDuration, 10);
      if (!Number.isFinite(mins) || mins <= 0) {
        showToast("Duration should be a positive number of minutes.");
        return;
      }
      const entry = {
        workoutType: type,
        durationMin: mins,
        notes: logNotes.trim(),
        loggedAt: Date.now(),
      };
      setDayLogs((prev) => ({
        ...prev,
        [logDayId]: [...(prev[logDayId] || []), entry],
      }));
      const dayLabel = planDays.find((d) => d.id === logDayId)?.dayLabel || logDayId;
      setLogOpen(false);
      showToast(`Logged for ${dayLabel}. Open Plan to see it on that day.`);
    },
    [logWorkoutType, logDuration, logNotes, logDayId, planDays, showToast],
  );

  const handlePlanRowClick = useCallback(
    (row) => {
      if (row.id !== todayId) {
        showToast(
          `That’s ${row.dayLabel}’s plan — not today (${formatTodayTitle()}). When that day arrives, you’ll be able to open it and go.`,
        );
        return;
      }
      if (row.completed) {
        showToast("You already logged this one. Save the energy for the next session.");
        return;
      }
      setDetailDay(row);
    },
    [todayId, showToast],
  );

  const beginWorkout = useCallback(
    (row) => {
      if (row.completed) {
        showToast("Already finished — nice work.");
        return;
      }
      if (row.id !== todayId) {
        showToast(`Heads up: you can only start ${formatTodayTitle()}’s workout today.`);
        return;
      }
      setDetailDay(null);
      setActiveSession({
        dayId: row.id,
        dayLabel: row.dayLabel,
        title: row.title,
        duration: row.duration,
        details: WORKOUT_DETAILS[row.id] || ["Follow coach cues", "Stay hydrated", "Log how you feel"],
        startedAt: Date.now(),
      });
    },
    [todayId, showToast],
  );

  const finishWorkout = useCallback(() => {
    if (!activeSession) return;
    const endedAt = Date.now();
    const durationMs = endedAt - activeSession.startedAt;
    setPlanDays((prev) =>
      prev.map((d) => (d.id === activeSession.dayId ? { ...d, completed: true } : d)),
    );
    setFinishSummary({
      title: activeSession.title,
      dayLabel: activeSession.dayLabel,
      startedAt: activeSession.startedAt,
      endedAt,
      durationMs,
    });
    setActiveSession(null);
  }, [activeSession]);

  const blockOverlays = planOpen || dietOpen || logOpen || !!detailDay || !!activeSession || !!finishSummary;

  useEffect(() => {
    if (!blockOverlays) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [blockOverlays]);

  useEffect(() => {
    if (activeSession) return undefined;
    if (!planOpen && !dietOpen && !logOpen && !detailDay) return undefined;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (detailDay) {
        setDetailDay(null);
        return;
      }
      if (logOpen) {
        closeLog();
        return;
      }
      if (dietOpen) {
        closeDiet();
        return;
      }
      if (planOpen) closePlan();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [planOpen, dietOpen, logOpen, activeSession, detailDay, closePlan, closeDiet, closeLog]);

  useEffect(() => {
    if (!activeSession) return undefined;
    setSessionNow(Date.now());
    const id = setInterval(() => setSessionNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [activeSession]);

  useEffect(() => () => toastTimer.current && clearTimeout(toastTimer.current), []);

  const elapsedMs = activeSession ? sessionNow - activeSession.startedAt : 0;

  useEffect(() => {
    if (!activeSession) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeSession]);

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
            <button type="button" className="progress-next-action" onClick={() => setPlanOpen(true)}>
              <svg className="progress-next-action-ico" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="8" width="4" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="16" y="8" width="4" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Plan
            </button>
            <button type="button" className="progress-next-action" onClick={() => setDietOpen(true)}>
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
            <button type="button" className="progress-next-action" onClick={() => setLogOpen(true)}>
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

        <div className="progress-segment" role="tablist" aria-label="Metric category">
          {CATEGORY_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={category === t.id}
              className={`progress-segment-tab${category === t.id ? " progress-segment-tab--active" : ""}`}
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
              className={`progress-time-tab${timeRange === t.id ? " progress-time-tab--active" : ""}`}
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

        <section className="progress-goals" aria-label="Active goals">
          <div className="progress-goals-head">
            <span className="progress-goals-head-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="progress-goals-head-svg">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="1.2" fill="currentColor" />
              </svg>
            </span>
            <h2 className="progress-goals-title">Active Goals</h2>
          </div>

          <article className="progress-goal-card progress-goal-card--weight">
            <div className="progress-goal-top">
              <div className="progress-goal-icon progress-goal-icon--weight" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="progress-goal-icon-svg">
                  <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="progress-goal-text">
                <p className="progress-goal-title">Lose 5kg</p>
                <p className="progress-goal-sub">3 / 5 kg</p>
              </div>
              <span className="progress-goal-pct">60%</span>
            </div>
            <div className="progress-goal-bar">
              <div className="progress-goal-fill progress-goal-fill--orange" style={{ width: "60%" }} />
            </div>
          </article>

          <article className="progress-goal-card progress-goal-card--strength">
            <div className="progress-goal-top">
              <div className="progress-goal-icon progress-goal-icon--strength" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="progress-goal-icon-svg">
                  <rect x="5" y="9" width="3" height="6" rx="0.8" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="16" y="9" width="3" height="6" rx="0.8" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="progress-goal-text">
                <p className="progress-goal-title">Bench 100kg</p>
                <p className="progress-goal-sub">60 / 100 kg</p>
              </div>
              <span className="progress-goal-pct">60%</span>
            </div>
            <div className="progress-goal-bar">
              <div className="progress-goal-fill progress-goal-fill--purple" style={{ width: "60%" }} />
            </div>
          </article>

          <article className="progress-goal-card progress-goal-card--activity">
            <div className="progress-goal-top">
              <div className="progress-goal-icon progress-goal-icon--activity" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="progress-goal-icon-svg">
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
              <div className="progress-goal-text">
                <p className="progress-goal-title">20 Workouts</p>
                <p className="progress-goal-sub">12 / 20</p>
              </div>
              <span className="progress-goal-pct">60%</span>
            </div>
            <div className="progress-goal-bar">
              <div className="progress-goal-fill progress-goal-fill--green" style={{ width: "60%" }} />
            </div>
          </article>
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

      {planOpen ? (
        <div className="progress-plan-portal" role="presentation">
          <button
            type="button"
            className="progress-plan-backdrop"
            aria-label="Close weekly plan"
            onClick={closePlan}
          />
          <div
            className="progress-plan-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={planTitleId}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="progress-plan-header">
              <h2 id={planTitleId} className="progress-plan-title">
                Weekly Workout Plan
              </h2>
              <button type="button" className="progress-plan-close" onClick={closePlan} aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
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
            <ul className="progress-plan-list">
              {planDays.map((row) => {
                const isToday = row.id === todayId;
                const rowCls = [
                  "progress-plan-row",
                  isToday && !row.completed ? "progress-plan-row--today" : "",
                  row.completed ? "progress-plan-row--done" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                const logsForDay = dayLogs[row.id] || [];
                return (
                  <li key={row.id}>
                    <div className={rowCls}>
                      <div
                        className={`progress-plan-status${row.completed ? " progress-plan-status--done" : ""}`}
                        aria-hidden="true"
                      >
                        {row.completed ? (
                          <svg viewBox="0 0 24 24" className="progress-plan-status-ico">
                            <circle cx="12" cy="12" r="10" fill="#22c55e" />
                            <path
                              d="M8.2 12.3l2.4 2.3 5.2-5.2"
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="progress-plan-status-ico">
                            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        )}
                      </div>
                      <button
                        type="button"
                        className="progress-plan-main progress-plan-main--btn"
                        onClick={() => handlePlanRowClick(row)}
                      >
                        <span className="progress-plan-day">{row.dayLabel}</span>
                        <span className="progress-plan-workout">{row.title}</span>
                        <span className="progress-plan-meta">
                          <svg className="progress-plan-clock" viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          {row.duration}
                        </span>
                      </button>
                      <div className="progress-plan-actions">
                        {!row.completed ? (
                          <button type="button" className="progress-plan-start" onClick={() => beginWorkout(row)}>
                            Start
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {logsForDay.length > 0 ? (
                      <ul className="progress-plan-day-logs" aria-label={`Logged workouts for ${row.dayLabel}`}>
                        {logsForDay.map((log, idx) => (
                          <li key={`${log.loggedAt}-${idx}`} className="progress-plan-day-log">
                            <span className="progress-plan-day-log-badge">Logged</span>
                            <span className="progress-plan-day-log-when">{formatLogWhen(log.loggedAt)}</span>
                            <span className="progress-plan-day-log-main">
                              {log.workoutType} · {log.durationMin} min
                            </span>
                            {log.notes ? <p className="progress-plan-day-log-notes">{log.notes}</p> : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      {dietOpen ? (
        <div className="progress-diet-portal" role="presentation">
          <button
            type="button"
            className="progress-diet-backdrop"
            aria-label="Close diet plan"
            onClick={closeDiet}
          />
          <div
            className="progress-diet-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dietTitleId}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="progress-diet-header">
              <h2 id={dietTitleId} className="progress-diet-title">
                Daily Diet Plan
              </h2>
              <button type="button" className="progress-plan-close" onClick={closeDiet} aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
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
            <div className="progress-diet-macros">
              {DIET_MACROS.map((m) => (
                <div key={m.id} className="progress-diet-macro-card">
                  {m.icon ? <DietMacroIcon type={m.icon} /> : null}
                  <span className={`progress-diet-macro-value ${m.valueClass}`}>{m.value}</span>
                  <span className="progress-diet-macro-label">{m.label}</span>
                </div>
              ))}
            </div>
            <div className="progress-diet-meals">
              {DIET_MEALS.map((meal) => (
                <article key={meal.id} className="progress-diet-meal-card">
                  <div className="progress-diet-meal-top">
                    <h3 className="progress-diet-meal-title">{meal.title}</h3>
                    <span className="progress-diet-meal-cal">{meal.calLabel}</span>
                  </div>
                  <p className="progress-diet-meal-time">
                    <svg className="progress-diet-meal-clock" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {meal.time}
                  </p>
                  <ul className="progress-diet-meal-list">
                    {meal.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {logOpen ? (
        <div className="progress-log-portal" role="presentation">
          <button type="button" className="progress-log-backdrop" aria-label="Close log workout" onClick={closeLog} />
          <div
            className="progress-log-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={logTitleId}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="progress-log-header">
              <h2 id={logTitleId} className="progress-log-title">
                Log Workout
              </h2>
              <button type="button" className="progress-plan-close" onClick={closeLog} aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
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
            <form className="progress-log-form" onSubmit={submitWorkoutLog}>
              <div className="progress-log-fields">
                <label className="progress-log-label" htmlFor="progress-log-day">
                  Day
                </label>
                <select
                  id="progress-log-day"
                  className="progress-log-input progress-log-select"
                  value={logDayId}
                  onChange={(e) => setLogDayId(e.target.value)}
                >
                  {planDays.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.dayLabel}
                    </option>
                  ))}
                </select>

                <label className="progress-log-label" htmlFor="progress-log-type">
                  Workout type
                </label>
                <input
                  id="progress-log-type"
                  className="progress-log-input"
                  type="text"
                  value={logWorkoutType}
                  onChange={(e) => setLogWorkoutType(e.target.value)}
                  placeholder="e.g. Upper body, Run, Yoga"
                  autoComplete="off"
                />

                <label className="progress-log-label" htmlFor="progress-log-duration">
                  Duration (minutes)
                </label>
                <input
                  id="progress-log-duration"
                  className="progress-log-input"
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={logDuration}
                  onChange={(e) => setLogDuration(e.target.value)}
                />

                <label className="progress-log-label" htmlFor="progress-log-notes">
                  Notes (optional)
                </label>
                <textarea
                  id="progress-log-notes"
                  className="progress-log-input progress-log-textarea"
                  rows={4}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="How did it go?"
                />
              </div>
              <div className="progress-log-actions">
                <button type="button" className="progress-log-cancel" onClick={closeLog}>
                  Cancel
                </button>
                <button type="submit" className="progress-log-submit">
                  <svg className="progress-log-submit-ico" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M20 6L9 17l-5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Log Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="progress-toast" role="status">
          {toast}
        </div>
      ) : null}

      {planOpen && detailDay && !activeSession ? (
        <div className="progress-detail-portal" role="presentation">
          <button
            type="button"
            className="progress-detail-backdrop"
            aria-label="Close details"
            onClick={() => setDetailDay(null)}
          />
          <div
            className="progress-detail-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={detailTitleId}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="progress-detail-head">
              <h2 id={detailTitleId} className="progress-detail-title">
                {detailDay.title}
              </h2>
              <button type="button" className="progress-plan-close" onClick={() => setDetailDay(null)} aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
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
            <p className="progress-detail-sub">
              {detailDay.dayLabel} · {detailDay.duration} · Today ({formatTodayTitle()})
            </p>
            <ul className="progress-detail-list">
              {(WORKOUT_DETAILS[detailDay.id] || []).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <div className="progress-detail-actions">
              <button type="button" className="progress-detail-secondary" onClick={() => setDetailDay(null)}>
                Not now
              </button>
              <button type="button" className="progress-detail-primary" onClick={() => beginWorkout(detailDay)}>
                Begin workout
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {activeSession ? (
        <div className="progress-session" role="dialog" aria-modal="true" aria-label="Workout in progress">
          <div className="progress-session-inner">
            <p className="progress-session-label">In session</p>
            <h2 className="progress-session-title">{activeSession.title}</h2>
            <p className="progress-session-sub">
              {activeSession.dayLabel} · Planned {activeSession.duration}
            </p>
            <div className="progress-session-timer" aria-live="polite">
              <span className="progress-session-timer-label">Elapsed</span>
              <span className="progress-session-timer-value">{formatDuration(elapsedMs)}</span>
            </div>
            <p className="progress-session-started">Started at {formatClock(activeSession.startedAt)}</p>
            <ul className="progress-session-details">
              {activeSession.details.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <button type="button" className="progress-session-finish" onClick={finishWorkout}>
              Finish
            </button>
            <p className="progress-session-note">Everything else is paused until you finish or complete the session.</p>
          </div>
        </div>
      ) : null}

      {finishSummary ? (
        <div className="progress-summary-portal" role="presentation">
          <button
            type="button"
            className="progress-summary-backdrop"
            aria-label="Close summary"
            onClick={() => setFinishSummary(null)}
          />
          <div
            className="progress-summary-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={summaryTitleId}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id={summaryTitleId} className="progress-summary-title">
              Workout logged
            </h2>
            <p className="progress-summary-line">
              <strong>{finishSummary.title}</strong> · {finishSummary.dayLabel}
            </p>
            <dl className="progress-summary-dl">
              <div>
                <dt>Duration</dt>
                <dd>{formatDuration(finishSummary.durationMs)}</dd>
              </div>
              <div>
                <dt>Started</dt>
                <dd>{formatClock(finishSummary.startedAt)}</dd>
              </div>
              <div>
                <dt>Finished</dt>
                <dd>{formatClock(finishSummary.endedAt)}</dd>
              </div>
            </dl>
            <button type="button" className="progress-summary-ok" onClick={() => setFinishSummary(null)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default ProgressTrackingPage;
