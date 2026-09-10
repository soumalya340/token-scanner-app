import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Field, FillButton, inputClass, PageShell } from "@/components/page-shell";
import { setMockSession, useMockSession } from "@/lib/mock-session";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    expired:
      search.expired === true ||
      search.expired === 1 ||
      search.expired === "1" ||
      search.expired === "true",
  }),
  component: LoginPage,
});

function LoginPage() {
  const { expired } = Route.useSearch();
  const { session, isPending } = useMockSession();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (isPending) {
    return (
      <PageShell className="flex min-h-dvh flex-col justify-center py-12">
        <h1 className="text-status font-medium">Token scanner</h1>
        <div className="mt-10 space-y-5" aria-hidden="true">
          <div className="h-5 w-20 rounded-control bg-rule/70" />
          <div className="h-12 rounded-control bg-rule/50" />
          <div className="h-5 w-20 rounded-control bg-rule/70" />
          <div className="h-12 rounded-control bg-rule/50" />
          <div className="h-12 rounded-control bg-rule/80" />
        </div>
      </PageShell>
    );
  }

  if (session) return <Navigate to="/" />;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const name = username.trim();
    if (!name || !password) return;
    setMockSession(name);
    void navigate({ to: "/" });
  }

  return (
    <PageShell className="flex min-h-dvh flex-col justify-center py-12">
      <h1 className="text-status font-medium">Token scanner</h1>
      {expired ? (
        <p className="mt-6 text-meta text-muted">Session expired. Sign in again.</p>
      ) : null}
      <form onSubmit={onSubmit} className={expired ? "mt-6 space-y-5" : "mt-10 space-y-5"}>
        <Field id="username" label="Username">
          <input
            id="username"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="password" label="Password">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </Field>
        <FillButton type="submit" disabled={!username.trim() || !password}>
          Sign in
        </FillButton>
      </form>
    </PageShell>
  );
}
