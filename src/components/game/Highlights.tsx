"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { Button } from "@/components/ui/Button";
import { AIHost } from "@/components/host/AIHost";

export function Highlights() {
  const highlights = useGameStore((s) => s.highlights);
  const players = useGameStore((s) => s.players);
  const history = useGameStore((s) => s.history);
  const backToLobby = useGameStore((s) => s.backToLobby);
  const resetSession = useGameStore((s) => s.resetSession);

  const truths = history.filter((h) => h.type === "truth").length;
  const dares = history.filter((h) => h.type === "dare").length;
  const success = history.filter((h) => h.completed).length;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pb-10">
      <AIHost />
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center text-4xl font-black text-white"
      >
        🎬 Replay Highlights
      </motion.h1>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Truth", value: truths, color: "from-violet-600 to-purple-800" },
          { label: "Dare", value: dares, color: "from-orange-500 to-rose-600" },
          { label: "Sukses", value: success, color: "from-emerald-500 to-teal-700" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl bg-gradient-to-br ${s.color} p-4 text-center shadow-lg`}
          >
            <p className="text-3xl font-black text-white">{s.value}</p>
            <p className="text-xs font-semibold uppercase text-white/80">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {highlights.map((h, i) => (
          <motion.div
            key={h.title + i}
            initial={{ x: i % 2 ? 30 : -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="rounded-3xl border border-white/10 bg-slate-800/80 p-5"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{h.icon}</span>
              <div>
                <p className="font-bold text-yellow-300">{h.title}</p>
                <p className="text-sm text-white/70">{h.description}</p>
                {h.playerName && (
                  <p className="mt-1 font-semibold text-white">
                    {h.playerName}
                    {h.value !== undefined && (
                      <span className="ml-2 text-orange-300">{h.value}</span>
                    )}
                  </p>
                )}
                {!h.playerName && h.value !== undefined && (
                  <p className="mt-1 text-lg font-bold text-white">{h.value}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-white/50">
          Leaderboard Sesi
        </p>
        {[...players]
          .sort((a, b) => b.xp - a.xp)
          .map((p, i) => (
            <div
              key={p.id}
              className="flex items-center justify-between border-b border-white/5 py-2 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 text-center font-bold text-yellow-300">
                  {i + 1}
                </span>
                <span className="text-xl">{p.avatar}</span>
                <span className="font-medium text-white">{p.name}</span>
              </div>
              <span className="text-sm text-orange-300">{p.xp} XP</span>
            </div>
          ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" variant="orange" onClick={backToLobby}>
          Kembali ke Lobby
        </Button>
        <Button size="lg" variant="ghost" onClick={resetSession}>
          Home
        </Button>
      </div>
    </div>
  );
}
