"use client";

import { Badge, Text } from "rizzui";

export default function DataSourceState({
  isLoading,
  isLive,
  error,
}: {
  isLoading?: boolean;
  isLive?: boolean;
  error?: string | null;
}) {
  const tone = isLoading
    ? "bg-amber-50 text-amber-700"
    : error
      ? "bg-rose-50 text-rose-700"
      : isLive
        ? "bg-emerald-50 text-emerald-700"
        : "bg-primary/10 text-primary";

  const label = isLoading
    ? "Loading live API"
    : error
      ? "Seed fallback"
      : isLive
        ? "Live API"
        : "Seed preview";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="flat" className={`rounded-2xl px-3 py-1.5 ${tone}`}>
        {label}
      </Badge>
      {error ? <Text className="text-xs text-rose-600">{error}</Text> : null}
    </div>
  );
}
