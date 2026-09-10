import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as useRouter, v as Navigate, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-DUtYoQbQ.mjs";
import { n as Route$2 } from "./router-D8RBeSqb.mjs";
import { i as PageShell, l as useCurrentUserState, n as FillButton, o as inputClass, t as Field } from "./page-shell-CS_yLYFU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BB3rdYHg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toEmail(username) {
	const trimmed = username.trim();
	if (trimmed.includes("@")) return trimmed.toLowerCase();
	return `${trimmed.toLowerCase()}@tokenscanner.app`;
}
function LoginPage() {
	const { expired } = Route$2.useSearch();
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const router = useRouter();
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "flex min-h-dvh flex-col justify-center py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-status font-medium",
			children: "Token scanner"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 space-y-5",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-20 rounded-control bg-rule/70" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 rounded-control bg-rule/50" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-20 rounded-control bg-rule/70" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 rounded-control bg-rule/50" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 rounded-control bg-rule/80" })
			]
		})]
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onSubmit(event) {
		event.preventDefault();
		setError(false);
		setSubmitting(true);
		const email = toEmail(username);
		const name = username.trim().includes("@") ? username.trim().split("@")[0] : username.trim();
		try {
			if (!(await authClient.signIn.email({
				email,
				password
			})).error) {
				await router.invalidate();
				await navigate({ to: "/" });
				return;
			}
			if ((await authClient.signUp.email({
				email,
				password,
				name: name || "Trader"
			})).error) {
				setError(true);
				setSubmitting(false);
				return;
			}
			await router.invalidate();
			await navigate({ to: "/" });
		} catch {
			setError(true);
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "flex min-h-dvh flex-col justify-center py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-status font-medium",
				children: "Token scanner"
			}),
			expired ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-meta text-muted",
				children: "Session expired. Sign in again."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: expired ? "mt-6 space-y-5" : "mt-10 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "username",
						label: "Username",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "username",
							name: "username",
							autoComplete: "username",
							autoCapitalize: "none",
							autoCorrect: "off",
							spellCheck: false,
							value: username,
							onChange: (e) => setUsername(e.target.value),
							className: inputClass
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "password",
						label: "Password",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "password",
							name: "password",
							type: "password",
							autoComplete: "current-password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							className: inputClass
						})
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-meta text-loss",
						children: "Invalid username or password."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FillButton, {
						type: "submit",
						disabled: submitting || !username || !password,
						children: submitting ? "Signing in" : "Sign in"
					})
				]
			})
		]
	});
}
//#endregion
export { LoginPage as component };
