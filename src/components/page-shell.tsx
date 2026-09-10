import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <div className={cn("mx-auto w-full max-w-column px-5 py-8", className)}>{children}</div>
    </div>
  );
}

export function Hairline() {
  return <hr className="my-8 border-0 border-t border-rule" />;
}

export function FillButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "h-12 w-full rounded-control bg-ink text-body text-paper transition-transform duration-150 ease-out",
        "active:not-disabled:scale-[0.96] disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-meta text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "h-12 w-full rounded-control border border-rule bg-paper px-3 text-body text-ink outline-none placeholder:text-muted";
