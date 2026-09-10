import { inTimerWindow } from "./format";
import type { PendingAction, TradeMode } from "./console-types";

export const MOONCAT_ADDRESS = "0x7a3f8c91d04e2ab3f6c8e4a19d0b7c5e0000e21b";
export const ETH_USD = 3360;
export const PENDING_MS = 1600;

const TOKEN_NAMES = [
  "MOONCAT",
  "FROGE",
  "CHONK",
  "GIGA",
  "PEPU",
  "WIF2",
  "MEOWFI",
  "BONKAI",
  "NIBBLE",
  "SPARK",
  "DRIFT",
  "PUMPLO",
  "RIBBIT",
  "YELL",
  "SNOUT",
];

export type SimDetected = {
  name: string;
  address: string;
  detectedAt: number;
  graduated: boolean;
  ageMinutes: number;
};

export type SimPosition = {
  name: string;
  address: string;
  boughtAt: number;
  entryEth: number;
  peakEth: number;
};

export type SimPending = {
  action: PendingAction;
  hash: string;
  startedAt: number;
  name: string;
  address: string;
  amountEth: number;
};

export type SimState = {
  running: boolean;
  runningSince: number | null;
  stoppedSince: number | null;
  mode: TradeMode;
  tradeAmountEth: number;
  trailingStopPct: number;
  dailyTimerOn: boolean;
  dailyTimerStart: string;
  dailyTimerEnd: string;
  graduatedApproval: boolean;
  tokenAgeMinutes: number;
  maxTradePct: number;
  pollingSeconds: number;
  walletEth: number;
  ethUsd: number;
  detected: SimDetected | null;
  position: SimPosition | null;
  pending: SimPending | null;
  lastError: string | null;
  salt: string;
};

export function hash32(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function toAddress(a: number, b: number): string {
  const hex = (a.toString(16) + b.toString(16) + "0000000000000000000000000000000000000000").slice(0, 40);
  return `0x${hex}`;
}

function toTxHash(input: string): string {
  const a = hash32(input).toString(16).padStart(8, "0");
  const b = hash32(`${input}:b`).toString(16).padStart(8, "0");
  const c = hash32(`${input}:c`).toString(16).padStart(8, "0");
  const d = hash32(`${input}:d`).toString(16).padStart(8, "0");
  return `0x${a}${b}${c}${d}${a}${b}${c}${d}`.slice(0, 66);
}

export function positionValue(position: SimPosition, now: number): number {
  const elapsed = Math.max(0, (now - position.boughtAt) / 1000);
  const seed = hash32(position.address) / 4294967296;
  const trend = 1 + 0.5 * (1 - Math.exp(-elapsed / 180));
  const waveAmp = 1 - Math.exp(-elapsed / 15);
  const wave =
    waveAmp *
    (0.05 * Math.sin(elapsed / 11 + seed * Math.PI * 2) +
      0.025 * Math.sin(elapsed / 4.5 + seed * Math.PI * 4));
  const multiplier = Math.max(0.12, trend * (1 + wave));
  return position.entryEth * multiplier;
}

export function passesFilters(
  token: SimDetected,
  state: Pick<SimState, "graduatedApproval" | "tokenAgeMinutes">,
): boolean {
  if (token.graduated && !state.graduatedApproval) return false;
  if (token.ageMinutes > state.tokenAgeMinutes) return false;
  return true;
}

export function tradeSize(state: SimState): number {
  const cap = state.walletEth * (state.maxTradePct / 100);
  return Math.min(state.tradeAmountEth, cap);
}

function makeToken(salt: string, now: number, offset: number): SimDetected {
  const h = hash32(`${salt}:${Math.floor(now / 1000)}:${offset}`);
  const name = TOKEN_NAMES[h % TOKEN_NAMES.length] ?? "MOONCAT";
  const address = toAddress(h, hash32(`${name}:${offset}:${salt}`));
  return {
    name,
    address,
    detectedAt: now,
    graduated: h % 10 < 3,
    ageMinutes: 1 + (h % 18),
  };
}

function detectToken(state: SimState, now: number): SimDetected | null {
  for (let offset = 0; offset < 12; offset += 1) {
    const token = makeToken(state.salt, now, offset);
    if (state.position && token.address === state.position.address) continue;
    if (state.detected && token.address === state.detected.address) continue;
    if (!passesFilters(token, state)) continue;
    return token;
  }
  return null;
}

function applyTimer(state: SimState, now: number): SimState {
  if (!state.dailyTimerOn) return state;
  const shouldRun = inTimerWindow(now, state.dailyTimerStart, state.dailyTimerEnd);
  if (shouldRun && !state.running) {
    return {
      ...state,
      running: true,
      runningSince: now,
      stoppedSince: null,
    };
  }
  if (!shouldRun && state.running) {
    return {
      ...state,
      running: false,
      stoppedSince: now,
    };
  }
  return state;
}

function completePending(state: SimState, now: number): SimState {
  const pending = state.pending;
  if (!pending) return state;
  if (now - pending.startedAt < PENDING_MS) return state;

  if (pending.action === "buy") {
    const amount = Math.min(pending.amountEth, state.walletEth);
    if (amount < 0.0001) {
      return {
        ...state,
        pending: null,
        lastError: "Buy failed: wallet balance is below the trade amount.",
      };
    }
    return {
      ...state,
      pending: null,
      lastError: null,
      walletEth: state.walletEth - amount,
      position: {
        name: pending.name,
        address: pending.address,
        boughtAt: now,
        entryEth: amount,
        peakEth: amount,
      },
    };
  }

  const proceeds = state.position
    ? positionValue(state.position, now)
    : pending.amountEth;
  return {
    ...state,
    pending: null,
    lastError: null,
    walletEth: state.walletEth + Math.max(0, proceeds),
    position: null,
  };
}

function maybeDetect(state: SimState, now: number, force: boolean): SimState {
  if (!state.running || state.pending) return state;
  const interval = Math.max(2, state.pollingSeconds) * 1000;
  const due =
    force || !state.detected || now - state.detected.detectedAt >= interval;
  if (!due) return state;
  const token = detectToken(state, now);
  if (!token) return state;
  return { ...state, detected: token };
}

function maybeAutoBuy(state: SimState, now: number): SimState {
  if (!state.running || state.mode !== "auto") return state;
  if (state.position || state.pending || !state.detected) return state;
  if (!passesFilters(state.detected, state)) return state;
  const amount = tradeSize(state);
  if (amount < 0.0001) {
    return {
      ...state,
      lastError: "Buy failed: wallet balance is below the trade amount.",
    };
  }
  return {
    ...state,
    lastError: null,
    pending: {
      action: "buy",
      hash: toTxHash(`${state.salt}:buy:${now}:${state.detected.address}`),
      startedAt: now,
      name: state.detected.name,
      address: state.detected.address,
      amountEth: amount,
    },
  };
}

function updatePeakAndStop(state: SimState, now: number): SimState {
  if (!state.position || state.pending) return state;
  const current = positionValue(state.position, now);
  const peak = Math.max(state.position.peakEth, current);
  const next: SimState = {
    ...state,
    position: { ...state.position, peakEth: peak },
  };
  const drop = peak <= 0 ? 0 : (peak - current) / peak;
  if (drop >= next.trailingStopPct / 100) {
    return {
      ...next,
      lastError: null,
      pending: {
        action: "sell",
        hash: toTxHash(`${state.salt}:stop:${now}:${state.position.address}`),
        startedAt: now,
        name: state.position.name,
        address: state.position.address,
        amountEth: current,
      },
    };
  }
  return next;
}

export function tick(state: SimState, now: number, opts?: { forceDetect?: boolean }): SimState {
  let next = applyTimer(state, now);
  const pendingBefore = next.pending;
  next = completePending(next, now);
  const justSold =
    pendingBefore?.action === "sell" && !next.pending && !next.position;
  next = updatePeakAndStop(next, now);
  next = maybeDetect(next, now, Boolean(opts?.forceDetect));
  if (!justSold) next = maybeAutoBuy(next, now);
  return next;
}

export function startPendingBuy(state: SimState, now: number): SimState {
  if (state.position) return { ...state, lastError: "A position is already open." };
  if (state.pending) return state;
  if (!state.detected) return { ...state, lastError: "Nothing detected yet." };
  if (!passesFilters(state.detected, state)) {
    return { ...state, lastError: "Buy failed: token is older than the age limit." };
  }
  const amount = tradeSize(state);
  if (amount < 0.0001) {
    return { ...state, lastError: "Buy failed: wallet balance is below the trade amount." };
  }
  return {
    ...state,
    lastError: null,
    pending: {
      action: "buy",
      hash: toTxHash(`${state.salt}:buy:${now}:${state.detected.address}`),
      startedAt: now,
      name: state.detected.name,
      address: state.detected.address,
      amountEth: amount,
    },
  };
}

export function startPendingSell(state: SimState, now: number): SimState {
  if (!state.position) return { ...state, lastError: "No open position." };
  if (state.pending) return state;
  const current = positionValue(state.position, now);
  return {
    ...state,
    lastError: null,
    pending: {
      action: "sell",
      hash: toTxHash(`${state.salt}:sell:${now}:${state.position.address}`),
      startedAt: now,
      name: state.position.name,
      address: state.position.address,
      amountEth: current,
    },
  };
}

export function seedState(salt: string, now: number): SimState {
  const boughtAt = now - 4 * 60 * 1000;
  const entryEth = 0.8;
  const position: SimPosition = {
    name: "MOONCAT",
    address: MOONCAT_ADDRESS,
    boughtAt,
    entryEth,
    peakEth: entryEth,
  };
  const current = positionValue(position, now);
  return {
    running: true,
    runningSince: boughtAt,
    stoppedSince: null,
    mode: "auto",
    tradeAmountEth: 0.8,
    trailingStopPct: 15,
    dailyTimerOn: false,
    dailyTimerStart: "09:30",
    dailyTimerEnd: "17:00",
    graduatedApproval: false,
    tokenAgeMinutes: 10,
    maxTradePct: 80,
    pollingSeconds: 8,
    walletEth: 1.284,
    ethUsd: ETH_USD,
    detected: {
      name: "MOONCAT",
      address: MOONCAT_ADDRESS,
      detectedAt: boughtAt,
      graduated: false,
      ageMinutes: 6,
    },
    position: { ...position, peakEth: Math.max(entryEth, current) },
    pending: null,
    lastError: null,
    salt,
  };
}
