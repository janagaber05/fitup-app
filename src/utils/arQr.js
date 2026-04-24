/**
 * Branch + machine QR deep links: each sticker encodes a unique branch id
 * while machine id maps to the shared in-app tutorial catalog.
 *
 * Encode in QR as a URL, e.g. https://<your-host>/ar-tutorial?branch=downtown&machine=chest_press
 */
export function parseArDeepLink(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    try {
      url = new URL(trimmed, "https://placeholder.local");
    } catch {
      return null;
    }
  }
  const path = url.pathname || "";
  const isArPath = path === "/ar-tutorial" || path.endsWith("/ar-tutorial");
  if (!isArPath) return null;
  const branch = (url.searchParams.get("branch") || "").trim();
  const machine = (url.searchParams.get("machine") || "").trim();
  if (!branch || !machine) return null;
  return { branch, machine };
}
