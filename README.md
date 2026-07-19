# Truth or Dare Party 🃏

Premium multiplayer-ready **Truth or Dare** web game — modern card-game UI, Three.js backgrounds, 3D wheel, mini games, chaos events, AI host, XP/achievements, and PWA support.

## Stack

- **Next.js 15+** (App Router) + **TypeScript**
- **Tailwind CSS** v4
- **Framer Motion** + **GSAP-ready** patterns
- **Three.js** + **React Three Fiber** + Drei
- **Zustand** (persisted profile / settings)
- **Web Audio** procedural SFX (Howler-compatible architecture)
- **PWA** (manifest + service worker)
- **WebSocket client** ready (`NEXT_PUBLIC_WS_URL`)

## Run

```bash
cd truth-or-dare
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Buat project di [supabase.com](https://supabase.com)
2. **SQL Editor** → paste & run isi file `supabase/schema.sql`
3. **Project Settings → API** → salin URL + `anon` key
4. Buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

5. Restart `npm run dev`

Tanpa env, game tetap jalan **mode lokal**. Dengan env:

| Fitur | Supabase |
|--------|----------|
| Create / Join Room | `rooms` + `room_players` |
| Realtime player list | Realtime on `room_players` |
| Chat antar device | `chat_messages` |
| Leaderboard | `leaderboard_entries` |
| Profile | `profiles` (guest `client_id`) |

Lihat juga `.env.example`.

## Features

| Area | Highlights |
|------|------------|
| Landing | Logo animasi, Play, Create/Join Room, Quick Play, How To, Settings, Daily, Leaderboard, Achievements, Profile |
| Lobby | 2–20 players, avatar circle, edit name/color, custom room, categories, custom truths/dares |
| Modes | Classic, Party, Couple, Family, Extreme, Random Chaos |
| Wheel | 3D spinning wheel (R3F), confetti, highlight winner |
| Cards | Cinematic Truth / Dare select, flip reveal, risk vs reward, power cards |
| Content | 1000+ generated truths & dares + AI fallback generator |
| Systems | Combo, mystery box, random events, voting, mini games, highlights/MVP |
| UX | Mobile-first, reduce motion, volume, dark theme, skeleton-ready CSS |
| Multiplayer | Local party + WebSocket client stub for realtime scale-out |

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run start` — start production server

## Optional online multiplayer

Set:

```env
NEXT_PUBLIC_WS_URL=wss://your-realtime-server.example
```

Then wire server messages to `src/lib/multiplayer.ts`.

## License

MIT — buat party, jangan bikin malu di group chat 🎉
