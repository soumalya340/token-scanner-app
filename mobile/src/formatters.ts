export function formatAddress(address?: string): string {
  if (!address) return "—";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatEth(value?: number): string {
  if (value === undefined || value === null || !Number.isFinite(value)) return "0.00";
  return value.toFixed(4);
}

export function formatUsd(value?: number): string {
  if (value === undefined || value === null || !Number.isFinite(value)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value?: number): string {
  if (value === undefined || value === null || !Number.isFinite(value)) return "0.0%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatClockIst(isoOrTimestamp: string | number): string {
  try {
    const d = new Date(isoOrTimestamp);
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Kolkata",
      hour12: false,
    }).format(d);
  } catch {
    return String(isoOrTimestamp);
  }
}

export function formatAge(pastIso: string): string {
  try {
    const past = new Date(pastIso).getTime();
    const diffSec = Math.max(0, Math.floor((Date.now() - past) / 1000));
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours}h ago`;
  } catch {
    return "just now";
  }
}
