import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import BottomNav from "../components/BottomNav";
import { parseArDeepLink } from "../utils/arQr";
import "./GymsPage.css";

function GymsPage() {
  const navigate = useNavigate();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerStatus, setScannerStatus] = useState("idle");
  const [scannerMessage, setScannerMessage] = useState("");
  const [scannedCode, setScannedCode] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!scannerOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [scannerOpen]);

  useEffect(() => {
    if (!scannerOpen) return undefined;
    let cancelled = false;

    const stopScanner = () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    const scanFrame = () => {
      if (cancelled) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        rafRef.current = window.requestAnimationFrame(scanFrame);
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!width || !height) {
        rafRef.current = window.requestAnimationFrame(scanFrame);
        return;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        rafRef.current = window.requestAnimationFrame(scanFrame);
        return;
      }
      ctx.drawImage(video, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const result = jsQR(imageData.data, width, height, {
        inversionAttempts: "dontInvert",
      });

      if (result?.data) {
        const ar = parseArDeepLink(result.data);
        if (ar) {
          setScannedCode(result.data);
          setScannerStatus("success");
          setScannerMessage("Equipment QR recognized. Opening AR tutorial…");
          stopScanner();
          navigate(
            `/ar-tutorial?branch=${encodeURIComponent(ar.branch)}&machine=${encodeURIComponent(ar.machine)}`,
          );
          setScannerOpen(false);
          return;
        }
        setScannedCode(result.data);
        setScannerStatus("success");
        setScannerMessage("QR detected and verified. You are checked in.");
        stopScanner();
        return;
      }

      rafRef.current = window.requestAnimationFrame(scanFrame);
    };

    const startScanner = async () => {
      setScannerMessage("");
      setScannedCode("");
      setScannerStatus("scanning");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        rafRef.current = window.requestAnimationFrame(scanFrame);
      } catch {
        setScannerStatus("error");
        setScannerMessage("Camera access failed. Please allow camera permission and try again.");
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [scannerOpen, navigate]);

  const openArScanner = () => {
    setScannerStatus("idle");
    setScannerMessage("");
    setScannedCode("");
    setScannerOpen(true);
  };

  const closeArScanner = () => {
    setScannerOpen(false);
    setScannerStatus("idle");
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-content">
        <section className="membership-section">
          <header className="top-bar">
            <div className="profile-wrap">
              <div className="avatar-ring">
                <img
                  className="avatar"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Lina Morgan"
                />
              </div>
              <div>
                <h1 className="profile-name">Lina Morgan</h1>
                <p className="profile-subtitle">GOOD MORNING</p>
              </div>
            </div>
            <button
              className="icon-btn"
              type="button"
              aria-label="Notifications"
            >
              <svg
                className="bell-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M18 16H6l1.4-1.7c.4-.5.6-1.1.6-1.7V10a4 4 0 1 1 8 0v2.6c0 .6.2 1.2.6 1.7L18 16Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 18.6a2 2 0 0 0 4 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="17.5" cy="7.5" r="2.6" fill="#ff6f50" />
              </svg>
            </button>
          </header>

          <section className="plan-card">
            <div className="plan-head">
              <div>
                <p className="muted-label">Current Plan</p>
                <h2 className="plan-title">Premium All-Access</h2>
              </div>
              <span className="status-pill">Active</span>
            </div>
            <div className="usage-row">
              <span>Expires in 15 days</span>
              <span>85% Used</span>
            </div>
            <div className="usage-track">
              <span className="usage-fill" />
            </div>
            <Link className="details-link" to="/membership">
              View Details ›
            </Link>
          </section>
        </section>

        <section className="section-head">
          <h3>Live Capacity</h3>
          <Link to="/branch-details" className="section-head-link">
            View Branch
          </Link>
        </section>

        <section className="capacity-card">
          <div className="branch-left">
            <div className="branch-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="mini-icon">
                <path
                  d="M3 12h4l2-5 4 10 2-5h6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="branch-name">Downtown Branch</p>
              <p className="branch-status">● Quote Quiet</p>
            </div>
          </div>
          <div className="capacity-right">
            <p className="capacity-value">45%</p>
            <p className="capacity-label">Capacity</p>
          </div>
        </section>

        <section className="quick-grid">
          <Link to="/book" className="quick-tile">
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="tile-svg">
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
            </span>
            <span className="tile-label">Book</span>
          </Link>
          <button type="button" className="quick-tile" onClick={openArScanner}>
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="tile-svg">
                <path
                  d="M13 2L5 14h6l-1 8 9-12h-6l1-8z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="tile-label">Check In</span>
          </button>
          <Link to="/ar-tutorial" className="quick-tile">
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="tile-svg">
                <path
                  d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 7.5L12 12l8-4.5M12 12v9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <span className="tile-label">AR</span>
          </Link>
          <Link to="/progress" className="quick-tile">
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="tile-svg">
                <path
                  d="M3 13h5l2-6 4 10 2-5h5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="tile-label">Progress</span>
          </Link>
        </section>

        <section className="section-head">
          <h3>Up Next</h3>
        </section>

        <section className="upnext-card">
          <div className="upnext-left">
            <p className="upnext-title">HIIT Advanced</p>
            <p className="upnext-subtitle">with Sarah Connor</p>
            <div className="upnext-meta">
              <span className="meta-item">
                <svg viewBox="0 0 24 24" className="meta-icon" aria-hidden="true">
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 8v5l3 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                45 min
              </span>
              <span className="meta-item">
                <svg viewBox="0 0 24 24" className="meta-icon" aria-hidden="true">
                  <path
                    d="M12 21s6-5.6 6-10a6 6 0 1 0-12 0c0 4.4 6 10 6 10Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="11" r="2.2" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                Studio B
              </span>
            </div>
          </div>
          <div className="upnext-right">
            <p className="today-label">Today</p>
            <p className="today-time">18:00</p>
          </div>
        </section>

        <section className="section-head">
          <h3>Updates</h3>
          <Link to="/updates" className="section-head-link">
            View All
          </Link>
        </section>

        <section className="updates-list">
          <Link to="/updates" className="update-item">
            <span className="dot dot-orange" />
            <p>Pool Maintenance Update</p>
            <span className="update-chevron">›</span>
          </Link>
          <Link to="/updates" className="update-item">
            <span className="dot dot-green" />
            <p>Summer Sale: 20% Off</p>
            <span className="update-chevron">›</span>
          </Link>
        </section>
      </section>

      <button type="button" className="fab" aria-label="Open quick action">
        <svg viewBox="0 0 24 24" className="fab-icon" aria-hidden="true">
          <path
            d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M4 7.5L12 12l8-4.5M12 12v9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>

      {scannerOpen ? (
        <div className="ar-scan-wrap" role="presentation">
          <button type="button" className="ar-scan-backdrop" aria-label="Close scanner" onClick={closeArScanner} />
          <section className="ar-scan-modal" role="dialog" aria-modal="true" aria-label="AR check in scanner">
            <header className="ar-scan-head">
              <h2>AR Check In</h2>
              <button type="button" className="ar-scan-close" onClick={closeArScanner} aria-label="Close">
                ✕
              </button>
            </header>
            <p className="ar-scan-sub">
              {scannerStatus === "success"
                ? "Scan complete. You are checked in."
                : scannerStatus === "error"
                  ? scannerMessage
                  : "Align your membership QR in the frame to check in."}
            </p>
            <div className="ar-scan-viewfinder" aria-hidden="true">
              <video ref={videoRef} className="ar-scan-video" playsInline muted />
              <canvas ref={canvasRef} className="ar-scan-canvas" />
              <div className="ar-scan-corners">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className={`ar-scan-line${scannerStatus === "scanning" ? " ar-scan-line--run" : ""}`} />
              {scannerStatus === "success" ? (
                <div className="ar-scan-success">
                  Checked In
                  {scannedCode ? <small>{scannedCode}</small> : null}
                </div>
              ) : null}
            </div>
            <div className="ar-scan-actions">
              {scannerStatus === "success" || scannerStatus === "error" ? (
                <button type="button" className="ar-scan-done" onClick={closeArScanner}>
                  Done
                </button>
              ) : (
                <button type="button" className="ar-scan-cancel" onClick={closeArScanner}>
                  Cancel
                </button>
              )}
            </div>
          </section>
        </div>
      ) : null}

      <BottomNav activeTab="home" />
    </main>
  );
}

export default GymsPage;
