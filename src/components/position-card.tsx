import { useEffect, useRef, useState } from "react";
import { CopyAddress } from "@/components/copy-address";
import { formatAddress, formatAge, formatEth, formatPct, formatUsd } from "@/lib/format";
import { positionValue, type SimPosition } from "@/lib/console-sim";
import type { ConsoleSnapshot } from "@/lib/console-types";
import { cn } from "@/lib/utils";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useCountUp(target: number, play: boolean): number {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(play && !reduced ? 0 : target);

  useEffect(() => {
    if (!play || reduced) {
      setValue(target);
      return;
    }
    setValue(0);
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 400);
      setValue(target * p);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [play, reduced, target]);

  return value;
}

export function PositionCard({
  snapshot,
  now,
  onSell,
}: {
  snapshot: ConsoleSnapshot;
  now: number;
  onSell: () => void;
}) {
  const position = snapshot.position;
  const boot = useRef(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (boot.current) {
      boot.current = false;
      return;
    }
    if (position) {
      setAnimating(true);
      const id = window.setTimeout(() => setAnimating(false), 420);
      return () => window.clearTimeout(id);
    }
    setAnimating(false);
  }, [position?.address]);

  const sim: SimPosition | null = position
    ? {
        name: position.name,
        address: position.address,
        boughtAt: new Date(position.boughtAt).getTime(),
        entryEth: position.entryEth,
        peakEth: position.peakEth,
      }
    : null;
  const currentEth = sim ? positionValue(sim, now) : 0;
  const entryEth = position?.entryEth ?? 0;
  const pnlEth = currentEth - entryEth;
  const pnlPct = entryEth === 0 ? 0 : (pnlEth / entryEth) * 100;
  const shownPct = useCountUp(pnlPct, animating);
  const shownEth = useCountUp(pnlEth, animating);

  if (!position || !sim) return null;

  const positive = shownPct >= 0;
  const tone = positive ? "text-gain" : "text-loss";
  const selling = snapshot.pending?.action === "sell";
  const buying = snapshot.pending?.action === "buy";

  return (
    <article
      className={cn(
        "rounded-card border border-rule px-4 py-5",
        animating && "position-enter",
      )}
    >
      <p className="text-body text-ink">Holding {position.name}</p>
      <CopyAddress address={position.address} className="mt-1" />

      <p
        className={cn(
          "mt-6 text-pnl font-semibold tracking-pnl transition-colors duration-pnl",
          tone,
        )}
        aria-live="polite"
      >
        {formatPct(shownPct)}
      </p>
      <p className={cn("mt-2 text-value transition-colors duration-pnl", tone)}>
        {formatEth(shownEth)} ETH · {formatUsd(shownEth * snapshot.ethUsd)}
      </p>

      <p className="mt-6 text-meta text-muted">
        Bought {formatAge(sim.boughtAt, now)}
      </p>

      <button
        type="button"
        disabled={selling || buying}
        onClick={onSell}
        className={cn(
          "mt-4 h-12 w-full rounded-control border border-loss text-body text-loss",
          "transition-transform duration-150 ease-out active:not-disabled:scale-[0.96]",
          "disabled:opacity-40",
        )}
      >
        {selling ? "Selling" : "Sell now"}
      </button>

      {selling && snapshot.pending ? (
        <p className="mt-2 text-meta text-muted">{formatAddress(snapshot.pending.hash)}</p>
      ) : null}
      {snapshot.lastError ? (
        <p className="mt-2 text-meta text-loss">{snapshot.lastError}</p>
      ) : null}
    </article>
  );
}
