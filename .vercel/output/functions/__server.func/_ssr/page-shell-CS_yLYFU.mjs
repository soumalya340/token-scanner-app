import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as authClient } from "./client-DUtYoQbQ.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-shell-CS_yLYFU.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function isUnauthorized(error) {
	if (!error || typeof error !== "object") return false;
	const message = "message" in error ? String(error.message) : "";
	return message === "Unauthorized" || message.includes("Unauthorized");
}
function PageShell({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mx-auto w-full max-w-column px-5 py-8", className),
			children
		})
	});
}
function Hairline() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-8 border-0 border-t border-rule" });
}
function FillButton({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("h-12 w-full rounded-control bg-ink text-body text-paper transition-transform duration-150 ease-out", "active:not-disabled:scale-[0.96] disabled:opacity-40", className),
		...props,
		children
	});
}
function Field({ id, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		htmlFor: id,
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-2 block text-meta text-muted",
			children: label
		}), children]
	});
}
var inputClass = "h-12 w-full rounded-control border border-rule bg-paper px-3 text-body text-ink outline-none placeholder:text-muted";
//#endregion
export { cn as a, useCurrentUser as c, PageShell as i, useCurrentUserState as l, FillButton as n, inputClass as o, Hairline as r, isUnauthorized as s, Field as t };
