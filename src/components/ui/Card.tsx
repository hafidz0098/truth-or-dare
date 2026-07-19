"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
  as?: "div" | "button";
}

export function Card({
  children,
  className,
  hover = true,
  delay = 0,
  onClick,
  as = "div",
}: Props) {
  const Comp = as === "button" ? motion.button : motion.div;

  return (
    <Comp
      type={as === "button" ? "button" : undefined}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        delay,
      }}
      whileHover={
        hover
          ? { y: -4, scale: 1.02, transition: { duration: 0.2 } }
          : undefined
      }
      onClick={onClick}
      className={cn(
        "relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/95",
        "p-5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-sm",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Comp>
  );
}
