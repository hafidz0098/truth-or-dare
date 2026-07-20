"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useGameStore } from "@/store/game-store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AIHost } from "@/components/host/AIHost";
import {
  AVATAR_COLORS,
  AVATAR_EMOJIS,
  MODE_INFO,
  GENERAL_CATEGORIES,
  COUPLE_CATEGORIES,
  CATEGORY_LABELS,
  type AvatarColor,
  type GameMode,
  type Category,
} from "@/types";
import {
  NHIE_CATEGORIES,
  NHIE_PACK_LABELS,
  NHIE_PACK_TO_CATEGORY,
  type NhiePack,
} from "@/data/never-have-i-ever";
import { sound } from "@/lib/sound";
import { getClientId } from "@/lib/supabase/client-id";

export function Lobby() {
  const players = useGameStore((s) => s.players);
  const roomCode = useGameStore((s) => s.roomCode);
  const onlineStatus = useGameStore((s) => s.onlineStatus);
  const onlineRoomId = useGameStore((s) => s.onlineRoomId);
  const onlineHostClientId = useGameStore((s) => s.onlineHostClientId);
  const settings = useGameStore((s) => s.settings);
  const phase = useGameStore((s) => s.phase);
  const addPlayer = useGameStore((s) => s.addPlayer);
  const removePlayer = useGameStore((s) => s.removePlayer);
  const updatePlayer = useGameStore((s) => s.updatePlayer);
  const randomizeAvatar = useGameStore((s) => s.randomizeAvatar);
  const setMode = useGameStore((s) => s.setMode);
  const startGame = useGameStore((s) => s.startGame);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const resetSession = useGameStore((s) => s.resetSession);
  const myId = getClientId();
  const isHost =
    !onlineRoomId ||
    onlineHostClientId === myId ||
    players.some((p) => p.isHost && p.id === myId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showRoom, setShowRoom] = useState(false);
  const [customTruth, setCustomTruth] = useState("");
  const [customDare, setCustomDare] = useState("");

  const circle = useMemo(() => {
    const n = players.length || 1;
    const radius = Math.min(120, 40 + n * 8);
    return players.map((p, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return {
        ...p,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });
  }, [players]);

  const modes = Object.keys(MODE_INFO) as GameMode[];
  const isCoupleMode = settings.mode === "couple";
  const isNhieMode = settings.mode === "never";
  // Kategori couple / NHIE pack dipisah dari kategori umum TOD
  const categories: Category[] = isCoupleMode
    ? COUPLE_CATEGORIES
    : isNhieMode
      ? NHIE_CATEGORIES
      : GENERAL_CATEGORIES;

  const categoryLabel = (c: Category) => {
    if (isNhieMode) {
      const pack = (Object.keys(NHIE_PACK_TO_CATEGORY) as NhiePack[]).find(
        (p) => NHIE_PACK_TO_CATEGORY[p] === c
      );
      if (pack) return NHIE_PACK_LABELS[pack];
    }
    return CATEGORY_LABELS[c];
  };

  if (phase === "mode-select") {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-5 px-4 py-8">
        <AIHost />
        <h1 className="text-center text-3xl font-black text-white">Pilih Mode</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {modes.map((m, i) => {
            const info = MODE_INFO[m];
            const active = settings.mode === m;
            return (
              <Card
                key={m}
                delay={i * 0.05}
                onClick={() => {
                  setMode(m);
                  if (settings.soundEnabled) sound.play("click");
                }}
                className={`!p-4 ${active ? "ring-2 ring-yellow-400" : ""}`}
              >
                <span className="text-3xl">{info.icon}</span>
                <p className="mt-2 font-bold text-white">{info.name}</p>
                <p className="text-xs text-white/50">{info.description}</p>
              </Card>
            );
          })}
        </div>
        {settings.mode === "couple" && (
          <div className="rounded-2xl border border-pink-400/20 bg-pink-500/10 p-4">
            <p className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-pink-200/80">
              Kategori Couple (pisah dari mode lain)
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {COUPLE_CATEGORIES.map((c) => {
                const on = settings.categories.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      const next = on
                        ? settings.categories.filter((x) => x !== c)
                        : [...settings.categories, c];
                      updateSettings({ categories: next });
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      on
                        ? "bg-pink-500 text-white"
                        : "bg-slate-900/80 text-white/60"
                    }`}
                  >
                    {CATEGORY_LABELS[c]}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-center text-[10px] text-white/40">
              Kosong = semua kategori couple
            </p>
          </div>
        )}

        {settings.mode === "never" && (
          <div className="rounded-2xl border border-cyan-400/25 bg-cyan-500/10 p-4">
            <p className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-cyan-200/90">
              Pack Never Have I Ever
            </p>
            <p className="mb-3 text-center text-[11px] text-white/50">
              Bukan kategori TOD — ini filter prompt “Aku belum pernah…”
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {NHIE_CATEGORIES.map((c) => {
                const on = settings.categories.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      const next = on
                        ? settings.categories.filter((x) => x !== c)
                        : [...settings.categories, c];
                      updateSettings({ categories: next });
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      on
                        ? "bg-cyan-500 text-slate-900"
                        : "bg-slate-900/80 text-white/60"
                    }`}
                  >
                    {categoryLabel(c)}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-center text-[10px] text-white/40">
              Kosong = semua pack
            </p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {isHost ? (
            <Button
              size="lg"
              variant="orange"
              onClick={() => {
                if (settings.soundEnabled) sound.play("win");
                startGame();
              }}
              disabled={players.length < 2}
            >
              🚀 Mulai Game
            </Button>
          ) : (
            <p className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center text-sm text-white/70">
              Menunggu host memulai game… ({players.length} pemain)
            </p>
          )}
          <Button variant="ghost" onClick={() => useGameStore.setState({ phase: "lobby" })}>
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-5 px-4 py-6 pb-24">
      <div className="flex items-center justify-between">
        <Button size="sm" variant="ghost" onClick={resetSession}>
          ← Home
        </Button>
        <div className="flex flex-col items-center gap-0.5">
          <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1 font-mono text-sm font-bold tracking-widest text-yellow-300">
            {roomCode || "------"}
          </div>
          <span
            className={`text-[10px] font-semibold uppercase ${
              onlineStatus === "online" && onlineRoomId
                ? "text-emerald-400"
                : "text-white/40"
            }`}
          >
            {onlineStatus === "online" && onlineRoomId
              ? "online room"
              : onlineStatus === "connecting"
                ? "connecting…"
                : "local room"}
          </span>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setShowRoom((v) => !v)}>
          ⚙️
        </Button>
      </div>

      <AIHost compact />

      <h1 className="text-center text-3xl font-black text-white">Lobby Party</h1>
      <p className="text-center text-sm text-white/50">
        {players.length}/20 pemain · tambah teman & pilih avatar
      </p>

      {/* Circular avatars */}
      <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
        <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-slate-900/60 text-center text-xs text-white/40">
          Party
          <br />
          Circle
        </div>
        {circle.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            initial={{ scale: 0 }}
            animate={{ scale: 1, x: p.x, y: p.y }}
            transition={{ delay: i * 0.05, type: "spring" }}
            onClick={() => setEditingId(editingId === p.id ? null : p.id)}
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border-2 text-2xl shadow-lg"
            style={{
              borderColor: AVATAR_COLORS[p.color],
              background: `${AVATAR_COLORS[p.color]}33`,
            }}
            title={p.name}
          >
            {p.avatar}
            <span className="absolute -bottom-5 max-w-[70px] truncate text-[10px] font-semibold text-white">
              {p.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Player list edit */}
      <div className="space-y-2">
        {players.map((p) => (
          <motion.div
            key={p.id}
            layout
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/70 p-3"
          >
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
              style={{ background: AVATAR_COLORS[p.color] }}
              onClick={() => randomizeAvatar(p.id)}
            >
              {p.avatar}
            </button>
            <input
              value={p.name}
              onChange={(e) => updatePlayer(p.id, { name: e.target.value })}
              className="flex-1 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-white"
            />
            {p.isHost && (
              <span className="rounded-full bg-yellow-400/20 px-2 py-0.5 text-[10px] font-bold text-yellow-300">
                HOST
              </span>
            )}
            <span className="text-[10px] text-emerald-400">{p.ping}ms</span>
            {!p.isHost && (
              <button
                type="button"
                className="text-rose-400"
                onClick={() => removePlayer(p.id)}
                aria-label="Kick"
              >
                ✕
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {editingId && (
        <Card className="!p-4">
          <p className="mb-2 text-sm font-bold text-white">Pilih Avatar</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {AVATAR_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                className="rounded-lg bg-slate-900 p-2 text-xl"
                onClick={() => updatePlayer(editingId, { avatar: e })}
              >
                {e}
              </button>
            ))}
          </div>
          <p className="mb-2 text-sm font-bold text-white">Warna</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(AVATAR_COLORS) as AvatarColor[]).map((c) => (
              <button
                key={c}
                type="button"
                className="h-8 w-8 rounded-full"
                style={{ background: AVATAR_COLORS[c] }}
                onClick={() => updatePlayer(editingId, { color: c })}
              />
            ))}
          </div>
          <Button
            className="mt-3"
            size="sm"
            variant="secondary"
            onClick={() => randomizeAvatar(editingId)}
          >
            🎲 Random Avatar
          </Button>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {!onlineRoomId && (
          <Button
            variant="secondary"
            onClick={() => addPlayer()}
            disabled={players.length >= 20}
          >
            + Tambah Pemain
          </Button>
        )}
        {onlineRoomId && (
          <p className="w-full text-center text-xs text-white/50">
            Online: bagikan kode room — teman join dari device lain. Min. 2 pemain untuk mulai.
          </p>
        )}
        {isHost ? (
          <Button
            variant="orange"
            size="lg"
            className="flex-1"
            onClick={() => {
              useGameStore.setState({ phase: "mode-select" });
              useGameStore.getState().pushOnlineSync(false);
            }}
            disabled={players.length < 2}
          >
            Lanjut Pilih Mode →
          </Button>
        ) : (
          <p className="flex-1 rounded-2xl border border-white/10 bg-slate-900/50 px-3 py-3 text-center text-sm text-white/60">
            Host yang pilih mode & mulai · {players.length} pemain online
          </p>
        )}
      </div>

      {showRoom && (
        <Card className="!p-4 space-y-3">
          <h3 className="font-bold text-white">Custom Room Settings</h3>
          <label className="block text-sm text-white/70">
            Timer: {settings.timer}s
            <input
              type="range"
              min={0}
              max={120}
              step={5}
              value={settings.timer}
              onChange={(e) => updateSettings({ timer: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <label className="block text-sm text-white/70">
            Ronde: {settings.rounds}
            <input
              type="range"
              min={5}
              max={40}
              value={settings.rounds}
              onChange={(e) => updateSettings({ rounds: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <label className="flex items-center justify-between text-sm text-white">
            Private Room
            <input
              type="checkbox"
              checked={settings.isPrivate}
              onChange={(e) => updateSettings({ isPrivate: e.target.checked })}
            />
          </label>
          {settings.isPrivate && (
            <input
              value={settings.password}
              onChange={(e) => updateSettings({ password: e.target.value })}
              placeholder="Password"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
            />
          )}
          <label className="flex items-center justify-between text-sm text-white">
            Konten 18+
            <input
              type="checkbox"
              checked={settings.adultContent}
              onChange={(e) => updateSettings({ adultContent: e.target.checked })}
            />
          </label>
          <label className="block text-sm text-white/70">
            Ganti kartu / orang: {settings.cardRerollsPerPlayer ?? 2}x
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={settings.cardRerollsPerPlayer ?? 2}
              onChange={(e) =>
                updateSettings({ cardRerollsPerPlayer: Number(e.target.value) })
              }
              className="w-full"
            />
          </label>
          <div>
            <p className="mb-1 text-xs text-white/50">
              {isCoupleMode
                ? "Kategori Couple (pisah dari mode lain)"
                : isNhieMode
                  ? "Pack Never Have I Ever"
                  : "Kategori umum"}
            </p>
            <p className="mb-2 text-[10px] text-white/35">
              {isCoupleMode
                ? "Crush · Kencan · Flag · Flirt · Kenal Crush · Saling Kenal — kosong = semua"
                : isNhieMode
                  ? "Lucu · Couple · Dalam · Party · Family — kosong = semua"
                  : "School/office/dll tidak masuk Couple Mode"}
            </p>
            <div className="flex flex-wrap gap-1">
              {categories.map((c) => {
                const on = settings.categories.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      const next = on
                        ? settings.categories.filter((x) => x !== c)
                        : [...settings.categories, c];
                      updateSettings({ categories: next });
                    }}
                    className={`rounded-full px-2 py-1 text-xs ${
                      on
                        ? isCoupleMode
                          ? "bg-pink-600 text-white"
                          : "bg-violet-600 text-white"
                        : "bg-slate-900 text-white/60"
                    }`}
                  >
                    {categoryLabel(c)}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              value={customTruth}
              onChange={(e) => setCustomTruth(e.target.value)}
              placeholder="Custom Truth"
              className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
            />
            <Button
              size="sm"
              onClick={() => {
                if (!customTruth.trim()) return;
                updateSettings({
                  customTruths: [...settings.customTruths, customTruth.trim()],
                });
                setCustomTruth("");
              }}
            >
              +T
            </Button>
          </div>
          <div className="flex gap-2">
            <input
              value={customDare}
              onChange={(e) => setCustomDare(e.target.value)}
              placeholder="Custom Dare"
              className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
            />
            <Button
              size="sm"
              onClick={() => {
                if (!customDare.trim()) return;
                updateSettings({
                  customDares: [...settings.customDares, customDare.trim()],
                });
                setCustomDare("");
              }}
            >
              +D
            </Button>
          </div>
          <p className="text-xs text-white/40">
            Custom: {settings.customTruths.length} truth, {settings.customDares.length} dare
          </p>
        </Card>
      )}
    </div>
  );
}
