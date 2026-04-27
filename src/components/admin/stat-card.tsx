"use client";

import cn from "@/utils/class-names";
import { Badge, Text, Title } from "rizzui";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  tone?: "positive" | "warning" | "neutral";
  detail?: string;
};

const toneClasses = {
  positive: "bg-primary/12 text-primary",
  warning: "bg-secondary/20 text-secondary-foreground",
  neutral: "bg-blue-lighter/70 text-blue-dark",
};

export default function StatCard({
  label,
  value,
  change,
  tone = "neutral",
  detail,
}: StatCardProps) {
  return (
    <div className="rounded-[22px] border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50/90 p-4 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <Text className="text-sm font-medium text-gray-500">{label}</Text>
        <Badge
          variant="flat"
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-semibold",
            toneClasses[tone],
          )}
        >
          {change}
        </Badge>
      </div>
      <Title as="h2" className="mt-3 text-[26px] font-semibold tracking-tight">
        {value}
      </Title>
      {detail ? <Text className="mt-1.5 text-xs leading-5 text-gray-500">{detail}</Text> : null}
    </div>
  );
}
