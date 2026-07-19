"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { CHAOS_EVENTS } from "@/data/events";
import { Button } from "@/components/ui/Button";
import { AIHost } from "@/components/host/AIHost";

export function EventOverlay() {
  const activeEvent = useGameStore((s) => s.activeEvent);
  const activeRoundEvent = useGameStore((s) => s.activeRoundEvent);
  const clearEvent = useGameStore((s) => s.clearEvent);
  const lastCard = useGameStore((s) => s.lastCard);

  const chaos = activeEvent ? CHAOS_EVENTS[activeEvent] : null;
  const round = activeRoundEvent;

  if (!chaos && !round) return null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-4">
      <AIHost />
      <motion.div
        initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="w-full overflow-hidden rounded-[2rem] border-2 border-yellow-400/50 bg-gradient-to-br from-fuchsia-800 via-violet-900 to-orange-800 p-8 text-center shadow-2xl"
      >
        <motion.p
          animate={{ scale: 1.12 }}
          transition={{
            type: "tween",
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.6,
          }}
          className="text-6xl"
        >
          {chaos?.icon || round?.icon}
        </motion.p>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-yellow-300">
          Random Event
        </p>
        <h2 className="mt-2 text-3xl font-black text-white">
          {chaos?.name || round?.name}
        </h2>
        <p className="mt-3 text-white/80">
          {chaos?.description || round?.description}
        </p>
        {activeEvent === "random-punishment" && lastCard && (
          <p className="mt-4 rounded-2xl bg-black/30 p-3 text-sm font-semibold text-orange-200">
            {lastCard.text}
          </p>
        )}
      </motion.div>
      <Button size="lg" variant="orange" onClick={clearEvent}>
        Lanjut!
      </Button>
    </div>
  );
}
