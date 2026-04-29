const YOLO_API_URL = (process.env.REACT_APP_YOLO_API_URL || "").trim().replace(/\/$/, "");

/**
 * POST camera frame to local YOLO server (scripts/yolo_serve.py).
 * Server returns { predictions: [{ class_name, confidence, x, y, width, height, image_width, image_height }] }
 * with x,y,width,height in pixels relative to image_width/height.
 */
export async function detectWithYoloServer(canvas) {
  if (!YOLO_API_URL) return null;
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
  return Boolean(YOLO_API_URL);
}
