import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";
import "./MembershipPage.css";

const FREEZE_USAGE_KEY = "fitup-membership-freeze-used-days";
const MEMBERSHIP_SUBSCRIPTION_KEY = "fitup-membership-subscription";
const MEMBERSHIP_HISTORY_KEY = "fitup-membership-history";
const BILLING_LABELS = { monthly: "Monthly", q3: "3 Months", q6: "6 Months", yearly: "Yearly" };
const BILLING_MONTHS = { monthly: 1, q3: 3, q6: 6, yearly: 12 };
const PLAN_OPTIONS = [
  {
    id: "basic",
    name: "Basic Access",
    prices: { monthly: 49.99, q3: 139.99, q6: 259.99, yearly: 479.99 },
    perks: ["Gym floor access", "2 group classes / month", "Freeze allowance: 7 days / year"],
  },
  {
    id: "premium",
    name: "Premium All-Access",
    prices: { monthly: 89.99, q3: 249.99, q6: 469.99, yearly: 839.99 },
    perks: ["Unlimited gym access", "All group classes", "Freeze allowance: 21 days / year"],
  },
  {
    id: "elite",
    name: "Elite Performance",
    prices: { monthly: 129.99, q3: 369.99, q6: 699.99, yearly: 1199.99 },
    perks: ["Everything in Premium", "4 PT sessions / month", "Freeze allowance: 30 days / year"],
  },
];
const MEMBERSHIP_FREEZE_RULES = {
  "Basic Access": 7,
  "Premium All-Access": 21,
  "Elite Performance": 30,
};

function getRemainingFreezeDays(freezeUntil) {
  if (!freezeUntil) return 0;
  const diffMs = new Date(freezeUntil).getTime() - Date.now();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

function MembershipPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [freezeUntil, setFreezeUntil] = useState(null);
  const [freezeOpen, setFreezeOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceDraft, setInvoiceDraft] = useState(null);
  const [requestedFreezeDays, setRequestedFreezeDays] = useState(7);
  const [usedFreezeDays, setUsedFreezeDays] = useState(() => {
    const raw = localStorage.getItem(FREEZE_USAGE_KEY);
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : 0;
  });
  const [notice, setNotice] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState(() => {
    try {
      const raw = localStorage.getItem(MEMBERSHIP_SUBSCRIPTION_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return { planId: "premium", term: "monthly", startAt: new Date("2024-01-01").toISOString() };
  });
  const [paymentHistory, setPaymentHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(MEMBERSHIP_HISTORY_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return [
      { id: "h-1", title: "Monthly Subscription - Premium All-Access", sub: "Jan 1, 2024 · Visa **** 4242 · Membership fee", amount: "$89.99" },
      { id: "h-2", title: "Monthly Subscription - Premium All-Access", sub: "Dec 1, 2023 · Visa **** 4242 · Membership fee", amount: "$89.99" },
      { id: "h-3", title: "Monthly Subscription - Premium All-Access", sub: "Nov 1, 2023 · Visa **** 4242 · Membership fee", amount: "$89.99" },
    ];
  });

  const currentPlan = PLAN_OPTIONS.find((p) => p.id === currentSubscription.planId) || PLAN_OPTIONS[1];
  const currentPrice = currentPlan.prices[currentSubscription.term];
  const nextRenewal = useMemo(() => {
    const d = new Date(currentSubscription.startAt);
    d.setMonth(d.getMonth() + (BILLING_MONTHS[currentSubscription.term] || 1));
    return d.toLocaleDateString();
  }, [currentSubscription]);

  const maxFreezeDays = MEMBERSHIP_FREEZE_RULES[currentPlan.name] || 7;
  const remainingFreezeDays = Math.max(0, maxFreezeDays - usedFreezeDays);
  const currentFreezeRemaining = getRemainingFreezeDays(freezeUntil);

  const freezeLabel = useMemo(() => {
    if (!freezeUntil) return "Freeze";
    return `Frozen until ${new Date(freezeUntil).toLocaleDateString()}`;
  }, [freezeUntil]);

  useEffect(() => {
    localStorage.setItem(FREEZE_USAGE_KEY, String(usedFreezeDays));
  }, [usedFreezeDays]);

  useEffect(() => {
    if (!freezeOpen && !plansOpen && !invoiceOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [freezeOpen, plansOpen, invoiceOpen]);

  const openFreezePopup = useCallback(() => {
    setRequestedFreezeDays(Math.min(Math.max(1, requestedFreezeDays), Math.max(1, remainingFreezeDays)));
    setFreezeOpen(true);
  }, [remainingFreezeDays, requestedFreezeDays]);

  const closeFreezePopup = useCallback(() => {
    setFreezeOpen(false);
  }, []);

  const openPlansPopup = useCallback(() => {
    setPlansOpen(true);
  }, []);

  const closePlansPopup = useCallback(() => {
    setPlansOpen(false);
  }, []);

  const startPaymentFlow = useCallback(
    (planId, term) => {
      navigate("/membership/payment", { state: { planId, term } });
    },
    [navigate],
  );

  const applyFreeze = useCallback(() => {
    if (remainingFreezeDays <= 0) {
      setNotice("No freeze days left for your membership.");
      return;
    }
    const safeDays = Math.min(Math.max(1, requestedFreezeDays), remainingFreezeDays);
    const until = new Date();
    until.setDate(until.getDate() + safeDays);
    setFreezeUntil(until.toISOString());
    setUsedFreezeDays((prev) => prev + safeDays);
    setFreezeOpen(false);
    setNotice(`Membership frozen for ${safeDays} day${safeDays > 1 ? "s" : ""} (until ${until.toLocaleDateString()}).`);
  }, [remainingFreezeDays, requestedFreezeDays]);

  const unfreezeNow = useCallback(() => {
    setFreezeUntil(null);
    setFreezeOpen(false);
    setNotice("Membership unfrozen. Your plan is active again.");
  }, []);

  const handleInvoice = useCallback(() => {
    const today = new Date();
    const invoiceNumber = `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(
      today.getDate(),
    ).padStart(2, "0")}-001`;
    setInvoiceDraft({
      invoiceNumber,
      dateLabel: today.toLocaleDateString(),
      planLabel: `${currentPlan.name} (${BILLING_LABELS[currentSubscription.term]})`,
      amountLabel: `$${currentPrice.toFixed(2)}`,
      methodLabel: "Visa **** 4242",
      customerLabel: "FitUp Member",
    });
    setInvoiceOpen(true);
  }, [currentPlan.name, currentPrice, currentSubscription.term]);

  const downloadInvoice = useCallback(() => {
    if (!invoiceDraft) return;
    const invoiceText = [
      "FitUp Invoice",
      `Invoice #: ${invoiceDraft.invoiceNumber}`,
      `Date: ${invoiceDraft.dateLabel}`,
      `Customer: ${invoiceDraft.customerLabel}`,
      `Plan: ${invoiceDraft.planLabel}`,
      `Amount: ${invoiceDraft.amountLabel}`,
      `Payment Method: ${invoiceDraft.methodLabel}`,
      "",
      "Thank you for training with FitUp.",
    ].join("\n");
    const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoiceDraft.invoiceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setInvoiceOpen(false);
    setNotice(`Invoice downloaded (${invoiceDraft.invoiceNumber}).`);
  }, [invoiceDraft]);

  useEffect(() => {
    localStorage.setItem(MEMBERSHIP_SUBSCRIPTION_KEY, JSON.stringify(currentSubscription));
  }, [currentSubscription]);

  useEffect(() => {
    localStorage.setItem(MEMBERSHIP_HISTORY_KEY, JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  useEffect(() => {
    if (!location.state?.notice) return;
    setNotice(location.state.notice);
    setPlansOpen(false);
    if (location.state.subscription) setCurrentSubscription(location.state.subscription);
    if (location.state.paymentEntry) setPaymentHistory((prev) => [location.state.paymentEntry, ...prev]);
    navigate("/membership", { replace: true });
  }, [location.state, navigate]);

  return (
    <main className="membership-page">
      <section className="membership-content">
        <header className="membership-header">
          <Link to="/gyms" className="back-link">
            ← Membership
          </Link>
        </header>

        <section className="membership-plan-card">
          <div className="membership-plan-head">
            <div>
              <p className="small-label">Current Plan</p>
              <h1>{currentPlan.name}</h1>
            </div>
            <span className="active-pill">Active</span>
          </div>
          <div className="membership-row">
            <span>Start Date</span>
            <strong>{new Date(currentSubscription.startAt).toLocaleDateString()}</strong>
          </div>
          <div className="membership-row">
            <span>Next Renewal</span>
            <strong>{nextRenewal}</strong>
          </div>
          <div className="membership-row">
            <span>Price</span>
            <strong>${currentPrice.toFixed(2)} / {BILLING_LABELS[currentSubscription.term]}</strong>
          </div>
        </section>

        <section className="membership-actions">
          <button type="button" onClick={openFreezePopup}>
            <svg viewBox="0 0 24 24" className="action-icon" aria-hidden="true">
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
            {freezeLabel}
          </button>
          <button type="button" onClick={handleInvoice}>
            <svg viewBox="0 0 24 24" className="action-icon" aria-hidden="true">
              <path
                d="M6 3h9l4 4v14H6z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M15 3v4h4M9 12h6M9 16h6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Invoice
          </button>
        </section>
        {notice ? <p className="membership-notice">{notice}</p> : null}
        <p className="membership-freeze-meta">
          Freeze allowance: {maxFreezeDays} days/year · Remaining: {remainingFreezeDays} days
        </p>

        <section className="title-row">
          <h2>Payment History</h2>
        </section>

        <section className="history-list">
          {paymentHistory.map((item) => (
            <article key={item.id} className="history-item">
              <div className="history-left">
                <span className="history-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="history-icon-svg">
                    <path
                      d="M3 12h4l2-5 4 10 2-5h6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="history-title">{item.title}</p>
                  <p className="history-sub">{item.sub}</p>
                </div>
              </div>
              <div className="history-right">
                <p className="history-price">{item.amount}</p>
                <p className="history-pdf">
                  <svg viewBox="0 0 24 24" className="history-pdf-icon" aria-hidden="true">
                    <path
                      d="M12 3v12m0 0l-4-4m4 4l4-4M5 19h14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  PDF
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="benefits-grid">
          <article className="benefit-item">
            <span className="benefit-icon-bg benefit-green">
              <svg viewBox="0 0 24 24" className="benefit-icon" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
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
            <p>Unlimited Gym Access</p>
          </article>
          <article className="benefit-item">
            <span className="benefit-icon-bg benefit-orange">
              <svg viewBox="0 0 24 24" className="benefit-icon" aria-hidden="true">
                <path
                  d="M13 2L5 14h6l-1 8 9-12h-6l1-8z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p>All Group Classes</p>
          </article>
          <article className="benefit-item">
            <span className="benefit-icon-bg benefit-blue">
              <svg viewBox="0 0 24 24" className="benefit-icon" aria-hidden="true">
                <circle cx="9" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M4.5 18c1-2.4 2.7-3.5 4.5-3.5s3.5 1.1 4.5 3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="16.8" cy="9.2" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <p>Guest Pass (2/month)</p>
          </article>
          <article className="benefit-item">
            <span className="benefit-icon-bg benefit-yellow">
              <svg viewBox="0 0 24 24" className="benefit-icon" aria-hidden="true">
                <path
                  d="M12 3.6l2.6 5.2 5.7.8-4.1 4 1 5.7-5.2-2.7-5.2 2.7 1-5.7-4.1-4 5.7-.8z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p>Priority Booking</p>
          </article>
          <article className="benefit-item">
            <span className="benefit-icon-bg benefit-purple">
              <svg viewBox="0 0 24 24" className="benefit-icon" aria-hidden="true">
                <circle cx="12" cy="8.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M8.5 20l-.5-4 4-2 4 2-.5 4-3.5-1.6z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p>Personal Training (1/month)</p>
          </article>
          <article className="benefit-item">
            <span className="benefit-icon-bg benefit-red">
              <svg viewBox="0 0 24 24" className="benefit-icon" aria-hidden="true">
                <rect
                  x="4.5"
                  y="10"
                  width="15"
                  height="9"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 10V8a4 4 0 0 1 8 0v2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <p>24/7 Facility Access</p>
          </article>
        </section>

        <section className="upgrade-card" aria-labelledby="upgrade-heading">
          <div className="upgrade-card-inner">
            <h3 id="upgrade-heading">Upgrade to Annual</h3>
            <p className="upgrade-card-line">Save 20% by switching to our annual plan.</p>
            <p className="upgrade-card-line">Get 2 months free!</p>
            <button type="button" className="upgrade-card-cta" onClick={openPlansPopup}>
              View Plans
            </button>
          </div>
        </section>
      </section>
      {freezeOpen ? (
        <div className="freeze-modal-wrap" role="presentation">
          <button type="button" className="freeze-modal-backdrop" aria-label="Close freeze popup" onClick={closeFreezePopup} />
          <div className="freeze-modal" role="dialog" aria-modal="true" aria-label="Freeze membership">
            <header className="freeze-modal-head">
              <h2 className="freeze-modal-title">Freeze Membership</h2>
              <button type="button" className="freeze-modal-close" onClick={closeFreezePopup} aria-label="Close">
                ✕
              </button>
            </header>

            <div className="freeze-modal-body">
              <p className="freeze-modal-line">Plan: {currentPlan.name}</p>
              <p className="freeze-modal-line">Max freeze: {maxFreezeDays} days / year</p>
              <p className="freeze-modal-line">Used: {usedFreezeDays} days</p>
              <p className="freeze-modal-line">Remaining: {remainingFreezeDays} days</p>
              <p className="freeze-modal-line">
                Current freeze remaining: {currentFreezeRemaining > 0 ? `${currentFreezeRemaining} day(s)` : "Not frozen"}
              </p>

              <label className="freeze-modal-label" htmlFor="freeze-days-select">
                How long do you want to freeze?
              </label>
              <select
                id="freeze-days-select"
                className="freeze-modal-select"
                value={requestedFreezeDays}
                onChange={(e) => setRequestedFreezeDays(Number(e.target.value))}
                disabled={remainingFreezeDays <= 0}
              >
                {Array.from({ length: Math.max(remainingFreezeDays, 1) }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day} day{day > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="freeze-modal-actions">
              {currentFreezeRemaining > 0 ? (
                <button type="button" className="freeze-unfreeze-btn" onClick={unfreezeNow}>
                  Unfreeze Now
                </button>
              ) : null}
              <button
                type="button"
                className="freeze-confirm-btn"
                onClick={applyFreeze}
                disabled={remainingFreezeDays <= 0}
              >
                Confirm Freeze
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {plansOpen ? (
        <div className="plans-modal-wrap" role="presentation">
          <button type="button" className="plans-modal-backdrop" aria-label="Close plans popup" onClick={closePlansPopup} />
          <div className="plans-modal" role="dialog" aria-modal="true" aria-label="All membership plans">
            <header className="plans-modal-head">
              <h2 className="plans-modal-title">All Membership Plans</h2>
              <button type="button" className="plans-modal-close" onClick={closePlansPopup} aria-label="Close">
                ✕
              </button>
            </header>

            <div className="plans-modal-list">
              <article className="plan-option plan-option--basic">
                <div className="plan-option-top">
                  <h3>Basic Access</h3>
                  <p>From $39.99 / mo</p>
                </div>
                <div className="plan-option-prices">
                  {Object.entries(PLAN_OPTIONS[0].prices).map(([term, price]) => (
                    <button key={term} type="button" className="plan-price-btn" onClick={() => startPaymentFlow("basic", term)}>
                      {BILLING_LABELS[term]}: ${price.toFixed(2)}
                    </button>
                  ))}
                </div>
                <ul>
                  <li>Gym floor access</li>
                  <li>2 group classes / month</li>
                  <li>Freeze allowance: 7 days / year</li>
                </ul>
              </article>

              <article className="plan-option plan-option--premium">
                <div className="plan-option-top">
                  <h3>Premium All-Access</h3>
                  <p>From $69.99 / mo</p>
                </div>
                <div className="plan-option-prices">
                  {Object.entries(PLAN_OPTIONS[1].prices).map(([term, price]) => (
                    <button key={term} type="button" className="plan-price-btn" onClick={() => startPaymentFlow("premium", term)}>
                      {BILLING_LABELS[term]}: ${price.toFixed(2)}
                    </button>
                  ))}
                </div>
                <ul>
                  <li>Unlimited gym access</li>
                  <li>All group classes</li>
                  <li>Freeze allowance: 21 days / year</li>
                </ul>
              </article>

              <article className="plan-option plan-option--elite">
                <div className="plan-option-top">
                  <h3>Elite Performance</h3>
                  <p>From $99.99 / mo</p>
                </div>
                <div className="plan-option-prices">
                  {Object.entries(PLAN_OPTIONS[2].prices).map(([term, price]) => (
                    <button key={term} type="button" className="plan-price-btn" onClick={() => startPaymentFlow("elite", term)}>
                      {BILLING_LABELS[term]}: ${price.toFixed(2)}
                    </button>
                  ))}
                </div>
                <ul>
                  <li>Everything in Premium</li>
                  <li>4 PT sessions / month</li>
                  <li>Freeze allowance: 30 days / year</li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      ) : null}
      {invoiceOpen && invoiceDraft ? (
        <div className="invoice-modal-wrap" role="presentation">
          <button type="button" className="invoice-modal-backdrop" aria-label="Close invoice preview" onClick={() => setInvoiceOpen(false)} />
          <div className="invoice-modal" role="dialog" aria-modal="true" aria-label="Invoice preview">
            <header className="invoice-modal-head">
              <h2 className="invoice-modal-title">Invoice Preview</h2>
              <button type="button" className="invoice-modal-close" onClick={() => setInvoiceOpen(false)} aria-label="Close">
                ✕
              </button>
            </header>

            <div className="invoice-sheet">
              <p className="invoice-brand">FitUp</p>
              <div className="invoice-row"><span>Invoice #</span><strong>{invoiceDraft.invoiceNumber}</strong></div>
              <div className="invoice-row"><span>Date</span><strong>{invoiceDraft.dateLabel}</strong></div>
              <div className="invoice-row"><span>Customer</span><strong>{invoiceDraft.customerLabel}</strong></div>
              <div className="invoice-row"><span>Plan</span><strong>{invoiceDraft.planLabel}</strong></div>
              <div className="invoice-row"><span>Payment Method</span><strong>{invoiceDraft.methodLabel}</strong></div>
              <div className="invoice-row invoice-row--total"><span>Total</span><strong>{invoiceDraft.amountLabel}</strong></div>
            </div>

            <div className="invoice-actions">
              <button type="button" className="invoice-cancel" onClick={() => setInvoiceOpen(false)}>
                Not Now
              </button>
              <button type="button" className="invoice-download" onClick={downloadInvoice}>
                Download
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <BottomNav activeTab="" />
    </main>
  );
}

export default MembershipPage;
