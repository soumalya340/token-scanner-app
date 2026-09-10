import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState, type InputHTMLAttributes } from "react";
import { inputClass, PageShell } from "@/components/page-shell";
import { Segmented } from "@/components/segmented";
import type { ConsoleSnapshot, SettingsPatch } from "@/lib/console-types";
import { clearMockSession } from "@/lib/mock-session";
import { useConsole } from "@/lib/use-console";
import { cn } from "@/lib/utils";

function useFlash(): [string | null, (key: string) => void] {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    if (!key) return;
    const id = window.setTimeout(() => setKey(null), 1200);
    return () => window.clearTimeout(id);
  }, [key]);
  return [key, setKey];
}

function Label({
  text,
  saved,
}: {
  text: string;
  saved: boolean;
}) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <span className="text-meta text-muted">{text}</span>
      {saved ? <span className="text-meta text-muted">Saved</span> : null}
    </div>
  );
}

function SuffixInput({
  suffix,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { suffix: string }) {
  return (
    <div className="relative">
      <input {...props} className={cn(inputClass, "pr-24")} />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-meta text-muted">
        {suffix}
      </span>
    </div>
  );
}

function SettingsFields({
  snapshot,
  onSave,
}: {
  snapshot: ConsoleSnapshot;
  onSave: (patch: SettingsPatch) => void;
}) {
  const [flash, setFlash] = useFlash();
  const [age, setAge] = useState(String(snapshot.tokenAgeMinutes));
  const [maxPct, setMaxPct] = useState(String(snapshot.maxTradePct));
  const [polling, setPolling] = useState(String(snapshot.pollingSeconds));
  const [start, setStart] = useState(snapshot.dailyTimerStart);
  const [end, setEnd] = useState(snapshot.dailyTimerEnd);

  useEffect(() => setAge(String(snapshot.tokenAgeMinutes)), [snapshot.tokenAgeMinutes]);
  useEffect(() => setMaxPct(String(snapshot.maxTradePct)), [snapshot.maxTradePct]);
  useEffect(() => setPolling(String(snapshot.pollingSeconds)), [snapshot.pollingSeconds]);
  useEffect(() => setStart(snapshot.dailyTimerStart), [snapshot.dailyTimerStart]);
  useEffect(() => setEnd(snapshot.dailyTimerEnd), [snapshot.dailyTimerEnd]);

  const persist = (patch: SettingsPatch, key: string) => {
    onSave(patch);
    setFlash(key);
  };

  return (
    <div className="space-y-8">
      <section>
        <Label text="Graduated coin approval" saved={flash === "graduated"} />
        <Segmented
          ariaLabel="Graduated coin approval"
          value={snapshot.graduatedApproval ? "yes" : "no"}
          onChange={(value) => persist({ graduatedApproval: value === "yes" }, "graduated")}
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
        />
        <p className="mt-2 text-meta text-muted">
          If no, a token that has already graduated is skipped.
        </p>
      </section>

      <section>
        <Label text="Token age" saved={flash === "age"} />
        <SuffixInput
          suffix="minutes"
          inputMode="numeric"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          onBlur={() => {
            const n = Number(age);
            if (!Number.isFinite(n) || n === snapshot.tokenAgeMinutes) {
              setAge(String(snapshot.tokenAgeMinutes));
              return;
            }
            persist({ tokenAgeMinutes: n }, "age");
          }}
          aria-label="Token age in minutes"
        />
        <p className="mt-2 text-meta text-muted">
          A token older than this is skipped, even if everything else passes.
        </p>
      </section>

      <section>
        <Label text="ETH trade amount max percentage" saved={flash === "max"} />
        <SuffixInput
          suffix="%"
          inputMode="decimal"
          value={maxPct}
          onChange={(e) => setMaxPct(e.target.value)}
          onBlur={() => {
            const n = Number(maxPct);
            if (!Number.isFinite(n) || n === snapshot.maxTradePct) {
              setMaxPct(String(snapshot.maxTradePct));
              return;
            }
            persist({ maxTradePct: n }, "max");
          }}
          aria-label="ETH trade amount max percentage"
        />
        <p className="mt-2 text-meta text-muted">
          The bot will not spend more than this share of the wallet on a single trade.
        </p>
      </section>

      <section>
        <Label text="Polling time" saved={flash === "polling"} />
        <SuffixInput
          suffix="seconds"
          inputMode="numeric"
          value={polling}
          onChange={(e) => setPolling(e.target.value)}
          onBlur={() => {
            const n = Number(polling);
            if (!Number.isFinite(n) || n === snapshot.pollingSeconds) {
              setPolling(String(snapshot.pollingSeconds));
              return;
            }
            persist({ pollingSeconds: n }, "polling");
          }}
          aria-label="Polling time in seconds"
        />
        <p className="mt-2 text-meta text-muted">How often the scanner looks for a new token.</p>
      </section>

      <section>
        <Label text="Daily timer" saved={flash === "timer"} />
        <button
          type="button"
          onClick={() => persist({ dailyTimerOn: !snapshot.dailyTimerOn }, "timer")}
          className="flex h-12 w-full items-center justify-between rounded-control border border-rule px-3 text-body"
        >
          <span className="text-muted">Timer</span>
          <span className="text-ink">{snapshot.dailyTimerOn ? "On" : "Off"}</span>
        </button>
        {snapshot.dailyTimerOn ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-meta text-muted">Starts</span>
                <input
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  onBlur={() => {
                    if (start === snapshot.dailyTimerStart) return;
                    persist({ dailyTimerStart: start }, "timer");
                  }}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-meta text-muted">Ends</span>
                <input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  onBlur={() => {
                    if (end === snapshot.dailyTimerEnd) return;
                    persist({ dailyTimerEnd: end }, "timer");
                  }}
                  className={inputClass}
                />
              </label>
            </div>
            <p className="mt-2 text-meta text-muted">IST</p>
          </>
        ) : null}
        <p className="mt-2 text-meta text-muted">
          When on, the bot only runs between these times.
        </p>
      </section>
    </div>
  );
}

export function SettingsView() {
  const navigate = useNavigate();
  const consoleState = useConsole();
  const snapshot = consoleState.snapshot;

  return (
    <PageShell>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1 text-body text-ink"
      >
        <ChevronLeft className="size-5" strokeWidth={1.75} />
        Back
      </Link>

      <h1 className="mt-6 text-status font-medium">Settings</h1>

      {snapshot ? (
        <div className="mt-8">
          <SettingsFields
            snapshot={snapshot}
            onSave={(patch) => consoleState.updateSettings(patch)}
          />
        </div>
      ) : null}

      <section className="mt-8">
        <p className="mb-2 text-meta text-muted">Telegram notification chats</p>
        <p className="mb-4 text-meta text-muted">
          Anyone who starts a chat with the bot receives notifications. Remove a chat to stop
          sending to it.
        </p>
        {snapshot && snapshot.chats.length === 0 ? (
          <p className="text-body text-muted">No chats yet.</p>
        ) : null}
        <ul>
          {snapshot?.chats.map((chat) => (
            <li
              key={chat.id}
              className="flex min-h-11 items-center justify-between gap-4 border-b border-rule py-3 first:border-t"
            >
              <span className="text-body text-ink">{chat.name ?? chat.chatId}</span>
              <button
                type="button"
                onClick={() => consoleState.removeChat(chat.id)}
                className="text-body text-ink"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12">
        <button
          type="button"
          onClick={() => {
            clearMockSession();
            void navigate({ to: "/login", search: { expired: false } });
          }}
          className="text-body text-ink"
        >
          Sign out
        </button>
      </div>
    </PageShell>
  );
}
