"use client";

type SoundName =
  | "click"
  | "hover"
  | "flip"
  | "spin"
  | "win"
  | "countdown"
  | "achievement"
  | "confetti"
  | "levelup"
  | "whoosh"
  | "pop"
  | "fail"
  | "tick";

// Procedural Web Audio sounds — no external files needed
class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private volume = 0.55;
  private unlocked = false;

  private ensure() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    this.unlocked = true;
    return this.ctx;
  }

  unlock() {
    this.ensure();
  }

  setEnabled(v: boolean) {
    this.enabled = v;
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    gain = 0.3,
    delay = 0
  ) {
    const ctx = this.ensure();
    if (!ctx || !this.enabled) return;

    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain * this.volume, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  private noise(duration: number, gain = 0.15) {
    const ctx = this.ensure();
    if (!ctx || !this.enabled) return;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = buffer;
    g.gain.value = gain * this.volume;
    src.connect(g);
    g.connect(ctx.destination);
    src.start();
  }

  play(name: SoundName) {
    if (!this.enabled) return;
    switch (name) {
      case "click":
        this.tone(520, 0.08, "triangle", 0.25);
        this.tone(780, 0.06, "sine", 0.15, 0.03);
        break;
      case "hover":
        this.tone(440, 0.05, "sine", 0.08);
        break;
      case "flip":
        this.tone(300, 0.1, "sawtooth", 0.12);
        this.tone(600, 0.15, "triangle", 0.18, 0.05);
        break;
      case "spin":
        for (let i = 0; i < 8; i++) {
          this.tone(200 + i * 60, 0.08, "square", 0.08, i * 0.06);
        }
        break;
      case "win":
        [523, 659, 784, 1046].forEach((f, i) =>
          this.tone(f, 0.25, "triangle", 0.2, i * 0.1)
        );
        break;
      case "countdown":
        this.tone(880, 0.12, "sine", 0.2);
        break;
      case "achievement":
        [659, 784, 988, 1318].forEach((f, i) =>
          this.tone(f, 0.2, "sine", 0.18, i * 0.08)
        );
        break;
      case "confetti":
        this.noise(0.25, 0.12);
        this.tone(1200, 0.2, "triangle", 0.1);
        break;
      case "levelup":
        [392, 523, 659, 784, 1046].forEach((f, i) =>
          this.tone(f, 0.18, "triangle", 0.16, i * 0.07)
        );
        break;
      case "whoosh":
        this.noise(0.2, 0.1);
        this.tone(150, 0.25, "sawtooth", 0.08);
        break;
      case "pop":
        this.tone(180, 0.06, "sine", 0.3);
        this.tone(90, 0.1, "triangle", 0.15, 0.02);
        break;
      case "fail":
        this.tone(200, 0.2, "sawtooth", 0.15);
        this.tone(140, 0.25, "triangle", 0.12, 0.1);
        break;
      case "tick":
        this.tone(1000, 0.03, "square", 0.06);
        break;
    }
  }
}

export const sound = new SoundEngine();
