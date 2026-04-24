import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { detectWithYoloServer, isYoloServerConfigured } from "../lib/yoloRemoteDetection";

const MACHINE_IDS = ["chest_press", "treadmill"];
/** YOLOv8 class slugs (13) — match your `data.yaml` / training names after normalize. */
const YOLO_CLASS_SLUGS = [
  "arm_curl_machine",
  "chest_fly_machine",
  "chest_press_machine",
  "chinning_dipping",
  "lat_pull_down",
  "lateral_raises_machine",
  "leg_extension",
  "leg_press",
  "reg_curl_machine",
  "seated_cable_rows",
  "seated_dip_machine",
  "shoulder_press_machine",
  "smith_machine",
];
const MACHINE_ALLOWED_FOR_DETECTION = new Set([...MACHINE_IDS, ...YOLO_CLASS_SLUGS]);
const DETECTION_THRESHOLD = 0.82;
const YOLO_CONFIDENCE_THRESHOLD = 0.45;
const MODEL_BASE_URL = (process.env.REACT_APP_TM_MODEL_URL || "").trim();
const ROBOFLOW_WORKFLOW_URL = (process.env.REACT_APP_ROBOFLOW_WORKFLOW_URL || "").trim();
const ROBOFLOW_API_KEY = (process.env.REACT_APP_ROBOFLOW_API_KEY || "").trim();
const SKETCHFAB_EMBED_URL = "https://sketchfab.com/models/d862a67af82d43ecaabec2d638c9e2b5/embed";
const MACHINE_LABEL_ALIASES = {
  chest_press: "chest_press",
  chest_press_machine: "chest_press",
  chestpress: "chest_press",
  chest_presses: "chest_press",
  treadmill: "treadmill",
  tread_mill: "treadmill",
};

function humanizeSlug(slug) {
  return String(slug || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeMachineId(id) {
  if (MACHINE_ALLOWED_FOR_DETECTION.has(id)) return id;
  return "chest_press";
}

export default function EquipmentAR() {
  const [machine, setMachine] = useState("chest_press");
  const [cameraState, setCameraState] = useState("loading");
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [detectState, setDetectState] = useState("idle");
  const [detectMessage, setDetectMessage] = useState("Point camera at a machine and tap Start Detection.");
  const [manualMode, setManualMode] = useState(true);
  const [showSketchfabModel, setShowSketchfabModel] = useState(false);
  const [overlayVideoByMachine, setOverlayVideoByMachine] = useState({});
  const [overlayOpacity, setOverlayOpacity] = useState(0.72);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReanchorMode, setIsReanchorMode] = useState(false);
  const [selectedCalloutIndex, setSelectedCalloutIndex] = useState(0);
  const [trackedBoxByMachine, setTrackedBoxByMachine] = useState({});
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraWrapRef = useRef(null);
  const streamRef = useRef(null);
  const modelRef = useRef(null);
  const detectMachineFromFrameRef = useRef(null);

  const tutorials = {
    chest_press: {
      title: "Chest Press",
      steps: [
        "Adjust seat to chest level",
        "Grip handles firmly",
        "Push forward slowly",
        "Return with control",
      ],
      arrows: [
        { top: "56%", left: "16%", symbol: "↑" },
        { top: "50%", left: "20%", symbol: "↑" },
        { top: "44%", left: "24%", symbol: "↑" },
      ],
      callouts: [
        { top: "60%", left: "26%", text: "Adjust seat to chest level" },
        { top: "53%", left: "29%", text: "Grip handles firmly" },
        { top: "46%", left: "33%", text: "Push forward slowly" },
        { top: "39%", left: "36%", text: "Return with control" },
      ],
      hotspots: [
        { label: "Grip", x: 0.66, y: 0.43 },
        { label: "Back", x: 0.43, y: 0.35 },
        { label: "Seat", x: 0.47, y: 0.58 },
        { label: "Push", x: 0.8, y: 0.42 },
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
      arrows: [
        { top: "46%", left: "60%", symbol: "→" },
        { top: "46%", left: "66%", symbol: "→" },
        { top: "46%", left: "72%", symbol: "→" },
      ],
      callouts: [
        { top: "58%", left: "66%", text: "Stand centered" },
        { top: "52%", left: "69%", text: "Start slow speed" },
        { top: "46%", left: "72%", text: "Keep posture upright" },
        { top: "40%", left: "75%", text: "Increase gradually" },
      ],
      hotspots: [
        { label: "Handles", x: 0.53, y: 0.2 },
        { label: "Deck", x: 0.5, y: 0.6 },
        { label: "Safety", x: 0.4, y: 0.3 },
      ],
    },
  };
  const yoloGenericGuide = {
    steps: [
      "Check the machine is set correctly",
      "Start with light resistance",
      "Maintain neutral posture",
      "Stop if you feel sharp pain",
    ],
    arrows: [
      { top: "50%", left: "36%", symbol: "▲" },
      { top: "46%", left: "50%", symbol: "▲" },
    ],
    callouts: [
      { top: "58%", left: "50%", text: "Warm up before heavy sets" },
      { top: "48%", left: "50%", text: "Controlled range of motion" },
    ],
    hotspots: [
      { label: "Setup", x: 0.5, y: 0.38 },
      { label: "Grip", x: 0.65, y: 0.45 },
      { label: "Position", x: 0.35, y: 0.5 },
    ],
  };
  YOLO_CLASS_SLUGS.forEach((slug) => {
    tutorials[slug] = { title: humanizeSlug(slug), ...yoloGenericGuide };
  });

  const machineAnchors = [
    { id: "chest_press", top: "64%", left: "12%" },
    { id: "treadmill", top: "42%", left: "58%" },
  ];

  const prettyMachineName = (id) => {
    if (id === "chest_press") return "Chest Press";
    if (id === "treadmill") return "Treadmill";
    if (tutorials[id]?.title) return tutorials[id].title;
    return "Machine";
  };

  const initialCalloutLayout = Object.fromEntries(
    Object.keys(tutorials).map((key) => [
      key,
      tutorials[key].callouts.map((point) => ({
        top: Number.parseFloat(point.top),
        left: Number.parseFloat(point.left),
        text: point.text,
      })),
    ]),
  );
  const [calloutLayoutByMachine, setCalloutLayoutByMachine] = useState(initialCalloutLayout);
  const initialAnchorByMachine = {
    ...machineAnchors.reduce((acc, anchor) => {
      acc[anchor.id] = {
        top: Number.parseFloat(anchor.top),
        left: Number.parseFloat(anchor.left),
      };
      return acc;
    }, {}),
    ...Object.fromEntries(YOLO_CLASS_SLUGS.map((slug) => [slug, { top: 50, left: 50 }])),
  };
  const [anchorByMachine, setAnchorByMachine] = useState(initialAnchorByMachine);

  useEffect(() => {
    return () => {
      Object.values(overlayVideoByMachine).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [overlayVideoByMachine]);

  const toMachineId = (rawLabel) => {
    const normalized = String(rawLabel || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    if (MACHINE_LABEL_ALIASES[normalized]) return MACHINE_LABEL_ALIASES[normalized];
    if (YOLO_CLASS_SLUGS.includes(normalized)) return normalized;
    return MACHINE_IDS.includes(normalized) ? normalized : null;
  };

  const slugFromYoloClassName = (raw) => toMachineId(raw);

  const extractWorkflowPredictions = (payload) => {
    const candidateArrays = [];
    if (Array.isArray(payload?.predictions)) candidateArrays.push(payload.predictions);
    if (Array.isArray(payload?.outputs)) candidateArrays.push(...payload.outputs.filter(Array.isArray));
    if (Array.isArray(payload?.result)) candidateArrays.push(payload.result);

    const outputItems = Array.isArray(payload?.outputs) ? payload.outputs : [];
    outputItems.forEach((item) => {
      if (Array.isArray(item?.predictions)) candidateArrays.push(item.predictions);
      if (Array.isArray(item?.detections)) candidateArrays.push(item.detections);
      if (Array.isArray(item)) candidateArrays.push(item);
      if (item?.predictions && Array.isArray(item.predictions?.predictions)) {
        candidateArrays.push(item.predictions.predictions);
      }
      if (item?.output && Array.isArray(item.output?.predictions)) {
        candidateArrays.push(item.output.predictions);
      }
    });

    const merged = candidateArrays.flat().filter(Boolean);
    return merged.map((pred) => ({
      label: pred.class || pred.class_name || pred.label || pred.name,
      confidence: Number(pred.confidence ?? pred.score ?? pred.probability ?? 0),
      x: Number(pred.x ?? pred.cx ?? pred.center_x ?? 0),
      y: Number(pred.y ?? pred.cy ?? pred.center_y ?? 0),
      width: Number(pred.width ?? pred.w ?? 0),
      height: Number(pred.height ?? pred.h ?? 0),
    }));
  };

  const detectMachineFromRoboflow = async (canvas) => {
    if (!ROBOFLOW_WORKFLOW_URL || !ROBOFLOW_API_KEY) return null;
    try {
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.75);
      const imageBase64Raw = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");
      const urlWithKey = ROBOFLOW_WORKFLOW_URL.includes("?")
        ? `${ROBOFLOW_WORKFLOW_URL}&api_key=${encodeURIComponent(ROBOFLOW_API_KEY)}`
        : `${ROBOFLOW_WORKFLOW_URL}?api_key=${encodeURIComponent(ROBOFLOW_API_KEY)}`;

      const attempts = [
        {
          url: ROBOFLOW_WORKFLOW_URL,
          body: {
            api_key: ROBOFLOW_API_KEY,
            inputs: {
              image: { type: "base64", value: imageBase64Raw },
            },
          },
        },
        {
          url: ROBOFLOW_WORKFLOW_URL,
          body: {
            api_key: ROBOFLOW_API_KEY,
            inputs: {
              image: { type: "base64", value: imageDataUrl },
            },
          },
        },
        {
          url: urlWithKey,
          body: {
            inputs: {
              image: { type: "base64", value: imageBase64Raw },
            },
          },
        },
        {
          url: urlWithKey,
          body: {
            image: imageBase64Raw,
          },
        },
      ];

      for (const attempt of attempts) {
        // eslint-disable-next-line no-await-in-loop
        const response = await fetch(attempt.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attempt.body),
        });
        if (!response.ok) continue;
        // eslint-disable-next-line no-await-in-loop
        const result = await response.json();
        const predictions = extractWorkflowPredictions(result);
        if (!predictions.length) continue;

        const topPrediction = predictions.reduce((best, current) =>
          current.confidence > best.confidence ? current : best,
        );
        const machineId = toMachineId(topPrediction.label);
        if (!machineId || topPrediction.confidence < DETECTION_THRESHOLD) continue;

        return {
          machineId,
          confidence: topPrediction.confidence,
          anchor: {
            left: topPrediction.x,
            top: topPrediction.y,
          },
          box: {
            width: topPrediction.width,
            height: topPrediction.height,
          },
        };
      }

      return null;
    } catch {
      return null;
    }
  };

  const ensureModelLoaded = async () => {
    if (modelRef.current) return modelRef.current;
    if (!MODEL_BASE_URL) return null;

    const tmImage = await import("@teachablemachine/image");
    const base = MODEL_BASE_URL.endsWith("/") ? MODEL_BASE_URL : `${MODEL_BASE_URL}/`;
    const modelURL = `${base}model.json`;
    const metadataURL = `${base}metadata.json`;
    const model = await tmImage.load(modelURL, metadataURL);
    modelRef.current = model;
    return model;
  };

  const detectMachineFromFrame = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.readyState < 2) return null;
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return null;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, width, height);

    if (isYoloServerConfigured()) {
      const top = await detectWithYoloServer(canvas);
      if (top) {
        const slug = slugFromYoloClassName(top.class_name);
        if (slug && Number(top.confidence) >= YOLO_CONFIDENCE_THRESHOLD) {
          const iw = top.image_width || width;
          const ih = top.image_height || height;
          const leftPct = (top.x / iw) * 100;
          const topPct = (top.y / ih) * 100;
          const wPct = (top.width / iw) * 100;
          const hPct = (top.height / ih) * 100;
          return {
            machineId: slug,
            confidence: Number(top.confidence),
            anchor: {
              left: Math.min(95, Math.max(5, leftPct)),
              top: Math.min(95, Math.max(5, topPct)),
            },
            box: {
              width: Math.min(90, Math.max(12, wPct)),
              height: Math.min(90, Math.max(12, hPct)),
            },
          };
        }
      }
    }

    if (ROBOFLOW_WORKFLOW_URL && ROBOFLOW_API_KEY) {
      const workflowDetection = await detectMachineFromRoboflow(canvas);
      if (!workflowDetection) return null;
      const normalizedLeft = Math.min(95, Math.max(5, (workflowDetection.anchor.left / width) * 100));
      const normalizedTop = Math.min(95, Math.max(5, (workflowDetection.anchor.top / height) * 100));
      return {
        machineId: workflowDetection.machineId,
        confidence: workflowDetection.confidence,
        anchor: { left: normalizedLeft, top: normalizedTop },
        box: {
          width: Math.min(90, Math.max(12, (workflowDetection.box.width / width) * 100)),
          height: Math.min(90, Math.max(12, (workflowDetection.box.height / height) * 100)),
        },
      };
    }

    const model = await ensureModelLoaded();
    if (!model) return null;

    const predictions = await model.predict(canvas);
    if (!Array.isArray(predictions) || !predictions.length) return null;

    const topPrediction = predictions.reduce((best, current) =>
      current.probability > best.probability ? current : best,
    );
    const machineId = toMachineId(topPrediction.className);
    if (!machineId || topPrediction.probability < DETECTION_THRESHOLD) return null;

    return {
      machineId,
      confidence: topPrediction.probability,
    };
  };

  useEffect(() => {
    detectMachineFromFrameRef.current = detectMachineFromFrame;
  });

  const handleStartDetection = async () => {
    if (cameraState !== "ready") return;
    if (!MODEL_BASE_URL && !(ROBOFLOW_WORKFLOW_URL && ROBOFLOW_API_KEY) && !isYoloServerConfigured()) {
      setDetectState("error");
      setDetectMessage(
        "No detector configured. Set REACT_APP_YOLO_API_URL (local YOLO server), or Roboflow / Teachable Machine env vars, then restart.",
      );
      return;
    }

    setDetectState("running");
    setDetectMessage("Detecting machine...");

    let found = null;
    for (let i = 0; i < 10; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      found = await detectMachineFromFrame();
      if (found?.machineId && MACHINE_ALLOWED_FOR_DETECTION.has(found.machineId)) {
        break;
      }
      // Small delay between frame checks
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 180));
    }

    if (found?.machineId && MACHINE_ALLOWED_FOR_DETECTION.has(found.machineId)) {
      const detected = normalizeMachineId(found.machineId);
      setMachine(detected);
      if (found.anchor) {
        setAnchorByMachine((prev) => ({
          ...prev,
          [detected]: {
            left: found.anchor.left,
            top: found.anchor.top,
          },
        }));
      }
      if (found.box) {
        setTrackedBoxByMachine((prev) => ({
          ...prev,
          [detected]: found.box,
        }));
      }
      setDetectState("ready");
      const confidencePct = Math.round(found.confidence * 100);
      setDetectMessage(`Detected: ${prettyMachineName(detected)} (${confidencePct}%). Tap Start Guide.`);
      return;
    }

    setDetectState("idle");
    setDetectMessage(
      "No supported machine found in view yet. Point camera to chest press/treadmill and try Start Detection again.",
    );
  };

  const handleOverlayVideoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file || !machine) return;
    const nextUrl = URL.createObjectURL(file);
    setOverlayVideoByMachine((prev) => {
      const oldUrl = prev[machine];
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      return { ...prev, [machine]: nextUrl };
    });
    setIsOverlayVisible(true);
    setDetectMessage(`${prettyMachineName(machine)} demo video uploaded. Tap Start Guide to view overlay.`);
  };

  const openMachineGuide = (machineId) => {
    setMachine(machineId);
    setActiveTutorial(machineId);
    setIsOverlayVisible(true);
    setSelectedCalloutIndex(0);
    setDetectState("ready");
    setDetectMessage(`Manual mode: ${prettyMachineName(machineId)} selected. Tap Show AR Demo.`);
  };

  const shiftToCurrentAnchor = (machineId, point) => {
    const base = initialAnchorByMachine[machineId];
    const current = anchorByMachine[machineId] || base;
    if (!base || !current) return point;
    return {
      top: point.top + (current.top - base.top),
      left: point.left + (current.left - base.left),
    };
  };

  const nudgeSelectedCallout = (axis, delta) => {
    if (!activeTutorial) return;
    setCalloutLayoutByMachine((prev) => {
      const points = prev[activeTutorial] || [];
      if (!points[selectedCalloutIndex]) return prev;
      const nextPoints = points.map((point, index) => {
        if (index !== selectedCalloutIndex) return point;
        const nextValue = Math.min(95, Math.max(5, point[axis] + delta));
        return { ...point, [axis]: nextValue };
      });
      return { ...prev, [activeTutorial]: nextPoints };
    });
  };

  const resetCalloutsForMachine = () => {
    if (!activeTutorial) return;
    setCalloutLayoutByMachine((prev) => ({
      ...prev,
      [activeTutorial]: initialCalloutLayout[activeTutorial],
    }));
    setAnchorByMachine((prev) => ({
      ...prev,
      [activeTutorial]: initialAnchorByMachine[activeTutorial],
    }));
    setSelectedCalloutIndex(0);
  };

  const handleCameraWrapClick = (event) => {
    if (!isReanchorMode) return;
    const targetMachine = activeTutorial || machine;
    const wrap = cameraWrapRef.current;
    if (!wrap || !targetMachine) return;

    const rect = wrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const nextLeft = Math.min(95, Math.max(5, x));
    const nextTop = Math.min(95, Math.max(5, y));
    setAnchorByMachine((prev) => ({
      ...prev,
      [targetMachine]: { top: nextTop, left: nextLeft },
    }));
    setDetectMessage(`${prettyMachineName(targetMachine)} re-anchored. Points now follow the new machine position.`);
    setIsReanchorMode(false);
  };

  useEffect(() => {
    if (detectState !== "ready") return undefined;
    if (!(ROBOFLOW_WORKFLOW_URL && ROBOFLOW_API_KEY)) return undefined;
    let cancelled = false;
    const interval = setInterval(async () => {
      if (cancelled) return;
      const found = await detectMachineFromFrameRef.current?.();
      if (!found?.machineId || !found.anchor) return;
      const target = activeTutorial || machine;
      if (found.machineId !== target) return;
      setAnchorByMachine((prev) => {
        const current = prev[target] || found.anchor;
        return {
          ...prev,
          [target]: {
            left: current.left * 0.75 + found.anchor.left * 0.25,
            top: current.top * 0.75 + found.anchor.top * 0.25,
          },
        };
      });
      if (found.box) {
        setTrackedBoxByMachine((prev) => {
          const current = prev[target] || found.box;
          return {
            ...prev,
            [target]: {
              width: current.width * 0.75 + found.box.width * 0.25,
              height: current.height * 0.75 + found.box.height * 0.25,
            },
          };
        });
      }
    }, 1200);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeTutorial, detectState, machine]);

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
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ color: "#ff6f50", fontSize: 20, margin: 0, lineHeight: 1.2 }}>FITUP AR Tutorial</h1>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9ea3ab", fontWeight: 600 }}>
            No QR needed. Camera detection + start button.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowSketchfabModel((prev) => !prev)}
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10,
            background: showSketchfabModel ? "#5b2aa8" : "#23262f",
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
            padding: "8px 10px",
          }}
        >
          3D
        </button>
      </header>

      <div
        ref={cameraWrapRef}
        onClick={handleCameraWrapClick}
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
        <canvas ref={canvasRef} style={{ display: "none" }} />
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
          <button
            type="button"
            onClick={handleStartDetection}
            disabled={cameraState !== "ready" || detectState === "running"}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: 0,
              background: detectState === "running" ? "#3a3a3a" : "#ff6f50",
              color: "#fff",
              fontWeight: 700,
              cursor: cameraState === "ready" && detectState !== "running" ? "pointer" : "default",
            }}
          >
            {detectState === "running" ? "Detecting..." : "Start Detection"}
          </button>
        </div>
        {cameraState === "ready" && (detectState === "ready" || activeTutorial)
          ? [machine].map((machineId) => {
              const anchor = anchorByMachine[machineId] || initialAnchorByMachine[machineId];
              if (!anchor) return null;
              return (
                <div
                  key={machineId}
                  style={{
                    position: "absolute",
                    top: `${anchor.top}%`,
                    left: `${anchor.left}%`,
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#ff6f50",
                      boxShadow: "0 0 20px rgba(255,111,80,0.85)",
                    }}
                  />
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      background: "rgba(0,0,0,0.6)",
                      padding: "5px 9px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,111,80,0.55)",
                    }}
                  >
                    {prettyMachineName(machineId)}
                  </div>
                </div>
              );
            })
          : null}

        {cameraState === "ready" && activeTutorial
          ? (tutorials[activeTutorial] || tutorials.chest_press).arrows.map((arrow, index) => {
              const shiftedArrow = shiftToCurrentAnchor(activeTutorial, {
                top: Number.parseFloat(arrow.top),
                left: Number.parseFloat(arrow.left),
              });
              return (
                <div
                  key={`${activeTutorial}-arrow-${index}`}
                  style={{
                    position: "absolute",
                    top: `${shiftedArrow.top}%`,
                    left: `${shiftedArrow.left}%`,
                    transform: "translate(-50%, -50%)",
                    color: "#ffd166",
                    fontSize: 24,
                    fontWeight: 900,
                    textShadow: "0 0 8px rgba(255,209,102,0.85)",
                    opacity: 1 - index * 0.24,
                    pointerEvents: "none",
                  }}
                >
                  {arrow.symbol}
                </div>
              );
            })
          : null}

        {cameraState === "ready" && activeTutorial && trackedBoxByMachine[activeTutorial]
          ? (tutorials[activeTutorial] || tutorials.chest_press).hotspots.map((hotspot, index) => {
              const anchor = anchorByMachine[activeTutorial] || initialAnchorByMachine[activeTutorial];
              const box = trackedBoxByMachine[activeTutorial];
              if (!anchor || !box) return null;
              const left = anchor.left - box.width / 2 + box.width * hotspot.x;
              const top = anchor.top - box.height / 2 + box.height * hotspot.y;
              return (
                <button
                  key={`${activeTutorial}-hotspot-${index}`}
                  type="button"
                  style={{
                    position: "absolute",
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    border: "1px solid rgba(255,255,255,0.62)",
                    borderRadius: 999,
                    padding: "6px 12px",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 11,
                    letterSpacing: 0.2,
                    background:
                      "linear-gradient(180deg, rgba(77,92,255,0.95) 0%, rgba(50,60,185,0.95) 100%)",
                    boxShadow:
                      "0 6px 16px rgba(20,24,80,0.45), inset 0 1px 2px rgba(255,255,255,0.28)",
                    textTransform: "uppercase",
                  }}
                >
                  {hotspot.label}
                </button>
              );
            })
          : null}

        {cameraState === "ready" && activeTutorial && overlayVideoByMachine[activeTutorial] && isOverlayVisible
          ? [activeTutorial].map((machineId) => {
              const anchor = anchorByMachine[machineId] || initialAnchorByMachine[machineId];
              if (!anchor) return null;
              return (
                <div
                  key={`${machineId}-overlay-video`}
                  style={{
                    position: "absolute",
                    top: `${anchor.top}%`,
                    left: `${anchor.left}%`,
                    transform: "translate(-50%, -50%)",
                    width: 170,
                    height: 240,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                    opacity: overlayOpacity,
                    pointerEvents: "auto",
                    background: "rgba(0,0,0,0.25)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsOverlayVisible(false)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      zIndex: 2,
                      width: 24,
                      height: 24,
                      borderRadius: 999,
                      border: 0,
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    aria-label="Close video model"
                  >
                    ✕
                  </button>
                  <video
                    src={overlayVideoByMachine[machineId]}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                  />
                </div>
              );
            })
          : null}

        {cameraState === "ready" && activeTutorial
          ? (calloutLayoutByMachine[activeTutorial] || []).map((point, index) => {
              const shiftedPoint = shiftToCurrentAnchor(activeTutorial, point);
              return (
                <div
                  key={`${activeTutorial}-callout-${index}`}
                  onClick={() => {
                    if (isEditMode) setSelectedCalloutIndex(index);
                  }}
                  style={{
                    position: "absolute",
                    top: `${shiftedPoint.top}%`,
                    left: `${shiftedPoint.left}%`,
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    border: "1px solid rgba(255,209,102,0.55)",
                    borderRadius: 999,
                    padding: "5px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    maxWidth: 170,
                    pointerEvents: isEditMode ? "auto" : "none",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
                    cursor: isEditMode ? "pointer" : "default",
                    borderColor:
                      isEditMode && selectedCalloutIndex === index
                        ? "rgba(62, 207, 142, 0.95)"
                        : "rgba(255,209,102,0.55)",
                  }}
                >
                  <span style={{ color: "#ffd166", fontSize: 12 }}>•</span>
                  <span>{point.text}</span>
                </div>
              );
            })
          : null}

        {showSketchfabModel ? (
          <div
            style={{
              position: "absolute",
              inset: 8,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
              zIndex: 5,
              background: "#0b0f18",
            }}
          >
            <button
              type="button"
              onClick={() => setShowSketchfabModel(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 6,
                border: 0,
                borderRadius: 999,
                width: 28,
                height: 28,
                background: "rgba(0,0,0,0.65)",
                color: "#fff",
                fontWeight: 800,
              }}
              aria-label="Close 3D model"
            >
              ✕
            </button>
            <iframe
              title="20. Barbell Bench Press"
              src={SKETCHFAB_EMBED_URL}
              allow="autoplay; fullscreen; xr-spatial-tracking"
              style={{
                width: "100%",
                height: "100%",
                border: 0,
                background: "#000",
              }}
            />
          </div>
        ) : null}
      </div>

      <section
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "14px",
          background: "#1a1a1a",
          marginTop: 12,
        }}
      >
        <p style={{ margin: "0 0 10px", color: "#d8dbe0", fontSize: 13 }}>{detectMessage}</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <button
            type="button"
            onClick={() => {
              setManualMode((prev) => !prev);
              setDetectMessage(
                !manualMode
                  ? "Manual mode enabled. Select a machine button and show AR demo."
                  : "Auto detection mode enabled. Tap Start Detection.",
              );
            }}
            style={{
              padding: "9px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              background: manualMode ? "#3158c9" : "#202020",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {manualMode ? "Manual Mode On" : "Manual Mode Off"}
          </button>
        </div>

        {manualMode ? (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
            <button
              type="button"
              onClick={() => openMachineGuide("chest_press")}
              style={{
                border: "1px solid rgba(255,255,255,0.45)",
                borderRadius: 14,
                padding: "10px 14px",
                background: "linear-gradient(180deg, #6b7cff 0%, #3d4ecb 100%)",
                color: "#fff",
                fontWeight: 800,
                boxShadow: "0 8px 18px rgba(18,28,97,0.45)",
              }}
            >
              3D Chest Press
            </button>
            <button
              type="button"
              onClick={() => openMachineGuide("treadmill")}
              style={{
                border: "1px solid rgba(255,255,255,0.45)",
                borderRadius: 14,
                padding: "10px 14px",
                background: "linear-gradient(180deg, #6b7cff 0%, #3d4ecb 100%)",
                color: "#fff",
                fontWeight: 800,
                boxShadow: "0 8px 18px rgba(18,28,97,0.45)",
              }}
            >
              3D Treadmill
            </button>
            <button
              type="button"
              onClick={() => {
                if (machine) openMachineGuide(machine);
              }}
              style={{
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 14,
                padding: "10px 14px",
                background: "linear-gradient(180deg, #37b36b 0%, #21864f 100%)",
                color: "#fff",
                fontWeight: 800,
                boxShadow: "0 8px 18px rgba(18,97,48,0.4)",
              }}
            >
              Show AR Demo
            </button>
            <button
              type="button"
              onClick={() => setShowSketchfabModel((prev) => !prev)}
              style={{
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 14,
                padding: "10px 14px",
                background: "linear-gradient(180deg, #8f4df0 0%, #5b2aa8 100%)",
                color: "#fff",
                fontWeight: 800,
                boxShadow: "0 8px 18px rgba(70,34,125,0.45)",
              }}
            >
              {showSketchfabModel ? "Hide 3D Model" : "Show 3D Model"}
            </button>
          </div>
        ) : null}

        {detectState === "ready" ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            <button
              type="button"
              onClick={() => openMachineGuide(machine)}
              style={{
                padding: "9px 12px",
                borderRadius: 10,
                border: 0,
                background: "#3fb950",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Start Guide: {prettyMachineName(machine)}
            </button>
            <button
              type="button"
              onClick={() => openMachineGuide("chest_press")}
              style={{
                padding: "9px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "#202020",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Chest Press Video
            </button>
            <button
              type="button"
              onClick={() => openMachineGuide("treadmill")}
              style={{
                padding: "9px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "#202020",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Treadmill Video
            </button>
            <label
              style={{
                padding: "9px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "#222",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Upload Demo Video
              <input type="file" accept="video/*" onChange={handleOverlayVideoUpload} style={{ display: "none" }} />
            </label>
            {!isOverlayVisible && activeTutorial && overlayVideoByMachine[activeTutorial] ? (
              <button
                type="button"
                onClick={() => setIsOverlayVisible(true)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "#234b33",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Show Video Model
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setIsEditMode((prev) => !prev)}
              style={{
                padding: "9px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                background: isEditMode ? "#1f5a3d" : "#202020",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {isEditMode ? "Done Positioning" : "Edit Point Positions"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsReanchorMode((prev) => !prev);
                setDetectMessage("Tap on the machine in camera view to re-anchor all points.");
              }}
              style={{
                padding: "9px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                background: isReanchorMode ? "#1f5a3d" : "#202020",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {isReanchorMode ? "Cancel Re-anchor" : "Re-anchor To Machine"}
            </button>
          </div>
        ) : null}

        {isEditMode && activeTutorial ? (
          <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#d8dbe0" }}>
              Select a point, then move it to match machine parts.
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {(calloutLayoutByMachine[activeTutorial] || []).map((point, index) => (
                <button
                  key={`edit-point-${index}`}
                  type="button"
                  onClick={() => setSelectedCalloutIndex(index)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: selectedCalloutIndex === index ? "#2b6f4e" : "#202020",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {index + 1}. {point.text}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button type="button" onClick={() => nudgeSelectedCallout("top", -1.2)} style={{ padding: "7px 10px", borderRadius: 8, border: 0, background: "#2a2a2a", color: "#fff" }}>Up</button>
              <button type="button" onClick={() => nudgeSelectedCallout("top", 1.2)} style={{ padding: "7px 10px", borderRadius: 8, border: 0, background: "#2a2a2a", color: "#fff" }}>Down</button>
              <button type="button" onClick={() => nudgeSelectedCallout("left", -1.2)} style={{ padding: "7px 10px", borderRadius: 8, border: 0, background: "#2a2a2a", color: "#fff" }}>Left</button>
              <button type="button" onClick={() => nudgeSelectedCallout("left", 1.2)} style={{ padding: "7px 10px", borderRadius: 8, border: 0, background: "#2a2a2a", color: "#fff" }}>Right</button>
              <button type="button" onClick={resetCalloutsForMachine} style={{ padding: "7px 10px", borderRadius: 8, border: 0, background: "#612b2b", color: "#fff" }}>Reset</button>
            </div>
          </div>
        ) : null}

        {activeTutorial && overlayVideoByMachine[activeTutorial] ? (
          <div style={{ marginTop: 10 }}>
            <label style={{ display: "block", color: "#d8dbe0", fontSize: 12, marginBottom: 6 }}>
              Video Overlay Opacity: {Math.round(overlayOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        ) : null}
      </section>

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
          <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>
            {(tutorials[activeTutorial] || tutorials.chest_press).title} (AR Guide)
          </h2>
          {(tutorials[activeTutorial] || tutorials.chest_press).steps.map((step, index) => (
            <p key={index} style={{ margin: "0 0 8px", color: "#d8dbe0", fontSize: 13 }}>
              👉 {step}
            </p>
          ))}
        </section>
      ) : (
        <p style={{ marginTop: 10, color: "#9ea3ab", fontSize: 12 }}>
          Point to a machine, tap Start Detection, then Start Guide.
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
