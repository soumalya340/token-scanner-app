import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-CQJdNnE0.mjs";
import { t as authMiddleware } from "./middleware-DjDsd_o6.mjs";
import { c as isHhMm, d as startPendingBuy, f as startPendingSell, p as tick, s as inTimerWindow, u as seedState } from "./console-sim-Cz0Hb492.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/console-api-BaB0TCEW.js
function num(value, fallback = 0) {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : fallback;
}
function bool(value) {
	return Boolean(value);
}
function ms(value) {
	if (!value) return null;
	const t = value instanceof Date ? value.getTime() : new Date(value).getTime();
	return Number.isFinite(t) ? t : null;
}
function iso(value) {
	if (value === null) return null;
	return new Date(value).toISOString();
}
function rowToSim(row) {
	const detectedAt = ms(row.detected_at);
	const boughtAt = ms(row.position_bought_at);
	const pendingAt = ms(row.pending_at);
	const position = row.position_name && row.position_address && boughtAt ? {
		name: row.position_name,
		address: row.position_address,
		boughtAt,
		entryEth: num(row.position_entry_eth),
		peakEth: num(row.position_peak_eth, num(row.position_entry_eth))
	} : null;
	const pending = row.pending_action && row.pending_hash && pendingAt ? {
		action: row.pending_action === "sell" ? "sell" : "buy",
		hash: row.pending_hash,
		startedAt: pendingAt,
		name: row.pending_name ?? "",
		address: row.pending_address ?? "",
		amountEth: num(row.pending_amount_eth)
	} : null;
	return {
		running: bool(row.running),
		runningSince: ms(row.running_since),
		stoppedSince: ms(row.stopped_since),
		mode: row.mode === "manual" ? "manual" : "auto",
		tradeAmountEth: num(row.trade_amount_eth, .8),
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
		detected: row.detected_name && row.detected_address && detectedAt ? {
			name: row.detected_name,
			address: row.detected_address,
			detectedAt,
			graduated: bool(row.detected_graduated),
			ageMinutes: Math.round(num(row.detected_age_minutes, 1))
		} : null,
		position,
		pending,
		lastError: row.last_error,
		salt: row.user_id
	};
}
function toSnapshot(state, chats, now) {
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
		detected: state.detected ? {
			name: state.detected.name,
			address: state.detected.address,
			detectedAt: new Date(state.detected.detectedAt).toISOString(),
			graduated: state.detected.graduated,
			ageMinutes: state.detected.ageMinutes
		} : null,
		position: state.position ? {
			name: state.position.name,
			address: state.position.address,
			boughtAt: new Date(state.position.boughtAt).toISOString(),
			entryEth: state.position.entryEth,
			peakEth: state.position.peakEth
		} : null,
		pending: state.pending ? {
			action: state.pending.action,
			hash: state.pending.hash,
			startedAt: new Date(state.pending.startedAt).toISOString(),
			name: state.pending.name,
			address: state.pending.address,
			amountEth: state.pending.amountEth
		} : null,
		lastError: state.lastError,
		chats,
		inTimerWindow: inTimerWindow(now, state.dailyTimerStart, state.dailyTimerEnd)
	};
}
async function loadChats(userId) {
	return (await (await getSql())`
    select id, name, chat_id from telegram_chats
    where user_id = ${userId}
    order by id asc
  `).map((row) => ({
		id: num(row.id),
		name: row.name,
		chatId: row.chat_id
	}));
}
async function saveState(userId, state) {
	await (await getSql())`
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
async function insertSeed(userId, now) {
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
	if (((await sql`
    select count(*)::int as n from telegram_chats where user_id = ${userId}
  `)[0]?.n ?? 0) === 0) await sql`
      insert into telegram_chats (user_id, chat_id, name) values
        (${userId}, 'alpha-desk', 'Alpha desk'),
        (${userId}, '847291304', null)
    `;
}
async function loadRow(userId) {
	return (await (await getSql())`select * from consoles where user_id = ${userId}`)[0];
}
async function loadOrSeed(userId, now) {
	let row = await loadRow(userId);
	if (!row) {
		await insertSeed(userId, now);
		row = await loadRow(userId);
	}
	if (!row) throw new Error("Console could not be created.");
	return rowToSim(row);
}
var writeChains = /* @__PURE__ */ new Map();
function enqueueWrite(userId, fn) {
	const next = (writeChains.get(userId) ?? Promise.resolve()).then(fn, fn);
	writeChains.set(userId, next.then(() => void 0, () => void 0));
	return next;
}
async function snapshotFor(userId, mutate) {
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
var getConsole_createServerFn_handler = createServerRpc({
	id: "9a241826f410d6c97e8f8aa31b37aa3a3904dfcdba8b9492555d3f1ea502587a",
	name: "getConsole",
	filename: "src/lib/console-api.ts"
}, (opts) => getConsole.__executeServer(opts));
var getConsole = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getConsole_createServerFn_handler, async ({ context }) => {
	return snapshotFor(context.userId);
});
var setBotRunning_createServerFn_handler = createServerRpc({
	id: "1cdde33ff4cc87838c2a19c0c76aa18159485af92f319ab735f740174cd6722e",
	name: "setBotRunning",
	filename: "src/lib/console-api.ts"
}, (opts) => setBotRunning.__executeServer(opts));
var setBotRunning = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(setBotRunning_createServerFn_handler, async ({ context, data }) => {
	return snapshotFor(context.userId, (state, now) => {
		if (state.dailyTimerOn) return state;
		if (data.running === state.running) return state;
		if (data.running) return tick({
			...state,
			running: true,
			runningSince: now,
			stoppedSince: null,
			lastError: null
		}, now, { forceDetect: true });
		return {
			...state,
			running: false,
			stoppedSince: now
		};
	});
});
var setTradeMode_createServerFn_handler = createServerRpc({
	id: "9b18f0a8a8a7d9bea12d1f17138136898faafb84c322bb5778a5342d11e0258c",
	name: "setTradeMode",
	filename: "src/lib/console-api.ts"
}, (opts) => setTradeMode.__executeServer(opts));
var setTradeMode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => ({ mode: data.mode === "manual" ? "manual" : "auto" })).handler(setTradeMode_createServerFn_handler, async ({ context, data }) => {
	return snapshotFor(context.userId, (state) => ({
		...state,
		mode: data.mode
	}));
});
var sellNow_createServerFn_handler = createServerRpc({
	id: "4994a724898755a86ebb6b410a2f92f2bb2522c75bae4d9c0b78f183459e4d04",
	name: "sellNow",
	filename: "src/lib/console-api.ts"
}, (opts) => sellNow.__executeServer(opts));
var sellNow = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(sellNow_createServerFn_handler, async ({ context }) => {
	return snapshotFor(context.userId, (state, now) => startPendingSell(state, now));
});
var buyDetected_createServerFn_handler = createServerRpc({
	id: "5d70328604575b96a11f16abf35ce11bd0d8a273cae08ca798e2732489b7cfc5",
	name: "buyDetected",
	filename: "src/lib/console-api.ts"
}, (opts) => buyDetected.__executeServer(opts));
var buyDetected = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(buyDetected_createServerFn_handler, async ({ context }) => {
	return snapshotFor(context.userId, (state, now) => startPendingBuy(state, now));
});
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
var updateSettings_createServerFn_handler = createServerRpc({
	id: "b74cd31f618b05dc817e53c86ba15f2308aa960773121835ee74fd462908635f",
	name: "updateSettings",
	filename: "src/lib/console-api.ts"
}, (opts) => updateSettings.__executeServer(opts));
var updateSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateSettings_createServerFn_handler, async ({ context, data }) => {
	return snapshotFor(context.userId, (state) => {
		const next = { ...state };
		if (data.tradeAmountEth !== void 0) next.tradeAmountEth = clamp(data.tradeAmountEth, 1e-4, 100);
		if (data.trailingStopPct !== void 0) next.trailingStopPct = clamp(data.trailingStopPct, 1, 90);
		if (data.dailyTimerOn !== void 0) next.dailyTimerOn = data.dailyTimerOn;
		if (data.dailyTimerStart !== void 0 && isHhMm(data.dailyTimerStart)) next.dailyTimerStart = data.dailyTimerStart;
		if (data.dailyTimerEnd !== void 0 && isHhMm(data.dailyTimerEnd)) next.dailyTimerEnd = data.dailyTimerEnd;
		if (data.graduatedApproval !== void 0) next.graduatedApproval = data.graduatedApproval;
		if (data.tokenAgeMinutes !== void 0) next.tokenAgeMinutes = Math.round(clamp(data.tokenAgeMinutes, 1, 1440));
		if (data.maxTradePct !== void 0) next.maxTradePct = clamp(data.maxTradePct, 1, 100);
		if (data.pollingSeconds !== void 0) next.pollingSeconds = Math.round(clamp(data.pollingSeconds, 2, 120));
		return next;
	});
});
var removeChat_createServerFn_handler = createServerRpc({
	id: "411a885cc2e07ac2cf6b42489215d8c463b52d740b58816504240cb54178a68c",
	name: "removeChat",
	filename: "src/lib/console-api.ts"
}, (opts) => removeChat.__executeServer(opts));
var removeChat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => ({ id: Number(data.id) })).handler(removeChat_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`delete from telegram_chats where id = ${data.id} and user_id = ${context.userId}`;
	return snapshotFor(context.userId);
});
//#endregion
export { buyDetected_createServerFn_handler, getConsole_createServerFn_handler, removeChat_createServerFn_handler, sellNow_createServerFn_handler, setBotRunning_createServerFn_handler, setTradeMode_createServerFn_handler, updateSettings_createServerFn_handler };
