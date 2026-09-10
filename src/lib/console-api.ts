import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import type {
  ConsoleSnapshot,
  SettingsPatch,
  TelegramChat,
  TradeMode,
} from "./console-types";
import {
  seedState,
  startPendingBuy,
  startPendingSell,
  tick,
  type SimPending,
  type SimPosition,
  type SimState,
} from "./console-sim";
import { inTimerWindow, isHhMm } from "./format";

type ConsoleRow = {
  user_id: string;
  running: boolean;
  running_since: string | Date | null;
  stopped_since: string | Date | null;
  mode: string;
  trade_amount_eth: number | string;
  trailing_stop_pct: number | string;
  daily_timer_on: boolean;
  daily_timer_start: string;
  daily_timer_end: string;
  graduated_approval: boolean;
  token_age_minutes: number | string;
  max_trade_pct: number | string;
  polling_seconds: number | string;
  wallet_eth: number | string;
  eth_usd: number | string;
  detected_name: string | null;
  detected_address: string | null;
  detected_at: string | Date | null;
  detected_graduated: boolean | null;
  detected_age_minutes: number | string | null;
  position_name: string | null;
  position_address: string | null;
  position_bought_at: string | Date | null;
  position_entry_eth: number | string | null;
  position_peak_eth: number | string | null;
  pending_action: string | null;
  pending_hash: string | null;
  pending_at: string | Date | null;
  pending_name: string | null;
  pending_address: string | null;
  pending_amount_eth: number | string | null;
  last_error: string | null;
};

type ChatRow = {
  id: number;
  name: string | null;
  chat_id: string;
};

function num(value: number | string | null | undefined, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function bool(value: boolean | null | undefined): boolean {
  return Boolean(value);
}

function ms(value: string | Date | null | undefined): number | null {
  if (!value) return null;
  const t = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(t) ? t : null;
}

function iso(value: number | null): string | null {
  if (value === null) return null;
  return new Date(value).toISOString();
}

function rowToSim(row: ConsoleRow): SimState {
  const detectedAt = ms(row.detected_at);
  const boughtAt = ms(row.position_bought_at);
  const pendingAt = ms(row.pending_at);
  const position: SimPosition | null =
    row.position_name && row.position_address && boughtAt
      ? {
          name: row.position_name,
          address: row.position_address,
          boughtAt,
          entryEth: num(row.position_entry_eth),
          peakEth: num(row.position_peak_eth, num(row.position_entry_eth)),
        }
      : null;
  const pending: SimPending | null =
    row.pending_action && row.pending_hash && pendingAt
      ? {
          action: row.pending_action === "sell" ? "sell" : "buy",
          hash: row.pending_hash,
          startedAt: pendingAt,
          name: row.pending_name ?? "",
          address: row.pending_address ?? "",
          amountEth: num(row.pending_amount_eth),
        }
      : null;
  return {
    running: bool(row.running),
    runningSince: ms(row.running_since),
    stoppedSince: ms(row.stopped_since),
    mode: row.mode === "manual" ? "manual" : "auto",
    tradeAmountEth: num(row.trade_amount_eth, 0.8),
    trailingStopPct: num(row.trailing_stop_pct, 15),
    dailyTimerOn: bool(row.daily_timer_on),
    dailyTimerStart: row.daily_timer_start || "09:30",
    dailyTimerEnd: row.daily_timer_end || "17:00",
    graduatedApproval: bool(row.graduated_approval),
    tokenAgeMinutes: Math.round(num(row.token_age_minutes, 10)),
    maxTradePct: num(row.max_trade_pct, 80),
    pollingSeconds: Math.round(num(row.polling_seconds, 8)),
    walletEth: num(row.wallet_eth, 1.284),
    ethUsd: num(row.eth_usd, 3360),
    detected:
      row.detected_name && row.detected_address && detectedAt
        ? {
            name: row.detected_name,
            address: row.detected_address,
            detectedAt,
            graduated: bool(row.detected_graduated),
            ageMinutes: Math.round(num(row.detected_age_minutes, 1)),
          }
        : null,
    position,
    pending,
    lastError: row.last_error,
    salt: row.user_id,
  };
}

function toSnapshot(state: SimState, chats: TelegramChat[], now: number): ConsoleSnapshot {
  return {
    running: state.running,
    runningSince: iso(state.runningSince),
    stoppedSince: iso(state.stoppedSince),
    mode: state.mode,
    tradeAmountEth: state.tradeAmountEth,
    trailingStopPct: state.trailingStopPct,
    dailyTimerOn: state.dailyTimerOn,
    dailyTimerStart: state.dailyTimerStart,
    dailyTimerEnd: state.dailyTimerEnd,
    graduatedApproval: state.graduatedApproval,
    tokenAgeMinutes: state.tokenAgeMinutes,
    maxTradePct: state.maxTradePct,
    pollingSeconds: state.pollingSeconds,
    walletEth: state.walletEth,
    ethUsd: state.ethUsd,
    detected: state.detected
      ? {
          name: state.detected.name,
          address: state.detected.address,
          detectedAt: new Date(state.detected.detectedAt).toISOString(),
          graduated: state.detected.graduated,
          ageMinutes: state.detected.ageMinutes,
        }
      : null,
    position: state.position
      ? {
          name: state.position.name,
          address: state.position.address,
          boughtAt: new Date(state.position.boughtAt).toISOString(),
          entryEth: state.position.entryEth,
          peakEth: state.position.peakEth,
        }
      : null,
    pending: state.pending
      ? {
          action: state.pending.action,
          hash: state.pending.hash,
          startedAt: new Date(state.pending.startedAt).toISOString(),
          name: state.pending.name,
          address: state.pending.address,
          amountEth: state.pending.amountEth,
        }
      : null,
    lastError: state.lastError,
    chats,
    inTimerWindow: inTimerWindow(now, state.dailyTimerStart, state.dailyTimerEnd),
  };
}

async function loadChats(userId: string): Promise<TelegramChat[]> {
  const sql = await getSql();
  const rows = await sql<ChatRow>`
    select id, name, chat_id from telegram_chats
    where user_id = ${userId}
    order by id asc
  `;
  return rows.map((row) => ({
    id: num(row.id),
    name: row.name,
    chatId: row.chat_id,
  }));
}

async function saveState(userId: string, state: SimState): Promise<void> {
  const sql = await getSql();
  await sql`
    update consoles set
      running = ${state.running},
      running_since = ${iso(state.runningSince)},
      stopped_since = ${iso(state.stoppedSince)},
      mode = ${state.mode},
      trade_amount_eth = ${state.tradeAmountEth},
      trailing_stop_pct = ${state.trailingStopPct},
      daily_timer_on = ${state.dailyTimerOn},
      daily_timer_start = ${state.dailyTimerStart},
      daily_timer_end = ${state.dailyTimerEnd},
      graduated_approval = ${state.graduatedApproval},
      token_age_minutes = ${state.tokenAgeMinutes},
      max_trade_pct = ${state.maxTradePct},
      polling_seconds = ${state.pollingSeconds},
      wallet_eth = ${state.walletEth},
      eth_usd = ${state.ethUsd},
      detected_name = ${state.detected?.name ?? null},
      detected_address = ${state.detected?.address ?? null},
      detected_at = ${state.detected ? iso(state.detected.detectedAt) : null},
      detected_graduated = ${state.detected?.graduated ?? null},
      detected_age_minutes = ${state.detected?.ageMinutes ?? null},
      position_name = ${state.position?.name ?? null},
      position_address = ${state.position?.address ?? null},
      position_bought_at = ${state.position ? iso(state.position.boughtAt) : null},
      position_entry_eth = ${state.position?.entryEth ?? null},
      position_peak_eth = ${state.position?.peakEth ?? null},
      pending_action = ${state.pending?.action ?? null},
      pending_hash = ${state.pending?.hash ?? null},
      pending_at = ${state.pending ? iso(state.pending.startedAt) : null},
      pending_name = ${state.pending?.name ?? null},
      pending_address = ${state.pending?.address ?? null},
      pending_amount_eth = ${state.pending?.amountEth ?? null},
      last_error = ${state.lastError}
    where user_id = ${userId}
  `;
}

async function insertSeed(userId: string, now: number): Promise<void> {
  const sql = await getSql();
  const state = seedState(userId, now);
  await sql`
    insert into consoles (
      user_id, running, running_since, stopped_since, mode,
      trade_amount_eth, trailing_stop_pct, daily_timer_on, daily_timer_start, daily_timer_end,
      graduated_approval, token_age_minutes, max_trade_pct, polling_seconds,
      wallet_eth, eth_usd,
      detected_name, detected_address, detected_at, detected_graduated, detected_age_minutes,
      position_name, position_address, position_bought_at, position_entry_eth, position_peak_eth,
      last_error
    ) values (
      ${userId}, ${state.running}, ${iso(state.runningSince)}, ${iso(state.stoppedSince)}, ${state.mode},
      ${state.tradeAmountEth}, ${state.trailingStopPct}, ${state.dailyTimerOn}, ${state.dailyTimerStart}, ${state.dailyTimerEnd},
      ${state.graduatedApproval}, ${state.tokenAgeMinutes}, ${state.maxTradePct}, ${state.pollingSeconds},
      ${state.walletEth}, ${state.ethUsd},
      ${state.detected?.name ?? null}, ${state.detected?.address ?? null}, ${state.detected ? new Date(state.detected.detectedAt).toISOString() : null}, ${state.detected?.graduated ?? null}, ${state.detected?.ageMinutes ?? null},
      ${state.position?.name ?? null}, ${state.position?.address ?? null}, ${state.position ? new Date(state.position.boughtAt).toISOString() : null}, ${state.position?.entryEth ?? null}, ${state.position?.peakEth ?? null},
      ${state.lastError}
    )
    on conflict (user_id) do nothing
  `;
  const existing = await sql<{ n: number }>`
    select count(*)::int as n from telegram_chats where user_id = ${userId}
  `;
  if ((existing[0]?.n ?? 0) === 0) {
    await sql`
      insert into telegram_chats (user_id, chat_id, name) values
        (${userId}, 'alpha-desk', 'Alpha desk'),
        (${userId}, '847291304', null)
    `;
  }
}

async function loadRow(userId: string): Promise<ConsoleRow | undefined> {
  const sql = await getSql();
  const rows = await sql<ConsoleRow>`select * from consoles where user_id = ${userId}`;
  return rows[0];
}

async function loadOrSeed(userId: string, now: number): Promise<SimState> {
  let row = await loadRow(userId);
  if (!row) {
    await insertSeed(userId, now);
    row = await loadRow(userId);
  }
  if (!row) throw new Error("Console could not be created.");
  return rowToSim(row);
}

const writeChains = new Map<string, Promise<unknown>>();

function enqueueWrite<T>(userId: string, fn: () => Promise<T>): Promise<T> {
  const previous = writeChains.get(userId) ?? Promise.resolve();
  const next = previous.then(fn, fn);
  writeChains.set(
    userId,
    next.then(
      () => undefined,
      () => undefined,
    ),
  );
  return next;
}

async function snapshotFor(userId: string, mutate?: (state: SimState, now: number) => SimState) {
  return enqueueWrite(userId, async () => {
    const now = Date.now();
    let state = await loadOrSeed(userId, now);
    state = tick(state, now);
    if (mutate) state = mutate(state, now);
    await saveState(userId, state);
    const chats = await loadChats(userId);
    return toSnapshot(state, chats, now);
  });
}

const CONSOLE_USER = "console";

export const getConsole = createServerFn({ method: "GET" }).handler(
  async (): Promise<ConsoleSnapshot> => {
    return snapshotFor(CONSOLE_USER);
  },
);

export const setBotRunning = createServerFn({ method: "POST" })
  .validator((data: { running: boolean }) => data)
  .handler(async ({ data }): Promise<ConsoleSnapshot> => {
    return snapshotFor(CONSOLE_USER, (state, now) => {
      if (state.dailyTimerOn) return state;
      if (data.running === state.running) return state;
      if (data.running) {
        return tick(
          {
            ...state,
            running: true,
            runningSince: now,
            stoppedSince: null,
            lastError: null,
          },
          now,
          { forceDetect: true },
        );
      }
      return {
        ...state,
        running: false,
        stoppedSince: now,
      };
    });
  });

export const setTradeMode = createServerFn({ method: "POST" })
  .validator((data: { mode: TradeMode }) => ({
    mode: data.mode === "manual" ? "manual" : "auto",
  }))
  .handler(async ({ data }): Promise<ConsoleSnapshot> => {
    return snapshotFor(CONSOLE_USER, (state) => ({ ...state, mode: data.mode as TradeMode }));
  });

export const sellNow = createServerFn({ method: "POST" }).handler(
  async (): Promise<ConsoleSnapshot> => {
    return snapshotFor(CONSOLE_USER, (state, now) => startPendingSell(state, now));
  },
);

export const buyDetected = createServerFn({ method: "POST" }).handler(
  async (): Promise<ConsoleSnapshot> => {
    return snapshotFor(CONSOLE_USER, (state, now) => startPendingBuy(state, now));
  },
);

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const updateSettings = createServerFn({ method: "POST" })
  .validator((data: SettingsPatch) => data)
  .handler(async ({ data }): Promise<ConsoleSnapshot> => {
    return snapshotFor(CONSOLE_USER, (state) => {
      const next = { ...state };
      if (data.tradeAmountEth !== undefined) {
        next.tradeAmountEth = clamp(data.tradeAmountEth, 0.0001, 100);
      }
      if (data.trailingStopPct !== undefined) {
        next.trailingStopPct = clamp(data.trailingStopPct, 1, 90);
      }
      if (data.dailyTimerOn !== undefined) next.dailyTimerOn = data.dailyTimerOn;
      if (data.dailyTimerStart !== undefined && isHhMm(data.dailyTimerStart)) {
        next.dailyTimerStart = data.dailyTimerStart;
      }
      if (data.dailyTimerEnd !== undefined && isHhMm(data.dailyTimerEnd)) {
        next.dailyTimerEnd = data.dailyTimerEnd;
      }
      if (data.graduatedApproval !== undefined) next.graduatedApproval = data.graduatedApproval;
      if (data.tokenAgeMinutes !== undefined) {
        next.tokenAgeMinutes = Math.round(clamp(data.tokenAgeMinutes, 1, 1440));
      }
      if (data.maxTradePct !== undefined) {
        next.maxTradePct = clamp(data.maxTradePct, 1, 100);
      }
      if (data.pollingSeconds !== undefined) {
        next.pollingSeconds = Math.round(clamp(data.pollingSeconds, 2, 120));
      }
      return next;
    });
  });

export const removeChat = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => ({ id: Number(data.id) }))
  .handler(async ({ data }): Promise<ConsoleSnapshot> => {
    const sql = await getSql();
    await sql`delete from telegram_chats where id = ${data.id} and user_id = ${CONSOLE_USER}`;
    return snapshotFor(CONSOLE_USER);
  });
