/**
 * Multiplayer realtime layer (WebSocket-ready).
 * Works offline with local simulation; connects when NEXT_PUBLIC_WS_URL is set.
 */

export type MpMessage =
  | { type: "join"; room: string; player: { id: string; name: string; avatar: string } }
  | { type: "leave"; playerId: string }
  | { type: "chat"; playerId: string; text: string }
  | { type: "emoji"; playerId: string; emoji: string }
  | { type: "state"; payload: unknown }
  | { type: "kick"; playerId: string }
  | { type: "ping"; t: number }
  | { type: "pong"; t: number; serverT: number };

type Handler = (msg: MpMessage) => void;

export class MultiplayerClient {
  private ws: WebSocket | null = null;
  private handlers = new Set<Handler>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private url: string | null;
  connected = false;
  latency = 0;

  constructor(url?: string) {
    this.url = url || process.env.NEXT_PUBLIC_WS_URL || null;
  }

  connect(room: string) {
    if (!this.url || typeof window === "undefined") {
      // local-only mode
      this.connected = false;
      return;
    }
    try {
      this.ws = new WebSocket(`${this.url}?room=${room}`);
      this.ws.onopen = () => {
        this.connected = true;
        this.pingLoop();
      };
      this.ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data as string) as MpMessage;
          if (msg.type === "pong") {
            this.latency = Date.now() - msg.t;
          }
          this.handlers.forEach((h) => h(msg));
        } catch {
          /* ignore */
        }
      };
      this.ws.onclose = () => {
        this.connected = false;
        this.scheduleReconnect(room);
      };
      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      this.connected = false;
    }
  }

  private scheduleReconnect(room: string) {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect(room);
    }, 2000);
  }

  private pingLoop() {
    if (!this.connected) return;
    this.send({ type: "ping", t: Date.now() });
    setTimeout(() => this.pingLoop(), 5000);
  }

  send(msg: MpMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  onMessage(handler: Handler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.connected = false;
  }
}

export const mpClient = new MultiplayerClient();
