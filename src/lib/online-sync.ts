import type {
  ChaosEventType,
  Difficulty,
  GameMode,
  GamePhase,
  GameSettings,
  Highlight,
  MiniGameType,
} from "@/types";

/** Shared multiplayer snapshot stored in rooms.game_state */
export type OnlineGameSnapshot = {
  seq: number;
  sourceClientId: string;
  phase: GamePhase;
  currentRound: number;
  currentPlayerIndex: number;
  direction: 1 | -1;
  spinTargetIndex: number | null;
  lastCard: {
    type: "truth" | "dare";
    text: string;
    difficulty?: Difficulty;
    id: string;
    riskReward?: boolean;
  } | null;
  usedTruthIds: string[];
  usedDareIds: string[];
  hostMessage: string;
  hostMood: string;
  pendingDouble: boolean;
  selectedRisk: boolean;
  voting: { yes: number; no: number; open: boolean };
  activeEvent: ChaosEventType | null;
  activeRoundEvent: {
    id: string;
    name: string;
    description: string;
    icon?: string;
  } | null;
  activeMiniGame: MiniGameType | null;
  mysteryResult: {
    type: string;
    label: string;
    icon?: string;
    amount?: number;
    power?: string;
  } | null;
  highlights: Highlight[];
  bgMood: "neutral" | "truth" | "dare" | "party" | "chaos";
  showConfetti: boolean;
  mode?: GameMode;
  settings?: Partial<GameSettings>;
};

export function isOnlineGameSnapshot(v: unknown): v is OnlineGameSnapshot {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return typeof o.seq === "number" && typeof o.phase === "string";
}

export type LocalOnlineMeta = {
  onlineSeq: number;
  onlineHostClientId: string | null;
  spinTargetIndex: number | null;
};
