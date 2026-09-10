import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfigRows } from "@/components/config-rows";
import { CopyAddress } from "@/components/copy-address";
import { Hairline, PageShell, FillButton } from "@/components/page-shell";
import { PositionCard } from "@/components/position-card";
import { Segmented } from "@/components/segmented";
import { formatAddress, formatAge, formatEth, formatIstClock, formatUsd } from "@/lib/format";
import type { ConsoleSnapshot } from "@/lib/console-types";
import { useConsole } from "@/lib/use-console";

function statusCaption(snapshot: ConsoleSnapshot): string {
  if (snapshot.running && snapshot.runningSince) {
    return `since ${formatIstClock(snapshot.runningSince)}`;
  }
  if (!snapshot.running && snapshot.stoppedSince) {
    return `since ${formatIstClock(snapshot.stoppedSince)}`;
  }
  return snapshot.running ? "since just now" : "since just now";
}

function StatusHeader({
  snapshot,
  connected,
}: {
  snapshot: ConsoleSnapshot | null;
  connected: boolean;
}) {
  const running = snapshot?.running ?? false;
  return (
    <header>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={running ? "text-status font-medium text-gain" : "text-status font-medium text-muted"}>
            {snapshot ? (running ? "Running" : "Stopped") : "…"}
          </p>
          <p className="mt-1 text-meta text-muted">
            {snapshot ? statusCaption(snapshot) : " "}
          </p>
        </div>
        <Link
          to="/settings"
          aria-label="Settings"
          className="grid size-11 place-items-center text-ink"
        >
          <Settings className="size-6" strokeWidth={1.75} />
        </Link>
      </div>
      {!connected ? (
        <p className="mt-4 rounded-control border border-rule px-3 py-3 text-meta text-ink">
          Not connected. Values may be out of date.
        </p>
      ) : null}
    </header>
  );
}

export function TradingView() {
  const consoleState = useConsole();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  const snapshot = consoleState.snapshot;

  return (
    <PageShell>
      <StatusHeader snapshot={snapshot} connected={consoleState.connected} />

      {snapshot?.position ? (
        <div className="mt-8">
          <PositionCard
            snapshot={snapshot}
            now={now}
            onSell={() => consoleState.sellNow()}
          />
        </div>
      ) : (
        <p className="mt-8 text-body text-muted">No open position.</p>
      )}

      {snapshot && !snapshot.position && snapshot.lastError ? (
        <p className="mt-3 text-meta text-loss">{snapshot.lastError}</p>
      ) : null}

      <Hairline />

      <section>
        <p className="mb-3 text-body text-muted">Mode</p>
        <Segmented
          ariaLabel="Trading mode"
          value={snapshot?.mode ?? "auto"}
          onChange={(mode) => consoleState.setMode(mode)}
          options={[
            { value: "auto", label: "Auto" },
            { value: "manual", label: "Manual" },
          ]}
        />
        {snapshot?.mode === "manual" && snapshot.detected && !snapshot.position ? (
          <div className="mt-4">
            <FillButton
              disabled={snapshot.pending?.action === "buy"}
              onClick={() => consoleState.buyDetected()}
            >
              {snapshot.pending?.action === "buy" ? "Buying" : `Buy ${snapshot.detected.name}`}
            </FillButton>
            {snapshot.pending?.action === "buy" ? (
              <p className="mt-2 text-meta text-muted">{formatAddress(snapshot.pending.hash)}</p>
            ) : null}
          </div>
        ) : null}
        <div className="mt-4">
          <FillButton
            disabled={!snapshot || snapshot.dailyTimerOn}
            onClick={() => consoleState.setRunning(!(snapshot?.running ?? false))}
          >
            {snapshot?.running ? "Stop bot" : "Start bot"}
          </FillButton>
          {snapshot?.dailyTimerOn ? (
            <p className="mt-2 text-meta text-muted">
              Timer controls the bot. Turn it off in settings to start manually.
            </p>
          ) : null}
        </div>
      </section>

      <Hairline />

      {snapshot ? (
        <ConfigRows snapshot={snapshot} onSave={(patch) => consoleState.updateSettings(patch)} />
      ) : null}

      <Hairline />

      <section className="space-y-6">
        <div>
          <p className="text-body text-muted">Latest detected</p>
          {snapshot?.detected ? (
            <>
              <p className="mt-1 text-section font-medium text-ink">
                {snapshot.detected.name} · {formatAge(new Date(snapshot.detected.detectedAt).getTime(), now)}
              </p>
              <CopyAddress address={snapshot.detected.address} className="mt-1 block" />
            </>
          ) : (
            <p className="mt-1 text-section font-medium text-muted">Nothing detected yet</p>
          )}
        </div>
        <div>
          <p className="text-body text-muted">Wallet</p>
          <p className="mt-1 text-section font-medium text-ink">
            {snapshot ? (
              <>
                {formatEth(snapshot.walletEth)} ETH · {formatUsd(snapshot.walletEth * snapshot.ethUsd)}
              </>
            ) : (
              "—"
            )}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
