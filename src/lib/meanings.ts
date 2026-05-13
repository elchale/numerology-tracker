import type { DayType } from "./types";

export interface NumberMeaning {
  number: number;
  title: string;
  archetype: string;
  essence: string;
  strengths: string[];
  shadows: string[];
  doToday: string[];
  avoidToday: string[];
  color: string;
}

export const LIFE_PATH_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    number: 1,
    title: "The Pioneer",
    archetype: "Leader, originator, initiator",
    essence:
      "You are wired to begin. New paths, original ideas, the courage to go first — that is where you come alive. Independence is oxygen.",
    strengths: ["Initiative", "Courage", "Original thinking", "Self-reliance", "Decisiveness"],
    shadows: ["Impatience", "Stubbornness", "Loneliness from over-independence", "Domineering"],
    doToday: ["Start the thing", "Take the first step alone", "Lead a decision", "Skip permission"],
    avoidToday: ["Waiting for consensus", "Second-guessing", "Doing what others expect"],
    color: "#f97316",
  },
  2: {
    number: 2,
    title: "The Diplomat",
    archetype: "Mediator, partner, intuitive",
    essence:
      "You read the room before words are spoken. Your power is in collaboration, sensitivity, and the quiet art of bringing people together.",
    strengths: ["Empathy", "Cooperation", "Intuition", "Tact", "Loyalty"],
    shadows: ["Over-giving", "Resentment", "Codependence", "Avoiding conflict"],
    doToday: ["Listen deeply", "Mediate", "Strengthen a partnership", "Choose harmony over winning"],
    avoidToday: ["Forcing decisions", "Going it alone", "Ignoring your gut"],
    color: "#a78bfa",
  },
  3: {
    number: 3,
    title: "The Creator",
    archetype: "Artist, storyteller, communicator",
    essence:
      "Joy, expression, and creative play are your fuel. You inspire others when you allow yourself to be seen and heard without apology.",
    strengths: ["Expression", "Optimism", "Charm", "Imagination", "Wit"],
    shadows: ["Scattered focus", "Drama", "Superficiality", "Self-doubt under pressure"],
    doToday: ["Create something", "Speak in public", "Share your work", "Laugh"],
    avoidToday: ["Heavy admin", "Bitter criticism", "Spreading yourself thin"],
    color: "#fbbf24",
  },
  4: {
    number: 4,
    title: "The Builder",
    archetype: "Architect, craftsman, foundation-layer",
    essence:
      "You build things that last. Structure, discipline, and patient mastery are your gifts. Your work outlives the moment.",
    strengths: ["Discipline", "Reliability", "Practicality", "Endurance", "Loyalty"],
    shadows: ["Rigidity", "Workaholism", "Resistance to change", "Stubborn pessimism"],
    doToday: ["Systematize", "Finish what you started", "Build the foundation", "Plan long-term"],
    avoidToday: ["Improvising under pressure", "Skipping the process", "Resisting feedback"],
    color: "#16a34a",
  },
  5: {
    number: 5,
    title: "The Free Spirit",
    archetype: "Adventurer, explorer, change-agent",
    essence:
      "Movement is medicine for you. Variety, freedom, and sensory experience keep your spirit awake. Cages — physical or mental — are toxic.",
    strengths: ["Adaptability", "Curiosity", "Magnetism", "Sensory intelligence", "Resilience"],
    shadows: ["Restlessness", "Impulsivity", "Commitment-phobia", "Excess"],
    doToday: ["Travel", "Try something new", "Embrace change", "Network"],
    avoidToday: ["Long routines", "Locking in big commitments", "Numbing with excess"],
    color: "#06b6d4",
  },
  6: {
    number: 6,
    title: "The Nurturer",
    archetype: "Healer, parent, protector",
    essence:
      "You are responsible for the well-being of those around you — and you do it beautifully. Home, family, beauty, and service light your way.",
    strengths: ["Care", "Responsibility", "Aesthetic sense", "Wisdom", "Devotion"],
    shadows: ["Martyrdom", "Perfectionism", "Meddling", "Over-responsibility"],
    doToday: ["Host", "Heal a relationship", "Beautify your space", "Give thoughtfully"],
    avoidToday: ["Sacrificing yourself", "Fixing what isn't yours", "Picking apart details"],
    color: "#ec4899",
  },
  7: {
    number: 7,
    title: "The Seeker",
    archetype: "Mystic, scholar, analyst",
    essence:
      "Truth, depth, and silence. You are here to question everything and dig until you find what's real — including within yourself.",
    strengths: ["Intuition", "Analysis", "Spiritual depth", "Focus", "Specialist mastery"],
    shadows: ["Isolation", "Skepticism", "Coldness", "Overthinking"],
    doToday: ["Study", "Meditate", "Be alone", "Research deeply"],
    avoidToday: ["Forced socializing", "Surface chatter", "Rushed decisions"],
    color: "#8b5cf6",
  },
  8: {
    number: 8,
    title: "The Power",
    archetype: "Executive, builder of empires",
    essence:
      "Material mastery, authority, and the responsible use of power. You can move serious resources when you align ambition with integrity.",
    strengths: ["Authority", "Business acumen", "Stamina", "Vision at scale", "Justice"],
    shadows: ["Workaholism", "Control", "Money obsession", "Power abuse"],
    doToday: ["Negotiate", "Invest", "Lead at scale", "Make the big ask"],
    avoidToday: ["Skipping ethics", "Hoarding", "Bullying for a result"],
    color: "#eab308",
  },
  9: {
    number: 9,
    title: "The Humanitarian",
    archetype: "Sage, healer of the world",
    essence:
      "You are here to complete, release, and serve the whole. Your love is universal — your gift is letting go for something larger.",
    strengths: ["Compassion", "Wisdom", "Vision", "Generosity", "Artistic depth"],
    shadows: ["Martyrdom", "Holding on past the ending", "Bitterness", "Drama"],
    doToday: ["Finish a chapter", "Give back", "Forgive", "Release"],
    avoidToday: ["Starting brand-new commitments", "Clinging to the past", "Self-pity"],
    color: "#ef4444",
  },
  11: {
    number: 11,
    title: "The Intuitive",
    archetype: "Visionary, channel, illuminator",
    essence:
      "A master number. You carry a higher voltage — intuition, inspiration, and the ability to lift others into vision. Your wiring is sensitive; protect it.",
    strengths: ["Vision", "Inspiration", "Spiritual insight", "Magnetism", "Idealism"],
    shadows: ["Anxiety", "Burnout from intensity", "Self-doubt", "Avoidance of your gift"],
    doToday: ["Trust the download", "Inspire someone", "Create from vision", "Protect your nervous system"],
    avoidToday: ["Dimming yourself to fit in", "Overstimulation", "Doubting the message"],
    color: "#c084fc",
  },
  22: {
    number: 22,
    title: "The Master Builder",
    archetype: "Architect of large-scale legacy",
    essence:
      "A master number. You can take vision and turn it into something concrete that serves many. Your task: do not shrink the dream to fit the day.",
    strengths: ["Visionary execution", "Discipline", "Large-scale impact", "Practical genius"],
    shadows: ["Overwhelm at the scale of your calling", "Burnout", "Playing small"],
    doToday: ["Build the foundation of a long vision", "Commit to the big project", "Ground the dream in plans"],
    avoidToday: ["Settling for short-term wins", "Avoiding responsibility", "Half-measures"],
    color: "#fbbf24",
  },
  33: {
    number: 33,
    title: "The Master Teacher",
    archetype: "Compassionate healer of collectives",
    essence:
      "The rarest master number. You are here to love at scale — to teach, heal, and lift entire communities through embodied service.",
    strengths: ["Unconditional love", "Spiritual teaching", "Healing presence", "Wisdom"],
    shadows: ["Self-sacrifice", "Carrying everyone's pain", "Avoiding your gift"],
    doToday: ["Teach", "Heal", "Serve the collective", "Speak compassion into a hard moment"],
    avoidToday: ["Martyrdom", "Suppressing your truth to keep peace"],
    color: "#f472b6",
  },
};

export const PERSONAL_YEAR_MEANINGS: Record<number, { title: string; theme: string; focus: string }> = {
  1: { title: "Year of Beginnings", theme: "Plant seeds. Start the new chapter.", focus: "Courage, identity, fresh direction" },
  2: { title: "Year of Partnerships", theme: "Slow down. Build alliances.", focus: "Patience, collaboration, intuition" },
  3: { title: "Year of Expression", theme: "Create, communicate, enjoy.", focus: "Creativity, social life, visibility" },
  4: { title: "Year of Foundations", theme: "Work the system. Build slowly.", focus: "Discipline, structure, health" },
  5: { title: "Year of Change", theme: "Embrace the unexpected. Move.", focus: "Freedom, travel, adaptation" },
  6: { title: "Year of Responsibility", theme: "Tend to home, love, family.", focus: "Relationships, service, beauty" },
  7: { title: "Year of Reflection", theme: "Go inward. Study. Heal.", focus: "Spirit, learning, solitude" },
  8: { title: "Year of Power", theme: "Step into authority and abundance.", focus: "Career, money, influence" },
  9: { title: "Year of Completion", theme: "Release what no longer serves.", focus: "Closure, generosity, transformation" },
  11: { title: "Master Year of Vision", theme: "Inspired path. High voltage.", focus: "Intuition, leadership of light" },
  22: { title: "Master Year of Building", theme: "Build something that outlasts you.", focus: "Legacy, large-scale work" },
  33: { title: "Master Year of Service", theme: "Teach, heal, devote.", focus: "Collective uplift" },
};

export const DAY_TYPE_META: Record<DayType, { label: string; tone: string; emoji: string; color: string }> = {
  master11: { label: "Master 11", tone: "Visionary day. Trust your intuition.", emoji: "★", color: "#c084fc" },
  master22: { label: "Master 22", tone: "Master Builder day. Lay big foundations.", emoji: "◆", color: "#fbbf24" },
  master33: { label: "Master 33", tone: "Master Teacher day. Serve and heal.", emoji: "✦", color: "#f472b6" },
  peak: { label: "Peak Day", tone: "Your Life Path activates today.", emoji: "▲", color: "#22d3ee" },
  abundance: { label: "Abundance", tone: "Power & resources flow.", emoji: "$", color: "#eab308" },
  flow: { label: "Flow", tone: "Movement, freedom, opportunity.", emoji: "~", color: "#06b6d4" },
  newStart: { label: "New Start", tone: "Plant a seed. Begin.", emoji: "+", color: "#f97316" },
  creative: { label: "Creative", tone: "Express, play, share.", emoji: "♪", color: "#fbbf24" },
  harmony: { label: "Harmony", tone: "Connect, partner, soften.", emoji: "♡", color: "#ec4899" },
  rest: { label: "Rest", tone: "Reflect, study, recharge.", emoji: "○", color: "#8b5cf6" },
  release: { label: "Release", tone: "Complete and let go.", emoji: "↺", color: "#ef4444" },
  karmic: { label: "Karmic Day", tone: "A lesson is on offer. Move with care.", emoji: "!", color: "#dc2626" },
  neutral: { label: "Build", tone: "Steady, grounded work.", emoji: "□", color: "#94a3b8" },
};

export const KARMIC_MEANINGS: Record<13 | 14 | 16 | 19, { title: string; lesson: string }> = {
  13: { title: "Karmic 13 → 4", lesson: "The lesson of disciplined effort. Shortcuts cost more than they save today." },
  14: { title: "Karmic 14 → 5", lesson: "The lesson of moderation. Freedom abused becomes a cage." },
  16: { title: "Karmic 16 → 7", lesson: "The lesson of humility. The ego built on sand must be rebuilt on truth." },
  19: { title: "Karmic 19 → 1", lesson: "The lesson of independence through service. You cannot lead by taking only." },
};

export const UNIVERSAL_MEANING: Record<number, string> = {
  1: "Universal seed-planting day.",
  2: "Universal day of cooperation.",
  3: "Universal day of expression.",
  4: "Universal day of structure.",
  5: "Universal day of change.",
  6: "Universal day of care.",
  7: "Universal day of reflection.",
  8: "Universal day of power.",
  9: "Universal day of release.",
  11: "Universal master day — intuition heightened.",
  22: "Universal master day — build big.",
  33: "Universal master day — teach and heal.",
};
