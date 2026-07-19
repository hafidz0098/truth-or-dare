-- Truth or Dare Party — Supabase schema
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

-- Extensions
create extension if not exists "pgcrypto";

-- ─── Profiles (guest-friendly, no forced auth) ─────────────────────────────
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  client_id text unique not null,
  display_name text not null default 'Player',
  avatar text not null default '🦊',
  color text not null default 'purple',
  xp integer not null default 0,
  coins integer not null default 0,
  level integer not null default 1,
  total_games integer not null default 0,
  total_truths integer not null default 0,
  total_dares integer not null default 0,
  dares_completed integer not null default 0,
  dares_failed integer not null default 0,
  achievements text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_client_id_idx on public.profiles (client_id);
create index if not exists profiles_xp_idx on public.profiles (xp desc);

-- ─── Rooms ──────────────────────────────────────────────────────────────────
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  host_client_id text not null,
  phase text not null default 'lobby',
  mode text not null default 'classic',
  settings jsonb not null default '{}'::jsonb,
  game_state jsonb not null default '{}'::jsonb,
  is_private boolean not null default false,
  password text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rooms_code_idx on public.rooms (code);
create index if not exists rooms_active_idx on public.rooms (is_active);

-- ─── Room players ───────────────────────────────────────────────────────────
create table if not exists public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  client_id text not null,
  display_name text not null,
  avatar text not null default '🦊',
  color text not null default 'purple',
  is_host boolean not null default false,
  is_connected boolean not null default true,
  xp integer not null default 0,
  coins integer not null default 0,
  truths_answered integer not null default 0,
  dares_completed integer not null default 0,
  dares_failed integer not null default 0,
  skips integer not null default 0,
  combo integer not null default 0,
  max_combo integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  joined_at timestamptz not null default now(),
  unique (room_id, client_id)
);

create index if not exists room_players_room_idx on public.room_players (room_id);

-- ─── Chat messages ──────────────────────────────────────────────────────────
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  client_id text not null,
  display_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_room_idx
  on public.chat_messages (room_id, created_at desc);

-- ─── Leaderboard / session results ──────────────────────────────────────────
create table if not exists public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  display_name text not null,
  avatar text not null default '🦊',
  mode text,
  xp_earned integer not null default 0,
  dares_completed integer not null default 0,
  truths_answered integer not null default 0,
  is_mvp boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_xp_idx
  on public.leaderboard_entries (xp_earned desc, created_at desc);

-- ─── Updated_at helper ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists rooms_updated_at on public.rooms;
create trigger rooms_updated_at
  before update on public.rooms
  for each row execute function public.set_updated_at();

-- ─── RLS (open guest party — tighten later with auth if needed) ─────────────
alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.chat_messages enable row level security;
alter table public.leaderboard_entries enable row level security;

-- Dev-friendly policies (anon key can read/write). For production, switch to auth.uid().
drop policy if exists "profiles_all" on public.profiles;
create policy "profiles_all" on public.profiles for all using (true) with check (true);

drop policy if exists "rooms_all" on public.rooms;
create policy "rooms_all" on public.rooms for all using (true) with check (true);

drop policy if exists "room_players_all" on public.room_players;
create policy "room_players_all" on public.room_players for all using (true) with check (true);

drop policy if exists "chat_all" on public.chat_messages;
create policy "chat_all" on public.chat_messages for all using (true) with check (true);

drop policy if exists "leaderboard_all" on public.leaderboard_entries;
create policy "leaderboard_all" on public.leaderboard_entries for all using (true) with check (true);

-- Realtime (abaikan error "already member of publication" kalau sudah pernah dijalankan)
do $$
begin
  begin
    alter publication supabase_realtime add table public.rooms;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.room_players;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.chat_messages;
  exception when duplicate_object then null;
  end;
end $$;
