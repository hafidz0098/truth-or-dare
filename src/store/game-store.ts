"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  filterDares,
  filterTruths,
  generateAIDare,
  generateAITruth,
} from "@/data/cards";
import { generateDailyMissions } from "@/data/achievements";
import {
  CHAOS_EVENTS,
  MYSTERY_BOX_REWARDS,
  PUNISHMENTS,
  RANDOM_ROUND_EVENTS,
} from "@/data/events";
import { hostLine, hostReactToCard } from "@/lib/ai-host";
import {
  chance,
  levelFromXp,
  pick,
  randomInt,
  roomCode,
  uid,
  xpForLevel,
} from "@/lib/utils";
import {
  createOnlineRoom,
  isSupabaseConfigured,
  joinOnlineRoom,
  roomPlayersToLocal,
  submitSessionResults,
  syncRoomPlayers,
  updateRoomPhase,
  upsertProfile,
  closeRoom,
  pushRoomSnapshot,
} from "@/lib/supabase/api";
import { getClientId } from "@/lib/supabase/client-id";
import {
  isOnlineGameSnapshot,
  type OnlineGameSnapshot,
} from "@/lib/online-sync";
import type { RoomRow } from "@/lib/supabase/types";
import type {
  AvatarColor,
  CardType,
  ChaosEventType,
  DailyMission,
  Difficulty,
  GameMode,
  GamePhase,
  GameSettings,
  Highlight,
  Player,
  PowerCardType,
  ProfileStats,
  RoundHistory,
} from "@/types";
import { AVATAR_EMOJIS, COUPLE_CATEGORIES, GENERAL_CATEGORIES } from "@/types";

const DEFAULT_SETTINGS: GameSettings = {
  mode: "classic",
  categories: [],
  timer: 60,
  rounds: 20,
  difficulty: "mixed",
  isPrivate: false,
  password: "",
  customTruths: [],
  customDares: [],
  enableVoting: true,
  enableEvents: true,
  enablePowerCards: true,
  adultContent: false,
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.6,
  reduceMotion: false,
  darkMode: true,
};

function makePlayer(name: string, isHost = false): Player {
  return {
    id: uid("p"),
    name,
    avatar: pick(AVATAR_EMOJIS),
    color: pick([
      "purple",
      "orange",
      "yellow",
      "coral",
      "navy",
      "pink",
      "teal",
    ] as AvatarColor[]),
    xp: 0,
    coins: 0,
    level: 1,
    truthsAnswered: 0,
    daresCompleted: 0,
    daresFailed: 0,
    skips: 0,
    combo: 0,
    maxCombo: 0,
    powerCards: isHost ? ["skip", "truth-shield"] : ["skip"],
    titles: [],
    badges: [],
    isHost,
    isConnected: true,
    ping: randomInt(12, 80),
  };
}

interface GameState {
  // meta
  hydrated: boolean;
  profileName: string;
  profileAvatar: string;
  profileColor: AvatarColor;
  profileStats: ProfileStats;
  unlockedAchievements: string[];
  dailyMissions: DailyMission[];
  settings: GameSettings;

  // room / session
  roomCode: string;
  onlineRoomId: string | null;
  onlineEnabled: boolean;
  onlineStatus: "idle" | "connecting" | "online" | "offline" | "error";
  onlineError: string | null;
  onlineHostClientId: string | null;
  onlineSeq: number;
  spinTargetIndex: number | null;
  players: Player[];
  phase: GamePhase;
  currentRound: number;
  currentPlayerIndex: number;
  direction: 1 | -1;
  usedTruthIds: string[];
  usedDareIds: string[];
  history: RoundHistory[];
  lastCard: {
    type: CardType;
    text: string;
    difficulty?: Difficulty;
    id: string;
    riskReward?: boolean;
  } | null;
  activeEvent: ChaosEventType | null;
  activeRoundEvent: (typeof RANDOM_ROUND_EVENTS)[0] | null;
  hostMessage: string;
  hostMood: string;
  voting: { yes: number; no: number; open: boolean };
  pendingDouble: boolean;
  mysteryResult: (typeof MYSTERY_BOX_REWARDS)[0] | null;
  highlights: Highlight[];
  bgMood: "neutral" | "truth" | "dare" | "party" | "chaos";
  showConfetti: boolean;
  screenShake: boolean;
  selectedRisk: boolean;

  // actions
  setProfile: (name: string, avatar?: string, color?: AvatarColor) => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
  createRoom: () => Promise<void>;
  joinRoom: (code: string, password?: string) => Promise<void>;
  applyOnlinePlayers: (players: Player[]) => void;
  applyOnlinePhase: (phase: string, mode?: string) => void;
  applyOnlineRoom: (room: RoomRow) => void;
  pushOnlineSync: (alsoPlayers?: boolean) => void;
  beginOnlineSpin: () => number;
  isOnlineHost: () => boolean;
  isMyOnlineTurn: () => boolean;
  quickPlay: () => void;
  addPlayer: (name?: string) => void;
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, partial: Partial<Player>) => void;
  randomizeAvatar: (id: string) => void;
  setMode: (mode: GameMode) => void;
  startGame: () => void;
  spinDone: (playerIndex: number) => void;
  chooseCard: (type: CardType, riskReward?: boolean) => void;
  completeChallenge: (success: boolean) => void;
  castVote: (yes: boolean) => void;
  finishVoting: () => void;
  usePowerCard: (playerId: string, power: PowerCardType) => void;
  triggerRandomEvent: () => void;
  clearEvent: () => void;
  openMystery: () => void;
  clearMystery: () => void;
  nextTurn: () => void;
  endGame: () => void;
  backToLobby: () => void;
  resetSession: () => void;
  setHostMessage: (msg: string, mood?: string) => void;
  setConfetti: (v: boolean) => void;
  setBgMood: (m: GameState["bgMood"]) => void;
  refreshDailyMissions: () => void;
  bumpMission: (prefix: string, amount?: number) => void;
}

function speak(
  set: (p: Partial<GameState>) => void,
  context: Parameters<typeof hostLine>[0],
  extra?: Parameters<typeof hostLine>[1]
) {
  const line = hostLine(context, extra);
  set({ hostMessage: line.text, hostMood: line.mood });
}

/** Prevent re-push when applying remote multiplayer snapshots */
let suppressOnlinePush = false;

function buildOnlineSnapshot(s: GameState): OnlineGameSnapshot {
  return {
    seq: s.onlineSeq,
    sourceClientId: getClientId(),
    phase: s.phase,
    currentRound: s.currentRound,
    currentPlayerIndex: s.currentPlayerIndex,
    direction: s.direction,
    spinTargetIndex: s.spinTargetIndex,
    lastCard: s.lastCard,
    usedTruthIds: s.usedTruthIds,
    usedDareIds: s.usedDareIds,
    hostMessage: s.hostMessage,
    hostMood: s.hostMood,
    pendingDouble: s.pendingDouble,
    selectedRisk: s.selectedRisk,
    voting: s.voting,
    activeEvent: s.activeEvent,
    activeRoundEvent: s.activeRoundEvent
      ? {
          id: s.activeRoundEvent.id,
          name: s.activeRoundEvent.name,
          description: s.activeRoundEvent.description,
          icon: s.activeRoundEvent.icon,
        }
      : null,
    mysteryResult: s.mysteryResult
      ? ({
          type: s.mysteryResult.type,
          label: s.mysteryResult.label,
          icon: s.mysteryResult.icon,
          amount: "amount" in s.mysteryResult ? s.mysteryResult.amount : undefined,
          power: "power" in s.mysteryResult ? s.mysteryResult.power : undefined,
        } as OnlineGameSnapshot["mysteryResult"])
      : null,
    highlights: s.highlights,
    bgMood: s.bgMood,
    showConfetti: s.showConfetti,
    mode: s.settings.mode,
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      profileName: "Player",
      profileAvatar: "🦊",
      profileColor: "purple",
      profileStats: {
        totalGames: 0,
        totalTruths: 0,
        totalDares: 0,
        daresCompleted: 0,
        daresFailed: 0,
        playTimeMinutes: 0,
        winRate: 0,
        achievementsUnlocked: [],
        favoriteMode: null,
      },
      unlockedAchievements: [],
      dailyMissions: generateDailyMissions(),
      settings: DEFAULT_SETTINGS,

      roomCode: "",
      onlineRoomId: null,
      onlineEnabled: isSupabaseConfigured(),
      onlineStatus: isSupabaseConfigured() ? "idle" : "offline",
      onlineError: null,
      onlineHostClientId: null,
      onlineSeq: 0,
      spinTargetIndex: null,
      players: [],
      phase: "landing",
      currentRound: 0,
      currentPlayerIndex: 0,
      direction: 1,
      usedTruthIds: [],
      usedDareIds: [],
      history: [],
      lastCard: null,
      activeEvent: null,
      activeRoundEvent: null,
      hostMessage: "Siap-siap party! 🔥",
      hostMood: "happy",
      voting: { yes: 0, no: 0, open: false },
      pendingDouble: false,
      mysteryResult: null,
      highlights: [],
      bgMood: "neutral",
      showConfetti: false,
      screenShake: false,
      selectedRisk: false,

      setProfile: (name, avatar, color) => {
        const displayName = (name ?? "").trim() || "Player";
        set({
          profileName: displayName,
          ...(avatar ? { profileAvatar: avatar } : {}),
          ...(color ? { profileColor: color } : {}),
        });
        // Keep host player in current session in sync with profile name
        const s = get();
        if (s.players.length > 0) {
          set({
            players: s.players.map((p) =>
              p.isHost
                ? {
                    ...p,
                    name: displayName,
                    ...(avatar ? { avatar } : {}),
                    ...(color ? { color } : {}),
                  }
                : p
            ),
          });
        }
        const next = get();
        void upsertProfile({
          displayName,
          avatar: avatar || next.profileAvatar,
          color: color || next.profileColor,
          xp: 0,
          coins: 0,
          totalGames: next.profileStats.totalGames,
          totalTruths: next.profileStats.totalTruths,
          totalDares: next.profileStats.totalDares,
          daresCompleted: next.profileStats.daresCompleted,
          daresFailed: next.profileStats.daresFailed,
          achievements: next.unlockedAchievements,
        });
      },

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      createRoom: async () => {
        const { profileName, profileAvatar, profileColor, settings } = get();
        const displayName = profileName.trim() || "Player";

        if (isSupabaseConfigured()) {
          set({ onlineStatus: "connecting", onlineError: null });
          const online = await createOnlineRoom({
            displayName,
            avatar: profileAvatar,
            color: profileColor,
            settings,
          });
          if (online) {
            const host = roomPlayersToLocal(online.players)[0];
            const localHost =
              host ||
              (() => {
                const p = makePlayer(displayName, true);
                p.id = getClientId();
                p.avatar = profileAvatar;
                p.color = profileColor;
                return p;
              })();
            // Prefer local profile name if server still has empty/default
            if (localHost.name === "Player" && displayName !== "Player") {
              localHost.name = displayName;
            }
            set({
              roomCode: online.room.code,
              onlineRoomId: online.room.id,
              onlineHostClientId: online.room.host_client_id || getClientId(),
              onlineEnabled: true,
              onlineStatus: "online",
              onlineSeq: 0,
              spinTargetIndex: null,
              profileName: displayName,
              players: [localHost],
              phase: "lobby",
              currentRound: 0,
              history: [],
              usedTruthIds: [],
              usedDareIds: [],
            });
            speak(set, "intro");
            return;
          }
          set({
            onlineStatus: "error",
            onlineError: "Gagal buat room online, pakai mode lokal",
          });
        }

        const host = makePlayer(displayName, true);
        host.id = getClientId();
        host.avatar = profileAvatar;
        host.color = profileColor;
        set({
          roomCode: roomCode(),
          onlineRoomId: null,
          onlineHostClientId: null,
          onlineStatus: isSupabaseConfigured() ? "error" : "offline",
          profileName: displayName,
          players: [host],
          phase: "lobby",
          currentRound: 0,
          history: [],
          usedTruthIds: [],
          usedDareIds: [],
        });
        speak(set, "intro");
      },

      joinRoom: async (code, password) => {
        const { profileName, profileAvatar, profileColor } = get();
        const displayName = profileName.trim() || "Player";

        if (isSupabaseConfigured() && code.trim()) {
          set({ onlineStatus: "connecting", onlineError: null });
          const res = await joinOnlineRoom({
            code,
            displayName,
            avatar: profileAvatar,
            color: profileColor,
            password,
          });
          if (res.ok) {
            const room = res.data.room;
            const gs = room.game_state;
            set({
              roomCode: room.code,
              onlineRoomId: room.id,
              onlineHostClientId: room.host_client_id,
              onlineEnabled: true,
              onlineStatus: "online",
              profileName: displayName,
              players: roomPlayersToLocal(res.data.players),
              phase: (room.phase as GamePhase) || "lobby",
              settings: {
                ...get().settings,
                mode: (room.mode as GameMode) || get().settings.mode,
                ...(typeof room.settings === "object" && room.settings
                  ? (room.settings as Partial<GameSettings>)
                  : {}),
              },
            });
            if (isOnlineGameSnapshot(gs)) {
              get().applyOnlineRoom(room);
            }
            speak(set, "intro");
            return;
          }
          set({ onlineStatus: "error", onlineError: res.error });
          // still allow local join fallback with message
        }

        const me = makePlayer(displayName);
        me.id = getClientId();
        me.avatar = profileAvatar;
        me.color = profileColor;
        const host = makePlayer("Host", true);
        set({
          roomCode: code.toUpperCase() || roomCode(),
          onlineRoomId: null,
          onlineHostClientId: null,
          profileName: displayName,
          players: [host, me],
          phase: "lobby",
        });
        speak(set, "intro");
      },

      applyOnlinePlayers: (players) => {
        if (players.length === 0) return;
        // Keep stable order: host first, then join time (from mapper)
        set({ players });
      },

      applyOnlinePhase: (phase, mode) => {
        // Legacy thin update — prefer applyOnlineRoom when game_state available
        const allowed: GamePhase[] = [
          "landing",
          "lobby",
          "mode-select",
          "spinning",
          "choose",
          "reveal",
          "voting",
          "event",
          "mystery",
          "result",
          "highlights",
        ];
        suppressOnlinePush = true;
        if (allowed.includes(phase as GamePhase)) {
          set({ phase: phase as GamePhase });
        }
        if (mode) {
          set((s) => ({ settings: { ...s.settings, mode: mode as GameMode } }));
        }
        suppressOnlinePush = false;
      },

      applyOnlineRoom: (room) => {
        const me = getClientId();
        const gsRaw = room.game_state;
        const gs = isOnlineGameSnapshot(gsRaw) ? gsRaw : null;

        // Ignore our own echo / stale snapshots
        if (gs) {
          if (gs.sourceClientId === me && gs.seq <= get().onlineSeq) return;
          if (gs.seq < get().onlineSeq) return;
        }

        suppressOnlinePush = true;

        const patch: Partial<GameState> = {
          onlineHostClientId: room.host_client_id || get().onlineHostClientId,
        };

        if (room.mode) {
          patch.settings = {
            ...get().settings,
            mode: room.mode as GameMode,
            ...(typeof room.settings === "object" && room.settings
              ? (room.settings as Partial<GameSettings>)
              : {}),
          };
        }

        if (gs) {
          patch.onlineSeq = gs.seq;
          patch.phase = gs.phase;
          patch.currentRound = gs.currentRound;
          patch.currentPlayerIndex = gs.currentPlayerIndex;
          patch.direction = gs.direction;
          patch.spinTargetIndex = gs.spinTargetIndex;
          patch.lastCard = gs.lastCard;
          patch.usedTruthIds = gs.usedTruthIds ?? [];
          patch.usedDareIds = gs.usedDareIds ?? [];
          patch.hostMessage = gs.hostMessage;
          patch.hostMood = gs.hostMood;
          patch.pendingDouble = gs.pendingDouble;
          patch.selectedRisk = gs.selectedRisk;
          patch.voting = gs.voting;
          patch.activeEvent = gs.activeEvent;
          patch.activeRoundEvent = gs.activeRoundEvent as GameState["activeRoundEvent"];
          patch.mysteryResult = gs.mysteryResult as GameState["mysteryResult"];
          patch.highlights = gs.highlights ?? [];
          patch.bgMood = gs.bgMood;
          patch.showConfetti = gs.showConfetti;
        } else if (room.phase) {
          patch.phase = room.phase as GamePhase;
        }

        set(patch);
        suppressOnlinePush = false;
      },

      pushOnlineSync: (alsoPlayers = true) => {
        if (suppressOnlinePush) return;
        const s = get();
        if (!s.onlineRoomId) return;

        const nextSeq = s.onlineSeq + 1;
        set({ onlineSeq: nextSeq });
        const snap = buildOnlineSnapshot({ ...get(), onlineSeq: nextSeq });

        void pushRoomSnapshot(s.onlineRoomId, {
          phase: snap.phase,
          mode: s.settings.mode,
          settings: s.settings,
          gameState: snap as unknown as Record<string, unknown>,
        });

        if (alsoPlayers) {
          void syncRoomPlayers(s.onlineRoomId, get().players);
        }
      },

      beginOnlineSpin: () => {
        const { players, onlineRoomId } = get();
        const idx =
          players.length > 0 ? Math.floor(Math.random() * players.length) : 0;
        set({ spinTargetIndex: idx, phase: "spinning" });
        if (onlineRoomId) get().pushOnlineSync(false);
        return idx;
      },

      isOnlineHost: () => {
        const s = get();
        if (!s.onlineRoomId) return true;
        const me = getClientId();
        if (s.onlineHostClientId) return s.onlineHostClientId === me;
        return s.players.some((p) => p.isHost && p.id === me);
      },

      isMyOnlineTurn: () => {
        const s = get();
        if (!s.onlineRoomId) return true;
        const cur = s.players[s.currentPlayerIndex];
        return !!cur && cur.id === getClientId();
      },

      quickPlay: () => {
        const { profileName, profileAvatar, profileColor } = get();
        const displayName = profileName.trim() || "Player";
        const host = makePlayer(displayName, true);
        host.avatar = profileAvatar;
        host.color = profileColor;
        const bots = ["Alex", "Sam", "Rio", "Mika"].map((n) => makePlayer(n));
        set({
          roomCode: roomCode(),
          profileName: displayName,
          players: [host, ...bots],
          phase: "mode-select",
          settings: { ...get().settings, mode: "party" },
        });
        speak(set, "intro", { mode: "party" });
      },

      addPlayer: (name) => {
        // Online rooms only get real joiners via Supabase — no local bots
        if (get().onlineRoomId) return;
        const { players } = get();
        if (players.length >= 20) return;
        const label = (name ?? "").trim() || `Player ${players.length + 1}`;
        set({
          players: [...players, makePlayer(label)],
        });
      },

      removePlayer: (id) => {
        const { players, onlineRoomId } = get();
        if (onlineRoomId) return; // cannot remove remote players locally
        if (players.length <= 2) return;
        set({ players: players.filter((p) => p.id !== id) });
      },

      updatePlayer: (id, partial) => {
        const { players, onlineRoomId } = get();
        const target = players.find((p) => p.id === id);
        if (!target) return;

        const nextPlayers = players.map((p) =>
          p.id === id ? { ...p, ...partial } : p
        );
        const patch: Partial<GameState> = { players: nextPlayers };

        // Editing host name/avatar/color also updates persisted profile
        if (target.isHost) {
          if (typeof partial.name === "string") {
            const displayName = partial.name.trim() || "Player";
            patch.profileName = displayName;
            // keep trimmed name on player
            patch.players = nextPlayers.map((p) =>
              p.id === id ? { ...p, name: displayName } : p
            );
          }
          if (partial.avatar) patch.profileAvatar = partial.avatar;
          if (partial.color) patch.profileColor = partial.color;
        }

        set(patch);

        if (onlineRoomId) {
          void syncRoomPlayers(onlineRoomId, get().players);
        }
      },

      randomizeAvatar: (id) => {
        get().updatePlayer(id, {
          avatar: pick(AVATAR_EMOJIS),
          color: pick([
            "purple",
            "orange",
            "yellow",
            "coral",
            "navy",
            "pink",
            "teal",
          ] as AvatarColor[]),
        });
      },

      setMode: (mode) => {
        set((s) => {
          // Saat ganti mode, jaga filter kategori tetap di jalur yang benar
          let cats = s.settings.categories;
          if (mode === "couple") {
            cats = cats.filter((c) => COUPLE_CATEGORIES.includes(c));
          } else {
            cats = cats.filter((c) => GENERAL_CATEGORIES.includes(c));
          }
          return {
            settings: {
              ...s.settings,
              mode,
              categories: cats,
              adultContent: mode === "extreme" ? s.settings.adultContent : false,
            },
            phase: s.onlineRoomId ? "mode-select" : s.phase,
            bgMood:
              mode === "chaos"
                ? "chaos"
                : mode === "party"
                  ? "party"
                  : mode === "couple"
                    ? "party"
                    : "neutral",
          };
        });
        speak(set, "intro", { mode });
        if (get().onlineRoomId) {
          get().pushOnlineSync(false);
        }
      },

      startGame: () => {
        const { players, settings, onlineRoomId } = get();
        if (players.length < 2) return;
        // Online: only host may start
        if (onlineRoomId && !get().isOnlineHost()) return;

        const firstSpin =
          players.length > 0 ? Math.floor(Math.random() * players.length) : 0;

        set({
          phase: "spinning",
          currentRound: 1,
          currentPlayerIndex: 0,
          direction: 1,
          spinTargetIndex: firstSpin,
          history: [],
          usedTruthIds: [],
          usedDareIds: [],
          lastCard: null,
          highlights: [],
          profileStats: {
            ...get().profileStats,
            totalGames: get().profileStats.totalGames + 1,
            favoriteMode: settings.mode,
          },
        });
        speak(set, "spin");
        get().bumpMission("play_rounds", 0);
        if (onlineRoomId) {
          get().pushOnlineSync(true);
        }
      },

      spinDone: (playerIndex) => {
        // Guests wait for host/authority snapshot — don't double-advance
        if (get().onlineRoomId && !get().isOnlineHost()) {
          // If already advanced remotely, no-op
          if (get().phase !== "spinning") return;
        }
        set({
          currentPlayerIndex: playerIndex,
          spinTargetIndex: playerIndex,
          phase: "choose",
        });
        speak(set, "spin");
        if (get().onlineRoomId && get().isOnlineHost()) {
          get().pushOnlineSync(false);
        }
      },

      chooseCard: (type, riskReward = false) => {
        const state = get();
        // Online: only the current player's device picks the card (and rolls RNG)
        if (state.onlineRoomId && !get().isMyOnlineTurn()) return;
        const {
          settings,
          usedTruthIds,
          usedDareIds,
          players,
          currentPlayerIndex,
          pendingDouble,
        } = state;
        const player = players[currentPlayerIndex];
        if (!player) return;

        let text = "";
        let id = "";
        let difficulty: Difficulty | undefined;

        if (type === "truth") {
          if (settings.customTruths.length && chance(20)) {
            text = pick(settings.customTruths);
            id = `custom_t_${Date.now()}`;
          } else {
            let pool = filterTruths(
              settings.mode,
              settings.categories,
              settings.adultContent,
              usedTruthIds
            );
            if (pool.length === 0) {
              const ai = generateAITruth(settings.mode, player.name);
              text = ai.text;
              id = ai.id;
            } else {
              const card = pick(pool);
              text = card.text;
              id = card.id;
              set({ usedTruthIds: [...usedTruthIds, id] });
            }
          }
          set({ bgMood: "truth" });
        } else {
          let diff: Difficulty | "mixed" = settings.difficulty;
          if (riskReward) diff = pick(["hard", "impossible"] as Difficulty[]);
          if (settings.customDares.length && chance(20)) {
            text = pick(settings.customDares);
            id = `custom_d_${Date.now()}`;
            difficulty = "medium";
          } else {
            let pool = filterDares(
              settings.mode,
              settings.categories,
              riskReward ? (diff as Difficulty) : settings.difficulty,
              settings.adultContent,
              usedDareIds
            );
            if (pool.length === 0) {
              const d =
                diff === "mixed"
                  ? pick(["easy", "medium", "hard"] as Difficulty[])
                  : (diff as Difficulty);
              const ai = generateAIDare(settings.mode, player.name, d);
              text = ai.text;
              id = ai.id;
              difficulty = ai.difficulty;
            } else {
              const card = pick(pool);
              text = card.text;
              id = card.id;
              difficulty = card.difficulty;
              set({ usedDareIds: [...get().usedDareIds, id] });
            }
          }
          set({ bgMood: "dare" });
        }

        const react = hostReactToCard(type);
        set({
          lastCard: {
            type,
            text,
            difficulty,
            id,
            riskReward,
          },
          phase: "reveal",
          hostMessage: react.text,
          hostMood: react.mood,
          selectedRisk: riskReward,
          pendingDouble: pendingDouble || type === "dare" && chance(
            settings.mode === "chaos" ? 25 : 8
          ),
        });
        if (get().onlineRoomId) get().pushOnlineSync(false);
      },

      completeChallenge: (success) => {
        const state = get();
        if (state.onlineRoomId && !get().isMyOnlineTurn()) return;
        const {
          players,
          currentPlayerIndex,
          lastCard,
          currentRound,
          settings,
          selectedRisk,
          pendingDouble,
        } = state;
        if (!lastCard) return;
        const player = players[currentPlayerIndex];
        if (!player) return;

        let xp = lastCard.type === "truth" ? 15 : 25;
        let coins = lastCard.type === "truth" ? 8 : 12;
        if (lastCard.difficulty === "medium") {
          xp *= 1.5;
          coins *= 1.5;
        } else if (lastCard.difficulty === "hard") {
          xp *= 2.5;
          coins *= 2.5;
        } else if (lastCard.difficulty === "impossible") {
          xp *= 4;
          coins *= 4;
        }
        if (selectedRisk) {
          xp *= 1.5;
          coins *= 1.5;
        }
        if (!success) {
          xp = Math.floor(xp * 0.15);
          coins = Math.floor(coins * 0.1);
        } else {
          xp = Math.round(xp);
          coins = Math.round(coins);
        }

        const combo = success && lastCard.type === "dare" ? player.combo + 1 : 0;
        if (combo >= 3) {
          xp += 30;
          speak(set, "combo");
        }

        const newXp = player.xp + xp;
        const newLevel = levelFromXp(newXp);
        const leveled = newLevel > player.level;

        const updated: Player = {
          ...player,
          xp: newXp,
          coins: player.coins + coins,
          level: newLevel,
          truthsAnswered:
            player.truthsAnswered + (lastCard.type === "truth" && success ? 1 : 0),
          daresCompleted:
            player.daresCompleted + (lastCard.type === "dare" && success ? 1 : 0),
          daresFailed:
            player.daresFailed + (lastCard.type === "dare" && !success ? 1 : 0),
          skips: player.skips + (!success ? 1 : 0),
          combo,
          maxCombo: Math.max(player.maxCombo, combo),
        };

        const historyEntry: RoundHistory = {
          round: currentRound,
          playerId: player.id,
          playerName: player.name,
          type: lastCard.type,
          text: lastCard.text,
          completed: success,
          votesYes: 0,
          votesNo: 0,
          xpEarned: xp,
          timestamp: Date.now(),
        };

        const stats = { ...state.profileStats };
        if (lastCard.type === "truth") stats.totalTruths += 1;
        else {
          stats.totalDares += 1;
          if (success) stats.daresCompleted += 1;
          else stats.daresFailed += 1;
        }

        set({
          players: players.map((p) => (p.id === player.id ? updated : p)),
          history: [...state.history, historyEntry],
          profileStats: stats,
          showConfetti: success,
          screenShake: !success,
          hostMessage: success
            ? hostLine("complete").text
            : hostLine("fail").text,
          hostMood: success ? "proud" : "teasing",
        });

        if (lastCard.type === "truth") get().bumpMission("answer_truths");
        if (lastCard.type === "dare" && success) get().bumpMission("complete_dares");
        if (success) get().bumpMission("no_skip_day");
        if (combo >= 3) get().bumpMission("combo_day");

        // achievements unlocks (local)
        const unlocked = new Set(get().unlockedAchievements);
        if (updated.truthsAnswered >= 1) unlocked.add("first_truth");
        if (updated.daresCompleted >= 1) unlocked.add("first_dare");
        if (updated.combo >= 3) unlocked.add("combo_king");
        if (updated.combo >= 5) unlocked.add("queen_party");
        if (updated.skips >= 5) unlocked.add("coward");
        if (lastCard.difficulty === "impossible" && success)
          unlocked.add("ultimate_survivor");
        if (settings.mode === "couple") unlocked.add("couple_goals");
        if (settings.mode === "family") unlocked.add("family_fun");
        if (leveled) {
          /* level up handled in UI via confetti */
        }
        set({ unlockedAchievements: Array.from(unlocked) });

        if (settings.enableVoting && success && chance(40)) {
          set({
            phase: "voting",
            voting: { yes: 0, no: 0, open: true },
          });
          speak(set, "vote");
          if (get().onlineRoomId) get().pushOnlineSync(true);
          return;
        }

        if (pendingDouble && lastCard.type === "dare" && success) {
          set({ pendingDouble: false });
          get().chooseCard("dare");
          return;
        }

        // maybe event / mystery
        if (settings.enableEvents && currentRound % randomInt(2, 5) === 0 && chance(50)) {
          get().triggerRandomEvent();
          return;
        }

        if (currentRound % 4 === 0 && chance(30)) {
          get().openMystery();
          return;
        }

        if (currentRound >= settings.rounds) {
          get().endGame();
          return;
        }

        get().nextTurn();
      },

      castVote: (yes) => {
        set((s) => ({
          voting: {
            ...s.voting,
            yes: s.voting.yes + (yes ? 1 : 0),
            no: s.voting.no + (yes ? 0 : 1),
          },
        }));
        if (get().onlineRoomId) get().pushOnlineSync(false);
      },

      finishVoting: () => {
        const { voting, history } = get();
        if (history.length) {
          const last = { ...history[history.length - 1] };
          last.votesYes = voting.yes;
          last.votesNo = voting.no;
          set({
            history: [...history.slice(0, -1), last],
            voting: { yes: 0, no: 0, open: false },
          });
        }
        if (get().currentRound >= get().settings.rounds) get().endGame();
        else get().nextTurn();
      },

      usePowerCard: (playerId, power) => {
        const { players, currentPlayerIndex, direction } = get();
        const player = players.find((p) => p.id === playerId);
        if (!player || !player.powerCards.includes(power)) return;

        const newCards = [...player.powerCards];
        newCards.splice(newCards.indexOf(power), 1);

        set({
          players: players.map((p) =>
            p.id === playerId ? { ...p, powerCards: newCards } : p
          ),
        });

        switch (power) {
          case "skip":
            get().nextTurn();
            break;
          case "reverse":
            set({ direction: direction === 1 ? -1 : 1 });
            get().nextTurn();
            break;
          case "swap": {
            if (players.length < 2) break;
            let other = randomInt(0, players.length - 1);
            if (other === currentPlayerIndex)
              other = (other + 1) % players.length;
            set({ currentPlayerIndex: other, phase: "choose" });
            break;
          }
          case "double-dare":
            set({ pendingDouble: true });
            get().chooseCard("dare");
            break;
          case "truth-shield":
            get().chooseCard("truth");
            break;
          case "steal-turn": {
            let other = randomInt(0, players.length - 1);
            if (other === currentPlayerIndex)
              other = (other + 1) % players.length;
            set({ currentPlayerIndex: other, phase: "choose" });
            break;
          }
        }
      },

      triggerRandomEvent: () => {
        const { settings } = get();
        speak(set, "event");

        if (settings.mode === "chaos" || chance(50)) {
          const keys = Object.keys(CHAOS_EVENTS) as ChaosEventType[];
          const event = pick(keys);
          set({
            activeEvent: event,
            phase: "event",
            bgMood: "chaos",
          });

          // auto apply some events
          if (event === "reverse-turn") {
            set({ direction: get().direction === 1 ? -1 : 1 });
          } else if (event === "lucky-bonus") {
            const i = get().currentPlayerIndex;
            const players = [...get().players];
            players[i] = {
              ...players[i],
              xp: players[i].xp + 50,
              coins: players[i].coins + 30,
              powerCards: [...players[i].powerCards, "skip"],
            };
            set({ players, showConfetti: true });
            const u = new Set(get().unlockedAchievements);
            u.add("lucky_player");
            set({ unlockedAchievements: Array.from(u) });
          } else if (event === "skip-turn") {
            // skip applied on clear
          } else if (event === "random-punishment") {
            set({
              lastCard: {
                type: "dare",
                text: pick(PUNISHMENTS),
                difficulty: "medium",
                id: `punish_${Date.now()}`,
              },
            });
          }
        } else {
          const ev = pick(RANDOM_ROUND_EVENTS);
          set({ activeRoundEvent: ev, phase: "event", bgMood: "party" });
        }
        if (get().onlineRoomId) get().pushOnlineSync(true);
      },

      clearEvent: () => {
        const { activeEvent } = get();
        set({ activeEvent: null, activeRoundEvent: null });
        if (activeEvent === "spin-again") {
          const idx = get().beginOnlineSpin();
          set({ phase: "spinning", spinTargetIndex: idx });
          if (get().onlineRoomId) get().pushOnlineSync(false);
          return;
        }
        if (activeEvent === "double-dare") {
          set({ pendingDouble: true, phase: "choose" });
          if (get().onlineRoomId) get().pushOnlineSync(false);
          return;
        }
        if (activeEvent === "triple-truth") {
          get().chooseCard("truth");
          return;
        }
        if (activeEvent === "mystery-card") {
          get().openMystery();
          return;
        }
        if (activeEvent === "skip-turn") {
          get().nextTurn();
          return;
        }
        if (activeEvent === "swap-player" && get().players.length > 1) {
          let other = randomInt(0, get().players.length - 1);
          if (other === get().currentPlayerIndex)
            other = (other + 1) % get().players.length;
          set({ currentPlayerIndex: other, phase: "choose" });
          if (get().onlineRoomId) get().pushOnlineSync(false);
          return;
        }
        if (get().currentRound >= get().settings.rounds) get().endGame();
        else if (get().phase === "event") {
          set({ phase: "choose" });
          if (get().onlineRoomId) get().pushOnlineSync(false);
        }
      },

      openMystery: () => {
        const reward = pick(MYSTERY_BOX_REWARDS);
        const i = get().currentPlayerIndex;
        const players = [...get().players];
        const p = { ...players[i] };
        if (reward.type === "xp") p.xp += reward.amount;
        if (reward.type === "coins") p.coins += reward.amount;
        if (reward.type === "power")
          p.powerCards = [...p.powerCards, reward.power];
        if (reward.type === "punish") {
          set({
            lastCard: {
              type: "dare",
              text: pick(PUNISHMENTS),
              difficulty: "easy",
              id: `mystery_p_${Date.now()}`,
            },
            phase: "reveal",
            mysteryResult: reward,
          });
          players[i] = p;
          set({ players });
          if (get().onlineRoomId) get().pushOnlineSync(true);
          return;
        }
        players[i] = p;
        set({
          players,
          mysteryResult: reward,
          phase: "mystery",
          showConfetti: true,
        });
        if (get().onlineRoomId) get().pushOnlineSync(true);
      },

      clearMystery: () => {
        set({ mysteryResult: null });
        if (get().currentRound >= get().settings.rounds) get().endGame();
        else get().nextTurn();
      },

      nextTurn: () => {
        const { players, currentPlayerIndex, direction, currentRound, settings, onlineRoomId } =
          get();
        const n = players.length;
        if (n === 0) return;
        const next = (currentPlayerIndex + direction + n) % n;
        const newRound = currentRound + 1;
        const spinIdx = Math.floor(Math.random() * n);

        set({
          currentPlayerIndex: next,
          currentRound: newRound,
          phase: "spinning",
          spinTargetIndex: spinIdx,
          lastCard: null,
          bgMood:
            settings.mode === "chaos"
              ? "chaos"
              : settings.mode === "party"
                ? "party"
                : "neutral",
          showConfetti: false,
          screenShake: false,
          selectedRisk: false,
        });
        get().bumpMission("play_rounds");
        speak(set, "spin");

        if (newRound > settings.rounds) {
          get().endGame();
          return;
        }

        if (onlineRoomId) get().pushOnlineSync(true);
      },

      endGame: () => {
        const { players, history, settings } = get();
        const sorted = [...players].sort(
          (a, b) => b.xp - a.xp || b.daresCompleted - a.daresCompleted
        );
        const mvp = sorted[0];
        const mostDare = [...players].sort(
          (a, b) => b.daresCompleted - a.daresCompleted
        )[0];
        const mostSkip = [...players].sort((a, b) => b.skips - a.skips)[0];
        const comboKing = [...players].sort((a, b) => b.maxCombo - a.maxCombo)[0];

        const highlights: Highlight[] = [
          {
            type: "mvp",
            title: "MVP Party",
            description: `${mvp?.name} menguasai malam ini!`,
            playerId: mvp?.id,
            playerName: mvp?.name,
            value: `${mvp?.xp ?? 0} XP`,
            icon: "👑",
          },
          {
            type: "daredevil",
            title: "Daredevil",
            description: `Paling banyak menyelesaikan dare`,
            playerId: mostDare?.id,
            playerName: mostDare?.name,
            value: mostDare?.daresCompleted ?? 0,
            icon: "💥",
          },
          {
            type: "combo",
            title: "Combo Master",
            description: `Combo tertinggi sesi ini`,
            playerId: comboKing?.id,
            playerName: comboKing?.name,
            value: `x${comboKing?.maxCombo ?? 0}`,
            icon: "🔥",
          },
          {
            type: "coward",
            title: "Chicken Award",
            description: `Paling sering skip`,
            playerId: mostSkip?.id,
            playerName: mostSkip?.name,
            value: mostSkip?.skips ?? 0,
            icon: "🐔",
          },
          {
            type: "stat",
            title: "Total Ronde",
            description: `Mode ${settings.mode}`,
            value: history.length,
            icon: "📊",
          },
          {
            type: "funniest",
            title: "Session Complete",
            description: "Momen-momen gila sudah terekam!",
            value: `${history.filter((h) => h.completed).length} sukses`,
            icon: "🎉",
          },
        ];

        if (mvp && players.length >= 4) {
          const u = new Set(get().unlockedAchievements);
          u.add("king_party");
          set({ unlockedAchievements: Array.from(u) });
        }

        // mode missions
        if (settings.mode === "couple") get().bumpMission("couple_mode");
        if (settings.mode === "family") get().bumpMission("family_mode");
        if (settings.mode === "party") get().bumpMission("party_mode");

        set({
          phase: "highlights",
          highlights,
          showConfetti: true,
          bgMood: "party",
        });
        speak(set, "end");

        const { onlineRoomId } = get();
        void submitSessionResults({ mode: settings.mode, players });
        if (onlineRoomId) {
          get().pushOnlineSync(true);
        }
      },

      backToLobby: () => {
        set({
          phase: "lobby",
          currentRound: 0,
          lastCard: null,
          activeEvent: null,
          mysteryResult: null,
          spinTargetIndex: null,
          showConfetti: false,
          bgMood: "neutral",
        });
        if (get().onlineRoomId) get().pushOnlineSync(false);
      },

      resetSession: () => {
        const { onlineRoomId } = get();
        if (onlineRoomId) void closeRoom(onlineRoomId);
        set({
          phase: "landing",
          players: [],
          roomCode: "",
          onlineRoomId: null,
          onlineHostClientId: null,
          onlineSeq: 0,
          spinTargetIndex: null,
          onlineStatus: isSupabaseConfigured() ? "idle" : "offline",
          onlineError: null,
          currentRound: 0,
          history: [],
          lastCard: null,
          highlights: [],
          bgMood: "neutral",
        });
      },

      setHostMessage: (msg, mood = "happy") =>
        set({ hostMessage: msg, hostMood: mood }),

      setConfetti: (v) => set({ showConfetti: v }),
      setBgMood: (m) => set({ bgMood: m }),

      refreshDailyMissions: () => set({ dailyMissions: generateDailyMissions() }),

      bumpMission: (prefix, amount = 1) => {
        set((s) => ({
          dailyMissions: s.dailyMissions.map((m) => {
            if (!m.id.startsWith(prefix) || m.completed) return m;
            if (amount === 0) return m;
            const progress = Math.min(m.target, m.progress + amount);
            const completed = progress >= m.target;
            if (completed && !m.completed) {
              // reward first player
              const players = [...s.players];
              if (players[0]) {
                players[0] = {
                  ...players[0],
                  xp: players[0].xp + m.rewardXp,
                  coins: players[0].coins + m.rewardCoins,
                };
              }
              return { ...m, progress, completed };
            }
            return { ...m, progress, completed };
          }),
        }));
      },
    }),
    {
      name: "tod-party-storage",
      partialize: (s) => ({
        profileName: s.profileName,
        profileAvatar: s.profileAvatar,
        profileColor: s.profileColor,
        profileStats: s.profileStats,
        unlockedAchievements: s.unlockedAchievements,
        dailyMissions: s.dailyMissions,
        settings: s.settings,
      }),
    }
  )
);

export function currentPlayer() {
  const s = useGameStore.getState();
  return s.players[s.currentPlayerIndex];
}

export { xpForLevel };
