"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useGameStore } from "@/store/game-store";
import { LandingPage } from "@/components/landing/LandingPage";
import { Lobby } from "@/components/lobby/Lobby";
import { GameShell } from "@/components/game/GameShell";
import { Confetti } from "@/components/effects/Confetti";
import { ChatPanel } from "@/components/game/ChatPanel";
import { OnlineRoomSync } from "@/components/online/OnlineRoomSync";
import { sound } from "@/lib/sound";
import { registerSW } from "@/lib/pwa";

const BackgroundScene = dynamic(
  () =>
    import("@/components/background/Scene").then((m) => m.BackgroundScene),
  {
    ssr: false,
    loading: () => (
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-violet-950 via-slate-950 to-orange-950" />
    ),
  }
);

export function App() {
  const phase = useGameStore((s) => s.phase);
  const settings = useGameStore((s) => s.settings);

  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
    sound.setVolume(settings.volume);
  }, [settings.soundEnabled, settings.volume]);

  useEffect(() => {
    const unlock = () => sound.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    registerSW();
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  const showLanding = phase === "landing";
  const showLobby = phase === "lobby" || phase === "mode-select";
  const showGame = !["landing", "lobby", "mode-select"].includes(phase);

  return (
    <div
      className={`relative min-h-dvh text-white ${
        settings.darkMode ? "" : "brightness-110"
      }`}
    >
      <BackgroundScene />
      <Confetti />
      <OnlineRoomSync />

      <div
        className="pointer-events-none fixed inset-0 -z-[5] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(124,58,237,0.25), transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(249,115,22,0.18), transparent 45%), radial-gradient(ellipse at 50% 90%, rgba(234,179,8,0.12), transparent 50%)",
        }}
      />

      {showLanding && <LandingPage />}
      {showLobby && <Lobby />}
      {showGame && <GameShell />}
      {(showLobby || showGame) && <ChatPanel />}
    </div>
  );
}
