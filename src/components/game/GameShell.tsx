"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { Wheel3D } from "./Wheel3D";
import { TruthDareSelect } from "./TruthDareSelect";
import { CardReveal } from "./CardReveal";
import { MiniGame } from "./MiniGame";
import { EventOverlay } from "./EventOverlay";
import { MysteryBox } from "./MysteryBox";
import { Highlights } from "./Highlights";
import { Voting } from "./Voting";
import { AVATAR_COLORS } from "@/types";
import { Button } from "@/components/ui/Button";

export function GameShell() {
  const phase = useGameStore((s) => s.phase);
  const players = useGameStore((s) => s.players);
  const idx = useGameStore((s) => s.currentPlayerIndex);
  const round = useGameStore((s) => s.currentRound);
  const settings = useGameStore((s) => s.settings);
  const endGame = useGameStore((s) => s.endGame);
  const screenShake = useGameStore((s) => s.screenShake);

  return (
    <motion.div
      animate={screenShake ? { x: 0 } : { x: 0 }}
      className={`relative min-h-dvh pb-10 pt-4 ${
        screenShake ? "animate-shake" : ""
      }`}
    >
      {/* Top bar */}
      {phase !== "highlights" && (
        <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between px-4">
          <div className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold text-white/70">
            Ronde {round}/{settings.rounds}
          </div>
          <div className="flex -space-x-2">
            {players.slice(0, 8).map((p, i) => (
              <div
                key={p.id}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm ${
                  i === idx ? "scale-110 border-yellow-300" : "border-white/20"
                }`}
                style={{ background: AVATAR_COLORS[p.color] }}
                title={p.name}
              >
                {p.avatar}
              </div>
            ))}
          </div>
          <Button size="sm" variant="ghost" onClick={endGame}>
            End
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: 0.28 }}
        >
          {phase === "spinning" && (
            <div className="px-4">
              <h2 className="mb-4 text-center text-2xl font-black text-white">
                🎡 Spin the Wheel
              </h2>
              <Wheel3D />
            </div>
          )}
          {phase === "choose" && <TruthDareSelect />}
          {phase === "reveal" && <CardReveal />}
          {phase === "voting" && <Voting />}
          {phase === "minigame" && <MiniGame />}
          {phase === "event" && <EventOverlay />}
          {phase === "mystery" && <MysteryBox />}
          {phase === "highlights" && <Highlights />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
