"use client";

import { motion } from "framer-motion";

const EMOJIS = ["✨", "💜", "🔥", "🎉", "⭐", "💫", "🧡", "❓", "🃏", "🎯"];

export function FloatingEmojis({ count = 12 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 17 + 5) % 100;
        const delay = (i * 0.7) % 5;
        const duration = 8 + (i % 5);
        return (
          <motion.span
            key={i}
            className="absolute text-2xl opacity-30 sm:text-3xl"
            style={{ left: `${left}%`, bottom: "-10%" }}
            animate={{
              y: -800 - (i % 3) * 100,
              x: Math.sin(i) * 40,
              rotate: 360,
              opacity: 0.3,
            }}
            initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
            transition={{
              type: "tween",
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {EMOJIS[i % EMOJIS.length]}
          </motion.span>
        );
      })}
    </div>
  );
}
