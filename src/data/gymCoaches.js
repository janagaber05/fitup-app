export const GYM_COACHES = [
  {
    id: "sarah-connor",
    name: "Sarah Connor",
    specialty: "Fat Loss & Conditioning",
    rating: 4.9,
    reviewCount: 128,
    price: 75,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Sarah builds high-energy programs focused on fat loss, athletic conditioning, and sustainable habits. She specializes in helping members stay consistent with structured weekly plans.",
    experience: "8 years",
    certifications: ["NASM CPT", "HIIT Specialist", "Sports Nutrition"],
    classes: ["HIIT Burn", "HIIT Advanced", "MetCon Circuit"],
    languages: ["English", "Arabic"],
  },
  {
    id: "layla-hassan",
    name: "Layla Hassan",
    specialty: "Strength & Athletic Performance",
    rating: 4.7,
    reviewCount: 96,
    price: 90,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bio: "Layla coaches Olympic lifting fundamentals and strength blocks for intermediate to advanced lifters. Her sessions emphasize form, progressive overload, and injury-aware training.",
    experience: "6 years",
    certifications: ["USAW Level 1", "CSCS", "Mobility First"],
    classes: ["Strength 101", "Power Lifting Lab", "Athletic Performance"],
    languages: ["English", "Arabic"],
  },
  {
    id: "maya-patel",
    name: "Maya Patel",
    specialty: "Mobility & Recovery",
    rating: 4.8,
    reviewCount: 84,
    price: 65,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio: "Maya leads mobility, yoga, and recovery-focused sessions designed to improve flexibility, posture, and post-workout recovery for busy members.",
    experience: "5 years",
    certifications: ["RYT-200", "FRC Mobility", "Breathwork Coach"],
    classes: ["Power Yoga", "Morning Flow Yoga", "Active Recovery"],
    languages: ["English", "Hindi"],
  },
  {
    id: "nina-carter",
    name: "Nina Carter",
    specialty: "Strength & Conditioning",
    rating: 4.9,
    reviewCount: 112,
    price: 80,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
    bio: "Nina combines strength training with conditioning finishers to help members build muscle while improving endurance and work capacity.",
    experience: "7 years",
    certifications: ["ACE CPT", "Kettlebell Specialist"],
    classes: ["Strength Foundations", "Full-Body Conditioning"],
    languages: ["English"],
  },
  {
    id: "nora-blake",
    name: "Nora Blake",
    specialty: "HIIT & MetCon",
    rating: 5.0,
    reviewCount: 143,
    price: 75,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    bio: "Nora is known for fast-paced HIIT sessions that push limits safely. She focuses on measurable progress and motivating members through every rep.",
    experience: "6 years",
    certifications: ["CrossFit L1", "First Aid & CPR"],
    classes: ["HIIT Blast", "Cardio Burn", "EMS Partner Sessions"],
    languages: ["English", "Arabic"],
  },
];

export function getCoachById(coachId) {
  return GYM_COACHES.find((coach) => coach.id === coachId) || null;
}

export function getCoachByName(name) {
  return GYM_COACHES.find((coach) => coach.name === name) || null;
}

export function coachToBookingRef(coach) {
  if (!coach) return null;
  return {
    id: coach.id,
    name: coach.name,
    specialty: coach.specialty,
    avatar: coach.image,
    image: coach.image,
    rating: coach.rating,
    price: coach.price,
  };
}
