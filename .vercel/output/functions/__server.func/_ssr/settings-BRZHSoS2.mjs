import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as ChevronLeft } from "../_libs/lucide-react.mjs";
import { a as cn, i as PageShell, o as inputClass } from "./page-shell-CS_yLYFU.mjs";
import { i as useConsole, n as Segmented, r as UserButton, t as AuthGate } from "./use-console-6lwJnp0Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BRZHSoS2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useFlash() {
	const [key, setKey] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!key) return;
		const id = window.setTimeout(() => setKey(null), 1200);
		return () => window.clearTimeout(id);
	}, [key]);
	return [key, setKey];
}
function Label({ text, saved }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 flex items-baseline justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-meta text-muted",
			children: text
		}), saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-meta text-muted",
			children: "Saved"
		}) : null]
	});
}
function SuffixInput({ suffix, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			...props,
			className: cn(inputClass, "pr-24")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute inset-y-0 right-3 flex items-center text-meta text-muted",
			children: suffix
		})]
	});
}
function SettingsFields({ snapshot, onSave }) {
	const [flash, setFlash] = useFlash();
	const [age, setAge] = (0, import_react.useState)(String(snapshot.tokenAgeMinutes));
	const [maxPct, setMaxPct] = (0, import_react.useState)(String(snapshot.maxTradePct));
	const [polling, setPolling] = (0, import_react.useState)(String(snapshot.pollingSeconds));
	const [start, setStart] = (0, import_react.useState)(snapshot.dailyTimerStart);
	const [end, setEnd] = (0, import_react.useState)(snapshot.dailyTimerEnd);
	(0, import_react.useEffect)(() => setAge(String(snapshot.tokenAgeMinutes)), [snapshot.tokenAgeMinutes]);
	(0, import_react.useEffect)(() => setMaxPct(String(snapshot.maxTradePct)), [snapshot.maxTradePct]);
	(0, import_react.useEffect)(() => setPolling(String(snapshot.pollingSeconds)), [snapshot.pollingSeconds]);
	(0, import_react.useEffect)(() => setStart(snapshot.dailyTimerStart), [snapshot.dailyTimerStart]);
	(0, import_react.useEffect)(() => setEnd(snapshot.dailyTimerEnd), [snapshot.dailyTimerEnd]);
	const persist = (patch, key) => {
		onSave(patch);
		setFlash(key);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					text: "Graduated coin approval",
					saved: flash === "graduated"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
					ariaLabel: "Graduated coin approval",
					value: snapshot.graduatedApproval ? "yes" : "no",
					onChange: (value) => persist({ graduatedApproval: value === "yes" }, "graduated"),
					options: [{
						value: "no",
						label: "No"
					}, {
						value: "yes",
						label: "Yes"
					}]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-meta text-muted",
					children: "If no, a token that has already graduated is skipped."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					text: "Token age",
					saved: flash === "age"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuffixInput, {
					suffix: "minutes",
					inputMode: "numeric",
					value: age,
					onChange: (e) => setAge(e.target.value),
					onBlur: () => {
						const n = Number(age);
						if (!Number.isFinite(n) || n === snapshot.tokenAgeMinutes) {
							setAge(String(snapshot.tokenAgeMinutes));
							return;
						}
						persist({ tokenAgeMinutes: n }, "age");
					},
					"aria-label": "Token age in minutes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-meta text-muted",
					children: "A token older than this is skipped, even if everything else passes."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					text: "ETH trade amount max percentage",
					saved: flash === "max"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuffixInput, {
					suffix: "%",
					inputMode: "decimal",
					value: maxPct,
					onChange: (e) => setMaxPct(e.target.value),
					onBlur: () => {
						const n = Number(maxPct);
						if (!Number.isFinite(n) || n === snapshot.maxTradePct) {
							setMaxPct(String(snapshot.maxTradePct));
							return;
						}
						persist({ maxTradePct: n }, "max");
					},
					"aria-label": "ETH trade amount max percentage"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-meta text-muted",
					children: "The bot will not spend more than this share of the wallet on a single trade."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					text: "Polling time",
					saved: flash === "polling"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuffixInput, {
					suffix: "seconds",
					inputMode: "numeric",
					value: polling,
					onChange: (e) => setPolling(e.target.value),
					onBlur: () => {
						const n = Number(polling);
						if (!Number.isFinite(n) || n === snapshot.pollingSeconds) {
							setPolling(String(snapshot.pollingSeconds));
							return;
						}
						persist({ pollingSeconds: n }, "polling");
					},
					"aria-label": "Polling time in seconds"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-meta text-muted",
					children: "How often the scanner looks for a new token."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					text: "Daily timer",
					saved: flash === "timer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => persist({ dailyTimerOn: !snapshot.dailyTimerOn }, "timer"),
					className: "flex h-12 w-full items-center justify-between rounded-control border border-rule px-3 text-body",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Timer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-ink",
						children: snapshot.dailyTimerOn ? "On" : "Off"
					})]
				}),
				snapshot.dailyTimerOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-2 block text-meta text-muted",
							children: "Starts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "time",
							value: start,
							onChange: (e) => setStart(e.target.value),
							onBlur: () => {
								if (start === snapshot.dailyTimerStart) return;
								persist({ dailyTimerStart: start }, "timer");
							},
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
							onBlur: () => {
								if (end === snapshot.dailyTimerEnd) return;
								persist({ dailyTimerEnd: end }, "timer");
							},
							className: inputClass
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-meta text-muted",
					children: "IST"
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-meta text-muted",
					children: "When on, the bot only runs between these times."
				})
			] })
		]
	});
}
function SettingsView() {
	const consoleState = useConsole();
	const snapshot = consoleState.snapshot;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/",
			className: "inline-flex min-h-11 items-center gap-1 text-body text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
				className: "size-5",
				strokeWidth: 1.75
			}), "Back"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-6 text-status font-medium",
			children: "Settings"
		}),
		snapshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsFields, {
				snapshot,
				onSave: (patch) => consoleState.updateSettings(patch)
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-meta text-muted",
					children: "Telegram notification chats"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-meta text-muted",
					children: "Anyone who starts a chat with the bot receives notifications. Remove a chat to stop sending to it."
				}),
				snapshot && snapshot.chats.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-body text-muted",
					children: "No chats yet."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: snapshot?.chats.map((chat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex min-h-11 items-center justify-between gap-4 border-b border-rule py-3 first:border-t",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-body text-ink",
						children: chat.name ?? chat.chatId
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => consoleState.removeChat(chat.id),
						className: "text-body text-ink",
						children: "Remove"
					})]
				}, chat.id)) })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
		})
	] });
}
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsView, {}) });
}
//#endregion
export { SettingsPage as component };
