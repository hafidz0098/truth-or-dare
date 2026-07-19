"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/game-store";
import {
  fetchChat,
  sendChatMessage,
  subscribeRoom,
} from "@/lib/supabase/api";

const QUICK_EMOJI = ["😂", "🔥", "😱", "👏", "💀", "❤️", "👀", "🎉"];

type Msg = { id: string; from: string; text: string };

export function ChatPanel() {
  const onlineRoomId = useGameStore((s) => s.onlineRoomId);
  const profileName = useGameStore((s) => s.profileName);
  const onlineStatus = useGameStore((s) => s.onlineStatus);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "sys",
      from: "System",
      text: onlineRoomId
        ? "Chat online aktif (Supabase)."
        : "Chat lokal. Set Supabase untuk chat antar device.",
    },
  ]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!onlineRoomId) return;
    let alive = true;
    void fetchChat(onlineRoomId).then((rows) => {
      if (!alive || rows.length === 0) return;
      setMessages(
        rows.map((r) => ({
          id: r.id,
          from: r.display_name,
          text: r.body,
        }))
      );
    });
    const unsub = subscribeRoom(onlineRoomId, {
      onChat: (msg) => {
        setMessages((m) => {
          if (m.some((x) => x.id === msg.id)) return m;
          return [
            ...m,
            { id: msg.id, from: msg.display_name, text: msg.body },
          ];
        });
      },
    });
    return () => {
      alive = false;
      unsub();
    };
  }, [onlineRoomId]);

  const send = async (t: string) => {
    if (!t.trim()) return;
    const body = t.trim();
    setText("");

    if (onlineRoomId) {
      const row = await sendChatMessage({
        roomId: onlineRoomId,
        displayName: profileName,
        body,
      });
      if (row) {
        setMessages((m) => {
          if (m.some((x) => x.id === row.id)) return m;
          return [...m, { id: row.id, from: row.display_name, text: row.body }];
        });
      }
      return;
    }

    setMessages((m) => [
      ...m,
      { id: String(Date.now()), from: "You", text: body },
    ]);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-orange-500 text-2xl shadow-xl"
        aria-label="Chat"
      >
        💬
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed bottom-20 right-4 z-40 flex h-80 w-[min(100vw-2rem,20rem)] flex-col rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="font-bold text-white">Party Chat</span>
              <span
                className={`text-[10px] font-semibold uppercase ${
                  onlineStatus === "online"
                    ? "text-emerald-400"
                    : "text-white/40"
                }`}
              >
                {onlineStatus === "online" ? "● live" : "○ local"}
              </span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {messages.map((m) => (
                <div key={m.id} className="text-sm">
                  <span className="font-semibold text-orange-300">{m.from}: </span>
                  <span className="text-white/80">{m.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 border-t border-white/10 px-2 py-1">
              {QUICK_EMOJI.map((e) => (
                <button
                  key={e}
                  type="button"
                  className="rounded-lg p-1 text-lg hover:bg-white/10"
                  onClick={() => void send(e)}
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="flex gap-2 border-t border-white/10 p-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void send(text)}
                placeholder="Ketik pesan..."
                className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
              />
              <Button size="sm" onClick={() => void send(text)}>
                →
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
