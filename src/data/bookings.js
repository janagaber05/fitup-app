const BOOKINGS_STORAGE_KEY = "fitup-member-bookings";
const EMS_PACKAGE_KEY = "fitup-ems-active-package";
const PRIVATE_SESSIONS_USAGE_KEY = "fitup-private-sessions-usage";
const PRIVATE_SESSIONS_CREDITS_KEY = "fitup-private-sessions-credits";
const LEGACY_EMS_BOOKINGS_KEY = "fitup-ems-package-bookings";
const LEGACY_PROFILE_BOOKINGS_KEY = "fitup-profile-private-bookings";

function readRawBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeBookings(list) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
}

function currentMonthCycle() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function mapKindToType(kind) {
  if (kind === "Class") return "class";
  if (kind === "Private Service") return "wellness";
  if (kind === "Personal Training") return "private";
  return "program";
}

function restoreBookingCredit(booking) {
  if (booking.creditSource === "ems-package") {
    try {
      const raw = localStorage.getItem(EMS_PACKAGE_KEY);
      if (!raw) return;
      const pkg = JSON.parse(raw);
      if (!pkg || typeof pkg.usedSessions !== "number") return;
      pkg.usedSessions = Math.max(0, pkg.usedSessions - 1);
      localStorage.setItem(EMS_PACKAGE_KEY, JSON.stringify(pkg));
    } catch {
      /* ignore */
    }
    return;
  }

  if (booking.creditSource === "profile-included") {
    try {
      const raw = localStorage.getItem(PRIVATE_SESSIONS_USAGE_KEY);
      const cycle = currentMonthCycle();
      const usage = raw ? JSON.parse(raw) : { cycle, used: 0 };
      const base = usage.cycle === cycle ? usage : { cycle, used: 0 };
      base.used = Math.max(0, base.used - 1);
      localStorage.setItem(PRIVATE_SESSIONS_USAGE_KEY, JSON.stringify(base));
    } catch {
      /* ignore */
    }
    return;
  }

  if (booking.creditSource === "profile-purchased") {
    try {
      const raw = localStorage.getItem(PRIVATE_SESSIONS_CREDITS_KEY);
      const value = Number(raw);
      const next = Number.isFinite(value) && value >= 0 ? value + 1 : 1;
      localStorage.setItem(PRIVATE_SESSIONS_CREDITS_KEY, String(next));
    } catch {
      /* ignore */
    }
  }
}

function syncLegacyRemoval(booking) {
  if (booking.legacySource === "ems") {
    try {
      const raw = localStorage.getItem(LEGACY_EMS_BOOKINGS_KEY);
      if (!raw) return;
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return;
      localStorage.setItem(
        LEGACY_EMS_BOOKINGS_KEY,
        JSON.stringify(list.filter((row) => row.id !== booking.id)),
      );
    } catch {
      /* ignore */
    }
    return;
  }

  if (booking.legacySource === "profile") {
    try {
      const raw = localStorage.getItem(LEGACY_PROFILE_BOOKINGS_KEY);
      if (!raw) return;
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return;
      localStorage.setItem(
        LEGACY_PROFILE_BOOKINGS_KEY,
        JSON.stringify(list.filter((row) => row.id !== booking.id)),
      );
    } catch {
      /* ignore */
    }
  }
}

function normalizeTime(when) {
  return String(when || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}

function normalizeDay(dateLabel) {
  return String(dateLabel || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function bookingSlotKey(dateLabel, when) {
  return `${normalizeDay(dateLabel)}|${normalizeTime(when)}`;
}

function parseLegacyWhenLabel(whenLabel) {
  const raw = String(whenLabel || "").trim();
  if (!raw.includes("•")) {
    return { dateLabel: "", when: raw };
  }
  const [dateLabel, when] = raw.split("•").map((part) => part.trim());
  return { dateLabel, when };
}

function collectActiveSlotKeys(excludeId) {
  const keys = new Set();

  loadActiveBookings().forEach((booking) => {
    if (excludeId && booking.id === excludeId) return;
    keys.add(bookingSlotKey(booking.dateLabel, booking.when));
  });

  try {
    const emsRaw = localStorage.getItem(LEGACY_EMS_BOOKINGS_KEY);
    if (emsRaw) {
      const emsList = JSON.parse(emsRaw);
      if (Array.isArray(emsList)) {
        emsList.forEach((row) => {
          if (excludeId && row.id === excludeId) return;
          const { dateLabel, when } = parseLegacyWhenLabel(row.when);
          if (dateLabel && when) keys.add(bookingSlotKey(dateLabel, when));
        });
      }
    }
  } catch {
    /* ignore */
  }

  try {
    const profileRaw = localStorage.getItem(LEGACY_PROFILE_BOOKINGS_KEY);
    if (profileRaw) {
      const profileList = JSON.parse(profileRaw);
      if (Array.isArray(profileList)) {
        profileList.forEach((row) => {
          if (excludeId && row.id === excludeId) return;
          if (row.day && row.time) keys.add(bookingSlotKey(row.day, row.time));
        });
      }
    }
  } catch {
    /* ignore */
  }

  return keys;
}

export function findBookingConflict(dateLabel, when, excludeId) {
  const key = bookingSlotKey(dateLabel, when);
  const active = loadActiveBookings();
  const centralConflict = active.find((booking) => {
    if (excludeId && booking.id === excludeId) return false;
    return bookingSlotKey(booking.dateLabel, booking.when) === key;
  });
  if (centralConflict) return centralConflict;

  if (collectActiveSlotKeys(excludeId).has(key) && !centralConflict) {
    return { title: "Another session", dateLabel, when };
  }

  return null;
}

export function isSlotAvailable(dateLabel, when, excludeId) {
  return !findBookingConflict(dateLabel, when, excludeId);
}

export function formatBookingConflictMessage(conflict, dateLabel, when) {
  const slot = `${dateLabel} · ${when}`;
  if (conflict?.title) {
    return `You already have "${conflict.title}" booked at ${slot}. Cancel it first or pick another time.`;
  }
  return `You already have a session booked at ${slot}. Cancel it first or pick another time.`;
}

export function loadActiveBookings() {
  return readRawBookings().filter((booking) => booking.status === "confirmed");
}

export function addBooking(booking) {
  const conflict = findBookingConflict(booking.dateLabel, booking.when, booking.id);
  if (conflict) {
    return null;
  }

  const entry = {
    id: booking.id || `bk-${Date.now()}`,
    status: "confirmed",
    confirmedAt: booking.confirmedAt || new Date().toLocaleString(),
    type: booking.type || mapKindToType(booking.kind),
    ...booking,
  };
  writeBookings([entry, ...readRawBookings()]);
  return entry;
}

export function cancelBooking(id) {
  const list = readRawBookings();
  const index = list.findIndex((booking) => booking.id === id && booking.status === "confirmed");
  if (index === -1) return null;

  const booking = list[index];
  const cancelled = {
    ...booking,
    status: "cancelled",
    cancelledAt: new Date().toLocaleString(),
  };
  list[index] = cancelled;
  writeBookings(list);
  restoreBookingCredit(booking);
  syncLegacyRemoval(booking);
  return cancelled;
}

export function buildBookingRef() {
  return `BK-${Date.now().toString().slice(-6)}`;
}

export { mapKindToType };
