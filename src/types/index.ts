export type GameMode =
  | "classic"
  | "party"
  | "couple"
  | "family"
  | "extreme"
  | "chaos";

export type Category =
  | "funny"
  | "romance"
  | "friends"
  | "school"
  | "office"
  | "deep"
  | "adult"
  | "family"
  | "random"
  /** Couple mode only — dipisah dari kategori umum */
  | "crush"
  | "date"
  | "flags"
  | "flirt";

/** Kategori room biasa (bukan couple) */
export const GENERAL_CATEGORIES: Category[] = [
  "funny",
  "romance",
  "friends",
  "school",
  "office",
  "deep",
  "family",
  "random",
];

/** Sub-kategori khusus Couple Mode (pisah dari kategori umum) */
export const COUPLE_CATEGORIES: Category[] = [
  "crush",
  "date",
  "flags",
  "flirt",
];

export const CATEGORY_LABELS: Record<Category, string> = {
  funny: "Funny",
  romance: "Romance",
  friends: "Friends",
  school: "School",
  office: "Office",
  deep: "Deep",
  adult: "Adult",
  family: "Family",
  random: "Random",
  crush: "Crush / Naksir",
  date: "Kencan / Date",
  flags: "Green & Red Flag",
  flirt: "Flirting / Chat",
};

export type Difficulty = "easy" | "medium" | "hard" | "impossible";

export type CardType = "truth" | "dare";

export type GamePhase =
  | "landing"
  | "lobby"
  | "mode-select"
  | "spinning"
  | "choose"
  | "reveal"
  | "voting"
  | "event"
  | "mystery"
  | "result"
  | "highlights";

export type PowerCardType =
  | "skip"
  | "reverse"
  | "swap"
  | "double-dare"
  | "truth-shield"
  | "steal-turn";

export type ChaosEventType =
  | "double-dare"
  | "triple-truth"
  | "spin-again"
  | "everyone-answer"
  | "swap-player"
  | "skip-turn"
  | "reverse-turn"
  | "challenge-battle"
  | "random-punishment"
  | "lucky-bonus"
  | "mystery-card";

export type AvatarColor =
  | "purple"
  | "orange"
  | "yellow"
  | "coral"
  | "navy"
  | "white"
  | "pink"
  | "teal";

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: AvatarColor;
  xp: number;
  coins: number;
  level: number;
  truthsAnswered: number;
  daresCompleted: number;
  daresFailed: number;
  skips: number;
  combo: number;
  maxCombo: number;
  powerCards: PowerCardType[];
  titles: string[];
  badges: string[];
  isHost: boolean;
  isConnected: boolean;
  ping: number;
  voteReady?: boolean;
}

export interface TruthCard {
  id: string;
  text: string;
  category: Category;
  modes: GameMode[];
  intensity: 1 | 2 | 3 | 4 | 5;
}

export interface DareCard {
  id: string;
  text: string;
  category: Category;
  modes: GameMode[];
  difficulty: Difficulty;
  xpReward: number;
  coinReward: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  condition: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
}

export interface GameSettings {
  mode: GameMode;
  categories: Category[];
  timer: number;
  rounds: number;
  difficulty: Difficulty | "mixed";
  isPrivate: boolean;
  password: string;
  customTruths: string[];
  customDares: string[];
  enableVoting: boolean;
  enableEvents: boolean;
  enablePowerCards: boolean;
  adultContent: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  reduceMotion: boolean;
  darkMode: boolean;
}

export interface Room {
  code: string;
  hostId: string;
  players: Player[];
  settings: GameSettings;
  phase: GamePhase;
  currentRound: number;
  currentPlayerIndex: number;
  direction: 1 | -1;
  usedTruthIds: string[];
  usedDareIds: string[];
  history: RoundHistory[];
  activeEvent?: ChaosEventType;
  lastCard?: { type: CardType; text: string; difficulty?: Difficulty };
}

export interface RoundHistory {
  round: number;
  playerId: string;
  playerName: string;
  type: CardType;
  text: string;
  completed: boolean;
  votesYes: number;
  votesNo: number;
  xpEarned: number;
  timestamp: number;
}

export interface Highlight {
  type: "mvp" | "funniest" | "combo" | "coward" | "daredevil" | "stat";
  title: string;
  description: string;
  playerId?: string;
  playerName?: string;
  value?: string | number;
  icon: string;
}

export interface ProfileStats {
  totalGames: number;
  totalTruths: number;
  totalDares: number;
  daresCompleted: number;
  daresFailed: number;
  playTimeMinutes: number;
  winRate: number;
  achievementsUnlocked: string[];
  favoriteMode: GameMode | null;
}

export const AVATAR_EMOJIS = [
  "🦊", "🐼", "🦁", "🐯", "🦄", "🐸", "🐙", "🦋",
  "🌟", "🔥", "💎", "🎮", "🎯", "🚀", "🌈", "🍕",
  "🍩", "🎸", "👑", "👾", "🤖", "👻", "🎃", "😎",
  "🤩", "😈", "🥳", "🐱", "🐶", "🐰", "🐻", "🐨",
];

export const AVATAR_COLORS: Record<AvatarColor, string> = {
  purple: "#7C3AED",
  orange: "#F97316",
  yellow: "#EAB308",
  coral: "#F97066",
  navy: "#1E3A5F",
  white: "#F8FAFC",
  pink: "#EC4899",
  teal: "#14B8A6",
};

export const MODE_INFO: Record<
  GameMode,
  { name: string; description: string; icon: string; color: string }
> = {
  classic: {
    name: "Classic",
    description: "Truth & Dare klasik yang selalu seru",
    icon: "🎲",
    color: "#7C3AED",
  },
  party: {
    name: "Party Mode",
    description: "Lebih konyol, lebih ramai, lebih gila!",
    icon: "🎉",
    color: "#F97316",
  },
  couple: {
    name: "Couple Mode",
    description: "Kategori sendiri: crush, kencan, flag, flirting",
    icon: "💕",
    color: "#EC4899",
  },
  family: {
    name: "Family Mode",
    description: "Aman buat semua umur, tanpa konten dewasa",
    icon: "👨‍👩‍👧‍👦",
    color: "#14B8A6",
  },
  extreme: {
    name: "Extreme Mode",
    description: "Lebih dalam, lebih susah, lebih berani",
    icon: "⚡",
    color: "#EF4444",
  },
  chaos: {
    name: "Random Chaos",
    description: "Event acak, double dare, plot twist terus",
    icon: "🌪️",
    color: "#EAB308",
  },
};
