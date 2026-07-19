"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/sound";
import { useGameStore } from "@/store/game-store";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "truth" | "dare" | "orange";

interface Props extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-lg shadow-purple-500/25",
  secondary:
    "bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-md shadow-slate-900/30",
  ghost: "bg-white/10 text-white border border-white/15 hover:bg-white/15",
  danger:
    "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25",
  truth:
    "bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white shadow-xl shadow-purple-600/30",
  dare:
    "bg-gradient-to-br from-orange-500 via-coral-500 to-rose-500 text-white shadow-xl shadow-orange-500/30",
  orange:
    "bg-gradient-to-br from-orange-400 to-amber-500 text-navy-900 text-slate-900 shadow-lg shadow-orange-400/30 font-bold",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-xl",
  md: "px-5 py-2.5 text-base rounded-2xl",
  lg: "px-7 py-3.5 text-lg rounded-2xl",
  xl: "px-10 py-5 text-xl rounded-3xl font-bold",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  icon,
  className,
  disabled,
  onClick,
  ...rest
}: Props) {
  const reduceMotion = useGameStore((s) => s.settings.reduceMotion);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const ref = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>(
    []
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundEnabled) sound.play("click");
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((r) => [...r, { x, y, id }]);
      setTimeout(() => setRipples((r) => r.filter((i) => i.id !== id)), 600);
    }
    onClick?.(e);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      whileHover={reduceMotion || disabled ? undefined : { scale: 1.04, y: -2 }}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      onHoverStart={() => soundEnabled && sound.play("hover")}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden select-none font-semibold tracking-wide",
        "transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "disabled:opacity-45 disabled:pointer-events-none",
        "active:brightness-95",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {icon}
        {children}
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute z-0 rounded-full bg-white/35 animate-ripple"
          style={{ left: r.x, top: r.y, width: 8, height: 8 }}
        />
      ))}
    </motion.button>
  );
}
