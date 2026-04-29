import cn from "@/utils/class-names";

const statusClasses: Record<string, string> = {
  live: "bg-primary/12 text-primary",
  stable: "bg-blue-lighter/70 text-blue-dark",
  monitoring: "bg-orange-lighter/70 text-orange-dark",
  at_risk: "bg-red-lighter/70 text-red-dark",
  queued: "bg-gray-100 text-gray-600",
  paused: "bg-gray-100 text-gray-600",
  review: "bg-secondary/20 text-secondary-foreground",
};

const statusLabels: Record<string, string> = {
  live: "Live",
  stable: "Stable",
  monitoring: "Watching",
  at_risk: "At risk",
  queued: "Queued",
  paused: "Blocked",
  review: "Needs review",
};

export default function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replace(/\s+/g, "_");
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
        statusClasses[normalized] ?? "bg-gray-100 text-gray-600",
      )}
    >
      {statusLabels[normalized] ?? status.replace(/_/g, " ")}
    </span>
  );
}
