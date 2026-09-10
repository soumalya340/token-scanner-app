import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { SettingsView } from "@/components/settings-view";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <AuthGate>
      <SettingsView />
    </AuthGate>
  );
}
