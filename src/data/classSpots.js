const CLASS_SPOTS_STORAGE_KEY = "fitup-class-spots";

function spotKey(sessionId, dateId) {
  return `${sessionId}:${dateId}`;
}

function readSpotMap() {
  try {
    const raw = localStorage.getItem(CLASS_SPOTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeSpotMap(map) {
  localStorage.setItem(CLASS_SPOTS_STORAGE_KEY, JSON.stringify(map));
}

export function getClassSpotsRemaining(sessionId, dateId, maxSpots) {
  const map = readSpotMap();
  const key = spotKey(sessionId, dateId);
  if (typeof map[key] === "number") {
    return Math.max(0, map[key]);
  }
  return maxSpots;
}

export function reserveClassSpot(sessionId, dateId, maxSpots) {
  const remaining = getClassSpotsRemaining(sessionId, dateId, maxSpots);
  if (remaining <= 0) return false;

  const map = readSpotMap();
  map[spotKey(sessionId, dateId)] = remaining - 1;
  writeSpotMap(map);
  return true;
}

export function releaseClassSpot(sessionId, dateId, maxSpots) {
  const remaining = getClassSpotsRemaining(sessionId, dateId, maxSpots);
  const map = readSpotMap();
  map[spotKey(sessionId, dateId)] = Math.min(maxSpots, remaining + 1);
  writeSpotMap(map);
}
