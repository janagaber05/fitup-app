#!/usr/bin/env python3
"""
Local YOLOv8 inference API for FITUP AR (Ultralytics).

The React app cannot load .pt weights in the browser — run this server and set:
  REACT_APP_YOLO_API_URL=http://127.0.0.1:8787

Usage:
  cd my-app
  pip install ultralytics fastapi uvicorn python-multipart
  python scripts/yolo_serve.py

Optional env:
  YOLO_MODEL_PATH  default: ./public/model ai/best (5).pt
"""
from __future__ import annotations

import base64
import io
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MODEL = ROOT / "public" / "model ai" / "best (5).pt"

app = FastAPI(title="FITUP YOLO")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictBody(BaseModel):
    image: str  # raw base64 (no data: prefix) or full data URL


_model = None
_resolved_model_path = None


def resolve_model_path() -> Path:
    env_path = os.environ.get("YOLO_MODEL_PATH", "").strip()
    if env_path:
        candidate = Path(env_path).expanduser()
        if not candidate.is_absolute():
            candidate = ROOT / candidate
        if candidate.exists():
            return candidate
        raise RuntimeError(f"Model not found at YOLO_MODEL_PATH: {candidate}")

    if DEFAULT_MODEL.exists():
        return DEFAULT_MODEL

    # Fallback: auto-discover any .pt inside the project.
    candidates = sorted(
        (p for p in ROOT.rglob("*.pt") if p.is_file()),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    if candidates:
        return candidates[0]

    raise RuntimeError(
        "No YOLO .pt model found. Place one under my-app/public (e.g. public/model ai/best (5).pt) "
        "or set YOLO_MODEL_PATH."
    )


def get_model():
    global _model, _resolved_model_path
    if _model is None:
        from ultralytics import YOLO

        model_path = resolve_model_path()
        _resolved_model_path = model_path
        _model = YOLO(str(model_path))
    return _model


@app.get("/health")
def health():
    model_path = _resolved_model_path
    if model_path is None:
        try:
            model_path = resolve_model_path()
        except Exception:
            model_path = os.environ.get("YOLO_MODEL_PATH", str(DEFAULT_MODEL))
    return {"ok": True, "model_path": str(model_path)}


@app.post("/predict")
def predict(body: PredictBody):
    raw = body.image.strip()
    if raw.startswith("data:"):
        raw = raw.split(",", 1)[-1]
    try:
        img_bytes = base64.b64decode(raw)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid base64: {exc}") from exc

    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    model = get_model()
    results = model.predict(image, verbose=False)
    if not results or results[0].boxes is None or len(results[0].boxes) == 0:
        return {"predictions": []}

    r0 = results[0]
    names = r0.names
    h, w = r0.orig_shape[:2]
    out = []
    for box in r0.boxes:
        xyxy = box.xyxy[0].tolist()
        x1, y1, x2, y2 = xyxy
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        label = names.get(cls_id, str(cls_id))
        cx = (x1 + x2) / 2
        cy = (y1 + y2) / 2
        bw = x2 - x1
        bh = y2 - y1
        out.append(
            {
                "class_name": label,
                "confidence": conf,
                "x": cx,
                "y": cy,
                "width": bw,
                "height": bh,
                "image_width": w,
                "image_height": h,
            }
        )
    out.sort(key=lambda p: p["confidence"], reverse=True)
    return {"predictions": out}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8787")))
