"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { sound } from "@/lib/sound";

const COLORS = ["#7C3AED", "#F97316", "#EAB308", "#F97066", "#14B8A6", "#EC4899", "#fff"];

export function Confetti() {
  const show = useGameStore((s) => s.showConfetti);
  const setConfetti = useGameStore((s) => s.setConfetti);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const [pieces, setPieces] = useState<
    { id: number; x: number; color: string; rot: number; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    if (!show) return;
    if (soundEnabled) sound.play("confetti");
    const p = Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      rot: Math.random() * 360,
      delay: Math.random() * 0.35,
      size: 6 + Math.random() * 10,
    }));
    setPieces(p);
    const t = setTimeout(() => {
      setConfetti(false);
      setPieces([]);
    }, 2800);
    return () => clearTimeout(t);
  }, [show, setConfetti, soundEnabled]);

  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
              animate={{
                y: "110vh",
                rotate: p.rot + 720,
                opacity: 0,
              }}
              transition={{
                type: "tween",
                duration: 2.2 + Math.random(),
                delay: p.delay,
                ease: "easeIn",
              }}
              className="absolute top-0 rounded-sm"
              style={{
                width: p.size,
                height: p.size * (Math.random() > 0.5 ? 0.4 : 1),
                background: p.color,
                left: 0,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
