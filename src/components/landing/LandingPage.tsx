"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/game-store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { FloatingEmojis } from "@/components/effects/FloatingEmojis";
import { sound } from "@/lib/sound";
import { ACHIEVEMENTS } from "@/data/achievements";
import { fetchLeaderboard } from "@/lib/supabase/api";
import { MODE_INFO, AVATAR_EMOJIS, AVATAR_COLORS, type AvatarColor } from "@/types";

type Panel =
  | null
  | "join"
  | "howto"
  | "settings"
  | "daily"
  | "leaderboard"
  | "achievements"
  | "profile";

export function LandingPage() {
  const createRoom = useGameStore((s) => s.createRoom);
  const joinRoom = useGameStore((s) => s.joinRoom);
  const quickPlay = useGameStore((s) => s.quickPlay);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const profileName = useGameStore((s) => s.profileName);
  const profileAvatar = useGameStore((s) => s.profileAvatar);
  const profileColor = useGameStore((s) => s.profileColor);
  const setProfile = useGameStore((s) => s.setProfile);
  const profileStats = useGameStore((s) => s.profileStats);
  const unlocked = useGameStore((s) => s.unlockedAchievements);
  const missions = useGameStore((s) => s.dailyMissions);
  const onlineEnabled = useGameStore((s) => s.onlineEnabled);
  const onlineStatus = useGameStore((s) => s.onlineStatus);
  const onlineError = useGameStore((s) => s.onlineError);

  const [panel, setPanel] = useState<Panel>(null);
  const [code, setCode] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [name, setName] = useState(profileName);
  const [busy, setBusy] = useState(false);
  const [leaderboardRows, setLeaderboardRows] = useState<
    { name: string; avatar: string; xp: number; you?: boolean }[]
  >([]);

  // Keep local input in sync after zustand rehydrate / external profile updates
  useEffect(() => {
    setName(profileName);
  }, [profileName]);

  const unlockAudio = () => {
    sound.unlock();
    sound.setEnabled(settings.soundEnabled);
    sound.setVolume(settings.volume);
  };

  /** Commit display name into store before any play flow */
  const commitProfileName = (override?: string) => {
    const next = (override ?? name).trim() || profileName.trim() || "Player";
    setName(next);
    setProfile(next, profileAvatar, profileColor);
    return next;
  };

  const menu = [
    {
      id: "create" as const,
      label: "Create Room",
      icon: "🏠",
      desc: onlineEnabled ? "Room online (Supabase)" : "Jadi host (lokal)",
      action: async () => {
        unlockAudio();
        commitProfileName();
        setBusy(true);
        await createRoom();
        setBusy(false);
      },
    },
    { id: "join" as const, label: "Join Room", icon: "🚪", desc: "Masuk dengan kode", action: () => setPanel("join") },
    {
      id: "quick" as const,
      label: "Quick Play",
      icon: "⚡",
      desc: "Langsung main bareng bot",
      action: () => {
        unlockAudio();
        commitProfileName();
        quickPlay();
      },
    },
    { id: "howto" as const, label: "How To Play", icon: "📖", desc: "Panduan cepat", action: () => setPanel("howto") },
    { id: "daily" as const, label: "Daily Challenge", icon: "📅", desc: "Misi harian", action: () => setPanel("daily") },
    { id: "leaderboard" as const, label: "Leaderboard", icon: "🏆", desc: "Peringkat lokal", action: () => setPanel("leaderboard") },
    { id: "achievements" as const, label: "Achievements", icon: "🎖️", desc: "Badge & title", action: () => setPanel("achievements") },
    { id: "profile" as const, label: "Player Profile", icon: "👤", desc: "Avatar & stats", action: () => setPanel("profile") },
    { id: "settings" as const, label: "Settings", icon: "⚙️", desc: "Suara & aksesibilitas", action: () => setPanel("settings") },
  ];

  return (
    <div className="relative min-h-dvh overflow-x-hidden px-4 pb-16 pt-8 sm:px-6">
      <FloatingEmojis count={10} />

      {/* Logo + Title */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        <div
          className={`mb-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
            onlineEnabled
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-white/10 text-white/50"
          }`}
        >
          {onlineEnabled ? "● Supabase ready" : "○ Offline / lokal"}
          {onlineStatus === "connecting" && " · connecting…"}
          {onlineStatus === "error" && onlineError ? ` · ${onlineError}` : ""}
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mb-3 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-violet-500 via-orange-400 to-yellow-400 text-5xl shadow-2xl shadow-orange-500/30"
        >
          🃏
        </motion.div>

        <motion.h1
          className="text-center text-5xl font-black tracking-tight sm:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-violet-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Truth
          </motion.span>
          <span className="mx-2 text-white/40">or</span>
          <motion.span
            className="inline-block bg-gradient-to-r from-orange-400 via-rose-400 to-yellow-300 bg-clip-text text-transparent"
            animate={{ y: -4 }}
            transition={{
              type: "tween",
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            Dare
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 max-w-md text-center text-base text-white/60 sm:text-lg"
        >
          Truth or Dare buat main bareng. Bisa offline, bisa online.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 w-full max-w-sm space-y-3"
        >
          <label className="block">
            <span className="mb-1.5 block text-center text-xs font-semibold uppercase tracking-wider text-white/40">
              Nama kamu
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => commitProfileName()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                  commitProfileName();
                }
              }}
              maxLength={24}
              placeholder="Isi nama dulu…"
              className="w-full rounded-2xl border border-white/15 bg-slate-950/80 px-4 py-3 text-center text-base font-bold text-white outline-none ring-orange-400/40 placeholder:text-white/30 focus:ring-2"
            />
          </label>
          <Button
            size="xl"
            variant="orange"
            fullWidth
            onClick={() => {
              unlockAudio();
              commitProfileName();
              quickPlay();
            }}
          >
            ▶ Play Now
          </Button>
          <p className="text-center text-xs text-white/40">
            Main sebagai{" "}
            <span className="font-semibold text-orange-300">
              {name.trim() || profileName || "Player"}
            </span>
          </p>
        </motion.div>

        {/* Menu grid */}
        <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
          {menu.map((item, i) => (
            <Card
              key={item.id}
              delay={0.05 * i}
              onClick={item.action}
              className="!p-4"
            >
              <div className="text-3xl">{item.icon}</div>
              <p className="mt-2 font-bold text-white">{item.label}</p>
              <p className="text-xs text-white/50">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Mode preview strip */}
        <div className="mt-10 w-full max-w-4xl">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-white/40">
            Game Modes
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Object.entries(MODE_INFO).map(([key, m], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="min-w-[140px] shrink-0 rounded-2xl border border-white/10 bg-slate-800/70 p-4"
                style={{ borderTopColor: m.color, borderTopWidth: 3 }}
              >
                <span className="text-2xl">{m.icon}</span>
                <p className="mt-1 text-sm font-bold text-white">{m.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* JOIN */}
      <Modal open={panel === "join"} onClose={() => setPanel(null)} title="Join Room">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="KODE ROOM"
          maxLength={6}
          className="mb-3 w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-3 text-center text-2xl font-black tracking-[0.3em] text-white uppercase"
        />
        <input
          value={joinPassword}
          onChange={(e) => setJoinPassword(e.target.value)}
          placeholder="Password (kalau private)"
          className="mb-4 w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2 text-center text-sm text-white"
        />
        {onlineError && panel === "join" && (
          <p className="mb-3 text-center text-sm text-rose-300">{onlineError}</p>
        )}
        <Button
          fullWidth
          size="lg"
          variant="orange"
          disabled={busy || !code.trim()}
          onClick={async () => {
            unlockAudio();
            commitProfileName();
            setBusy(true);
            await joinRoom(code, joinPassword);
            setBusy(false);
            if (useGameStore.getState().phase !== "landing") setPanel(null);
          }}
        >
          {busy ? "Masuk…" : "Masuk"}
        </Button>
      </Modal>

      {/* HOW TO */}
      <Modal open={panel === "howto"} onClose={() => setPanel(null)} title="How To Play">
        <ol className="space-y-3 text-sm text-white/80">
          <li>1. Buat/join room & tambah 2–20 pemain.</li>
          <li>2. Pilih mode (Classic, Party, Couple, Family, Extreme, Chaos).</li>
          <li>3. Putar roda 3D — siapa yang kena?</li>
          <li>4. Pilih Truth atau Dare (atau Risk vs Reward!).</li>
          <li>5. Selesaikan challenge, kumpulkan XP & combo.</li>
          <li>6. Event acak & mystery box biar gak boring!</li>
          <li>7. Akhir sesi: highlights + MVP party 👑</li>
        </ol>
        <Button className="mt-5" fullWidth onClick={() => setPanel(null)}>
          Mengerti!
        </Button>
      </Modal>

      {/* SETTINGS */}
      <Modal open={panel === "settings"} onClose={() => setPanel(null)} title="Settings">
        <div className="space-y-4 text-sm text-white">
          <label className="flex items-center justify-between">
            <span>Sound FX</span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => {
                updateSettings({ soundEnabled: e.target.checked });
                sound.setEnabled(e.target.checked);
              }}
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Music</span>
            <input
              type="checkbox"
              checked={settings.musicEnabled}
              onChange={(e) => updateSettings({ musicEnabled: e.target.checked })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block">Volume: {Math.round(settings.volume * 100)}%</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                updateSettings({ volume: v });
                sound.setVolume(v);
              }}
              className="w-full"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Reduce Motion</span>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => updateSettings({ darkMode: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Voting System</span>
            <input
              type="checkbox"
              checked={settings.enableVoting}
              onChange={(e) => updateSettings({ enableVoting: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Random Events</span>
            <input
              type="checkbox"
              checked={settings.enableEvents}
              onChange={(e) => updateSettings({ enableEvents: e.target.checked })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block">Timer (detik): {settings.timer}</span>
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
          <label className="block">
            <span className="mb-1 block">Jumlah Ronde: {settings.rounds}</span>
            <input
              type="range"
              min={5}
              max={40}
              step={1}
              value={settings.rounds}
              onChange={(e) => updateSettings({ rounds: Number(e.target.value) })}
              className="w-full"
            />
          </label>
        </div>
        <Button className="mt-5" fullWidth onClick={() => setPanel(null)}>
          Simpan
        </Button>
      </Modal>

      {/* DAILY */}
      <Modal open={panel === "daily"} onClose={() => setPanel(null)} title="Daily Challenge">
        <div className="space-y-3">
          {missions.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-white">{m.title}</p>
                  <p className="text-xs text-white/50">{m.description}</p>
                </div>
                {m.completed ? (
                  <span className="text-lg">✅</span>
                ) : (
                  <span className="text-xs text-orange-300">
                    +{m.rewardXp}XP
                  </span>
                )}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-orange-400"
                  style={{ width: `${(m.progress / m.target) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-right text-xs text-white/40">
                {m.progress}/{m.target}
              </p>
            </div>
          ))}
        </div>
      </Modal>

      {/* LEADERBOARD */}
      <Modal open={panel === "leaderboard"} onClose={() => setPanel(null)} title="Leaderboard">
        <LeaderboardBody
          open={panel === "leaderboard"}
          profileName={profileName}
          profileAvatar={profileAvatar}
          profileStats={profileStats}
          rows={leaderboardRows}
          setRows={setLeaderboardRows}
          online={onlineEnabled}
        />
      </Modal>

      {/* ACHIEVEMENTS */}
      <Modal
        open={panel === "achievements"}
        onClose={() => setPanel(null)}
        title="Achievements"
        className="max-h-[80vh] overflow-y-auto"
      >
        <div className="grid grid-cols-2 gap-2">
          {ACHIEVEMENTS.map((a) => {
            const got = unlocked.includes(a.id);
            return (
              <div
                key={a.id}
                className={`rounded-2xl border p-3 ${
                  got
                    ? "border-yellow-400/40 bg-yellow-400/10"
                    : "border-white/5 bg-slate-950/40 opacity-50"
                }`}
              >
                <span className="text-2xl">{a.icon}</span>
                <p className="mt-1 text-sm font-bold text-white">{a.name}</p>
                <p className="text-[10px] text-white/50">{a.description}</p>
                <p className="mt-1 text-[10px] uppercase text-orange-300/80">
                  {a.rarity}
                </p>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* PROFILE */}
      <Modal open={panel === "profile"} onClose={() => setPanel(null)} title="Player Profile">
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl text-4xl shadow-lg"
            style={{ background: AVATAR_COLORS[profileColor] }}
          >
            {profileAvatar}
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => commitProfileName()}
            className="w-full rounded-2xl border border-white/15 bg-slate-950 px-4 py-2 text-center text-white"
            placeholder="Nama"
            maxLength={24}
          />
          <div className="flex flex-wrap justify-center gap-2">
            {AVATAR_EMOJIS.slice(0, 16).map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setProfile(name, e, profileColor)}
                className={`rounded-xl p-2 text-xl ${
                  profileAvatar === e ? "bg-violet-600" : "bg-slate-800"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(AVATAR_COLORS) as AvatarColor[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setProfile(name, profileAvatar, c)}
                className={`h-8 w-8 rounded-full border-2 ${
                  profileColor === c ? "border-white" : "border-transparent"
                }`}
                style={{ background: AVATAR_COLORS[c] }}
              />
            ))}
          </div>
          <div className="grid w-full grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-xl bg-slate-950/50 p-2">
              <p className="text-lg font-bold text-white">{profileStats.totalGames}</p>
              <p className="text-xs text-white/50">Games</p>
            </div>
            <div className="rounded-xl bg-slate-950/50 p-2">
              <p className="text-lg font-bold text-white">{profileStats.totalTruths}</p>
              <p className="text-xs text-white/50">Truths</p>
            </div>
            <div className="rounded-xl bg-slate-950/50 p-2">
              <p className="text-lg font-bold text-white">{profileStats.daresCompleted}</p>
              <p className="text-xs text-white/50">Dares OK</p>
            </div>
            <div className="rounded-xl bg-slate-950/50 p-2">
              <p className="text-lg font-bold text-white">{unlocked.length}</p>
              <p className="text-xs text-white/50">Badges</p>
            </div>
          </div>
          <Button
            fullWidth
            variant="orange"
            onClick={() => {
              commitProfileName();
              setPanel(null);
            }}
          >
            Simpan Profil
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function LeaderboardBody({
  open,
  profileName,
  profileAvatar,
  profileStats,
  rows,
  setRows,
  online,
}: {
  open: boolean;
  profileName: string;
  profileAvatar: string;
  profileStats: { totalTruths: number; daresCompleted: number };
  rows: { name: string; avatar: string; xp: number; you?: boolean }[];
  setRows: (r: { name: string; avatar: string; xp: number; you?: boolean }[]) => void;
  online: boolean;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setLoading(true);
    void (async () => {
      const localYou = {
        name: profileName,
        avatar: profileAvatar,
        xp: profileStats.totalTruths * 15 + profileStats.daresCompleted * 25,
        you: true as const,
      };
      if (!online) {
        if (alive) {
          setRows([
            localYou,
            { name: "PartyKing", avatar: "👑", xp: 2400 },
            { name: "DareQueen", avatar: "💥", xp: 2100 },
          ].sort((a, b) => b.xp - a.xp));
          setLoading(false);
        }
        return;
      }
      const data = await fetchLeaderboard(15);
      if (!alive) return;
      if (data.length === 0) {
        setRows([localYou]);
      } else {
        setRows(
          data.map((d) => ({
            name: d.display_name,
            avatar: d.avatar,
            xp: d.xp_earned,
            you: d.display_name === profileName,
          }))
        );
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [open, online, profileName, profileAvatar, profileStats, setRows]);

  if (loading) {
    return <p className="text-center text-sm text-white/50">Loading leaderboard…</p>;
  }

  return (
    <div className="space-y-2">
      <p className="mb-2 text-center text-xs text-white/40">
        {online ? "Data dari Supabase" : "Contoh lokal (set env Supabase untuk live)"}
      </p>
      {rows.map((p, i) => (
        <div
          key={`${p.name}-${i}`}
          className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
            p.you ? "border border-violet-400/30 bg-violet-600/30" : "bg-slate-950/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-6 font-bold text-yellow-300">#{i + 1}</span>
            <span className="text-xl">{p.avatar}</span>
            <span className="font-medium text-white">
              {p.name} {p.you && "(You)"}
            </span>
          </div>
          <span className="text-sm text-orange-300">{p.xp} XP</span>
        </div>
      ))}
    </div>
  );
}
