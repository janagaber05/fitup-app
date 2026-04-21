import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function EquipmentAR() {
  const [machine, setMachine] = useState("chest_press");
  const [cameraState, setCameraState] = useState("loading");
  const [activeTutorial, setActiveTutorial] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const tutorials = {
    chest_press: {
      title: "Chest Press",
      steps: [
        "Adjust seat to chest level",
        "Grip handles firmly",
        "Push forward slowly",
        "Return with control",
      ],
    },
    treadmill: {
      title: "Treadmill",
      steps: [
        "Stand centered",
        "Start slow speed",
        "Keep posture upright",
        "Increase gradually",
      ],
    },
  };
  const machineAnchors = [
    { id: "chest_press", top: "64%", left: "12%" },
    { id: "treadmill", top: "42%", left: "58%" },
  ];

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
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
        setCameraState("ready");
      } catch {
        setCameraState("error");
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#121212",
        color: "white",
        padding: "16px 14px calc(80px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Link
          to="/gyms"
          style={{
            color: "#fff",
            textDecoration: "none",
            width: 34,
            height: 34,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "#1f1f1f",
          }}
          aria-label="Back"
        >
          ←
        </Link>
        <h1 style={{ color: "#ff6f50", fontSize: 20, margin: 0 }}>FITUP AR Tutorial</h1>
      </header>

      <div
        style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          background: "#0c0c0c",
          border: "1px solid rgba(255,255,255,0.08)",
          minHeight: 320,
        }}
      >
        <video ref={videoRef} playsInline muted style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            border: "2px solid rgba(255,111,80,0.35)",
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            top: 10,
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              background: "rgba(0,0,0,0.55)",
              padding: "6px 10px",
              borderRadius: 999,
            }}
          >
            {cameraState === "ready" ? "Camera Live" : cameraState === "error" ? "Camera blocked" : "Starting camera..."}
          </span>
          <select
            value={machine}
            onChange={(e) => {
              setMachine(e.target.value);
              setActiveTutorial(e.target.value);
            }}
            style={{ padding: "8px 10px", borderRadius: 10, border: 0, background: "#1d1d1d", color: "#fff" }}
          >
            <option value="chest_press">Chest Press</option>
            <option value="treadmill">Treadmill</option>
          </select>
        </div>
        {cameraState === "ready"
          ? machineAnchors.map((anchor) => (
              <button
                key={anchor.id}
                type="button"
                onClick={() => {
                  setMachine(anchor.id);
                  setActiveTutorial(anchor.id);
                }}
                style={{
                  position: "absolute",
                  top: anchor.top,
                  left: anchor.left,
                  transform: "translate(-50%, -50%)",
                  borderRadius: 999,
                  border: `1px solid ${machine === anchor.id ? "#ff6f50" : "rgba(255,255,255,0.45)"}`,
                  background: machine === anchor.id ? "rgba(255,111,80,0.18)" : "rgba(0,0,0,0.55)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "7px 11px",
                  cursor: "pointer",
                }}
              >
                {tutorials[anchor.id].title}
              </button>
            ))
          : null}
      </div>

      {activeTutorial ? (
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "14px",
            background: "#1a1a1a",
            marginTop: 12,
          }}
        >
          <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{tutorials[activeTutorial].title} (AR Guide)</h2>
          {tutorials[activeTutorial].steps.map((step, index) => (
            <p key={index} style={{ margin: "0 0 8px", color: "#d8dbe0", fontSize: 13 }}>
              👉 {step}
            </p>
          ))}
        </section>
      ) : (
        <p style={{ marginTop: 10, color: "#9ea3ab", fontSize: 12 }}>
          Move camera to machine, then tap the machine name to open tutorial.
        </p>
      )}

      {cameraState === "error" ? (
        <p style={{ marginTop: 10, color: "#ffb39f", fontSize: 12 }}>
          Camera access failed. Allow camera permission in browser/app settings.
        </p>
      ) : null}
    </main>
  );
}
