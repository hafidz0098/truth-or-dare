"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useGameStore } from "@/store/game-store";
import { getClientId } from "@/lib/supabase/client-id";
import { sound } from "@/lib/sound";
import { Button } from "@/components/ui/Button";
import { AIHost } from "@/components/host/AIHost";
import { AVATAR_COLORS } from "@/types";

export function TruthDareSelect() {
  const players = useGameStore((s) => s.players);
  const idx = useGameStore((s) => s.currentPlayerIndex);
  const chooseCard = useGameStore((s) => s.chooseCard);
  const onlineRoomId = useGameStore((s) => s.onlineRoomId);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const player = players[idx];
  // Reactive: re-render when turn / players change
  const canAct =
    !onlineRoomId || players[idx]?.id === getClientId();
  const [picked, setPicked] = useState<"truth" | "dare" | null>(null);
  const [showRisk, setShowRisk] = useState(false);

  const pick = (type: "truth" | "dare", risk = false) => {
    if (!canAct || picked) return;
    setPicked(type);
    if (soundEnabled) sound.play(type === "truth" ? "flip" : "whoosh");
    setTimeout(() => chooseCard(type, risk), type === "truth" ? 700 : 500);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4">
      <AIHost />

      {player && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 rounded-full border-2 bg-slate-900/70 px-5 py-2"
          style={{ borderColor: AVATAR_COLORS[player.color] }}
        >
          <span className="text-3xl">{player.avatar}</span>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Giliran</p>
            <p className="text-lg font-bold text-white">{player.name}</p>
          </div>
          {player.combo > 0 && (
            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold">
              🔥 x{player.combo}
            </span>
          )}
        </motion.div>
      )}

      <h2 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl">
        {canAct ? (
          <>
            Pilih{" "}
            <span className="bg-gradient-to-r from-violet-400 to-orange-400 bg-clip-text text-transparent">
              Truth
            </span>{" "}
            atau{" "}
            <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
              Dare
            </span>
          </>
        ) : (
          <span className="text-white/80">
            Menunggu {player?.name ?? "pemain"} memilih…
          </span>
        )}
      </h2>

      <div className={`grid w-full grid-cols-1 gap-5 sm:grid-cols-2 ${!canAct ? "pointer-events-none opacity-50" : ""}`}>
        {/* TRUTH CARD */}
        <motion.button
          type="button"
          disabled={!!picked || !canAct}
          onClick={() => pick("truth")}
          initial={{ y: 40, opacity: 0, rotate: -6 }}
          animate={
            picked === "truth"
              ? { rotateY: 180, scale: 1.05 }
              : { y: 0, opacity: 1, rotate: -2 }
          }
          whileHover={{ y: -8, rotate: 0, scale: 1.03 }}
          transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
          className="group relative h-56 overflow-hidden rounded-[2rem] border border-violet-400/30 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900 p-6 text-left shadow-2xl shadow-purple-900/40 sm:h-72"
          style={{ perspective: 1000 }}
        >
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-4 right-4 text-7xl opacity-20 transition group-hover:opacity-40">
            ❓
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-200">
            Kartu
          </p>
          <p className="mt-2 text-4xl font-black text-white sm:text-5xl">TRUTH</p>
          <p className="mt-3 max-w-[14rem] text-sm text-violet-100/80">
            Jawab jujur. Kartu terbuka seperti tarot…
          </p>
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-yellow-300 to-violet-300"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
          />
        </motion.button>

        {/* DARE CARD */}
        <motion.button
          type="button"
          disabled={!!picked}
          onClick={() => pick("dare")}
          initial={{ y: 40, opacity: 0, rotate: 6 }}
          animate={
            picked === "dare"
              ? { scale: 1.08, rotate: 0 }
              : { y: 0, opacity: 1, rotate: 2 }
          }
          whileHover={{ y: -8, rotate: 0, scale: 1.03 }}
          transition={
            picked === "dare"
              ? { type: "tween", duration: 0.25, ease: "easeOut" }
              : { type: "tween", duration: 0.35, ease: "easeOut" }
          }
          className="group relative h-56 overflow-hidden rounded-[2rem] border border-orange-400/30 bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 p-6 text-left shadow-2xl shadow-orange-900/40 sm:h-72"
        >
          <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl" />
          <div className="absolute bottom-4 right-4 text-7xl opacity-20 transition group-hover:opacity-40">
            💥
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">
            Kartu
          </p>
          <p className="mt-2 text-4xl font-black text-white sm:text-5xl">DARE</p>
          <p className="mt-3 max-w-[14rem] text-sm text-orange-50/85">
            Tantangan meledak. Siap berani?
          </p>
        </motion.button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRisk((v) => !v)}
        >
          ⚡ Risk vs Reward {showRisk ? "▲" : "▼"}
        </Button>
        {showRisk && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center"
          >
            <p className="mb-2 text-sm text-yellow-100">
              Ambil Dare lebih sulit untuk XP & coin lebih besar!
            </p>
            <Button variant="orange" size="sm" onClick={() => pick("dare", true)}>
              🔥 Ambil Risiko
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
