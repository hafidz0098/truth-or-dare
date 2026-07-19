"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { Button } from "@/components/ui/Button";
import { AIHost } from "@/components/host/AIHost";

export function Voting() {
  const voting = useGameStore((s) => s.voting);
  const lastCard = useGameStore((s) => s.lastCard);
  const castVote = useGameStore((s) => s.castVote);
  const finishVoting = useGameStore((s) => s.finishVoting);
  const players = useGameStore((s) => s.players);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-4">
      <AIHost compact />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full rounded-3xl border border-white/10 bg-slate-800/90 p-6 text-center"
      >
        <h2 className="text-2xl font-black text-white">🗳️ Voting Time</h2>
        <p className="mt-2 text-sm text-white/60">
          Apakah {lastCard?.type === "truth" ? "jawabannya jujur" : "dare berhasil"}?
        </p>
        <p className="mt-3 rounded-2xl bg-black/20 p-3 text-sm text-white/80">
          {lastCard?.text}
        </p>
        <div className="mt-6 flex gap-3">
          <Button fullWidth variant="orange" onClick={() => castVote(true)}>
            👍 Ya ({voting.yes})
          </Button>
          <Button fullWidth variant="danger" onClick={() => castVote(false)}>
            👎 Tidak ({voting.no})
          </Button>
        </div>
        <p className="mt-3 text-xs text-white/40">
          {players.length} pemain bisa vote
        </p>
      </motion.div>
      <Button variant="ghost" onClick={finishVoting}>
        Lanjut ({voting.yes + voting.no} vote)
      </Button>
    </div>
  );
}
