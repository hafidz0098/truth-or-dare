import type { ChaosEventType } from "@/types";

export const CHAOS_EVENTS: Record<
  ChaosEventType,
  { name: string; description: string; icon: string; color: string }
> = {
  "double-dare": {
    name: "Double Dare",
    description: "Pemain harus menyelesaikan 2 dare sekaligus!",
    icon: "💥💥",
    color: "#EF4444",
  },
  "triple-truth": {
    name: "Triple Truth",
    description: "Jawab 3 pertanyaan truth beruntun!",
    icon: "3️⃣",
    color: "#7C3AED",
  },
  "spin-again": {
    name: "Spin Again",
    description: "Putar roda sekali lagi!",
    icon: "🔄",
    color: "#F97316",
  },
  "everyone-answer": {
    name: "Everyone Answer",
    description: "Semua pemain harus jawab truth yang sama!",
    icon: "👥",
    color: "#14B8A6",
  },
  "swap-player": {
    name: "Swap Player",
    description: "Tukar giliran dengan pemain acak!",
    icon: "🔀",
    color: "#EAB308",
  },
  "skip-turn": {
    name: "Skip Turn",
    description: "Giliran ini dilewati — untung atau sial?",
    icon: "⏭️",
    color: "#64748B",
  },
  "reverse-turn": {
    name: "Reverse Turn",
    description: "Arah giliran berbalik!",
    icon: "🔃",
    color: "#EC4899",
  },
  "challenge-battle": {
    name: "Challenge Battle",
    description: "Dua pemain saling challenge!",
    icon: "⚔️",
    color: "#F97066",
  },
  "random-punishment": {
    name: "Random Punishment",
    description: "Hukuman konyol acak menantimu!",
    icon: "😈",
    color: "#1E3A5F",
  },
  "lucky-bonus": {
    name: "Lucky Bonus",
    description: "XP & coin bonus + power card!",
    icon: "🍀",
    color: "#22C55E",
  },
  "mystery-card": {
    name: "Mystery Card",
    description: "Kartu misterius... hadiah atau hukuman?",
    icon: "🎁",
    color: "#A855F7",
  },
};

export const RANDOM_ROUND_EVENTS = [
  {
    id: "all_answer",
    name: "Semua Menjawab",
    description: "Setiap pemain jawab truth kilat!",
    icon: "📣",
  },
  {
    id: "swap_seats",
    name: "Tukar Tempat",
    description: "Tukar posisi/avatar dengan tetangga!",
    icon: "🔄",
  },
  {
    id: "all_drink",
    name: "Semua Minum",
    description: "Semua angkat gelas / minum air bareng!",
    icon: "🥤",
  },
  {
    id: "all_stand",
    name: "Semua Berdiri",
    description: "Berdiri sampai ronde ini selesai!",
    icon: "🧍",
  },
  {
    id: "fastest_bonus",
    name: "Pemain Tercepat",
    description: "Yang selesai challenge tercepat dapat bonus!",
    icon: "⏱️",
  },
  {
    id: "double_challenge",
    name: "Challenge Ganda",
    description: "Challenge berikutnya x2 reward!",
    icon: "2️⃣",
  },
  {
    id: "all_laugh",
    name: "Semua Tertawa",
    description: "Wajib tertawa 10 detik bareng!",
    icon: "😂",
  },
  {
    id: "wildcard",
    name: "Wildcard",
    description: "Host AI menentukan aturan gila dadakan!",
    icon: "🃏",
  },
];

export const PUNISHMENTS = [
  "Nyanyi lagu anak-anak dengan gaya rock!",
  "Lakukan 10 push-up (atau attempt lucu).",
  "Bicara seperti robot sampai giliran berikutnya.",
  "Pakai filter aneh di kamera.",
  "Sebut dirimu dengan gelar konyol 3 ronde.",
  "Tari chicken dance 15 detik.",
  "Bilang 'saya ayam' setiap mau bicara 2 ronde.",
  "Imitasi selebriti sampai ada yang tebak.",
];

export const MYSTERY_BOX_REWARDS = [
  { type: "xp" as const, amount: 50, label: "+50 XP", icon: "⭐" },
  { type: "xp" as const, amount: 100, label: "+100 XP", icon: "🌟" },
  { type: "coins" as const, amount: 30, label: "+30 Coins", icon: "🪙" },
  { type: "coins" as const, amount: 75, label: "+75 Coins", icon: "💰" },
  { type: "power" as const, power: "skip" as const, label: "Power: Skip", icon: "⏭️" },
  { type: "power" as const, power: "double-dare" as const, label: "Power: Double Dare", icon: "💥" },
  { type: "power" as const, power: "truth-shield" as const, label: "Power: Truth Shield", icon: "🛡️" },
  { type: "punish" as const, label: "Hukuman Random!", icon: "😈" },
  { type: "bonus_turn" as const, label: "Giliran Extra!", icon: "🎁" },
];
