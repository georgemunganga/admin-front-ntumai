"use client";

import cn from "@/utils/class-names";
import { Badge, Text, Title } from "rizzui";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  tone?: "positive" | "warning" | "neutral";
  detail: string;
};

const toneClasses = {
  positive: "bg-green-lighter/60 text-green-dark",
  warning: "bg-orange-lighter/70 text-orange-dark",
  neutral: "bg-blue-lighter/60 text-blue-dark",
};

export default function StatCard({
  label,
  value,
  change,
  tone = "neutral",
  detail,
}: StatCardProps) {
  return (
    <div className="rounded-[24px] border border-gray-100 bg-gray-50/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <Text className="text-sm font-medium text-gray-500">{label}</Text>
        <Badge
          variant="flat"
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
            toneClasses[tone],
          )}
        >
          {change}
        </Badge>
      </div>
      <Title as="h2" className="mt-4 text-[28px] font-semibold tracking-tight">
        {value}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">{detail}</Text>
    </div>
  );
}
