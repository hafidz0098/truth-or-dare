"use client";

import gsap from "gsap";

/** Light GSAP helpers for micro-interactions */
export function bounceIn(el: HTMLElement | null, delay = 0) {
  if (!el) return;
  gsap.fromTo(
    el,
    { scale: 0.6, opacity: 0, y: 24 },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.55,
      delay,
      ease: "back.out(1.7)",
    }
  );
}

export function shake(el: HTMLElement | null) {
  if (!el) return;
  gsap.fromTo(
    el,
    { x: 0 },
    { x: 8, duration: 0.06, yoyo: true, repeat: 7, ease: "power1.inOut" }
  );
}

export function pulse(el: HTMLElement | null) {
  if (!el) return;
  gsap.to(el, {
    scale: 1.06,
    duration: 0.35,
    yoyo: true,
    repeat: 1,
    ease: "power1.inOut",
  });
}

export function numberCounter(
  el: HTMLElement | null,
  from: number,
  to: number,
  duration = 0.8
) {
  if (!el) return;
  const obj = { val: from };
  gsap.to(obj, {
    val: to,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = String(Math.round(obj.val));
    },
  });
}
