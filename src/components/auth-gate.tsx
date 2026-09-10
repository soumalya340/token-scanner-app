import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useMockSession } from "@/lib/mock-session";
import { PageShell } from "./page-shell";

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, isPending } = useMockSession();
  if (isPending) {
    return (
      <PageShell>
        <div className="space-y-2" aria-hidden="true">
          <div className="h-7 w-28 rounded-control bg-rule/80" />
          <div className="h-5 w-36 rounded-control bg-rule/60" />
        </div>
      </PageShell>
    );
  }
  if (!session) return <Navigate to="/login" search={{ expired: false }} />;
  return <>{children}</>;
}
