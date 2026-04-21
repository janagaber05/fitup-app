import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./ProfilePage.css";

const AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80";
const COACH_AVATAR =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80";

const COACH_NAME = "Sarah Johnson";

const FAVORITE_GYM = "Downtown";

const PRIVATE_PACKAGES = [
  { id: "1", title: "1 Session", sessions: 1, amount: 75, price: "$75" },
  { id: "5", title: "5 Sessions", sessions: 5, amount: 100, price: "$100" },
  { id: "10", title: "10 Sessions", sessions: 10, amount: 350, price: "$350" },
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
const PROFILE_INFO_KEY = "fitup-profile-info";
const MEMBERSHIP_SUBSCRIPTION_KEY = "fitup-membership-subscription";
const PRIVATE_SESSIONS_USAGE_KEY = "fitup-private-sessions-usage";
const PRIVATE_SESSIONS_CREDITS_KEY = "fitup-private-sessions-credits";
const PRIVATE_BOOKINGS_KEY = "fitup-profile-private-bookings";
const SESSION_KEY = "fitup-auth-session";
const PAYMENT_METHODS_KEY = "fitup-payment-methods";
const PAYMENT_DEFAULT_KEY = "fitup-payment-default-method";
const SECURITY_PREFS_KEY = "fitup-security-prefs";
const PRIVATE_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PRIVATE_TIMES = ["09:00 AM", "11:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"];
const DEFAULT_PAYMENT_METHODS = [
  { id: "axis", label: "Axis Bank", last4: "1234", brand: "mastercard" },
  { id: "hdfc", label: "HDFC Bank", last4: "1234", brand: "visa" },
  { id: "telda", label: "Telda", last4: "7781", brand: "telda" },
];
const HELP_FAQS = [
  {
    id: "book",
    q: "How do I book a session?",
    a: "Go to Book Session, choose class/private/wellness, then confirm your slot and payment if required.",
  },
  {
    id: "freeze",
    q: "How do I freeze my membership?",
    a: "Open Membership, tap Freeze, choose freeze days, and confirm within your plan allowance.",
  },
  {
    id: "payment",
    q: "How do I update payment method?",
    a: "From Profile > Quick Actions > Payment Methods, choose default card or add a new card.",
  },
];

function formatChatTime(d = new Date()) {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

const DEFAULT_PROFILE_INFO = {
  fullName: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 123-4567",
  dob: "January 15, 1995",
  gender: "Male",
  fitnessGoals: "Build Muscle, Increase Endurance",
  injuries: "",
  illnesses: "",
};

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
  const navigate = useNavigate();
  const location = useLocation();
  const chatTitleId = useId();
  const bookTitleId = useId();
  const [chatOpen, setChatOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [messages, setMessages] = useState(CHAT_INITIAL);
  const [draft, setDraft] = useState("");
  const [profileInfo, setProfileInfo] = useState(() => {
    try {
      const raw = localStorage.getItem(PROFILE_INFO_KEY);
      return raw ? { ...DEFAULT_PROFILE_INFO, ...JSON.parse(raw) } : DEFAULT_PROFILE_INFO;
    } catch {
      return DEFAULT_PROFILE_INFO;
    }
  });
  const [editDraft, setEditDraft] = useState(profileInfo);
  const [bookNotice, setBookNotice] = useState("");
  const [bookingDay, setBookingDay] = useState(PRIVATE_DAYS[0]);
  const [bookingTime, setBookingTime] = useState(PRIVATE_TIMES[0]);
  const [privateBookings, setPrivateBookings] = useState(() => {
    try {
      const raw = localStorage.getItem(PRIVATE_BOOKINGS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [actionNotice, setActionNotice] = useState("");
  const [securityNotice, setSecurityNotice] = useState("");
  const [securityPrefs, setSecurityPrefs] = useState(() => {
    try {
      const raw = localStorage.getItem(SECURITY_PREFS_KEY);
      if (!raw) {
        return { biometricLogin: false, loginAlerts: true, profilePublic: false };
      }
      return { biometricLogin: false, loginAlerts: true, profilePublic: false, ...JSON.parse(raw) };
    } catch {
      return { biometricLogin: false, loginAlerts: true, profilePublic: false };
    }
  });
  const [passwordDraft, setPasswordDraft] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [paymentMethods, setPaymentMethods] = useState(() => {
    try {
      const raw = localStorage.getItem(PAYMENT_METHODS_KEY);
      if (!raw) return DEFAULT_PAYMENT_METHODS;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PAYMENT_METHODS;
    } catch {
      return DEFAULT_PAYMENT_METHODS;
    }
  });
  const [defaultPaymentId, setDefaultPaymentId] = useState(() => {
    const preferred = localStorage.getItem(PAYMENT_DEFAULT_KEY);
    if (preferred) return preferred;
    return DEFAULT_PAYMENT_METHODS[0].id;
  });
  const [extraPrivateCredits, setExtraPrivateCredits] = useState(() => {
    const raw = localStorage.getItem(PRIVATE_SESSIONS_CREDITS_KEY);
    const value = Number(raw);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  });
  const [monthlyPrivateUsage, setMonthlyPrivateUsage] = useState(() => {
    try {
      const raw = localStorage.getItem(PRIVATE_SESSIONS_USAGE_KEY);
      return raw ? JSON.parse(raw) : { cycle: "", used: 0 };
    } catch {
      return { cycle: "", used: 0 };
    }
  });
  const nextMsgId = useRef(0);
  const currentSubscription = useMemo(() => {
    try {
      const raw = localStorage.getItem(MEMBERSHIP_SUBSCRIPTION_KEY);
      return raw ? JSON.parse(raw) : { planId: "premium" };
    } catch {
      return { planId: "premium" };
    }
  }, []);
  const includedPrivateSessions = currentSubscription.planId === "elite" ? 4 : 0;
  const currentCycle = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const normalizedUsage = useMemo(
    () =>
      monthlyPrivateUsage.cycle === currentCycle
        ? monthlyPrivateUsage
        : { cycle: currentCycle, used: 0 },
    [monthlyPrivateUsage, currentCycle],
  );
  const remainingIncludedSessions = Math.max(0, includedPrivateSessions - normalizedUsage.used);
  const profileRows = [
    { label: "Full Name", value: profileInfo.fullName },
    { label: "Email Address", value: profileInfo.email },
    { label: "Phone Number", value: profileInfo.phone },
    { label: "Date of Birth", value: profileInfo.dob },
    { label: "Gender", value: profileInfo.gender },
    { label: "Fitness Goals", value: profileInfo.fitnessGoals },
    { label: "Injuries", value: profileInfo.injuries || "None reported" },
    { label: "Illnesses", value: profileInfo.illnesses || "None reported" },
  ];

  const closeChat = useCallback(() => {
    setChatOpen(false);
    setDraft("");
  }, []);

  const closeBook = useCallback(() => {
    setBookOpen(false);
    setBookNotice("");
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
  }, []);

  const closePayments = useCallback(() => {
    setPaymentsOpen(false);
  }, []);

  const closeSecurity = useCallback(() => {
    setSecurityOpen(false);
    setSecurityNotice("");
    setPasswordDraft({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }, []);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
  }, []);

  const openEdit = useCallback(() => {
    setEditDraft(profileInfo);
    setEditOpen(true);
  }, [profileInfo]);

  useEffect(() => {
    const anyOpen = chatOpen || bookOpen || editOpen || paymentsOpen || securityOpen || helpOpen;
    if (!anyOpen) return undefined;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (helpOpen) closeHelp();
      else if (securityOpen) closeSecurity();
      else if (paymentsOpen) closePayments();
      else if (editOpen) closeEdit();
      else if (bookOpen) closeBook();
      else closeChat();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [chatOpen, bookOpen, editOpen, paymentsOpen, securityOpen, helpOpen, closeChat, closeBook, closeEdit, closePayments, closeSecurity, closeHelp]);

  useEffect(() => {
    localStorage.setItem(PROFILE_INFO_KEY, JSON.stringify(profileInfo));
  }, [profileInfo]);

  useEffect(() => {
    localStorage.setItem(PRIVATE_SESSIONS_CREDITS_KEY, String(extraPrivateCredits));
  }, [extraPrivateCredits]);

  useEffect(() => {
    localStorage.setItem(PRIVATE_SESSIONS_USAGE_KEY, JSON.stringify(normalizedUsage));
  }, [normalizedUsage]);

  useEffect(() => {
    localStorage.setItem(PRIVATE_BOOKINGS_KEY, JSON.stringify(privateBookings));
  }, [privateBookings]);

  useEffect(() => {
    localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem(PAYMENT_DEFAULT_KEY, defaultPaymentId);
  }, [defaultPaymentId]);

  useEffect(() => {
    localStorage.setItem(SECURITY_PREFS_KEY, JSON.stringify(securityPrefs));
  }, [securityPrefs]);

  useEffect(() => {
    if (!location.state?.privatePaymentNotice) return;
    setBookNotice(location.state.privatePaymentNotice);
    const added = Number(location.state.privateCreditsAdded || 0);
    if (added > 0) {
      setExtraPrivateCredits((prev) => prev + added);
    }
    setBookOpen(true);
    navigate("/profile", { replace: true });
  }, [location.state, navigate]);

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

  const saveProfile = () => {
    if (!editDraft.fullName.trim() || !editDraft.email.trim()) return;
    setProfileInfo({
      ...editDraft,
      fullName: editDraft.fullName.trim(),
      email: editDraft.email.trim(),
      phone: editDraft.phone.trim(),
      dob: editDraft.dob.trim(),
      gender: editDraft.gender.trim(),
      fitnessGoals: editDraft.fitnessGoals.trim(),
      injuries: editDraft.injuries.trim(),
      illnesses: editDraft.illnesses.trim(),
    });
    setEditOpen(false);
  };

  const bookFromIncludedPlan = () => {
    if (includedPrivateSessions <= 0) {
      setBookNotice("Your current plan does not include private sessions. Upgrade or buy extra sessions.");
      return;
    }
    if (remainingIncludedSessions <= 0) {
      setBookNotice("No included private sessions left this month. Upgrade or buy more.");
      return;
    }
    setMonthlyPrivateUsage((prev) => {
      const base = prev.cycle === currentCycle ? prev : { cycle: currentCycle, used: 0 };
      return { cycle: currentCycle, used: base.used + 1 };
    });
    setPrivateBookings((prev) => [
      {
        id: `profile-book-${Date.now()}`,
        day: bookingDay,
        time: bookingTime,
        source: "Included session",
      },
      ...prev,
    ]);
    setBookNotice(`Private session booked with ${COACH_NAME} on ${bookingDay} at ${bookingTime}.`);
  };

  const bookFromExtraCredits = () => {
    if (extraPrivateCredits <= 0) {
      setBookNotice("No extra private sessions available. Buy a package first.");
      return;
    }
    setExtraPrivateCredits((prev) => prev - 1);
    setPrivateBookings((prev) => [
      {
        id: `profile-book-${Date.now()}`,
        day: bookingDay,
        time: bookingTime,
        source: "Purchased session",
      },
      ...prev,
    ]);
    setBookNotice(`Private session booked with ${COACH_NAME} on ${bookingDay} at ${bookingTime}.`);
  };

  const buyPrivatePackage = (pkg) => {
    navigate("/membership/payment", {
      state: {
        paymentMode: "profile-private",
        privatePackage: pkg,
        returnTo: "/profile",
      },
    });
  };

  const exportMyData = () => {
    const payload = {
      profileInfo,
      privateSessions: {
        includedPerMonth: includedPrivateSessions,
        remainingIncludedSessions,
        purchasedCredits: extraPrivateCredits,
        bookings: privateBookings,
      },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fitup-profile-data.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setActionNotice("Your data file has been downloaded.");
  };

  const handleQuickAction = (id) => {
    if (id === "notif") {
      navigate("/notifications");
      return;
    }
    if (id === "pay") {
      setPaymentsOpen(true);
      return;
    }
    if (id === "sec") {
      setSecurityOpen(true);
      return;
    }
    if (id === "export") {
      exportMyData();
      return;
    }
    if (id === "help") {
      setHelpOpen(true);
      return;
    }
    if (id === "logout") {
      localStorage.removeItem(SESSION_KEY);
      navigate("/auth", { replace: true });
    }
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods((prev) => {
      const next = prev.filter((card) => card.id !== id);
      if (next.length === 0) return prev;
      if (!next.some((card) => card.id === defaultPaymentId)) {
        setDefaultPaymentId(next[0].id);
      }
      return next;
    });
  };

  const renderBrand = (brand) => {
    if (brand === "mastercard") return "Mastercard";
    if (brand === "visa") return "Visa";
    return "Telda";
  };

  const saveSecuritySettings = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordDraft;
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setSecurityNotice("Fill all password fields to update password.");
        return;
      }
      if (newPassword.length < 6) {
        setSecurityNotice("New password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setSecurityNotice("New password and confirm password do not match.");
        return;
      }
    }
    setSecurityNotice("Security and privacy settings saved.");
    setPasswordDraft({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
          <div className="profile-section-head">
            <h3 className="profile-section-title">Personal Information</h3>
            <button type="button" className="profile-edit-btn" onClick={openEdit}>
              Edit
            </button>
          </div>
          <div className="profile-info-card">
            {profileRows.map((row, i) => (
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
                <button
                  type="button"
                  className={`profile-qa-row${a.danger ? " profile-qa-row-danger" : ""}`}
                  onClick={() => handleQuickAction(a.id)}
                >
                  <span className="profile-qa-icon">
                    <QuickIcon type={a.icon} />
                  </span>
                  <span className="profile-qa-label">{a.label}</span>
                </button>
              </li>
            ))}
          </ul>
          {actionNotice ? <p className="profile-action-notice">{actionNotice}</p> : null}
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
              <div className="profile-private-summary">
                <p>
                  Included in plan: <strong>{includedPrivateSessions}</strong> / month
                </p>
                <p>
                  Remaining included: <strong>{remainingIncludedSessions}</strong>
                </p>
                <p>
                  Extra purchased sessions: <strong>{extraPrivateCredits}</strong>
                </p>
              </div>
              <div className="profile-private-slot-row">
                <select className="profile-private-select" value={bookingDay} onChange={(e) => setBookingDay(e.target.value)}>
                  {PRIVATE_DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select className="profile-private-select" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}>
                  {PRIVATE_TIMES.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="profile-private-actions">
                <button type="button" className="profile-package-select" onClick={bookFromIncludedPlan}>
                  Book From Plan Session
                </button>
                <button type="button" className="profile-package-select profile-package-select--ghost" onClick={bookFromExtraCredits}>
                  Use Purchased Session
                </button>
              </div>
              {bookNotice ? <p className="profile-private-notice">{bookNotice}</p> : null}
              {privateBookings.length > 0 ? (
                <ul className="profile-private-bookings">
                  {privateBookings.slice(0, 3).map((row) => (
                    <li key={row.id} className="profile-private-booking-item">
                      <span>
                        {row.day} • {row.time}
                      </span>
                      <strong>{row.source}</strong>
                    </li>
                  ))}
                </ul>
              ) : null}
              <ul className="profile-packages-list">
                {PRIVATE_PACKAGES.map((pkg) => (
                  <li key={pkg.id} className="profile-package-card">
                    <div className="profile-package-top">
                      <span className="profile-package-name">{pkg.title}</span>
                      <span className="profile-package-price">{pkg.price}</span>
                    </div>
                    <p className="profile-package-desc">{PACKAGE_BLURB}</p>
                    <button type="button" className="profile-package-select" onClick={() => buyPrivatePackage(pkg)}>
                      Upgrade & Pay
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {editOpen ? (
        <div className="profile-edit-portal" role="presentation">
          <button type="button" className="profile-edit-backdrop" aria-label="Close edit form" onClick={closeEdit} />
          <div className="profile-edit-sheet" role="dialog" aria-modal="true" aria-label="Edit personal information" onClick={(e) => e.stopPropagation()}>
            <header className="profile-edit-header">
              <h2>Edit Personal Information</h2>
              <button type="button" className="profile-chat-close" onClick={closeEdit} aria-label="Close">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <div className="profile-edit-body">
              <label className="profile-edit-label">Full Name</label>
              <input className="profile-edit-input" value={editDraft.fullName} onChange={(e) => setEditDraft((prev) => ({ ...prev, fullName: e.target.value }))} />
              <label className="profile-edit-label">Email Address</label>
              <input className="profile-edit-input" type="email" value={editDraft.email} onChange={(e) => setEditDraft((prev) => ({ ...prev, email: e.target.value }))} />
              <label className="profile-edit-label">Phone Number</label>
              <input className="profile-edit-input" value={editDraft.phone} onChange={(e) => setEditDraft((prev) => ({ ...prev, phone: e.target.value }))} />
              <label className="profile-edit-label">Date of Birth</label>
              <input className="profile-edit-input" value={editDraft.dob} onChange={(e) => setEditDraft((prev) => ({ ...prev, dob: e.target.value }))} />
              <label className="profile-edit-label">Gender</label>
              <input className="profile-edit-input" value={editDraft.gender} onChange={(e) => setEditDraft((prev) => ({ ...prev, gender: e.target.value }))} />
              <label className="profile-edit-label">Fitness Goals</label>
              <textarea className="profile-edit-textarea" rows={2} value={editDraft.fitnessGoals} onChange={(e) => setEditDraft((prev) => ({ ...prev, fitnessGoals: e.target.value }))} />
              <label className="profile-edit-label">Injuries</label>
              <textarea className="profile-edit-textarea" rows={2} placeholder="Ex: Knee pain, shoulder strain..." value={editDraft.injuries} onChange={(e) => setEditDraft((prev) => ({ ...prev, injuries: e.target.value }))} />
              <label className="profile-edit-label">Illnesses</label>
              <textarea className="profile-edit-textarea" rows={2} placeholder="Ex: Asthma, diabetes..." value={editDraft.illnesses} onChange={(e) => setEditDraft((prev) => ({ ...prev, illnesses: e.target.value }))} />
            </div>
            <div className="profile-edit-actions">
              <button type="button" className="profile-edit-cancel" onClick={closeEdit}>Cancel</button>
              <button type="button" className="profile-edit-save" onClick={saveProfile}>Save</button>
            </div>
          </div>
        </div>
      ) : null}

      {paymentsOpen ? (
        <div className="profile-edit-portal" role="presentation">
          <button type="button" className="profile-edit-backdrop" aria-label="Close payment methods" onClick={closePayments} />
          <div className="profile-edit-sheet" role="dialog" aria-modal="true" aria-label="Payment methods" onClick={(e) => e.stopPropagation()}>
            <header className="profile-edit-header">
              <h2>Payment Methods</h2>
              <button type="button" className="profile-chat-close" onClick={closePayments} aria-label="Close">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <div className="profile-edit-body">
              <p className="profile-pay-sub">Your saved cards</p>
              <ul className="profile-pay-list">
                {paymentMethods.map((card) => (
                  <li key={card.id} className="profile-pay-item">
                    <label className="profile-pay-main">
                      <input
                        type="radio"
                        name="default-card"
                        checked={defaultPaymentId === card.id}
                        onChange={() => setDefaultPaymentId(card.id)}
                      />
                      <span>{renderBrand(card.brand)} •••• {card.last4}</span>
                    </label>
                    {paymentMethods.length > 1 ? (
                      <button type="button" className="profile-pay-remove" onClick={() => removePaymentMethod(card.id)}>
                        Remove
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
              <button type="button" className="profile-package-select" onClick={() => navigate("/membership/payment", { state: { returnTo: "/profile" } })}>
                Add New Card
              </button>
            </div>
            <div className="profile-edit-actions">
              <button type="button" className="profile-edit-save" onClick={closePayments}>Done</button>
            </div>
          </div>
        </div>
      ) : null}

      {securityOpen ? (
        <div className="profile-edit-portal" role="presentation">
          <button type="button" className="profile-edit-backdrop" aria-label="Close security settings" onClick={closeSecurity} />
          <div className="profile-edit-sheet" role="dialog" aria-modal="true" aria-label="Security and privacy" onClick={(e) => e.stopPropagation()}>
            <header className="profile-edit-header">
              <h2>Security & Privacy</h2>
              <button type="button" className="profile-chat-close" onClick={closeSecurity} aria-label="Close">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <div className="profile-edit-body">
              <div className="profile-sec-option">
                <div>
                  <p className="profile-sec-title">Biometric Login</p>
                  <p className="profile-sec-sub">Use Face ID / Fingerprint for faster sign-in.</p>
                </div>
                <input
                  type="checkbox"
                  checked={securityPrefs.biometricLogin}
                  onChange={(e) => setSecurityPrefs((prev) => ({ ...prev, biometricLogin: e.target.checked }))}
                />
              </div>
              <div className="profile-sec-option">
                <div>
                  <p className="profile-sec-title">Login Alerts</p>
                  <p className="profile-sec-sub">Get notified when a new device signs in.</p>
                </div>
                <input
                  type="checkbox"
                  checked={securityPrefs.loginAlerts}
                  onChange={(e) => setSecurityPrefs((prev) => ({ ...prev, loginAlerts: e.target.checked }))}
                />
              </div>
              <div className="profile-sec-option">
                <div>
                  <p className="profile-sec-title">Public Profile</p>
                  <p className="profile-sec-sub">Allow others to view your profile basics.</p>
                </div>
                <input
                  type="checkbox"
                  checked={securityPrefs.profilePublic}
                  onChange={(e) => setSecurityPrefs((prev) => ({ ...prev, profilePublic: e.target.checked }))}
                />
              </div>

              <p className="profile-pay-sub">Change Password</p>
              <label className="profile-edit-label">Current Password</label>
              <input
                className="profile-edit-input"
                type="password"
                value={passwordDraft.currentPassword}
                onChange={(e) => setPasswordDraft((prev) => ({ ...prev, currentPassword: e.target.value }))}
              />
              <label className="profile-edit-label">New Password</label>
              <input
                className="profile-edit-input"
                type="password"
                value={passwordDraft.newPassword}
                onChange={(e) => setPasswordDraft((prev) => ({ ...prev, newPassword: e.target.value }))}
              />
              <label className="profile-edit-label">Confirm New Password</label>
              <input
                className="profile-edit-input"
                type="password"
                value={passwordDraft.confirmPassword}
                onChange={(e) => setPasswordDraft((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              />
              {securityNotice ? <p className="profile-private-notice">{securityNotice}</p> : null}
            </div>
            <div className="profile-edit-actions">
              <button type="button" className="profile-edit-cancel" onClick={closeSecurity}>Cancel</button>
              <button type="button" className="profile-edit-save" onClick={saveSecuritySettings}>Save</button>
            </div>
          </div>
        </div>
      ) : null}

      {helpOpen ? (
        <div className="profile-edit-portal" role="presentation">
          <button type="button" className="profile-edit-backdrop" aria-label="Close help and support" onClick={closeHelp} />
          <div className="profile-edit-sheet" role="dialog" aria-modal="true" aria-label="Help and support" onClick={(e) => e.stopPropagation()}>
            <header className="profile-edit-header">
              <h2>Help & Support</h2>
              <button type="button" className="profile-chat-close" onClick={closeHelp} aria-label="Close">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <div className="profile-edit-body">
              <div className="profile-help-card">
                <p className="profile-help-title">Contact Support</p>
                <p className="profile-help-line">Live Chat: 24/7 in-app support</p>
                <p className="profile-help-line">Email: support@fitup.app</p>
                <p className="profile-help-line">Phone: +1 (800) 555-0148</p>
              </div>

              <p className="profile-pay-sub">Frequently Asked Questions</p>
              <ul className="profile-help-faqs">
                {HELP_FAQS.map((faq) => (
                  <li key={faq.id} className="profile-help-faq-item">
                    <p className="profile-help-q">{faq.q}</p>
                    <p className="profile-help-a">{faq.a}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="profile-edit-actions">
              <button type="button" className="profile-edit-save" onClick={closeHelp}>Done</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default ProfilePage;
