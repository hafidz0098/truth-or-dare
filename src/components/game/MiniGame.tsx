"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { MINI_GAMES } from "@/data/events";
import { Button } from "@/components/ui/Button";
import { pick, randomInt } from "@/lib/utils";
import { sound } from "@/lib/sound";

export function MiniGame() {
  const type = useGameStore((s) => s.activeMiniGame);
  const players = useGameStore((s) => s.players);
  const finish = useGameStore((s) => s.finishMiniGame);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const info = type ? MINI_GAMES[type] : null;

  const [taps, setTaps] = useState(0);
  const [reactionReady, setReactionReady] = useState(false);
  const [reactionStart, setReactionStart] = useState(0);
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const [guess, setGuess] = useState("");
  const [secret] = useState(() => randomInt(1, 20));
  const [rps, setRps] = useState<"rock" | "paper" | "scissors" | null>(null);
  const [rpsResult, setRpsResult] = useState("");
  const [dice, setDice] = useState<number | null>(null);
  const [coin, setCoin] = useState<"H" | "T" | null>(null);
  const [mathQ] = useState(() => {
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);
    return { a, b, ans: a + b };
  });
  const [mathInput, setMathInput] = useState("");
  const [colorTarget] = useState(() => pick(["🔴", "🟢", "🔵", "🟡"]));
  const [trivia] = useState(() =>
    pick([
      { q: "Ibukota Indonesia?", a: "jakarta" },
      { q: "2 + 2 x 2 = ?", a: "6" },
      { q: "Planet merah?", a: "mars" },
      { q: "Warna langit cerah?", a: "biru" },
    ])
  );
  const [triviaAns, setTriviaAns] = useState("");
  const [done, setDone] = useState(false);

  const winner = useMemo(() => pick(players), [players]);

  useEffect(() => {
    if (type === "reaction") {
      const delay = 1000 + Math.random() * 2500;
      const t = setTimeout(() => {
        setReactionReady(true);
        setReactionStart(performance.now());
      }, delay);
      return () => clearTimeout(t);
    }
    if (type === "quick-tap") {
      const t = setTimeout(() => {
        endWithWinner();
      }, 5000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const endWithWinner = (id?: string) => {
    if (done) return;
    setDone(true);
    if (soundEnabled) sound.play("win");
    setTimeout(() => finish(id || winner?.id), 800);
  };

  if (!type || !info) return null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-center shadow-xl"
      >
        <p className="text-4xl">{info.icon}</p>
        <h2 className="mt-2 text-2xl font-black text-white">{info.name}</h2>
        <p className="mt-1 text-sm text-white/60">{info.description}</p>
      </motion.div>

      {type === "quick-tap" && (
        <div className="text-center">
          <p className="mb-3 text-5xl font-black text-yellow-300">{taps}</p>
          <Button
            size="xl"
            variant="orange"
            onClick={() => setTaps((t) => t + 1)}
            fullWidth
          >
            TAP!
          </Button>
        </div>
      )}

      {type === "reaction" && (
        <button
          type="button"
          className={`flex h-40 w-full items-center justify-center rounded-3xl text-xl font-bold transition ${
            reactionReady ? "bg-green-500 text-white" : "bg-red-600/80 text-white"
          }`}
          onClick={() => {
            if (!reactionReady || reactionMs !== null) return;
            const ms = Math.round(performance.now() - reactionStart);
            setReactionMs(ms);
            endWithWinner();
          }}
        >
          {reactionMs !== null
            ? `${reactionMs} ms!`
            : reactionReady
              ? "TAP SEKARANG!"
              : "Tunggu hijau..."}
        </button>
      )}

      {type === "guess-number" && (
        <div className="flex w-full flex-col gap-3">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            type="number"
            placeholder="1 - 20"
            className="rounded-2xl border border-white/15 bg-slate-800 px-4 py-3 text-center text-xl text-white"
          />
          <Button
            onClick={() => {
              if (Number(guess) === secret) endWithWinner();
              else if (soundEnabled) sound.play("fail");
            }}
          >
            Tebak!
          </Button>
          {guess && Number(guess) !== secret && (
            <p className="text-center text-sm text-white/50">
              {Number(guess) < secret ? "Lebih besar..." : "Lebih kecil..."}
            </p>
          )}
        </div>
      )}

      {type === "rps" && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-3">
            {(["rock", "paper", "scissors"] as const).map((c) => (
              <Button
                key={c}
                size="lg"
                variant={rps === c ? "orange" : "secondary"}
                onClick={() => {
                  const cpu = pick(["rock", "paper", "scissors"] as const);
                  setRps(c);
                  const win =
                    (c === "rock" && cpu === "scissors") ||
                    (c === "paper" && cpu === "rock") ||
                    (c === "scissors" && cpu === "paper");
                  const draw = c === cpu;
                  setRpsResult(
                    draw ? `Draw vs ${cpu}` : win ? `Menang vs ${cpu}!` : `Kalah vs ${cpu}`
                  );
                  endWithWinner(win ? players[0]?.id : pick(players)?.id);
                }}
              >
                {c === "rock" ? "✊" : c === "paper" ? "✋" : "✌️"}
              </Button>
            ))}
          </div>
          {rpsResult && <p className="font-bold text-white">{rpsResult}</p>}
        </div>
      )}

      {type === "dice-roll" && (
        <Button
          size="xl"
          variant="orange"
          onClick={() => {
            const v = randomInt(1, 6);
            setDice(v);
            endWithWinner();
          }}
        >
          {dice ? `🎲 ${dice}` : "Lempar Dadu"}
        </Button>
      )}

      {type === "coin-flip" && (
        <Button
          size="xl"
          onClick={() => {
            setCoin(Math.random() > 0.5 ? "H" : "T");
            endWithWinner();
          }}
        >
          {coin ? (coin === "H" ? "🪙 Kepala" : "🪙 Ekor") : "Lempar Koin"}
        </Button>
      )}

      {type === "math-battle" && (
        <div className="flex w-full flex-col gap-3 text-center">
          <p className="text-3xl font-black text-white">
            {mathQ.a} + {mathQ.b} = ?
          </p>
          <input
            value={mathInput}
            onChange={(e) => setMathInput(e.target.value)}
            className="rounded-2xl border border-white/15 bg-slate-800 px-4 py-3 text-center text-xl text-white"
          />
          <Button
            onClick={() => {
              if (Number(mathInput) === mathQ.ans) endWithWinner(players[0]?.id);
              else if (soundEnabled) sound.play("fail");
            }}
          >
            Submit
          </Button>
        </div>
      )}

      {type === "color-match" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-white">Tap: {colorTarget}</p>
          <div className="grid grid-cols-2 gap-3">
            {["🔴", "🟢", "🔵", "🟡"].map((c) => (
              <Button
                key={c}
                size="lg"
                onClick={() => {
                  if (c === colorTarget) endWithWinner(players[0]?.id);
                  else if (soundEnabled) sound.play("fail");
                }}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      )}

      {type === "trivia" && (
        <div className="flex w-full flex-col gap-3">
          <p className="text-center text-lg font-bold text-white">{trivia.q}</p>
          <input
            value={triviaAns}
            onChange={(e) => setTriviaAns(e.target.value)}
            className="rounded-2xl border border-white/15 bg-slate-800 px-4 py-3 text-center text-white"
          />
          <Button
            onClick={() => {
              if (triviaAns.trim().toLowerCase() === trivia.a)
                endWithWinner(players[0]?.id);
              else if (soundEnabled) sound.play("fail");
            }}
          >
            Jawab
          </Button>
        </div>
      )}

      {type === "emoji-quiz" && (
        <div className="text-center">
          <p className="mb-3 text-4xl">🍕🇮🇹</p>
          <Button onClick={() => endWithWinner()}>Pizza Italia?</Button>
        </div>
      )}

      {(type === "memory" ||
        type === "spin-bottle" ||
        type === "lucky-wheel" ||
        type === "simon") && (
        <div className="text-center">
          <p className="mb-3 text-white/70">Mini-game cepat — pemenang acak berhadiah!</p>
          <Button size="lg" variant="orange" onClick={() => endWithWinner()}>
            Main & Selesai
          </Button>
        </div>
      )}

      <Button variant="ghost" size="sm" onClick={() => finish()}>
        Skip Mini Game
      </Button>
    </div>
  );
}
