import {
  Coins,
  Crown,
  Gem,
  Hammer,
  Heart,
  Moon,
  Music,
  RotateCcw,
  Sparkle,
  Sparkles,
  Sprout,
  Waves,
  type LucideIcon,
} from "lucide-react";
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

export const DAY_TYPE_META: Record<
  DayType,
  { label: string; tone: string; icon: LucideIcon; color: string }
> = {
  master11: { label: "Master 11", tone: "Visionary day. Trust your intuition.", icon: Sparkles, color: "#c084fc" },
  master22: { label: "Master 22", tone: "Master Builder day. Lay big foundations.", icon: Gem, color: "#fbbf24" },
  master33: { label: "Master 33", tone: "Master Teacher day. Serve and heal.", icon: Sparkle, color: "#f472b6" },
  peak: { label: "Peak Day", tone: "Your Life Path activates today.", icon: Crown, color: "#22d3ee" },
  abundance: { label: "Abundance", tone: "Power & resources flow.", icon: Coins, color: "#eab308" },
  flow: { label: "Flow", tone: "Movement, freedom, opportunity.", icon: Waves, color: "#06b6d4" },
  newStart: { label: "New Start", tone: "Plant a seed. Begin.", icon: Sprout, color: "#f97316" },
  creative: { label: "Creative", tone: "Express, play, share.", icon: Music, color: "#fbbf24" },
  harmony: { label: "Harmony", tone: "Connect, partner, soften.", icon: Heart, color: "#ec4899" },
  rest: { label: "Rest", tone: "Reflect, study, recharge.", icon: Moon, color: "#8b5cf6" },
  release: { label: "Release", tone: "Complete and let go.", icon: RotateCcw, color: "#ef4444" },
  neutral: { label: "Build", tone: "Steady, grounded work.", icon: Hammer, color: "#94a3b8" },
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

/* ----------------------------- Compatibility ------------------------------ */
/**
 * Life-Path compatibility per Numerology.com's reference card, smoothed to
 * keep symmetry where the sources disagree. Allies are strong natural fits;
 * friction means active opposition (not "doomed" — just real work).
 * Master numbers reduce to their root for compatibility purposes.
 */
export interface CompatibilityEntry {
  allies: number[];
  friction: number[];
  note: string;
}

export const COMPATIBILITY: Record<number, CompatibilityEntry> = {
  1: { allies: [3, 5, 6], friction: [1, 8, 9], note: "Needs space to lead. Pairs best with partners who admire drive without competing for it." },
  2: { allies: [4, 6, 8], friction: [3, 5], note: "Cooperative and tender. Thrives with grounded providers; bruises under restless or aloof partners." },
  3: { allies: [1, 5, 9], friction: [2, 4, 8], note: "Joyful communicator. Vibrates with adventure types; sensitive 2s and rigid 4s grind." },
  4: { allies: [2, 7, 8], friction: [3, 5, 9], note: "Builder of structure. Bonds with the steady and the deep; chaos types feel threatening." },
  5: { allies: [1, 3, 7], friction: [2, 4, 9], note: "Freedom-first. Needs partners who can ride the wave or wander beside it." },
  6: { allies: [1, 2, 8, 9], friction: [3, 7], note: "Devoted nurturer. Almost universally caring, but flighty 3s and isolated 7s strain it." },
  7: { allies: [4, 5, 7], friction: [6, 8, 9], note: "Introspective seeker. Best with depth or solitude; nurturers and tycoons drain it." },
  8: { allies: [2, 4, 6], friction: [1, 3, 5, 7, 9], note: "Power-driven. Needs partners who orbit the ambition, not duel with it." },
  9: { allies: [3, 6, 9], friction: [1, 4, 5, 7, 8], note: "Old soul, big heart. Resonates with other-givers; needs partners patient with its melancholy." },
};

/* -------------------------- Birthday Number (1-31) ------------------------- */
/**
 * Birthday Number — the unreduced day-of-month of birth. Carries a flavour
 * even when it reduces to the same single digit as another date.
 */
export const BIRTHDAY_NUMBER_MEANINGS: Record<number, { title: string; blurb: string }> = {
  1: { title: "The Independent", blurb: "Self-starter. You see openings others miss and move first." },
  2: { title: "The Diplomat", blurb: "Sensitive and cooperative. You read rooms with uncomfortable accuracy." },
  3: { title: "The Performer", blurb: "Expressive and witty. Words and creativity come fast." },
  4: { title: "The Builder", blurb: "Reliable, methodical, allergic to shortcuts." },
  5: { title: "The Adventurer", blurb: "Restless, curious, magnetic — change is your oxygen." },
  6: { title: "The Caregiver", blurb: "Family-and-home centred. You love hard and protect harder." },
  7: { title: "The Seeker", blurb: "Introspective, analytical, drawn to anything mysterious." },
  8: { title: "The Executive", blurb: "Born for authority, money, and the long climb." },
  9: { title: "The Humanitarian", blurb: "Wide-hearted and idealistic. You care about the whole." },
  10: { title: "Pioneer (10/1)", blurb: "A 1 with extra individuality — leadership with a creative twist." },
  11: { title: "Master 11", blurb: "Intuitive, visionary, high-voltage nervous system." },
  12: { title: "Creative communicator (12/3)", blurb: "A 3 with disciplined structure underneath the wit." },
  13: { title: "Karmic 13 → 4", blurb: "A builder with debt: laziness or shortcuts must be unlearned." },
  14: { title: "Karmic 14 → 5", blurb: "Freedom haunted by past excess. Practise moderation." },
  15: { title: "Magnetic charmer (15/6)", blurb: "A 6 with allure — beware seduction overriding values." },
  16: { title: "Karmic 16 → 7", blurb: "Spiritual rebirth via humbling. Ego must be dismantled." },
  17: { title: "Tested 8 (17/8)", blurb: "Material success, but only through wisdom-tempered ambition." },
  18: { title: "Activist 9 (18/9)", blurb: "Humanitarian fight. You scrap with the world's wrongs." },
  19: { title: "Karmic 19 → 1", blurb: "Independence through service. You cannot lead by taking only." },
  20: { title: "Quiet diplomat (20/2)", blurb: "A 2 amplified — patience, intuition, sacred companionship." },
  21: { title: "Sparkling 3 (21/3)", blurb: "Joy with social ease. Born to charm an audience." },
  22: { title: "Master 22", blurb: "Master Builder. Capable of legacy-scale work." },
  23: { title: "Free 5 (23/5)", blurb: "Versatile, curious, irresistibly adaptable." },
  24: { title: "Devoted 6 (24/6)", blurb: "Family-builder, counsellor, the dependable one." },
  25: { title: "Mystic 7 (25/7)", blurb: "Inward, analytical, drawn to esoteric truth." },
  26: { title: "Power 8 (26/8)", blurb: "Material mastery with diplomatic edge." },
  27: { title: "Wise 9 (27/9)", blurb: "Old soul with teacherly streak." },
  28: { title: "Independent 1 (28/1)", blurb: "Leadership softened by partnership skill." },
  29: { title: "Master 11 / 2", blurb: "Visionary 11 vibration. High intuition, high overwhelm risk." },
  30: { title: "Polished 3 (30/3)", blurb: "Refined communicator. Big platforms, big audiences." },
  31: { title: "Patient builder (31/4)", blurb: "Long-game artisan. Steady, detailed, devoted to craft." },
};

/* ------------------------------ Attitude --------------------------------- */
export const ATTITUDE_MEANINGS: Record<number, string> = {
  1: "First impression: confident, direct, takes the lead.",
  2: "First impression: warm, considerate, easy to talk to.",
  3: "First impression: playful, sparkling, quick with words.",
  4: "First impression: serious, dependable, all-business.",
  5: "First impression: restless, magnetic, slightly unpredictable.",
  6: "First impression: warm host, caring, present.",
  7: "First impression: reserved, observant, quietly assessing.",
  8: "First impression: authoritative, capable, results-oriented.",
  9: "First impression: idealistic, soulful, slightly distant.",
  11: "First impression: electric and intense — easy to underestimate.",
  22: "First impression: composed master builder; gravitas you can feel.",
  33: "First impression: nurturing teacher; people open up unprompted.",
};

/* ------------------------------ Pinnacles --------------------------------- */
export const PINNACLE_MEANINGS: Record<number, string> = {
  1: "Cycle of independence. Self-definition, originality, standing alone.",
  2: "Cycle of partnership. Patience, diplomacy, learning to share weight.",
  3: "Cycle of expression. Creative output, social reach, joyful work.",
  4: "Cycle of building. Discipline, foundations, work that compounds.",
  5: "Cycle of change. Travel, freedom, expansion through experience.",
  6: "Cycle of responsibility. Family, home, service to those near you.",
  7: "Cycle of inner work. Study, depth, spiritual or analytical retreat.",
  8: "Cycle of power. Career, money, authority over your domain.",
  9: "Cycle of completion. Letting go, humanitarianism, broad impact.",
  11: "Master cycle of vision. Inspired leadership — intense, illuminating.",
  22: "Master cycle of building. Legacy-scale construction.",
  33: "Master cycle of service. Teaching, healing, devoted uplift.",
};

/* ------------------------------ Challenges -------------------------------- */
export const CHALLENGE_MEANINGS: Record<number, string> = {
  0: "Choice. No fixed lesson — every challenge type is on offer; you choose your battles.",
  1: "Asserting yourself without dominating. Find your voice without erasing others'.",
  2: "Oversensitivity. Stop absorbing every emotion in the room.",
  3: "Self-doubt around expression. Speak even when the voice shakes.",
  4: "Disorganisation or rigidity. Find structure without becoming it.",
  5: "Restlessness. Commit long enough to taste depth, not just novelty.",
  6: "Over-responsibility. Care without carrying everyone.",
  7: "Faith. Trust what cannot yet be proven; stop hiding in analysis.",
  8: "Money and power. Make peace with ambition — neither worship nor refuse it.",
  9: "Letting go. Stop carrying old griefs; finish what is finished.",
};

/* --------------------- Name-based number meanings ------------------------- */
export const NAME_NUMBER_MEANINGS: Record<
  number,
  { expression: string; soulUrge: string; personality: string }
> = {
  1: {
    expression: "Born to lead and originate. You're built for direction-setting.",
    soulUrge: "You hunger for independence and recognition for your own work.",
    personality: "You come across as confident, decisive, slightly self-contained.",
  },
  2: {
    expression: "Built for partnership and diplomacy. You harmonise systems and people.",
    soulUrge: "You crave deep companionship, gentleness, emotional safety.",
    personality: "You read as warm, attentive, easy to confide in.",
  },
  3: {
    expression: "Built for expression and joy. Words, art, charm — your native tools.",
    soulUrge: "You long to be heard, to create, to brighten rooms.",
    personality: "You come across as playful, witty, instantly likeable.",
  },
  4: {
    expression: "Built to construct. Method, precision, and useful structure.",
    soulUrge: "You want stability, order, and work you can stand behind.",
    personality: "You read as grounded, reliable, all-business.",
  },
  5: {
    expression: "Built for movement. Change, communication, adaptability.",
    soulUrge: "You crave freedom and novelty above almost anything else.",
    personality: "You read as kinetic, curious, charmingly unpredictable.",
  },
  6: {
    expression: "Built to care. Family, beauty, justice, healing.",
    soulUrge: "You long for love, harmony, and a circle that needs you.",
    personality: "You come across as warm host, protector, present.",
  },
  7: {
    expression: "Built to seek. Analyst, mystic, researcher of inner truths.",
    soulUrge: "You crave solitude, depth, and the texture of real understanding.",
    personality: "You read as reserved, thoughtful, slightly elusive.",
  },
  8: {
    expression: "Built for power. Money, command, the long climb.",
    soulUrge: "You hunger for material mastery and visible achievement.",
    personality: "You come across as capable, authoritative, results-driven.",
  },
  9: {
    expression: "Built to serve and complete. Humanitarianism, art, broad love.",
    soulUrge: "You long to give, to heal, to leave the world better.",
    personality: "You read as worldly, compassionate, a bit otherworldly.",
  },
  11: {
    expression: "Built as a channel. Vision, inspiration, spiritual transmission.",
    soulUrge: "You crave to illuminate — even at the cost of your nerves.",
    personality: "You come across as luminous, intense, magnetically odd.",
  },
  22: {
    expression: "Built as Master Builder. Legacy-scale construction is your gift.",
    soulUrge: "You hunger to build something the world remembers.",
    personality: "You read as quietly commanding, with unusual gravity.",
  },
  33: {
    expression: "Built as Master Teacher. Devotion, healing, sacrificial service.",
    soulUrge: "You long to nurture humanity itself.",
    personality: "You come across as soothing, deeply present, almost parental.",
  },
};

export const MATURITY_NOTE =
  "Your Maturity number activates around age 35 and grows stronger from there. It blends who you are (Life Path) with what you do (Expression).";

/* ------------------------------ Friction days ----------------------------- */
/**
 * A friction day runs a Personal Day number that sits in the friction set of
 * the viewer's Life Path. Not a bad day — just one whose energy works against
 * the grain, so it asks for a lighter touch.
 */
export const FRICTION_NOTE =
  "This day runs a number that sits in friction with your Life Path. Nothing is wrong with it — the energy simply pulls against your natural grain. Push gently, avoid forcing big outcomes, and don't take the resistance personally.";
