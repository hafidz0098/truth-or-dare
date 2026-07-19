"use client";

import { useEffect } from "react";
import {
  roomPlayersToLocal,
  subscribeRoom,
} from "@/lib/supabase/api";
import { useGameStore } from "@/store/game-store";

/** Subscribe Supabase Realtime saat room online aktif */
export function OnlineRoomSync() {
  const onlineRoomId = useGameStore((s) => s.onlineRoomId);
  const applyOnlinePlayers = useGameStore((s) => s.applyOnlinePlayers);
  const applyOnlinePhase = useGameStore((s) => s.applyOnlinePhase);

  useEffect(() => {
    if (!onlineRoomId) return;
    const unsub = subscribeRoom(onlineRoomId, {
      onPlayers: (rows) => {
        applyOnlinePlayers(roomPlayersToLocal(rows));
      },
      onRoom: (room) => {
        applyOnlinePhase(room.phase, room.mode);
      },
    });
    return unsub;
  }, [onlineRoomId, applyOnlinePlayers, applyOnlinePhase]);

  return null;
}
