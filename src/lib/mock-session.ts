import { useEffect, useState } from "react";

const KEY = "token-scanner-session";
const EVENT = "token-scanner-session";

export type MockSession = { username: string };

function read(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockSession;
    if (parsed && typeof parsed.username === "string" && parsed.username) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function setMockSession(username: string): void {
  window.sessionStorage.setItem(KEY, JSON.stringify({ username: username.trim() }));
  window.dispatchEvent(new Event(EVENT));
}

export function clearMockSession(): void {
  window.sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function useMockSession(): { session: MockSession | null; isPending: boolean } {
  const [session, setSession] = useState<MockSession | null>(null);
  const [isPending, setPending] = useState(true);

  useEffect(() => {
    const sync = () => setSession(read());
    sync();
    setPending(false);
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  return { session, isPending };
}
