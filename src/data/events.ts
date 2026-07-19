import type { ChaosEventType, MiniGameType } from "@/types";

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

export const MINI_GAMES: Record<
  MiniGameType,
  { name: string; description: string; icon: string; duration: number }
> = {
  rps: {
    name: "Rock Paper Scissors",
    description: "Batu-gunting-kertas lawan lawan acak!",
    icon: "✊",
    duration: 15,
  },
  memory: {
    name: "Memory Card",
    description: "Cocokkan pasangan kartu secepat mungkin",
    icon: "🃏",
    duration: 45,
  },
  "quick-tap": {
    name: "Quick Tap",
    description: "Tap secepat mungkin dalam 5 detik!",
    icon: "👆",
    duration: 8,
  },
  reaction: {
    name: "Reaction Test",
    description: "Tap saat warna berubah!",
    icon: "⚡",
    duration: 10,
  },
  "guess-number": {
    name: "Guess Number",
    description: "Tebak angka 1-20",
    icon: "🔢",
    duration: 20,
  },
  "emoji-quiz": {
    name: "Emoji Quiz",
    description: "Tebak arti dari rangkaian emoji",
    icon: "😎",
    duration: 25,
  },
  "spin-bottle": {
    name: "Spin Bottle",
    description: "Botol virtual menunjuk pemain",
    icon: "🍾",
    duration: 12,
  },
  "coin-flip": {
    name: "Coin Flip",
    description: "Kepala atau ekor?",
    icon: "🪙",
    duration: 8,
  },
  "dice-roll": {
    name: "Dice Roll",
    description: "Lempar dadu, angka tertinggi menang",
    icon: "🎲",
    duration: 10,
  },
  "lucky-wheel": {
    name: "Wheel Lucky",
    description: "Putar roda hadiah mini",
    icon: "🎡",
    duration: 15,
  },
  trivia: {
    name: "Trivia Quiz",
    description: "Pertanyaan kilat umum",
    icon: "🧠",
    duration: 20,
  },
  "color-match": {
    name: "Color Match",
    description: "Tap warna yang benar!",
    icon: "🎨",
    duration: 12,
  },
  simon: {
    name: "Simon Says",
    description: "Ikuti pola warna",
    icon: "🔴",
    duration: 30,
  },
  "math-battle": {
    name: "Math Battle",
    description: "Hitung cepat!",
    icon: "➕",
    duration: 15,
  },
};

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
