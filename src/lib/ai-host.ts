import type { CardType, GameMode } from "@/types";
import { pick } from "./utils";

const HOST_LINES = {
  intro: [
    "Siap-siap, party dimulai! 🔥",
    "Halo semuanya! Aku host virtual kalian~",
    "Siapa yang berani malam ini? 👀",
    "Jangan malu-malu, ayo main!",
  ],
  spin: [
    "Putar rodanyaaa!",
    "Semoga kamu beruntung... atau tidak 😈",
    "Siapa yang kena?!",
    "Roda berputar, nasib digenggam!",
  ],
  truth: [
    "Hahaha, pilih Truth ya?",
    "Jujur ya, jangan bohong!",
    "Wah truth... berani juga ngaku!",
    "Kita dengar jawabannya~",
    "Serius nih? Jawab jujur!",
  ],
  dare: [
    "Serius nih Dare?!",
    "Wah... berani juga!",
    "Kena kamu! 💥",
    "Dare time! Gak ada ampun!",
    "Ini mah tantangan gila!",
  ],
  complete: [
    "Mantap jiwa! 👏",
    "Keren banget!",
    "Party makin panas!",
    "Itu baru spirit!",
    "Legend! 🏆",
  ],
  fail: [
    "Waduh... skip? Coward alert 🐔",
    "Next time lebih berani ya!",
    "Oke deh, ampun kali ini...",
    "Hmm, kurang berani nih~",
  ],
  event: [
    "EVENT ACAK! Siap-siap!",
    "Plot twist! 🌪️",
    "Sesuatu yang gila akan terjadi...",
    "Random chaos activated!",
  ],
  combo: [
    "COMBO! Terus lanjutkan!",
    "On fire! 🔥🔥🔥",
    "Tidak bisa dihentikan!",
    "Combo master incoming!",
  ],
  vote: [
    "Voting time! Jujur atau bohong?",
    "Apa menurut kalian berhasil?",
    "Suara kalian menentukan!",
  ],
  end: [
    "Game over! Kalian gila semua 😂",
    "Sesi keren banget!",
    "Sampai jumpa di party berikutnya!",
    "MVP, berdirilah!",
  ],
  mode: {
    classic: ["Mode klasik, tapi tetap seru!"],
    party: ["PARTY MODE! Volume naik! 🎉"],
    couple: ["Mode couple... crush & dating mode on 💕"],
    family: ["Family friendly, aman untuk semua!"],
    extreme: ["EXTREME! Hati-hati... ⚡"],
    chaos: ["CHAOS MODE! Tidak ada aturan! 🌪️"],
  } as Record<GameMode, string[]>,
};

export type HostMood =
  | "happy"
  | "excited"
  | "mischievous"
  | "shocked"
  | "proud"
  | "teasing";

export function hostLine(
  context:
    | "intro"
    | "spin"
    | "truth"
    | "dare"
    | "complete"
    | "fail"
    | "event"
    | "combo"
    | "vote"
    | "end",
  extra?: { mode?: GameMode; type?: CardType }
): { text: string; mood: HostMood } {
  if (extra?.mode && context === "intro") {
    return {
      text: pick(HOST_LINES.mode[extra.mode] ?? HOST_LINES.intro),
      mood: "excited",
    };
  }

  const moods: Record<string, HostMood> = {
    intro: "happy",
    spin: "excited",
    truth: "teasing",
    dare: "mischievous",
    complete: "proud",
    fail: "teasing",
    event: "shocked",
    combo: "excited",
    vote: "happy",
    end: "proud",
  };

  return {
    text: pick(HOST_LINES[context]),
    mood: moods[context] ?? "happy",
  };
}

export function hostReactToCard(type: CardType) {
  return hostLine(type === "truth" ? "truth" : "dare");
}
