"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { getClientId } from "@/lib/supabase/client-id";
import { sound } from "@/lib/sound";
import { AVATAR_COLORS } from "@/types";
import { Button } from "@/components/ui/Button";

function WheelMesh({
  spinning,
  targetAngle,
  onDone,
  colors,
}: {
  spinning: boolean;
  targetAngle: number;
  onDone: () => void;
  colors: string[];
}) {
  const ref = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  const started = useRef(false);
  const done = useRef(false);
  const angle = useRef(0);

  useEffect(() => {
    if (spinning) {
      velocity.current = 0.45 + Math.random() * 0.2;
      started.current = true;
      done.current = false;
    }
  }, [spinning, targetAngle]);

  useFrame((_, delta) => {
    if (!ref.current || !started.current) return;
    if (!done.current) {
      angle.current += velocity.current;
      const diff = targetAngle - (angle.current % (Math.PI * 2));
      const normalized = ((diff % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      if (velocity.current > 0.02) {
        velocity.current *= 0.985 - delta * 0.02;
      } else if (normalized > 0.08) {
        angle.current += Math.min(0.04, normalized * 0.08);
        velocity.current = 0.015;
      } else {
        done.current = true;
        velocity.current = 0;
        onDone();
      }
      const shake =
        velocity.current < 0.08 && velocity.current > 0.01
          ? Math.sin(Date.now() / 30) * 0.01
          : 0;
      ref.current.rotation.z = -angle.current + shake;
    }
  });

  const n = Math.max(colors.length, 2);
  const segments = useMemo(() => {
    return colors.map((c, i) => {
      const start = (i / n) * Math.PI * 2;
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      const steps = 12;
      for (let s = 0; s <= steps; s++) {
        const a = start + (s / steps) * ((Math.PI * 2) / n);
        shape.lineTo(Math.cos(a) * 1.6, Math.sin(a) * 1.6);
      }
      shape.lineTo(0, 0);
      return { color: c, shape, i };
    });
  }, [colors, n]);

  return (
    <group ref={ref}>
      {segments.map((seg) => (
        <mesh key={seg.i} position={[0, 0, 0.02]}>
          <shapeGeometry args={[seg.shape]} />
          <meshStandardMaterial color={seg.color} metalness={0.2} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.05]}>
        <cylinderGeometry args={[1.7, 1.7, 0.15, 48]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

export function Wheel3D() {
  const players = useGameStore((s) => s.players);
  const spinDone = useGameStore((s) => s.spinDone);
  const beginOnlineSpin = useGameStore((s) => s.beginOnlineSpin);
  const onlineRoomId = useGameStore((s) => s.onlineRoomId);
  const spinTargetIndex = useGameStore((s) => s.spinTargetIndex);
  const onlineHostClientId = useGameStore((s) => s.onlineHostClientId);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const reduceMotion = useGameStore((s) => s.settings.reduceMotion);
  const [spinning, setSpinning] = useState(false);
  const [targetIdx, setTargetIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [waitingHost, setWaitingHost] = useState(false);

  const host = !onlineRoomId || onlineHostClientId === getClientId();
  const colors = players.map((p) => AVATAR_COLORS[p.color] || "#7C3AED");
  const n = Math.max(players.length, 1);
  const targetAngle = useMemo(() => {
    const slice = (Math.PI * 2) / n;
    return targetIdx * slice + slice / 2 + Math.PI * 2 * 4;
  }, [targetIdx, n]);

  const runSpin = (idx: number) => {
    setTargetIdx(idx);
    setSpinning(true);
    setFinished(false);
    setZoom(false);
    setWaitingHost(false);
    if (soundEnabled) sound.play("spin");
  };

  // Online guest: follow shared spinTargetIndex from host
  useEffect(() => {
    if (!onlineRoomId) return;
    if (spinning || finished) return;
    if (spinTargetIndex == null) {
      if (!host) setWaitingHost(true);
      return;
    }
    runSpin(spinTargetIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineRoomId, spinTargetIndex]);

  // Local OR online host: start spin once
  useEffect(() => {
    const t = setTimeout(() => {
      if (onlineRoomId) {
        if (!host) {
          // Guest waits for snapshot
          if (spinTargetIndex != null) runSpin(spinTargetIndex);
          else setWaitingHost(true);
          return;
        }
        // Host: reuse snapshot index if already set (startGame), else roll
        const idx =
          spinTargetIndex != null ? spinTargetIndex : beginOnlineSpin();
        runSpin(idx);
        return;
      }
      // Offline / local party
      const idx = Math.floor(Math.random() * Math.max(players.length, 1));
      runSpin(idx);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDone = () => {
    if (finished) return;
    setFinished(true);
    setZoom(true);
    if (soundEnabled) sound.play("win");
    setTimeout(() => {
      // Online: only host publishes the turn result
      if (onlineRoomId && !host) return;
      spinDone(targetIdx);
    }, 900);
  };

  if (waitingHost && !spinning) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="text-5xl animate-pulse">🎡</div>
        <p className="text-lg font-bold text-white">Menunggu host putar roda…</p>
        <p className="text-sm text-white/50">Game akan sync otomatis</p>
      </div>
    );
  }

  if (reduceMotion) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-64 w-64">
          <div
            className="absolute inset-0 rounded-full border-4 border-yellow-400 shadow-xl"
            style={{
              background: `conic-gradient(${colors
                .map(
                  (c, i) =>
                    `${c} ${(i / n) * 100}% ${((i + 1) / n) * 100}%`
                )
                .join(", ")})`,
              animation: spinning ? "spin 1.2s ease-out forwards" : undefined,
            }}
          />
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 text-3xl">
            ▼
          </div>
        </div>
        {!spinning && !onlineRoomId && (
          <Button
            onClick={() => {
              const idx = Math.floor(Math.random() * players.length);
              runSpin(idx);
            }}
            variant="orange"
            size="lg"
          >
            Putar Roda
          </Button>
        )}
        {finished && (
          <p className="text-xl font-bold text-yellow-300">
            {players[targetIdx]?.avatar} {players[targetIdx]?.name}!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative h-72 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
        <Canvas camera={{ position: [0, 0, 5], fov: 42 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 4, 6]} intensity={1.2} />
          <WheelMesh
            spinning={spinning}
            targetAngle={targetAngle}
            onDone={handleDone}
            colors={colors.length ? colors : ["#7C3AED", "#F97316"]}
          />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
        <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 text-3xl drop-shadow">
          ▼
        </div>
      </div>

      <motion.div
        animate={zoom ? { scale: [1, 1.15, 1] } : {}}
        className="min-h-[2rem] text-center"
      >
        {finished && (
          <p className="text-2xl font-black text-yellow-300">
            {players[targetIdx]?.avatar} {players[targetIdx]?.name}!
          </p>
        )}
        {onlineRoomId && finished && !host && (
          <p className="mt-1 text-xs text-white/50">Sync dari host…</p>
        )}
      </motion.div>
    </div>
  );
}
