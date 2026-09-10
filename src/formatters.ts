const IST = "Asia/Kolkata";

export function formatEth(value: number): string {
  return value.toFixed(4);
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPct(value: number): string {
  if (Object.is(value, 0) || Math.abs(value) < 0.05) return "0.0%";
  const sign = value > 0 ? "+" : "-";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

export function formatAddress(address: string): string {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatAge(fromMs: number | string, nowMs: number = Date.now()): string {
  const from = typeof fromMs === "string" ? new Date(fromMs).getTime() : fromMs;
  const seconds = Math.max(0, Math.floor((nowMs - from) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export function formatIstClock(isoOrMs: string | number): string {
  const date = typeof isoOrMs === "number" ? new Date(isoOrMs) : new Date(isoOrMs);
  const clock = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${clock} IST`;
}
