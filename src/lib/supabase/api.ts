"use client";

import type { GameMode, GameSettings, Player, AvatarColor } from "@/types";
import { roomCode as genRoomCode } from "@/lib/utils";
import { getClientId } from "./client-id";
import { getSupabase, isSupabaseConfigured } from "./client";
import type {
  ChatMessageRow,
  LeaderboardRow,
  ProfileRow,
  RoomPlayerRow,
  RoomRow,
} from "./types";

export { isSupabaseConfigured };

export type OnlineRoom = {
  room: RoomRow;
  players: RoomPlayerRow[];
};

function mapPlayer(row: RoomPlayerRow): Player {
  const payload = (row.payload || {}) as {
    powerCards?: Player["powerCards"];
    cardRerollsLeft?: number;
  };
  return {
    id: row.client_id,
    name: row.display_name,
    avatar: row.avatar,
    color: (row.color as AvatarColor) || "purple",
    xp: row.xp,
    coins: row.coins,
    level: 1,
    truthsAnswered: row.truths_answered,
    daresCompleted: row.dares_completed,
    daresFailed: row.dares_failed,
    skips: row.skips,
    combo: row.combo,
    maxCombo: row.max_combo,
    powerCards: payload.powerCards ?? ["skip"],
    cardRerollsLeft:
      typeof payload.cardRerollsLeft === "number" ? payload.cardRerollsLeft : 2,
    titles: [],
    badges: [],
    isHost: row.is_host,
    isConnected: row.is_connected,
    ping: 30,
  };
}

export function roomPlayersToLocal(rows: RoomPlayerRow[]): Player[] {
  return rows
    .slice()
    .sort((a, b) => Number(b.is_host) - Number(a.is_host) || a.joined_at.localeCompare(b.joined_at))
    .map(mapPlayer);
}

// ─── Profile ────────────────────────────────────────────────────────────────

export async function upsertProfile(input: {
  displayName: string;
  avatar: string;
  color: string;
  xp?: number;
  coins?: number;
  level?: number;
  totalGames?: number;
  totalTruths?: number;
  totalDares?: number;
  daresCompleted?: number;
  daresFailed?: number;
  achievements?: string[];
}): Promise<ProfileRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const clientId = getClientId();

  const { data, error } = await sb
    .from("profiles")
    .upsert(
      {
        client_id: clientId,
        display_name: input.displayName,
        avatar: input.avatar,
        color: input.color,
        xp: input.xp ?? 0,
        coins: input.coins ?? 0,
        level: input.level ?? 1,
        total_games: input.totalGames ?? 0,
        total_truths: input.totalTruths ?? 0,
        total_dares: input.totalDares ?? 0,
        dares_completed: input.daresCompleted ?? 0,
        dares_failed: input.daresFailed ?? 0,
        achievements: input.achievements ?? [],
      },
      { onConflict: "client_id" }
    )
    .select()
    .single();

  if (error) {
    console.warn("[supabase] upsertProfile", error.message);
    return null;
  }
  return data;
}

export async function fetchProfile(): Promise<ProfileRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("profiles")
    .select("*")
    .eq("client_id", getClientId())
    .maybeSingle();
  if (error) {
    console.warn("[supabase] fetchProfile", error.message);
    return null;
  }
  return data;
}

// ─── Rooms ──────────────────────────────────────────────────────────────────

export async function createOnlineRoom(input: {
  displayName: string;
  avatar: string;
  color: string;
  settings: GameSettings;
}): Promise<OnlineRoom | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const clientId = getClientId();
  const code = genRoomCode();

  const { data: room, error: roomErr } = await sb
    .from("rooms")
    .insert({
      code,
      host_client_id: clientId,
      phase: "lobby",
      mode: input.settings.mode,
      settings: JSON.parse(JSON.stringify(input.settings)),
      game_state: {},
      is_private: input.settings.isPrivate,
      password: input.settings.password || null,
      is_active: true,
    })
    .select()
    .single();

  if (roomErr || !room) {
    console.warn("[supabase] createOnlineRoom", roomErr?.message);
    return null;
  }

  const { data: player, error: playerErr } = await sb
    .from("room_players")
    .insert({
      room_id: room.id,
      client_id: clientId,
      display_name: input.displayName,
      avatar: input.avatar,
      color: input.color,
      is_host: true,
      is_connected: true,
      payload: { powerCards: ["skip", "truth-shield"] },
    })
    .select()
    .single();

  if (playerErr || !player) {
    console.warn("[supabase] createOnlineRoom player", playerErr?.message);
    return { room, players: [] };
  }

  await upsertProfile({
    displayName: input.displayName,
    avatar: input.avatar,
    color: input.color,
  });

  return { room, players: [player] };
}

export async function joinOnlineRoom(input: {
  code: string;
  displayName: string;
  avatar: string;
  color: string;
  password?: string;
}): Promise<{ ok: true; data: OnlineRoom } | { ok: false; error: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi" };

  const code = input.code.trim().toUpperCase();
  const { data: room, error } = await sb
    .from("rooms")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !room) {
    return { ok: false, error: "Room tidak ditemukan atau sudah tutup" };
  }

  if (room.is_private && room.password && room.password !== (input.password || "")) {
    return { ok: false, error: "Password room salah" };
  }

  const clientId = getClientId();

  // count players
  const { count } = await sb
    .from("room_players")
    .select("*", { count: "exact", head: true })
    .eq("room_id", room.id);

  if ((count ?? 0) >= 20) {
    return { ok: false, error: "Room penuh (max 20)" };
  }

  const { error: upsertErr } = await sb.from("room_players").upsert(
    {
      room_id: room.id,
      client_id: clientId,
      display_name: input.displayName,
      avatar: input.avatar,
      color: input.color,
      is_host: room.host_client_id === clientId,
      is_connected: true,
      payload: { powerCards: ["skip"] },
    },
    { onConflict: "room_id,client_id" }
  );

  if (upsertErr) {
    return { ok: false, error: upsertErr.message };
  }

  const { data: players } = await sb
    .from("room_players")
    .select("*")
    .eq("room_id", room.id);

  await upsertProfile({
    displayName: input.displayName,
    avatar: input.avatar,
    color: input.color,
  });

  return { ok: true, data: { room, players: players ?? [] } };
}

export async function fetchRoomByCode(code: string): Promise<OnlineRoom | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data: room } = await sb
    .from("rooms")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .maybeSingle();
  if (!room) return null;
  const { data: players } = await sb
    .from("room_players")
    .select("*")
    .eq("room_id", room.id);
  return { room, players: players ?? [] };
}

export async function fetchRoomById(roomId: string): Promise<OnlineRoom | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data: room } = await sb
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .maybeSingle();
  if (!room) return null;
  const { data: players } = await sb
    .from("room_players")
    .select("*")
    .eq("room_id", roomId);
  return { room, players: players ?? [] };
}

export async function updateRoomPhase(
  roomId: string,
  phase: string,
  extra?: {
    mode?: GameMode;
    settings?: GameSettings;
    gameState?: Record<string, unknown>;
  }
) {
  const sb = getSupabase();
  if (!sb) return;
  const patch: {
    phase: string;
    mode?: string;
    settings?: ReturnType<typeof JSON.parse>;
    game_state?: ReturnType<typeof JSON.parse>;
  } = { phase };
  if (extra?.mode) patch.mode = extra.mode;
  if (extra?.settings) patch.settings = JSON.parse(JSON.stringify(extra.settings));
  if (extra?.gameState) patch.game_state = JSON.parse(JSON.stringify(extra.gameState));
  const { error } = await sb.from("rooms").update(patch).eq("id", roomId);
  if (error) console.warn("[supabase] updateRoomPhase", error.message);
}

/** Full room write used for multiplayer game sync */
export async function pushRoomSnapshot(
  roomId: string,
  input: {
    phase: string;
    mode: GameMode;
    settings: GameSettings;
    gameState: Record<string, unknown>;
  }
) {
  await updateRoomPhase(roomId, input.phase, {
    mode: input.mode,
    settings: input.settings,
    gameState: input.gameState,
  });
}

export async function syncRoomPlayers(roomId: string, players: Player[]) {
  const sb = getSupabase();
  if (!sb) return;

  await Promise.all(
    players.map((p) =>
      sb
        .from("room_players")
        .update({
          display_name: p.name,
          avatar: p.avatar,
          color: p.color,
          is_host: p.isHost,
          is_connected: p.isConnected,
          xp: p.xp,
          coins: p.coins,
          truths_answered: p.truthsAnswered,
          dares_completed: p.daresCompleted,
          dares_failed: p.daresFailed,
          skips: p.skips,
          combo: p.combo,
          max_combo: p.maxCombo,
          payload: {
            powerCards: p.powerCards,
            cardRerollsLeft: p.cardRerollsLeft,
          },
        })
        .eq("room_id", roomId)
        .eq("client_id", p.id)
    )
  );
}

export async function removeRoomPlayer(roomId: string, clientId: string) {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("room_players").delete().eq("room_id", roomId).eq("client_id", clientId);
}

export async function closeRoom(roomId: string) {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("rooms").update({ is_active: false, phase: "closed" }).eq("id", roomId);
}

// ─── Chat ───────────────────────────────────────────────────────────────────

export async function sendChatMessage(input: {
  roomId: string;
  displayName: string;
  body: string;
}) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("chat_messages")
    .insert({
      room_id: input.roomId,
      client_id: getClientId(),
      display_name: input.displayName,
      body: input.body.slice(0, 500),
    })
    .select()
    .single();
  if (error) {
    console.warn("[supabase] sendChat", error.message);
    return null;
  }
  return data as ChatMessageRow;
}

export async function fetchChat(roomId: string, limit = 40): Promise<ChatMessageRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("chat_messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true })
    .limit(limit);
  return data ?? [];
}

// ─── Leaderboard ────────────────────────────────────────────────────────────

export async function submitSessionResults(input: {
  mode: GameMode;
  players: Player[];
}) {
  const sb = getSupabase();
  if (!sb || input.players.length === 0) return;

  const sorted = [...input.players].sort((a, b) => b.xp - a.xp);
  const mvpId = sorted[0]?.id;

  const rows = input.players.map((p) => ({
    client_id: p.id.startsWith("p_") ? getClientId() : p.id,
    display_name: p.name,
    avatar: p.avatar,
    mode: input.mode,
    xp_earned: p.xp,
    dares_completed: p.daresCompleted,
    truths_answered: p.truthsAnswered,
    is_mvp: p.id === mvpId,
  }));

  // Only persist real clients (host local bots skip if name is bot-like without client)
  const real = rows.filter((r) => r.client_id && !r.client_id.startsWith("p_"));
  const toInsert = real.length ? real : rows.slice(0, 1);

  const { error } = await sb.from("leaderboard_entries").insert(toInsert);
  if (error) console.warn("[supabase] submitSessionResults", error.message);

  // bump host profile totals
  const me = input.players.find((p) => p.isHost) || input.players[0];
  if (me) {
    await upsertProfile({
      displayName: me.name,
      avatar: me.avatar,
      color: me.color,
      xp: me.xp,
      coins: me.coins,
      totalGames: 1,
      totalTruths: me.truthsAnswered,
      totalDares: me.daresCompleted + me.daresFailed,
      daresCompleted: me.daresCompleted,
      daresFailed: me.daresFailed,
    });
  }
}

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardRow[]> {
  const sb = getSupabase();
  if (!sb) return [];

  // Aggregate top by sum xp_earned per client_id
  const { data, error } = await sb
    .from("leaderboard_entries")
    .select("*")
    .order("xp_earned", { ascending: false })
    .limit(100);

  if (error || !data) {
    console.warn("[supabase] fetchLeaderboard", error?.message);
    return [];
  }

  const map = new Map<
    string,
    LeaderboardRow & { total: number }
  >();
  for (const row of data) {
    const prev = map.get(row.client_id);
    if (!prev) {
      map.set(row.client_id, { ...row, total: row.xp_earned });
    } else {
      prev.total += row.xp_earned;
      prev.xp_earned = prev.total;
      if (row.created_at > prev.created_at) {
        prev.display_name = row.display_name;
        prev.avatar = row.avatar;
      }
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.xp_earned - a.xp_earned)
    .slice(0, limit);
}

// ─── Realtime ───────────────────────────────────────────────────────────────

export type RoomRealtimeHandlers = {
  onPlayers?: (players: RoomPlayerRow[]) => void;
  onRoom?: (room: RoomRow) => void;
  onChat?: (msg: ChatMessageRow) => void;
};

export function subscribeRoom(
  roomId: string,
  handlers: RoomRealtimeHandlers
): () => void {
  const sb = getSupabase();
  if (!sb) return () => {};

  const channel = sb
    .channel(`room:${roomId}:${Math.random().toString(36).slice(2, 8)}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "room_players", filter: `room_id=eq.${roomId}` },
      async () => {
        const { data } = await sb
          .from("room_players")
          .select("*")
          .eq("room_id", roomId);
        if (data) handlers.onPlayers?.(data);
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
      (payload) => {
        handlers.onRoom?.(payload.new as RoomRow);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        handlers.onChat?.(payload.new as ChatMessageRow);
      }
    )
    .subscribe();

  return () => {
    void sb.removeChannel(channel);
  };
}
