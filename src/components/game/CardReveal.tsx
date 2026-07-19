"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/game-store";
import { Button } from "@/components/ui/Button";
import { AIHost } from "@/components/host/AIHost";
import { sound } from "@/lib/sound";
import { AVATAR_COLORS } from "@/types";

export function CardReveal() {
  const lastCard = useGameStore((s) => s.lastCard);
  const players = useGameStore((s) => s.players);
  const idx = useGameStore((s) => s.currentPlayerIndex);
  const completeChallenge = useGameStore((s) => s.completeChallenge);
  const usePowerCard = useGameStore((s) => s.usePowerCard);
  const settings = useGameStore((s) => s.settings);
  const [flipped, setFlipped] = useState(false);
  const [timer, setTimer] = useState(settings.timer);
  const player = players[idx];

  useEffect(() => {
    const t = setTimeout(() => {
      setFlipped(true);
      if (settings.soundEnabled) sound.play("flip");
    }, 350);
    return () => clearTimeout(t);
  }, [settings.soundEnabled]);

  useEffect(() => {
    if (!flipped || settings.timer <= 0) return;
    setTimer(settings.timer);
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        if (settings.soundEnabled && t <= 5) sound.play("tick");
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [flipped, settings.timer, settings.soundEnabled]);

  if (!lastCard) return null;

  const isTruth = lastCard.type === "truth";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 px-4">
      <AIHost compact />

      {player && (
        <div
          className="flex items-center gap-2 rounded-full border px-4 py-1.5"
          style={{ borderColor: AVATAR_COLORS[player.color] }}
        >
          <span className="text-2xl">{player.avatar}</span>
          <span className="font-bold text-white">{player.name}</span>
        </div>
      )}

      <motion.div
        initial={{ rotateY: 180, scale: 0.8 }}
        animate={{ rotateY: flipped ? 0 : 180, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`relative overflow-hidden rounded-[2rem] border p-8 shadow-2xl ${
            isTruth
              ? "border-violet-400/40 bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-950"
              : "border-orange-400/40 bg-gradient-to-br from-orange-500 via-rose-600 to-red-800"
          }`}
        >
          {lastCard.riskReward && (
            <span className="absolute right-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-slate-900">
              RISK ⚡
            </span>
          )}
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/70">
            {isTruth ? "Truth" : "Dare"}
            {lastCard.difficulty && (
              <span className="ml-2 rounded-full bg-black/25 px-2 py-0.5 text-[10px] tracking-wide">
                {lastCard.difficulty}
              </span>
            )}
          </p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 12 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-2xl font-bold leading-snug text-white sm:text-3xl"
          >
            {lastCard.text}
          </motion.p>

          {settings.timer > 0 && (
            <div className="mt-6">
              <div className="mb-1 flex justify-between text-xs text-white/60">
                <span>Timer</span>
                <span>{timer}s</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/30">
                <motion.div
                  className="h-full rounded-full bg-yellow-300"
                  animate={{ width: `${(timer / settings.timer) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex w-full flex-wrap justify-center gap-3">
        <Button
          variant="orange"
          size="lg"
          onClick={() => {
            if (settings.soundEnabled) sound.play("win");
            completeChallenge(true);
          }}
        >
          ✓ Selesai
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            if (settings.soundEnabled) sound.play("fail");
            completeChallenge(false);
          }}
        >
          ✗ Gagal / Skip
        </Button>
      </div>

      {player && player.powerCards.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          <span className="w-full text-center text-xs text-white/50">Power Cards</span>
          {player.powerCards.map((power, i) => (
            <Button
              key={`${power}-${i}`}
              size="sm"
              variant="secondary"
              onClick={() => usePowerCard(player.id, power)}
            >
              {power}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
