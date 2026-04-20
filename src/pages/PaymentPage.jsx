import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const BILLING_LABELS = { monthly: "Monthly", q3: "3 Months", q6: "6 Months", yearly: "Yearly" };
const PLAN_OPTIONS = [
  { id: "basic", name: "Basic Access", prices: { monthly: 49.99, q3: 139.99, q6: 259.99, yearly: 479.99 } },
  { id: "premium", name: "Premium All-Access", prices: { monthly: 89.99, q3: 249.99, q6: 469.99, yearly: 839.99 } },
  { id: "elite", name: "Elite Performance", prices: { monthly: 129.99, q3: 369.99, q6: 699.99, yearly: 1199.99 } },
];

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingPayment = location.state?.paymentMode === "booking" ? location.state.booking : null;
  const emsPackagePayment = location.state?.paymentMode === "ems-package" ? location.state.emsPackage : null;
  const privatePackagePayment = location.state?.paymentMode === "profile-private" ? location.state.privatePackage : null;
  const returnTo = typeof location.state?.returnTo === "string" ? location.state.returnTo : "";
  const chosen = location.state || { planId: "premium", term: "monthly" };
  const selectedPlan = PLAN_OPTIONS.find((p) => p.id === chosen.planId) || PLAN_OPTIONS[1];
  const selectedTerm = BILLING_LABELS[chosen.term] ? chosen.term : "monthly";
  const price = selectedPlan.prices[selectedTerm];
  const emsPrice = Number(emsPackagePayment?.price || 0);

  const [method, setMethod] = useState("card");
  const [selectedSavedCard, setSelectedSavedCard] = useState("axis");
  const [saveCard, setSaveCard] = useState(true);
  const [form, setForm] = useState({ cardName: "", cardNumber: "", exp: "", cvc: "" });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);

  const savedCards = [
    { id: "axis", label: "Axis Bank", last4: "1234", brand: "mastercard" },
    { id: "hdfc", label: "HDFC Bank", last4: "1234", brand: "visa" },
    { id: "telda", label: "Telda", last4: "7781", brand: "telda" },
  ];
  const renderBrandIcon = (brand) => {
    if (brand === "mastercard") {
      return (
        <span className="card-brand card-brand--mastercard" aria-label="Mastercard">
          <span className="mc-dot mc-dot--left" />
          <span className="mc-dot mc-dot--right" />
        </span>
      );
    }
    if (brand === "visa") {
      return (
        <span className="card-brand card-brand--visa" aria-label="Visa">
          VISA
        </span>
      );
    }
    return (
      <span className="card-brand card-brand--telda" aria-label="Telda">
        telda
      </span>
    );
  };


  const summary = useMemo(
    () =>
      bookingPayment
        ? `${bookingPayment.title} · ${bookingPayment.kind} · ${bookingPayment.priceLabel}`
        : privatePackagePayment
          ? `${privatePackagePayment.title} · Private Sessions · $${Number(privatePackagePayment.amount || 0).toFixed(2)}`
        : emsPackagePayment
          ? `${emsPackagePayment.name} · ${emsPackagePayment.sessionsPerMonth} Sessions · $${emsPrice.toFixed(2)}`
        : `${selectedPlan.name} · ${BILLING_LABELS[selectedTerm]} · $${price.toFixed(2)}`,
    [bookingPayment, privatePackagePayment, emsPackagePayment, emsPrice, selectedPlan.name, selectedTerm, price],
  );

  const submit = (e) => {
    e.preventDefault();
    if (method !== "card") {
      setError("Only card payment is enabled right now.");
      return;
    }

    const digits = showAddCard ? form.cardNumber.replace(/\s+/g, "") : "";
    if (showAddCard && (!form.cardName.trim() || digits.length < 12 || form.exp.length < 4 || form.cvc.length < 3)) {
      setError("Please enter valid payment details.");
      return;
    }
    setError("");
    setProcessing(true);
    window.setTimeout(() => {
      const now = new Date();
      if (bookingPayment) {
        navigate(returnTo || "/book", {
          replace: true,
          state: {
            bookingPaymentNotice: `Payment successful. ${bookingPayment.title} is booked (${bookingPayment.bookingRef}).`,
          },
        });
        return;
      }
      if (privatePackagePayment) {
        navigate(returnTo || "/profile", {
          replace: true,
          state: {
            privatePaymentNotice: `Payment successful. ${privatePackagePayment.title} added to your private sessions.`,
            privateCreditsAdded: Number(privatePackagePayment.sessions || 0),
          },
        });
        return;
      }
      if (emsPackagePayment) {
        navigate(returnTo || "/ems-training", {
          replace: true,
          state: {
            emsPaymentNotice: `Payment successful. ${emsPackagePayment.name} is now active in your account.`,
            emsPackageActivated: emsPackagePayment,
          },
        });
        return;
      }
      const paymentEntry = {
        id: `h-${now.getTime()}`,
        title: `${BILLING_LABELS[selectedTerm]} Subscription - ${selectedPlan.name}`,
        sub: `${now.toLocaleDateString()} · Visa **** ${showAddCard ? digits.slice(-4) : savedCards.find((c) => c.id === selectedSavedCard)?.last4 || "1234"} · Membership fee`,
        amount: `$${price.toFixed(2)}`,
      };
      const subscription = { planId: selectedPlan.id, term: selectedTerm, startAt: now.toISOString() };
      navigate("/membership", {
        replace: true,
        state: {
          notice: `Payment successful. ${selectedPlan.name} (${BILLING_LABELS[selectedTerm]}) is now active.`,
          subscription,
          paymentEntry,
        },
      });
    }, 900);
  };

  return (
    <main className="payment-page">
      <header className="payment-header">
        <Link
          to={
            bookingPayment
              ? (returnTo || "/book")
              : privatePackagePayment
                ? (returnTo || "/profile")
                : emsPackagePayment
                  ? (returnTo || "/ems-training")
                  : "/membership"
          }
          className="payment-back"
        >
          ←
        </Link>
        <h1>Payment Methods</h1>
        <span className="payment-header-spacer" />
      </header>

      <section className="payment-card">
        <form className="payment-form-shell" onSubmit={submit}>
          <div className="payment-scroll">
            <p className="payment-kicker">Checkout</p>
            <h2>{summary}</h2>
            <div className="payment-method-list">
              <button
                type="button"
                className={`payment-method-item${method === "cod" ? " payment-method-item--active" : ""}`}
                onClick={() => setMethod("cod")}
              >
                <span>Cash in Gym</span>
                <span>›</span>
              </button>
              <button
                type="button"
                className={`payment-method-item${method === "card" ? " payment-method-item--active" : ""}`}
                onClick={() => setMethod("card")}
              >
                <span>Credit/Debit Card</span>
                <span>⌃</span>
              </button>
            </div>

            {method === "card" ? (
              <div className="saved-cards">
                {savedCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className={`saved-card${selectedSavedCard === card.id && !showAddCard ? " saved-card--selected" : ""}`}
                    onClick={() => {
                      setSelectedSavedCard(card.id);
                      setShowAddCard(false);
                    }}
                  >
                    {renderBrandIcon(card.brand)}
                    <span className="saved-card-text">{card.label}  •••• {card.last4}</span>
                    <span className="saved-card-radio">{selectedSavedCard === card.id && !showAddCard ? "●" : "○"}</span>
                  </button>
                ))}
                <button type="button" className={`saved-card add-card-btn${showAddCard ? " saved-card--selected" : ""}`} onClick={() => setShowAddCard(true)}>
                  <span className="add-card-plus">＋</span>
                  <span className="saved-card-text">Add Card</span>
                </button>
              </div>
            ) : null}

            <p className="payment-summary-line">{summary}</p>

            {showAddCard ? (
              <div className="payment-form-page">
                <label htmlFor="card-name">Cardholder Name</label>
                <input
                  id="card-name"
                  value={form.cardName}
                  onChange={(e) => setForm((prev) => ({ ...prev, cardName: e.target.value }))}
                  placeholder="Carrie Bradshaw"
                />

                <label htmlFor="card-number">Card Number</label>
                <input
                  id="card-number"
                  value={form.cardNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="1267 2312 0918 2344"
                  inputMode="numeric"
                />

                <div className="payment-grid-2">
                  <div>
                    <label htmlFor="card-exp">Expiration Date</label>
                    <input
                      id="card-exp"
                      value={form.exp}
                      onChange={(e) => setForm((prev) => ({ ...prev, exp: e.target.value }))}
                      placeholder="02/2028"
                    />
                  </div>
                  <div>
                    <label htmlFor="card-cvc">CVV</label>
                    <input
                      id="card-cvc"
                      value={form.cvc}
                      onChange={(e) => setForm((prev) => ({ ...prev, cvc: e.target.value }))}
                      placeholder="•••"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <label className="save-card-row">
                  <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} />
                  Save this card for faster payments.
                </label>
              </div>
            ) : null}
          </div>
          <div className="payment-footer">
            {error ? <p className="payment-error">{error}</p> : null}
            <button type="submit" className="payment-submit" disabled={processing}>
              {processing ? "Processing..." : showAddCard ? "Pay Now" : "Check out"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default PaymentPage;
