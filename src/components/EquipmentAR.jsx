import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
const MIN_BOX_PERCENT = 12;
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
  const navigate = useNavigate();
  const [machine, setMachine] = useState("chest_press");
  const [cameraState, setCameraState] = useState("loading");
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [detectState, setDetectState] = useState("idle");
  const [detectMessage, setDetectMessage] = useState("Point camera at a machine.");
  const [detectConfidencePct, setDetectConfidencePct] = useState(null);
  const [manualMode, setManualMode] = useState(true);
  const [showSketchfabModel, setShowSketchfabModel] = useState(false);
  const [overlayVideoByMachine, setOverlayVideoByMachine] = useState({});
  const [overlayOpacity, setOverlayOpacity] = useState(0.72);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReanchorMode, setIsReanchorMode] = useState(false);
  const [selectedCalloutIndex, setSelectedCalloutIndex] = useState(0);
  const [trackedBoxByMachine, setTrackedBoxByMachine] = useState({});
  const [trackingQualityByMachine, setTrackingQualityByMachine] = useState({});
  const [showTipsOverlay, setShowTipsOverlay] = useState(true);
  const [cameraAspectRatio, setCameraAspectRatio] = useState(16 / 9);
  const [isCameraMirrored, setIsCameraMirrored] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraWrapRef = useRef(null);
  const streamRef = useRef(null);
  const modelRef = useRef(null);
  const detectMachineFromFrameRef = useRef(null);
  const lostTrackCountRef = useRef(0);

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
      tips: [
        {
          title: "Setup Checklist",
          points: [
            "Align handles with mid-chest before first rep.",
            "Keep feet flat and shoulder blades pressed into backrest.",
            "Start with a light warm-up set before adding load.",
          ],
        },
        {
          title: "Grip Control",
          trackHotspot: "Grip",
          points: [
            "Wrap thumb around handles and keep wrist neutral.",
            "Push in a straight line; avoid flaring elbows too far out.",
            "Slowly return to the start to protect shoulder joints.",
          ],
        },
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
      tips: [
        {
          title: "Walking Form",
          points: [
            "Look forward and keep your shoulders relaxed.",
            "Land softly under your hips; avoid overstriding.",
            "Increase speed gradually, not in large jumps.",
          ],
        },
        {
          title: "Handle Usage",
          trackHotspot: "Handles",
          points: [
            "Use handles for balance only, not to pull your body weight.",
            "Relax your grip once your pace is stable.",
            "Keep posture upright while hands stay light.",
          ],
        },
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
    tips: [
      {
        title: "Machine Safety",
        points: [
          "Adjust seat and range of motion before loading weight.",
          "Keep controlled tempo through both directions.",
          "Stop immediately if you feel sharp pain.",
        ],
      },
      {
        title: "Grip Check",
        trackHotspot: "Grip",
        points: [
          "Keep the wrist straight and thumb wrapped around handle.",
          "Avoid squeezing too hard; maintain a stable, calm grip.",
          "Reposition grip if tracking shows unstable placement.",
        ],
      },
    ],
  };
  const machineSpecificGuides = {
    reg_curl_machine: {
      title: "Leg Curl Machine",
      steps: [
        "Align knee with machine pivot point",
        "Pad sits above your ankle/Achilles",
        "Curl smoothly, do not swing hips",
        "Lower slowly to full control",
      ],
      hotspots: [
        { label: "Knee", x: 0.46, y: 0.5 },
        { label: "Ankle Pad", x: 0.66, y: 0.65 },
        { label: "Grip", x: 0.34, y: 0.42 },
      ],
      tips: [
        {
          title: "Leg Curl Setup",
          points: [
            "Set back pad so knees line up with axis of rotation.",
            "Keep hips down on the bench throughout each rep.",
            "Start light and increase load after technique is stable.",
          ],
        },
        {
          title: "Grip & Stability",
          trackHotspot: "Grip",
          points: [
            "Hold side handles firmly to stop hip lift.",
            "Brace core and keep pelvis neutral while curling.",
            "If tracking is unstable, reset hand placement on handles.",
          ],
        },
      ],
    },
    leg_extension: {
      title: "Leg Extension",
      hotspots: [
        { label: "Knee", x: 0.5, y: 0.48 },
        { label: "Shin Pad", x: 0.68, y: 0.65 },
        { label: "Grip", x: 0.35, y: 0.44 },
      ],
      tips: [
        {
          title: "Knee Alignment",
          trackHotspot: "Knee",
          points: [
            "Match knee joint with machine pivot before starting.",
            "Avoid locking knees hard at the top position.",
            "Lower under control to protect the joint.",
          ],
        },
      ],
    },
    chest_fly_machine: {
      title: "Chest Fly Machine",
      hotspots: [
        { label: "Grip", x: 0.64, y: 0.43 },
        { label: "Seat", x: 0.47, y: 0.6 },
        { label: "Elbow Path", x: 0.75, y: 0.4 },
      ],
      tips: [
        {
          title: "Fly Form",
          trackHotspot: "Elbow Path",
          points: [
            "Keep elbows slightly bent through the full rep.",
            "Bring handles together with chest, not shoulder shrug.",
            "Return slowly to feel stretch without joint stress.",
          ],
        },
      ],
    },
  };
  YOLO_CLASS_SLUGS.forEach((slug) => {
    tutorials[slug] = {
      title: humanizeSlug(slug),
      ...yoloGenericGuide,
      ...(machineSpecificGuides[slug] || {}),
    };
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
  const detectionButtonLabel =
    detectState === "running"
      ? "Detecting..."
      : detectState === "ready" && (activeTutorial || machine)
        ? `Detected: ${prettyMachineName(activeTutorial || machine)}${
            Number.isFinite(detectConfidencePct) ? ` (${detectConfidencePct}%)` : ""
          }`
        : detectState === "error"
          ? "Detection Error"
          : "Start Detection";

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
      const predictions = await detectWithYoloServer(canvas);
      if (Array.isArray(predictions) && predictions.length) {
        const supported = predictions
          .map((item) => {
            const slug = slugFromYoloClassName(item.class_name);
            return slug ? { ...item, slug } : null;
          })
          .filter(Boolean)
          .filter((item) => Number(item.confidence || 0) >= YOLO_CONFIDENCE_THRESHOLD);
        if (supported.length) {
          const best = supported.reduce((currentBest, item) => {
            const conf = Number(item.confidence || 0);
            const bestConf = Number(currentBest.confidence || 0);
            if (conf > bestConf) return item;
            if (conf < bestConf) return currentBest;
            const area = Number(item.width || 0) * Number(item.height || 0);
            const bestArea = Number(currentBest.width || 0) * Number(currentBest.height || 0);
            return area > bestArea ? item : currentBest;
          }, supported[0]);
          const iw = best.image_width || width;
          const ih = best.image_height || height;
          const leftPct = (best.x / iw) * 100;
          const topPct = (best.y / ih) * 100;
          const wPct = (best.width / iw) * 100;
          const hPct = (best.height / ih) * 100;
          return {
            machineId: best.slug,
            confidence: Number(best.confidence),
            anchor: {
              left: Math.min(95, Math.max(5, leftPct)),
              top: Math.min(95, Math.max(5, topPct)),
            },
            box: {
              width: Math.min(90, Math.max(MIN_BOX_PERCENT, wPct)),
              height: Math.min(90, Math.max(MIN_BOX_PERCENT, hPct)),
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
          width: Math.min(90, Math.max(MIN_BOX_PERCENT, (workflowDetection.box.width / width) * 100)),
          height: Math.min(90, Math.max(MIN_BOX_PERCENT, (workflowDetection.box.height / height) * 100)),
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
    setDetectConfidencePct(null);
    setDetectMessage("Detecting machine...");

    let found = null;
    let candidateId = null;
    let candidateCount = 0;
    let candidateBest = null;
    for (let i = 0; i < 12; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const sample = await detectMachineFromFrame();
      if (sample?.machineId && MACHINE_ALLOWED_FOR_DETECTION.has(sample.machineId)) {
        if (sample.machineId !== candidateId) {
          candidateId = sample.machineId;
          candidateCount = 1;
          candidateBest = sample;
        } else {
          candidateCount += 1;
          if (Number(sample.confidence || 0) > Number(candidateBest?.confidence || 0)) {
            candidateBest = sample;
          }
        }
        if (candidateCount >= 2) {
          found = candidateBest;
          break;
        }
      }
      // Small delay between frame checks
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 180));
    }

    if (found?.machineId && MACHINE_ALLOWED_FOR_DETECTION.has(found.machineId)) {
      const detected = normalizeMachineId(found.machineId);
      setMachine(detected);
      setActiveTutorial(detected);
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
      const confidencePct = Math.round(Number(found.confidence || 0) * 100);
      setDetectConfidencePct(confidencePct);
      setDetectMessage(`Detected: ${prettyMachineName(detected)} (${confidencePct}%). Tap Start Guide.`);
      return;
    }

    setDetectState("idle");
    setDetectConfidencePct(null);
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

  const getTrackedHotspotPosition = (machineId, hotspotLabel) => {
    if (!machineId || !hotspotLabel) return null;
    const box = trackedBoxByMachine[machineId];
    if (!box) return null;
    const anchor = anchorByMachine[machineId] || initialAnchorByMachine[machineId];
    const hotspot = (tutorials[machineId]?.hotspots || []).find(
      (item) => String(item.label).toLowerCase() === String(hotspotLabel).toLowerCase(),
    );
    if (!anchor || !hotspot) return null;
    return {
      left: anchor.left - box.width / 2 + box.width * hotspot.x,
      top: anchor.top - box.height / 2 + box.height * hotspot.y,
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

  const handleExitAr = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setDetectState("idle");
    setDetectConfidencePct(null);
    setActiveTutorial(null);
    setCameraState("loading");
    setDetectMessage("AR stopped.");
    navigate("/gyms");
  };

  const handleFlipCamera = () => {
    setIsCameraMirrored((current) => !current);
  };

  useEffect(() => {
    if (detectState !== "ready") return undefined;
    const hasAnyDetector =
      isYoloServerConfigured() || (ROBOFLOW_WORKFLOW_URL && ROBOFLOW_API_KEY) || Boolean(MODEL_BASE_URL);
    if (!hasAnyDetector) return undefined;
    let cancelled = false;
    const interval = setInterval(async () => {
      if (cancelled) return;
      const found = await detectMachineFromFrameRef.current?.();
      const target = activeTutorial || machine;
      if (!found?.machineId || !found.anchor) {
        lostTrackCountRef.current += 1;
        if (lostTrackCountRef.current >= 4) {
          setDetectState("idle");
          setDetectConfidencePct(null);
          setActiveTutorial(null);
          setDetectMessage("Machine left camera view. Detection stopped.");
          setTrackingQualityByMachine((prev) => ({ ...prev, [target]: "poor" }));
          lostTrackCountRef.current = 0;
        }
        return;
      }
      // Ignore transient wrong-class detections while locked on current machine.
      if (found.machineId !== target) {
        return;
      }
      lostTrackCountRef.current = 0;
      setAnchorByMachine((prev) => {
        const current = prev[target] || found.anchor;
        const dx = found.anchor.left - current.left;
        const dy = found.anchor.top - current.top;
        const movement = Math.sqrt(dx * dx + dy * dy);
        const boxArea = (found.box?.width || 0) * (found.box?.height || 0);
        const quality =
          movement < 3 && boxArea > 240 ? "good" : movement < 6 && boxArea > 170 ? "fair" : "poor";
        setTrackingQualityByMachine((prevQuality) => ({ ...prevQuality, [target]: quality }));
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
    }, 450);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeTutorial, detectState, machine]);

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      try {
        setCameraState("loading");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            aspectRatio: { ideal: 16 / 9 },
            resizeMode: "none",
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack?.getCapabilities?.();
        if (capabilities?.zoom) {
          await videoTrack.applyConstraints({ advanced: [{ zoom: capabilities.zoom.min }] }).catch(() => {});
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          if (videoRef.current.videoWidth && videoRef.current.videoHeight) {
            setCameraAspectRatio(videoRef.current.videoWidth / videoRef.current.videoHeight);
          }
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
        background: "#000",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={cameraWrapRef}
        onClick={handleCameraWrapClick}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          background: "#0c0c0c",
        }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            if (video.videoWidth && video.videoHeight) {
              setCameraAspectRatio(video.videoWidth / video.videoHeight);
            }
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: isCameraMirrored ? "scaleX(-1)" : "none" }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <button
          type="button"
          onClick={handleStartDetection}
          disabled={cameraState !== "ready" || detectState === "running"}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            border: "1px solid rgba(255,255,255,0.28)",
            borderRadius: 999,
            background: "rgba(20,20,20,0.75)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            padding: "7px 12px",
            opacity: cameraState !== "ready" || detectState === "running" ? 0.65 : 1,
          }}
        >
          {detectionButtonLabel}
        </button>

        <button
          type="button"
          onClick={() => setShowTipsOverlay((prev) => !prev)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            border: "1px solid rgba(255,255,255,0.28)",
            borderRadius: 999,
            background: "rgba(20,20,20,0.75)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            padding: "7px 12px",
          }}
        >
          {showTipsOverlay ? "Hide Tips" : "Show Tips"}
        </button>

        <button
          type="button"
          onClick={handleExitAr}
          style={{
            position: "absolute",
            top: 10,
            right: 110,
            border: 0,
            borderRadius: 999,
            background: "#ff6f50",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 700,
            padding: "7px 12px",
            minHeight: 34,
            boxShadow: "0 6px 14px rgba(0,0,0,0.28)",
          }}
        >
          Exit AR
        </button>

        <button
          type="button"
          onClick={handleFlipCamera}
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            border: "1px solid rgba(255,255,255,0.28)",
            borderRadius: 999,
            background: "rgba(20,20,20,0.75)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            padding: "7px 12px",
          }}
        >
          Mirror
        </button>

        {showTipsOverlay && cameraState === "ready" && activeTutorial
          ? (() => {
              const assignedTip = (tutorials[activeTutorial]?.tips || []).find((tip) => tip.trackHotspot);
              if (!assignedTip) return null;

              const hotspotPos = getTrackedHotspotPosition(activeTutorial, assignedTip.trackHotspot);
              if (!hotspotPos) return null;

              const quality = trackingQualityByMachine[activeTutorial] || "fair";
              const qualityColor =
                quality === "good" ? "rgba(63,185,80,0.95)" : quality === "fair" ? "rgba(255,193,79,0.95)" : "rgba(255,111,80,0.95)";
              const placeRight = hotspotPos.left < 52;
              const cardLeft = Math.max(8, Math.min(92, hotspotPos.left + (placeRight ? 12 : -12)));
              const cardTop = Math.max(12, Math.min(88, hotspotPos.top - 2));

              return (
                <div
                  key={`${activeTutorial}-tracked-tip`}
                  style={{
                    position: "absolute",
                    left: `${cardLeft}%`,
                    top: `${cardTop}%`,
                    transform: `translate(${placeRight ? 0 : -100}%, -50%)`,
                    width: 220,
                    maxWidth: "58vw",
                    pointerEvents: "none",
                    background: "rgba(8,10,16,0.85)",
                    border: `1px solid ${qualityColor}`,
                    borderRadius: 12,
                    padding: "8px 10px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <strong style={{ fontSize: 12, color: "#fff" }}>{assignedTip.title}</strong>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: "#10161f",
                        background: qualityColor,
                        borderRadius: 999,
                        padding: "2px 7px",
                      }}
                    >
                      {quality}
                    </span>
                  </div>
                  <ul style={{ margin: "6px 0 0", paddingLeft: 16, color: "#e7e9ed", fontSize: 11, lineHeight: 1.35 }}>
                    {(assignedTip.points || []).slice(0, 3).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              );
            })()
          : null}

      </div>
    </main>
  );
}
