//#region node_modules/.nitro/vite/services/ssr/assets/console-sim-Cz0Hb492.js
var IST = "Asia/Kolkata";
function formatEth(value) {
	return value.toFixed(4);
}
function formatUsd(value) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value);
}
function formatPct(value) {
	if (Object.is(value, 0) || Math.abs(value) < .05) return "0.0%";
	return `${value > 0 ? "+" : "-"}${Math.abs(value).toFixed(1)}%`;
}
function formatAddress(address) {
	if (address.length < 12) return address;
	return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
function formatAge(fromMs, nowMs) {
	const seconds = Math.max(0, Math.floor((nowMs - fromMs) / 1e3));
	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 48) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
	const days = Math.floor(hours / 24);
	return days === 1 ? "1 day ago" : `${days} days ago`;
}
function formatIstClock(isoOrMs) {
	const date = typeof isoOrMs === "number" ? new Date(isoOrMs) : new Date(isoOrMs);
	return `${new Intl.DateTimeFormat("en-GB", {
		timeZone: IST,
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	}).format(date)} IST`;
}
function istMinutes(nowMs) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: IST,
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	}).formatToParts(new Date(nowMs));
	const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
	const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
	return hour * 60 + minute;
}
function parseHhMm(value) {
	const [hours, minutes] = value.split(":").map((part) => Number(part));
	if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
	return hours * 60 + minutes;
}
function inTimerWindow(nowMs, start, end) {
	const now = istMinutes(nowMs);
	const startMin = parseHhMm(start);
	const endMin = parseHhMm(end);
	if (startMin === endMin) return true;
	if (startMin < endMin) return now >= startMin && now < endMin;
	return now >= startMin || now < endMin;
}
function isHhMm(value) {
	return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
var MOONCAT_ADDRESS = "0x7a3f8c91d04e2ab3f6c8e4a19d0b7c5e0000e21b";
var ETH_USD = 3360;
var TOKEN_NAMES = [
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
	"SNOUT"
];
function hash32(input) {
	let hash = 2166136261;
	for (let i = 0; i < input.length; i += 1) {
		hash ^= input.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}
function toAddress(a, b) {
	return `0x${(a.toString(16) + b.toString(16) + "0000000000000000000000000000000000000000").slice(0, 40)}`;
}
function toTxHash(input) {
	const a = hash32(input).toString(16).padStart(8, "0");
	const b = hash32(`${input}:b`).toString(16).padStart(8, "0");
	const c = hash32(`${input}:c`).toString(16).padStart(8, "0");
	const d = hash32(`${input}:d`).toString(16).padStart(8, "0");
	return `0x${a}${b}${c}${d}${a}${b}${c}${d}`.slice(0, 66);
}
function positionValue(position, now) {
	const elapsed = Math.max(0, (now - position.boughtAt) / 1e3);
	const seed = hash32(position.address) / 4294967296;
	const trend = 1 + .5 * (1 - Math.exp(-elapsed / 180));
	const wave = (1 - Math.exp(-elapsed / 15)) * (.05 * Math.sin(elapsed / 11 + seed * Math.PI * 2) + .025 * Math.sin(elapsed / 4.5 + seed * Math.PI * 4));
	const multiplier = Math.max(.12, trend * (1 + wave));
	return position.entryEth * multiplier;
}
function passesFilters(token, state) {
	if (token.graduated && !state.graduatedApproval) return false;
	if (token.ageMinutes > state.tokenAgeMinutes) return false;
	return true;
}
function tradeSize(state) {
	const cap = state.walletEth * (state.maxTradePct / 100);
	return Math.min(state.tradeAmountEth, cap);
}
function makeToken(salt, now, offset) {
	const h = hash32(`${salt}:${Math.floor(now / 1e3)}:${offset}`);
	const name = TOKEN_NAMES[h % TOKEN_NAMES.length] ?? "MOONCAT";
	return {
		name,
		address: toAddress(h, hash32(`${name}:${offset}:${salt}`)),
		detectedAt: now,
		graduated: h % 10 < 3,
		ageMinutes: 1 + h % 18
	};
}
function detectToken(state, now) {
	for (let offset = 0; offset < 12; offset += 1) {
		const token = makeToken(state.salt, now, offset);
		if (state.position && token.address === state.position.address) continue;
		if (state.detected && token.address === state.detected.address) continue;
		if (!passesFilters(token, state)) continue;
		return token;
	}
	return null;
}
function applyTimer(state, now) {
	if (!state.dailyTimerOn) return state;
	const shouldRun = inTimerWindow(now, state.dailyTimerStart, state.dailyTimerEnd);
	if (shouldRun && !state.running) return {
		...state,
		running: true,
		runningSince: now,
		stoppedSince: null
	};
	if (!shouldRun && state.running) return {
		...state,
		running: false,
		stoppedSince: now
	};
	return state;
}
function completePending(state, now) {
	const pending = state.pending;
	if (!pending) return state;
	if (now - pending.startedAt < 1600) return state;
	if (pending.action === "buy") {
		const amount = Math.min(pending.amountEth, state.walletEth);
		if (amount < 1e-4) return {
			...state,
			pending: null,
			lastError: "Buy failed: wallet balance is below the trade amount."
		};
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
				peakEth: amount
			}
		};
	}
	const proceeds = state.position ? positionValue(state.position, now) : pending.amountEth;
	return {
		...state,
		pending: null,
		lastError: null,
		walletEth: state.walletEth + Math.max(0, proceeds),
		position: null
	};
}
function maybeDetect(state, now, force) {
	if (!state.running || state.pending) return state;
	const interval = Math.max(2, state.pollingSeconds) * 1e3;
	if (!(force || !state.detected || now - state.detected.detectedAt >= interval)) return state;
	const token = detectToken(state, now);
	if (!token) return state;
	return {
		...state,
		detected: token
	};
}
function maybeAutoBuy(state, now) {
	if (!state.running || state.mode !== "auto") return state;
	if (state.position || state.pending || !state.detected) return state;
	if (!passesFilters(state.detected, state)) return state;
	const amount = tradeSize(state);
	if (amount < 1e-4) return {
		...state,
		lastError: "Buy failed: wallet balance is below the trade amount."
	};
	return {
		...state,
		lastError: null,
		pending: {
			action: "buy",
			hash: toTxHash(`${state.salt}:buy:${now}:${state.detected.address}`),
			startedAt: now,
			name: state.detected.name,
			address: state.detected.address,
			amountEth: amount
		}
	};
}
function updatePeakAndStop(state, now) {
	if (!state.position || state.pending) return state;
	const current = positionValue(state.position, now);
	const peak = Math.max(state.position.peakEth, current);
	const next = {
		...state,
		position: {
			...state.position,
			peakEth: peak
		}
	};
	if ((peak <= 0 ? 0 : (peak - current) / peak) >= next.trailingStopPct / 100) return {
		...next,
		lastError: null,
		pending: {
			action: "sell",
			hash: toTxHash(`${state.salt}:stop:${now}:${state.position.address}`),
			startedAt: now,
			name: state.position.name,
			address: state.position.address,
			amountEth: current
		}
	};
	return next;
}
function tick(state, now, opts) {
	let next = applyTimer(state, now);
	const pendingBefore = next.pending;
	next = completePending(next, now);
	const justSold = pendingBefore?.action === "sell" && !next.pending && !next.position;
	next = updatePeakAndStop(next, now);
	next = maybeDetect(next, now, Boolean(opts?.forceDetect));
	if (!justSold) next = maybeAutoBuy(next, now);
	return next;
}
function startPendingBuy(state, now) {
	if (state.position) return {
		...state,
		lastError: "A position is already open."
	};
	if (state.pending) return state;
	if (!state.detected) return {
		...state,
		lastError: "Nothing detected yet."
	};
	if (!passesFilters(state.detected, state)) return {
		...state,
		lastError: "Buy failed: token is older than the age limit."
	};
	const amount = tradeSize(state);
	if (amount < 1e-4) return {
		...state,
		lastError: "Buy failed: wallet balance is below the trade amount."
	};
	return {
		...state,
		lastError: null,
		pending: {
			action: "buy",
			hash: toTxHash(`${state.salt}:buy:${now}:${state.detected.address}`),
			startedAt: now,
			name: state.detected.name,
			address: state.detected.address,
			amountEth: amount
		}
	};
}
function startPendingSell(state, now) {
	if (!state.position) return {
		...state,
		lastError: "No open position."
	};
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
			amountEth: current
		}
	};
}
function seedState(salt, now) {
	const boughtAt = now - 24e4;
	const entryEth = .8;
	const position = {
		name: "MOONCAT",
		address: MOONCAT_ADDRESS,
		boughtAt,
		entryEth,
		peakEth: entryEth
	};
	const current = positionValue(position, now);
	return {
		running: true,
		runningSince: boughtAt,
		stoppedSince: null,
		mode: "auto",
		tradeAmountEth: .8,
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
			ageMinutes: 6
		},
		position: {
			...position,
			peakEth: Math.max(entryEth, current)
		},
		pending: null,
		lastError: null,
		salt
	};
}
//#endregion
export { formatPct as a, isHhMm as c, startPendingBuy as d, startPendingSell as f, formatIstClock as i, positionValue as l, formatAge as n, formatUsd as o, tick as p, formatEth as r, inTimerWindow as s, formatAddress as t, seedState as u };
