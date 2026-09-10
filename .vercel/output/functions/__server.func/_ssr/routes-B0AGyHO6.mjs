import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatPct, i as formatIstClock, l as positionValue, n as formatAge, o as formatUsd, r as formatEth, t as formatAddress } from "./console-sim-Cz0Hb492.mjs";
import { n as Settings } from "../_libs/lucide-react.mjs";
import { a as cn, i as PageShell, n as FillButton, o as inputClass, r as Hairline } from "./page-shell-CS_yLYFU.mjs";
import { i as useConsole, n as Segmented, t as AuthGate } from "./use-console-6lwJnp0Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B0AGyHO6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Expand({ open, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid transition-[grid-template-rows] duration-expand ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 overflow-hidden",
			"aria-hidden": !open,
			inert: !open,
			children
		})
	});
}
function ActionPair({ onSave, onCancel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 grid grid-cols-2 gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FillButton, {
			onClick: onSave,
			children: "Save"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onCancel,
			className: "h-12 w-full rounded-control border border-rule text-body text-ink",
			children: "Cancel"
		})]
	});
}
function ConfigRows({ snapshot, onSave }) {
	const [open, setOpen] = (0, import_react.useState)(null);
	const [amount, setAmount] = (0, import_react.useState)(String(snapshot.tradeAmountEth));
	const [stop, setStop] = (0, import_react.useState)(String(snapshot.trailingStopPct));
	const [timerOn, setTimerOn] = (0, import_react.useState)(snapshot.dailyTimerOn);
	const [start, setStart] = (0, import_react.useState)(snapshot.dailyTimerStart);
	const [end, setEnd] = (0, import_react.useState)(snapshot.dailyTimerEnd);
	(0, import_react.useEffect)(() => {
		if (open !== "amount") setAmount(String(snapshot.tradeAmountEth));
	}, [open, snapshot.tradeAmountEth]);
	(0, import_react.useEffect)(() => {
		if (open !== "stop") setStop(String(snapshot.trailingStopPct));
	}, [open, snapshot.trailingStopPct]);
	(0, import_react.useEffect)(() => {
		if (open !== "timer") {
			setTimerOn(snapshot.dailyTimerOn);
			setStart(snapshot.dailyTimerStart);
			setEnd(snapshot.dailyTimerEnd);
		}
	}, [
		open,
		snapshot.dailyTimerOn,
		snapshot.dailyTimerEnd,
		snapshot.dailyTimerStart
	]);
	const timerLabel = snapshot.dailyTimerOn ? `${snapshot.dailyTimerStart}–${snapshot.dailyTimerEnd}` : "Off";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, {
			label: "Trade amount",
			value: `${formatEth(snapshot.tradeAmountEth)} ETH`,
			open: open === "amount",
			onToggle: () => setOpen(open === "amount" ? null : "amount"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: cn(inputClass, "pr-14"),
					inputMode: "decimal",
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					"aria-label": "Trade amount in ETH"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute inset-y-0 right-3 flex items-center text-meta text-muted",
					children: "ETH"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionPair, {
				onSave: () => {
					const n = Number(amount);
					if (Number.isFinite(n)) onSave({ tradeAmountEth: n });
					setOpen(null);
				},
				onCancel: () => setOpen(null)
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, {
			label: "Trailing stop",
			value: `${Number(snapshot.trailingStopPct).toFixed(0)}%`,
			open: open === "stop",
			onToggle: () => setOpen(open === "stop" ? null : "stop"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: cn(inputClass, "pr-10"),
					inputMode: "decimal",
					value: stop,
					onChange: (e) => setStop(e.target.value),
					"aria-label": "Trailing stop percent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute inset-y-0 right-3 flex items-center text-meta text-muted",
					children: "%"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionPair, {
				onSave: () => {
					const n = Number(stop);
					if (Number.isFinite(n)) onSave({ trailingStopPct: n });
					setOpen(null);
				},
				onCancel: () => setOpen(null)
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, {
			label: "Daily timer",
			value: timerLabel,
			open: open === "timer",
			last: true,
			onToggle: () => setOpen(open === "timer" ? null : "timer"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTimerOn((v) => !v),
					className: "flex h-12 w-full items-center justify-between rounded-control border border-rule px-3 text-body",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Timer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-ink",
						children: timerOn ? "On" : "Off"
					})]
				}),
				timerOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-2 block text-meta text-muted",
							children: "Starts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "time",
							value: start,
							onChange: (e) => setStart(e.target.value),
							className: inputClass
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-2 block text-meta text-muted",
							children: "Ends"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "time",
							value: end,
							onChange: (e) => setEnd(e.target.value),
							className: inputClass
						})]
					})]
				}) : null,
				timerOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-meta text-muted",
					children: "IST"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionPair, {
					onSave: () => {
						onSave({
							dailyTimerOn: timerOn,
							dailyTimerStart: start,
							dailyTimerEnd: end
						});
						setOpen(null);
					},
					onCancel: () => setOpen(null)
				})
			]
		})
	] });
}
function Row({ label, value, open, onToggle, last, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn(!last && "border-b border-rule"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onToggle,
			className: "flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-body text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-body text-ink",
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, {
			open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pb-4",
				children
			})
		})]
	});
}
function CopyAddress({ address, className }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!copied) return;
		const id = window.setTimeout(() => setCopied(false), 1400);
		return () => window.clearTimeout(id);
	}, [copied]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: async () => {
			try {
				await navigator.clipboard.writeText(address);
				setCopied(true);
			} catch {
				setCopied(false);
			}
		},
		className: cn("text-left text-meta text-muted", className),
		children: copied ? "Address copied" : formatAddress(address)
	});
}
function usePrefersReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduced(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);
	return reduced;
}
function useCountUp(target, play) {
	const reduced = usePrefersReducedMotion();
	const [value, setValue] = (0, import_react.useState)(play && !reduced ? 0 : target);
	(0, import_react.useEffect)(() => {
		if (!play || reduced) {
			setValue(target);
			return;
		}
		setValue(0);
		const start = performance.now();
		let raf = 0;
		const step = (now) => {
			const p = Math.min(1, (now - start) / 400);
			setValue(target * p);
			if (p < 1) raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [
		play,
		reduced,
		target
	]);
	return value;
}
function PositionCard({ snapshot, now, onSell }) {
	const position = snapshot.position;
	const boot = (0, import_react.useRef)(true);
	const [animating, setAnimating] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (boot.current) {
			boot.current = false;
			return;
		}
		if (position) {
			setAnimating(true);
			const id = window.setTimeout(() => setAnimating(false), 420);
			return () => window.clearTimeout(id);
		}
		setAnimating(false);
	}, [position?.address]);
	const sim = position ? {
		name: position.name,
		address: position.address,
		boughtAt: new Date(position.boughtAt).getTime(),
		entryEth: position.entryEth,
		peakEth: position.peakEth
	} : null;
	const currentEth = sim ? positionValue(sim, now) : 0;
	const entryEth = position?.entryEth ?? 0;
	const pnlEth = currentEth - entryEth;
	const shownPct = useCountUp(entryEth === 0 ? 0 : pnlEth / entryEth * 100, animating);
	const shownEth = useCountUp(pnlEth, animating);
	if (!position || !sim) return null;
	const tone = shownPct >= 0 ? "text-gain" : "text-loss";
	const selling = snapshot.pending?.action === "sell";
	const buying = snapshot.pending?.action === "buy";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("rounded-card border border-rule px-4 py-5", animating && "position-enter"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-body text-ink",
				children: ["Holding ", position.name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyAddress, {
				address: position.address,
				className: "mt-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-6 text-pnl font-semibold tracking-pnl transition-colors duration-pnl", tone),
				"aria-live": "polite",
				children: formatPct(shownPct)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cn("mt-2 text-value transition-colors duration-pnl", tone),
				children: [
					formatEth(shownEth),
					" ETH · ",
					formatUsd(shownEth * snapshot.ethUsd)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-meta text-muted",
				children: ["Bought ", formatAge(sim.boughtAt, now)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: selling || buying,
				onClick: onSell,
				className: cn("mt-4 h-12 w-full rounded-control border border-loss text-body text-loss", "transition-transform duration-150 ease-out active:not-disabled:scale-[0.96]", "disabled:opacity-40"),
				children: selling ? "Selling" : "Sell now"
			}),
			selling && snapshot.pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-meta text-muted",
				children: formatAddress(snapshot.pending.hash)
			}) : null,
			snapshot.lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-meta text-loss",
				children: snapshot.lastError
			}) : null
		]
	});
}
function statusCaption(snapshot) {
	if (snapshot.dailyTimerOn && !snapshot.running && !snapshot.inTimerWindow) return `starts ${snapshot.dailyTimerStart} IST`;
	if (snapshot.running && snapshot.runningSince) return `since ${formatIstClock(snapshot.runningSince)}`;
	if (!snapshot.running && snapshot.stoppedSince) return `since ${formatIstClock(snapshot.stoppedSince)}`;
	return snapshot.running ? "since just now" : "since just now";
}
function StatusHeader({ snapshot, connected }) {
	const running = snapshot?.running ?? false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: running ? "text-status font-medium text-gain" : "text-status font-medium text-muted",
			children: snapshot ? running ? "Running" : "Stopped" : "…"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-meta text-muted",
			children: snapshot ? statusCaption(snapshot) : " "
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/settings",
			"aria-label": "Settings",
			className: "grid size-11 place-items-center text-ink",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
				className: "size-6",
				strokeWidth: 1.75
			})
		})]
	}), !connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 rounded-control border border-rule px-3 py-3 text-meta text-ink",
		children: "Not connected. Values may be out of date."
	}) : null] });
}
function TradingView() {
	const consoleState = useConsole();
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNow(Date.now()), 250);
		return () => window.clearInterval(id);
	}, []);
	const snapshot = consoleState.snapshot;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusHeader, {
			snapshot,
			connected: consoleState.connected
		}),
		snapshot?.position ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PositionCard, {
				snapshot,
				now,
				onSell: () => consoleState.sellNow()
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-body text-muted",
			children: "No open position."
		}),
		snapshot && !snapshot.position && snapshot.lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-meta text-loss",
			children: snapshot.lastError
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hairline, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-body text-muted",
				children: "Mode"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
				ariaLabel: "Trading mode",
				value: snapshot?.mode ?? "auto",
				onChange: (mode) => consoleState.setMode(mode),
				options: [{
					value: "auto",
					label: "Auto"
				}, {
					value: "manual",
					label: "Manual"
				}]
			}),
			snapshot?.mode === "manual" && snapshot.detected && !snapshot.position ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FillButton, {
					disabled: snapshot.pending?.action === "buy",
					onClick: () => consoleState.buyDetected(),
					children: snapshot.pending?.action === "buy" ? "Buying" : `Buy ${snapshot.detected.name}`
				}), snapshot.pending?.action === "buy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-meta text-muted",
					children: formatAddress(snapshot.pending.hash)
				}) : null]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FillButton, {
					disabled: !snapshot || snapshot.dailyTimerOn,
					onClick: () => consoleState.setRunning(!(snapshot?.running ?? false)),
					children: snapshot?.running ? "Stop bot" : "Start bot"
				}), snapshot?.dailyTimerOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-meta text-muted",
					children: "Timer controls the bot. Turn it off in settings to start manually."
				}) : null]
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hairline, {}),
		snapshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigRows, {
			snapshot,
			onSave: (patch) => consoleState.updateSettings(patch)
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hairline, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-body text-muted",
				children: "Latest detected"
			}), snapshot?.detected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-section font-medium text-ink",
				children: [
					snapshot.detected.name,
					" · ",
					formatAge(new Date(snapshot.detected.detectedAt).getTime(), now)
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyAddress, {
				address: snapshot.detected.address,
				className: "mt-1 block"
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-section font-medium text-muted",
				children: "Nothing detected yet"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-body text-muted",
				children: "Wallet"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-section font-medium text-ink",
				children: snapshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					formatEth(snapshot.walletEth),
					" ETH · ",
					formatUsd(snapshot.walletEth * snapshot.ethUsd)
				] }) : "—"
			})] })]
		})
	] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradingView, {}) });
}
//#endregion
export { Home as component };
