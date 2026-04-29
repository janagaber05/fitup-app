const YOLO_API_URL = (process.env.REACT_APP_YOLO_API_URL || "").trim().replace(/\/$/, "");
const LOCAL_YOLO_HOST_REGEX = /(^https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?(\/|$)/i;

function isHostedRuntime() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname || "";
  return host !== "localhost" && host !== "127.0.0.1";
}

function shouldUseYoloApi() {
  if (!YOLO_API_URL) return false;
  // Local YOLO server is valid only during local development.
  if (isHostedRuntime() && LOCAL_YOLO_HOST_REGEX.test(YOLO_API_URL)) {
    return false;
  }
  return true;
}

/**
 * POST camera frame to local YOLO server (scripts/yolo_serve.py).
 * Server returns { predictions: [{ class_name, confidence, x, y, width, height, image_width, image_height }] }
 * with x,y,width,height in pixels relative to image_width/height.
 */
export async function detectWithYoloServer(canvas) {
  if (!shouldUseYoloApi()) return [];
  const imageDataUrl = canvas.toDataURL("image/jpeg", 0.75);
  const imageBase64Raw = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");

  try {
    const response = await fetch(`${YOLO_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64Raw }),
    });
    if (!response.ok) return null;
    const payload = await response.json();
    const list = Array.isArray(payload?.predictions) ? payload.predictions : [];
    if (!list.length) return [];
    return list;
  } catch {
    return [];
  }
}

export function isYoloServerConfigured() {
  return shouldUseYoloApi();
}
