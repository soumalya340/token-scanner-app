import { Check, Copy, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { CopyAddress } from "@/components/copy-address";
import type { ConsoleSnapshot } from "@/lib/console-types";
import { formatAddress, formatAge, formatEth, formatIstClock } from "@/lib/format";

export function LastCoinDetails({
  snapshot,
  now,
}: {
  snapshot: ConsoleSnapshot;
  now: number;
}) {
  const [copiedFull, setCopiedFull] = useState(false);

  // If a coin is detected, use it; otherwise if a position is open, use the position's coin
  const coin = snapshot.detected
    ? {
        name: snapshot.detected.name,
        address: snapshot.detected.address,
        time: new Date(snapshot.detected.detectedAt).getTime(),
        graduated: snapshot.detected.graduated,
        ageMinutes: snapshot.detected.ageMinutes,
        source: "detected" as const,
      }
    : snapshot.position
      ? {
          name: snapshot.position.name,
          address: snapshot.position.address,
          time: new Date(snapshot.position.boughtAt).getTime(),
          graduated: snapshot.graduatedApproval,
          ageMinutes: Math.max(1, Math.floor((now - new Date(snapshot.position.boughtAt).getTime()) / 60000)),
          source: "position" as const,
        }
      : null;

  const maxTradeEth = (snapshot.walletEth * snapshot.maxTradePct) / 100;
  const tradeSizeEth = Math.min(snapshot.tradeAmountEth, maxTradeEth);

  const copyFullAddress = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 1500);
    } catch {
      setCopiedFull(false);
    }
  };

  return (
    <section className="space-y-4" aria-labelledby="last-coin-heading">
      <div className="flex items-center justify-between">
        <h2 id="last-coin-heading" className="text-body font-medium text-muted">
          Last coin details
        </h2>
        {coin ? (
          <span
            className={
              coin.graduated
                ? "inline-flex items-center gap-1 rounded-full border border-rule px-2 py-0.5 text-meta text-gain"
                : "inline-flex items-center gap-1 rounded-full border border-rule px-2 py-0.5 text-meta text-muted"
            }
          >
            {coin.graduated ? (
              <>
                <ShieldCheck className="size-3.5" />
                Graduated
              </>
            ) : (
              <>
                <ShieldAlert className="size-3.5" />
                Curve Active
              </>
            )}
          </span>
        ) : null}
      </div>

      {coin ? (
        <div className="rounded-card border border-rule p-4 space-y-4">
          {/* Top Identity Row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-section font-medium text-ink">{coin.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <CopyAddress address={coin.address} />
                <button
                  type="button"
                  onClick={() => copyFullAddress(coin.address)}
                  className="text-meta text-muted hover:text-ink inline-flex items-center gap-1 transition-colors"
                  aria-label="Copy full contract address"
                >
                  {copiedFull ? (
                    <>
                      <Check className="size-3 text-gain" />
                      <span className="text-gain">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Full</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <span className="text-meta text-muted whitespace-nowrap">
              {formatAge(coin.time, now)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-rule text-meta">
            <div>
              <p className="text-muted">Detected time</p>
              <p className="mt-0.5 font-medium text-ink">{formatIstClock(coin.time)}</p>
            </div>

            <div>
              <p className="text-muted">Age at detection</p>
              <p className="mt-0.5 font-medium text-ink">
                {coin.ageMinutes}m{" "}
                <span className="text-muted font-normal">
                  (≤ {snapshot.tokenAgeMinutes}m limit)
                </span>
              </p>
            </div>

            <div>
              <p className="text-muted">Target allocation</p>
              <p className="mt-0.5 font-medium text-ink">
                {formatEth(tradeSizeEth)} ETH{" "}
                <span className="text-muted font-normal">
                  ({snapshot.maxTradePct}% cap)
                </span>
              </p>
            </div>

            <div>
              <p className="text-muted">Status</p>
              <p className="mt-0.5 font-medium text-ink">
                {coin.source === "position"
                  ? "Open Position"
                  : snapshot.mode === "auto"
                    ? "Auto-selected"
                    : "Manual Review"}
              </p>
            </div>
          </div>

          {/* Verification & Filter Footnote */}
          <div className="rounded-control bg-paper px-3 py-2 text-meta text-muted flex items-center justify-between">
            <span>
              {coin.graduated
                ? snapshot.graduatedApproval
                  ? "✓ Allowed by graduated policy"
                  : "⚠ Graduated filter active"
                : "✓ Pre-graduation bonding curve"}
            </span>
            <span className="font-mono text-[11px] text-muted">
              {formatAddress(coin.address)}
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-card border border-rule p-5 text-center">
          <p className="text-body font-medium text-ink">No coin detected yet</p>
          <p className="mt-1 text-meta text-muted">
            The scanner is active and polling DEX pairs every {snapshot.pollingSeconds}s. Newly
            discovered tokens and validation details will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
