import type { Achievement, DailyMission } from "@/types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_truth",
    name: "First Truth",
    description: "Jawab truth pertamamu",
    icon: "🗣️",
    rarity: "common",
    condition: "truths>=1",
  },
  {
    id: "first_dare",
    name: "First Dare",
    description: "Selesaikan dare pertamamu",
    icon: "💥",
    rarity: "common",
    condition: "dares>=1",
  },
  {
    id: "hundred_dares",
    name: "100 Dare",
    description: "Selesaikan 100 dare",
    icon: "💯",
    rarity: "legendary",
    condition: "dares>=100",
  },
  {
    id: "lucky_player",
    name: "Lucky Player",
    description: "Dapatkan Lucky Bonus",
    icon: "🍀",
    rarity: "rare",
    condition: "lucky>=1",
  },
  {
    id: "coward",
    name: "Coward",
    description: "Skip 5 kali dalam satu sesi",
    icon: "🐔",
    rarity: "common",
    condition: "skips>=5",
  },
  {
    id: "king_party",
    name: "King Party",
    description: "Jadi MVP di Party Mode",
    icon: "👑",
    rarity: "epic",
    condition: "mvp_party",
  },
  {
    id: "queen_party",
    name: "Queen Party",
    description: "Combo dare 5x beruntun",
    icon: "👸",
    rarity: "epic",
    condition: "combo>=5",
  },
  {
    id: "no_skip",
    name: "No Skip",
    description: "Selesaikan game tanpa skip",
    icon: "🛡️",
    rarity: "rare",
    condition: "no_skip_game",
  },
  {
    id: "truth_master",
    name: "Truth Master",
    description: "Jawab 50 truth",
    icon: "📜",
    rarity: "epic",
    condition: "truths>=50",
  },
  {
    id: "dare_master",
    name: "Dare Master",
    description: "Selesaikan 50 dare",
    icon: "⚔️",
    rarity: "epic",
    condition: "dares>=50",
  },
  {
    id: "speed_runner",
    name: "Speed Runner",
    description: "Selesaikan ronde di bawah 15 detik",
    icon: "⚡",
    rarity: "rare",
    condition: "fast_round",
  },
  {
    id: "ultimate_survivor",
    name: "Ultimate Survivor",
    description: "Selesaikan dare Impossible",
    icon: "🏆",
    rarity: "legendary",
    condition: "impossible_dare",
  },
  {
    id: "combo_king",
    name: "Combo King",
    description: "Raih combo 3x",
    icon: "🔥",
    rarity: "rare",
    condition: "combo>=3",
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Main dengan 10+ pemain",
    icon: "🦋",
    rarity: "rare",
    condition: "players>=10",
  },
  {
    id: "couple_goals",
    name: "Couple Goals",
    description: "Selesaikan Couple Mode",
    icon: "💕",
    rarity: "rare",
    condition: "mode_couple",
  },
  {
    id: "family_fun",
    name: "Family Fun",
    description: "Selesaikan Family Mode",
    icon: "🏠",
    rarity: "common",
    condition: "mode_family",
  },
  {
    id: "chaos_agent",
    name: "Chaos Agent",
    description: "Picu 5 random event",
    icon: "🌪️",
    rarity: "epic",
    condition: "events>=5",
  },
  {
    id: "minigame_champ",
    name: "Minigame Champ",
    description: "Menang 10 mini game",
    icon: "🎮",
    rarity: "epic",
    condition: "minigames>=10",
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Main lewat tengah malam",
    icon: "🦉",
    rarity: "common",
    condition: "night_play",
  },
  {
    id: "collector",
    name: "Collector",
    description: "Buka 10 achievement",
    icon: "📦",
    rarity: "legendary",
    condition: "achievements>=10",
  },
];

export function generateDailyMissions(): DailyMission[] {
  const pool = [
    {
      id: "play_rounds",
      title: "Main 5 Ronde",
      description: "Selesaikan 5 ronde hari ini",
      target: 5,
      rewardXp: 50,
      rewardCoins: 25,
    },
    {
      id: "complete_dares",
      title: "Selesaikan 10 Dare",
      description: "Tuntaskan 10 dare",
      target: 10,
      rewardXp: 100,
      rewardCoins: 50,
    },
    {
      id: "answer_truths",
      title: "Jawab 20 Truth",
      description: "Jawab 20 pertanyaan truth",
      target: 20,
      rewardXp: 80,
      rewardCoins: 40,
    },
    {
      id: "couple_mode",
      title: "Couple Night",
      description: "Main Couple Mode 1 sesi",
      target: 1,
      rewardXp: 60,
      rewardCoins: 30,
    },
    {
      id: "family_mode",
      title: "Family Time",
      description: "Main Family Mode 1 sesi",
      target: 1,
      rewardXp: 60,
      rewardCoins: 30,
    },
    {
      id: "party_mode",
      title: "Party Starter",
      description: "Main Party Mode 1 sesi",
      target: 1,
      rewardXp: 60,
      rewardCoins: 30,
    },
    {
      id: "no_skip_day",
      title: "No Chicken",
      description: "Selesaikan 8 challenge tanpa skip",
      target: 8,
      rewardXp: 90,
      rewardCoins: 45,
    },
    {
      id: "combo_day",
      title: "On Fire",
      description: "Raih combo 3x",
      target: 3,
      rewardXp: 70,
      rewardCoins: 35,
    },
  ];

  // Deterministic daily pick based on date
  const day = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < day.length; i++) hash = (hash * 31 + day.charCodeAt(i)) >>> 0;
  const picks: DailyMission[] = [];
  const used = new Set<number>();
  while (picks.length < 3) {
    const i = hash % pool.length;
    hash = (hash * 17 + 13) >>> 0;
    if (used.has(i)) continue;
    used.add(i);
    const m = pool[i];
    picks.push({
      ...m,
      id: `${m.id}_${day}`,
      progress: 0,
      completed: false,
    });
  }
  return picks;
}
