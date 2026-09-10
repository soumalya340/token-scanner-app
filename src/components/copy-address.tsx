import { useEffect, useState } from "react";
import { formatAddress } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CopyAddress({
  address,
  className,
}: {
  address: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(address);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      className={cn("text-left text-meta text-muted", className)}
    >
      {copied ? "Address copied" : formatAddress(address)}
    </button>
  );
}
