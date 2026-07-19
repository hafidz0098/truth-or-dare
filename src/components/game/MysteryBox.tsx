"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { Button } from "@/components/ui/Button";

export function MysteryBox() {
  const result = useGameStore((s) => s.mysteryResult);
  const clear = useGameStore((s) => s.clearMystery);

  if (!result) return null;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 px-4">
      <motion.div
        initial={{ y: 40, scale: 0.6, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        className="w-full rounded-[2rem] border border-yellow-400/40 bg-gradient-to-br from-amber-600 via-orange-700 to-violet-900 p-8 text-center shadow-2xl"
      >
        <motion.p
          animate={{ rotate: 0, scale: 1.15 }}
          initial={{ rotate: -8, scale: 0.8 }}
          transition={{ type: "tween", duration: 0.45, ease: "easeOut" }}
          className="text-6xl"
        >
          {result.icon}
        </motion.p>
        <h2 className="mt-4 text-2xl font-black text-white">Mystery Box!</h2>
        <p className="mt-2 text-xl font-bold text-yellow-200">{result.label}</p>
      </motion.div>
      <Button size="lg" variant="orange" onClick={clear}>
        Ambil Hadiah
      </Button>
    </div>
  );
}
