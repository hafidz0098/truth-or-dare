"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/game-store";

const MOOD_FACE: Record<string, string> = {
  happy: "😎",
  excited: "🤩",
  mischievous: "😈",
  shocked: "😱",
  proud: "🥳",
  teasing: "😏",
};

export function AIHost({ compact = false }: { compact?: boolean }) {
  const message = useGameStore((s) => s.hostMessage);
  const mood = useGameStore((s) => s.hostMood);

  return (
    <motion.div
      layout
      className={
        compact
          ? "flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2"
          : "flex items-start gap-3 rounded-3xl border border-white/10 bg-gradient-to-r from-violet-900/50 to-orange-900/30 p-4 shadow-lg"
      }
    >
      <motion.div
        key={mood}
        initial={{ scale: 0.6, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "tween", duration: 0.35 }}
        className={
          compact
            ? "flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-xl"
            : "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-orange-400 text-3xl shadow-md"
        }
      >
        {MOOD_FACE[mood] || "😎"}
      </motion.div>
      <div className="min-w-0 flex-1">
        {!compact && (
          <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-orange-300">
            AI Host
          </p>
        )}
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={
              compact
                ? "truncate text-sm text-white/90"
                : "text-base font-medium leading-snug text-white"
            }
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
