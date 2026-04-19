import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./MembershipPage.css";

function MembershipPage() {
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
              <h1>Premium All-Access</h1>
            </div>
            <span className="active-pill">Active</span>
          </div>
          <div className="membership-row">
            <span>Start Date</span>
            <strong>Jan 1, 2024</strong>
          </div>
          <div className="membership-row">
            <span>Next Renewal</span>
            <strong>Feb 1, 2024</strong>
          </div>
          <div className="membership-row">
            <span>Price</span>
            <strong>$89.99 / mo</strong>
          </div>
        </section>

        <section className="membership-actions">
          <button type="button">
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
            Freeze
          </button>
          <button type="button">
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

        <section className="title-row">
          <h2>Payment History</h2>
        </section>

        <section className="history-list">
          {[1, 2, 3].map((item) => (
            <article key={item} className="history-item">
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
                  <p className="history-title">Monthly Subscription</p>
                  <p className="history-sub">Jan 1, 2024 · Visa **** 4242</p>
                </div>
              </div>
              <div className="history-right">
                <p className="history-price">$89.99</p>
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
            <button type="button" className="upgrade-card-cta">
              View Plans
            </button>
          </div>
        </section>
      </section>
      <BottomNav activeTab="" />
    </main>
  );
}

export default MembershipPage;
