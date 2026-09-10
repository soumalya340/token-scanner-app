import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { TradingView } from "@/components/trading-view";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AuthGate>
      <TradingView />
    </AuthGate>
  );
}
