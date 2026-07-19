"use client";

import { useEffect } from "react";
import {
  fetchRoomById,
  roomPlayersToLocal,
  subscribeRoom,
} from "@/lib/supabase/api";
import { useGameStore } from "@/store/game-store";

/** Subscribe Supabase Realtime + initial snapshot saat room online aktif */
export function OnlineRoomSync() {
  const onlineRoomId = useGameStore((s) => s.onlineRoomId);
  const applyOnlinePlayers = useGameStore((s) => s.applyOnlinePlayers);
  const applyOnlineRoom = useGameStore((s) => s.applyOnlineRoom);

  useEffect(() => {
    if (!onlineRoomId) return;
    let cancelled = false;
    let unsub: (() => void) | undefined;

    const bootstrap = async () => {
      // Initial fetch so late joiners / second device catch current phase
      const snap = await fetchRoomById(onlineRoomId);
      if (cancelled) return;
      if (snap) {
        applyOnlinePlayers(roomPlayersToLocal(snap.players));
        applyOnlineRoom(snap.room);
      }

      unsub = subscribeRoom(onlineRoomId, {
        onPlayers: (rows) => {
          applyOnlinePlayers(roomPlayersToLocal(rows));
        },
        onRoom: (room) => {
          applyOnlineRoom(room);
        },
      });
    };

    void bootstrap();

    // Poll fallback if realtime is delayed / disabled (every 2.5s)
    const poll = setInterval(() => {
      void fetchRoomById(onlineRoomId).then((snap) => {
        if (cancelled || !snap) return;
        applyOnlinePlayers(roomPlayersToLocal(snap.players));
        applyOnlineRoom(snap.room);
      });
    }, 2500);

    return () => {
      cancelled = true;
      clearInterval(poll);
      unsub?.();
    };
  }, [onlineRoomId, applyOnlinePlayers, applyOnlineRoom]);

  return null;
}
