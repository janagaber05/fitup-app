import { getCoachById } from "./gymCoaches";

export const MEMBER_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80";

export const MEMBER_NAME = "Lina Morgan";

export const MEMBER_PLAN = "Premium All-Access";

export const MEMBER_BRANCH = "Downtown Branch";

const memberCoach = getCoachById("sarah-connor");

export const MEMBER_COACH = {
  id: memberCoach?.id || "sarah-connor",
  name: memberCoach?.name || "Sarah Connor",
  specialty: memberCoach?.specialty || "Fat Loss & Conditioning",
  avatar: memberCoach?.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
};

export const DEFAULT_PROFILE_INFO = {
  fullName: MEMBER_NAME,
  email: "lina.morgan@fitup.app",
  phone: "+20 100 987 6543",
  dob: "March 8, 1998",
  gender: "Female",
  fitnessGoals: "Fat Loss, Strength, Endurance",
  injuries: "",
  illnesses: "",
};

const LEGACY_DEMO_EMAIL = "alex.morgan@example.com";

export function loadStoredProfileInfo(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return DEFAULT_PROFILE_INFO;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_PROFILE_INFO, ...parsed };
    if (merged.email === LEGACY_DEMO_EMAIL || merged.fullName === "Alex Morgan") {
      return { ...merged, ...DEFAULT_PROFILE_INFO };
    }
    return merged;
  } catch {
    return DEFAULT_PROFILE_INFO;
  }
}
