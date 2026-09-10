import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { v as Navigate, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { r as signOut } from "./client-DUtYoQbQ.mjs";
import { t as authMiddleware } from "./middleware-DjDsd_o6.mjs";
import { i as hasGateSessionMarker } from "./server-4Ikmh438.mjs";
import { r as createSsrRpc } from "./router-D8RBeSqb.mjs";
import { a as cn, c as useCurrentUser, i as PageShell, l as useCurrentUserState, s as isUnauthorized } from "./page-shell-CS_yLYFU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-console-6lwJnp0Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function AuthGate({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-28 rounded-control bg-rule/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-36 rounded-control bg-rule/60" })]
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function Segmented({ value, onChange, options, ariaLabel }) {
	const index = Math.max(0, options.findIndex((option) => option.value === value));
	const count = options.length || 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "tablist",
		"aria-label": ariaLabel,
		className: "relative grid h-12 rounded-control border border-rule p-0.5",
		style: { gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": "true",
			className: "absolute top-0.5 bottom-0.5 rounded-md bg-ink transition-transform duration-toggle ease-out",
			style: {
				width: `calc(${100 / count}% - 4px)`,
				transform: `translateX(${index * 100}%)`
			}
		}), options.map((option) => {
			const active = option.value === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "tab",
				"aria-selected": active,
				onClick: () => onChange(option.value),
				className: cn("relative z-10 text-body transition-colors duration-toggle", active ? "text-paper" : "text-ink"),
				children: option.label
			}, option.value);
		})]
	});
}
var getConsole = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9a241826f410d6c97e8f8aa31b37aa3a3904dfcdba8b9492555d3f1ea502587a"));
var setBotRunning = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("1cdde33ff4cc87838c2a19c0c76aa18159485af92f319ab735f740174cd6722e"));
var setTradeMode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => ({ mode: data.mode === "manual" ? "manual" : "auto" })).handler(createSsrRpc("9b18f0a8a8a7d9bea12d1f17138136898faafb84c322bb5778a5342d11e0258c"));
var sellNow = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("4994a724898755a86ebb6b410a2f92f2bb2522c75bae4d9c0b78f183459e4d04"));
var buyDetected = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("5d70328604575b96a11f16abf35ce11bd0d8a273cae08ca798e2732489b7cfc5"));
var updateSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("b74cd31f618b05dc817e53c86ba15f2308aa960773121835ee74fd462908635f"));
var removeChat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => ({ id: Number(data.id) })).handler(createSsrRpc("411a885cc2e07ac2cf6b42489215d8c463b52d740b58816504240cb54178a68c"));
var KEY = ["console"];
function useConsole() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: KEY,
		queryFn: () => getConsole(),
		refetchInterval: 2e3
	});
	(0, import_react.useEffect)(() => {
		if (!query.error || !isUnauthorized(query.error)) return;
		navigate({
			to: "/login",
			search: { expired: true }
		});
	}, [navigate, query.error]);
	const apply = (snapshot) => {
		queryClient.setQueryData(KEY, snapshot);
	};
	const running = useMutation({
		mutationFn: (next) => setBotRunning({ data: { running: next } }),
		onSuccess: apply
	});
	const mode = useMutation({
		mutationFn: (next) => setTradeMode({ data: { mode: next } }),
		onSuccess: apply
	});
	const sell = useMutation({
		mutationFn: () => sellNow(),
		onSuccess: apply
	});
	const buy = useMutation({
		mutationFn: () => buyDetected(),
		onSuccess: apply
	});
	const settings = useMutation({
		mutationFn: (patch) => updateSettings({ data: patch }),
		onSuccess: apply
	});
	const chat = useMutation({
		mutationFn: (id) => removeChat({ data: { id } }),
		onSuccess: apply
	});
	const connected = !query.isError || isUnauthorized(query.error);
	return {
		snapshot: query.data ?? null,
		isPending: query.isPending,
		connected,
		setRunning: running.mutate,
		setMode: mode.mutate,
		sellNow: sell.mutate,
		buyDetected: buy.mutate,
		updateSettings: settings.mutate,
		removeChat: chat.mutate,
		saving: settings.isPending
	};
}
//#endregion
export { useConsole as i, Segmented as n, UserButton as r, AuthGate as t };
