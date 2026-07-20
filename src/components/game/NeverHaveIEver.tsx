"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { getClientId } from "@/lib/supabase/client-id";
import { Button } from "@/components/ui/Button";
import { AIHost } from "@/components/host/AIHost";
import { sound } from "@/lib/sound";
import { AVATAR_COLORS } from "@/types";

export function NeverHaveIEver() {
  const prompt = useGameStore((s) => s.nhiePrompt);
  const votes = useGameStore((s) => s.nhieVotes);
  const showResults = useGameStore((s) => s.nhieShowResults);
  const players = useGameStore((s) => s.players);
  const onlineRoomId = useGameStore((s) => s.onlineRoomId);
  const onlineHostClientId = useGameStore((s) => s.onlineHostClientId);
  const settings = useGameStore((s) => s.settings);
  const castNhieVote = useGameStore((s) => s.castNhieVote);
  const revealNhieResults = useGameStore((s) => s.revealNhieResults);
  const nextNhieRound = useGameStore((s) => s.nextNhieRound);

  const myId = getClientId();
  const isHost = !onlineRoomId || onlineHostClientId === myId;
  const myVote = onlineRoomId ? votes[myId] : undefined;

  const everPlayers = players.filter((p) => votes[p.id] === "ever");
  const neverPlayers = players.filter((p) => votes[p.id] === "never");
  const pending = players.filter((p) => !votes[p.id]);
  const allVoted = players.length > 0 && pending.length === 0;

  if (!prompt) {
    return (
      <div className="px-4 py-16 text-center text-white/60">
        Menyiapkan prompt…
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 px-4">
      <AIHost compact />

      <p className="text-center text-xs font-bold uppercase tracking-widest text-cyan-300/80">
        Never Have I Ever
      </p>

      <motion.div
        key={prompt.id}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full rounded-[2rem] border border-cyan-400/30 bg-gradient-to-br from-cyan-700 via-sky-800 to-indigo-950 p-8 shadow-2xl shadow-cyan-900/40"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-100/70">
          Aku belum pernah…
        </p>
        <p className="mt-4 text-2xl font-black leading-snug text-white sm:text-3xl">
          {prompt.text.replace(/^Aku belum pernah…\s*/i, "")}
        </p>
        <p className="mt-4 text-sm text-white/50">
          Yang <span className="font-bold text-amber-300">pernah</span> → jujur
          ya. Yang belum → santai.
        </p>
      </motion.div>

      {/* Voting */}
      {!showResults && (
        <div className="w-full space-y-4">
          {onlineRoomId ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-white/60">Pilihan kamu:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  variant="orange"
                  disabled={!!myVote}
                  onClick={() => {
                    if (settings.soundEnabled) sound.play("click");
                    castNhieVote("ever");
                  }}
                >
                  ✋ Pernah
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  disabled={!!myVote}
                  onClick={() => {
                    if (settings.soundEnabled) sound.play("click");
                    castNhieVote("never");
                  }}
                >
                  🙈 Belum
                </Button>
              </div>
              {myVote && (
                <p className="text-sm text-cyan-200">
                  Kamu pilih:{" "}
                  <strong>{myVote === "ever" ? "Pernah" : "Belum"}</strong>
                  {pending.length > 0
                    ? ` · nunggu ${pending.length} orang…`
                    : ""}
                </p>
              )}
            </div>
          ) : (
            <div className="w-full space-y-2">
              <p className="text-center text-xs text-white/50">
                Lokal: tiap pemain pilih (gilir HP / tap barisnya)
              </p>
              {players.map((p) => {
                const v = votes[p.id];
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
                        style={{ background: AVATAR_COLORS[p.color] }}
                      >
                        {p.avatar}
                      </span>
                      <span className="font-semibold text-white">{p.name}</span>
                    </div>
                    {v ? (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          v === "ever"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-600/40 text-white/70"
                        }`}
                      >
                        {v === "ever" ? "✋ Pernah" : "🙈 Belum"}
                      </span>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="orange"
                          onClick={() => {
                            if (settings.soundEnabled) sound.play("click");
                            castNhieVote("ever", p.id);
                          }}
                        >
                          Pernah
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (settings.soundEnabled) sound.play("click");
                            castNhieVote("never", p.id);
                          }}
                        >
                          Belum
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {isHost && !allVoted && (
            <Button
              fullWidth
              variant="ghost"
              onClick={() => {
                if (settings.soundEnabled) sound.play("whoosh");
                revealNhieResults();
              }}
            >
              Tampilkan hasil sekarang
            </Button>
          )}
        </div>
      )}

      {/* Results */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full space-y-4"
        >
          <div className="rounded-2xl border border-amber-400/25 bg-amber-500/10 p-4">
            <p className="mb-2 text-sm font-bold text-amber-200">
              ✋ Pernah ({everPlayers.length})
            </p>
            {everPlayers.length === 0 ? (
              <p className="text-sm text-white/40">Tidak ada</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {everPlayers.map((p) => (
                  <span
                    key={p.id}
                    className="rounded-full px-3 py-1 text-sm font-semibold text-white"
                    style={{ background: AVATAR_COLORS[p.color] }}
                  >
                    {p.avatar} {p.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="mb-2 text-sm font-bold text-white/70">
              🙈 Belum ({neverPlayers.length})
            </p>
            {neverPlayers.length === 0 ? (
              <p className="text-sm text-white/40">Tidak ada</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {neverPlayers.map((p) => (
                  <span
                    key={p.id}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80"
                  >
                    {p.avatar} {p.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isHost ? (
            <Button
              fullWidth
              size="lg"
              variant="orange"
              onClick={() => {
                if (settings.soundEnabled) sound.play("win");
                nextNhieRound();
              }}
            >
              Lanjut ronde →
            </Button>
          ) : (
            <p className="text-center text-sm text-white/50">
              Menunggu host lanjut ronde…
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
