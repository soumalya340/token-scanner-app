import { useEffect, useState, type ReactNode } from "react";
import { FillButton, inputClass } from "@/components/page-shell";
import type { ConsoleSnapshot, SettingsPatch } from "@/lib/console-types";
import { formatEth } from "@/lib/format";
import { cn } from "@/lib/utils";

function Expand({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-expand ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div
        className="min-h-0 overflow-hidden"
        aria-hidden={!open}
        inert={!open}
      >
        {children}
      </div>
    </div>
  );
}

function ActionPair({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <FillButton onClick={onSave}>Save</FillButton>
      <button
        type="button"
        onClick={onCancel}
        className="h-12 w-full rounded-control border border-rule text-body text-ink"
      >
        Cancel
      </button>
    </div>
  );
}

export function ConfigRows({
  snapshot,
  onSave,
}: {
  snapshot: ConsoleSnapshot;
  onSave: (patch: SettingsPatch) => void;
}) {
  const [open, setOpen] = useState<"amount" | "stop" | "timer" | null>(null);
  const [amount, setAmount] = useState(String(snapshot.tradeAmountEth));
  const [stop, setStop] = useState(String(snapshot.trailingStopPct));
  const [timerOn, setTimerOn] = useState(snapshot.dailyTimerOn);
  const [start, setStart] = useState(snapshot.dailyTimerStart);
  const [end, setEnd] = useState(snapshot.dailyTimerEnd);

  useEffect(() => {
    if (open !== "amount") setAmount(String(snapshot.tradeAmountEth));
  }, [open, snapshot.tradeAmountEth]);
  useEffect(() => {
    if (open !== "stop") setStop(String(snapshot.trailingStopPct));
  }, [open, snapshot.trailingStopPct]);
  useEffect(() => {
    if (open !== "timer") {
      setTimerOn(snapshot.dailyTimerOn);
      setStart(snapshot.dailyTimerStart);
      setEnd(snapshot.dailyTimerEnd);
    }
  }, [open, snapshot.dailyTimerOn, snapshot.dailyTimerEnd, snapshot.dailyTimerStart]);

  const timerLabel = snapshot.dailyTimerOn
    ? `${snapshot.dailyTimerStart}–${snapshot.dailyTimerEnd}`
    : "Off";

  return (
    <div>
      <Row
        label="Trade amount"
        value={`${formatEth(snapshot.tradeAmountEth)} ETH`}
        open={open === "amount"}
        onToggle={() => setOpen(open === "amount" ? null : "amount")}
      >
        <div className="relative">
          <input
            className={cn(inputClass, "pr-14")}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label="Trade amount in ETH"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-meta text-muted">
            ETH
          </span>
        </div>
        <ActionPair
          onSave={() => {
            const n = Number(amount);
            if (Number.isFinite(n)) onSave({ tradeAmountEth: n });
            setOpen(null);
          }}
          onCancel={() => setOpen(null)}
        />
      </Row>

      <Row
        label="Trailing stop"
        value={`${Number(snapshot.trailingStopPct).toFixed(0)}%`}
        open={open === "stop"}
        onToggle={() => setOpen(open === "stop" ? null : "stop")}
      >
        <div className="relative">
          <input
            className={cn(inputClass, "pr-10")}
            inputMode="decimal"
            value={stop}
            onChange={(e) => setStop(e.target.value)}
            aria-label="Trailing stop percent"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-meta text-muted">
            %
          </span>
        </div>
        <ActionPair
          onSave={() => {
            const n = Number(stop);
            if (Number.isFinite(n)) onSave({ trailingStopPct: n });
            setOpen(null);
          }}
          onCancel={() => setOpen(null)}
        />
      </Row>

      <Row
        label="Daily timer"
        value={timerLabel}
        open={open === "timer"}
        last
        onToggle={() => setOpen(open === "timer" ? null : "timer")}
      >
        <button
          type="button"
          onClick={() => setTimerOn((v) => !v)}
          className="flex h-12 w-full items-center justify-between rounded-control border border-rule px-3 text-body"
        >
          <span className="text-muted">Timer</span>
          <span className="text-ink">{timerOn ? "On" : "Off"}</span>
        </button>
        {timerOn ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-meta text-muted">Starts</span>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-meta text-muted">Ends</span>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        ) : null}
        {timerOn ? <p className="mt-2 text-meta text-muted">IST</p> : null}
        <ActionPair
          onSave={() => {
            onSave({
              dailyTimerOn: timerOn,
              dailyTimerStart: start,
              dailyTimerEnd: end,
            });
            setOpen(null);
          }}
          onCancel={() => setOpen(null)}
        />
      </Row>
    </div>
  );
}

function Row({
  label,
  value,
  open,
  onToggle,
  last,
  children,
}: {
  label: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn(!last && "border-b border-rule")}>
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left"
      >
        <span className="text-body text-muted">{label}</span>
        <span className="text-body text-ink">{value}</span>
      </button>
      <Expand open={open}>
        <div className="pb-4">{children}</div>
      </Expand>
    </div>
  );
}
