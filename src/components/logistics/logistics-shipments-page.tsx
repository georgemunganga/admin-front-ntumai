"use client";

import { Text, Title } from "rizzui";
import PinningListPage from "@/components/crud/pinning-list-page";
import { crudPages } from "@/components/crud/crud-data";

const shipmentStats = [
  { label: "Dispatch-ready", value: "64", meta: "Batched for next release window" },
  { label: "In transit", value: "148", meta: "Across 11 city lanes" },
  { label: "Delayed", value: "09", meta: "Needs recovery routing" },
];

export default function LogisticsShipmentsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        {shipmentStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <Text className="text-sm text-gray-500">{stat.label}</Text>
            <Title as="h3" className="mt-3 text-[28px] font-semibold tracking-tight">
              {stat.value}
            </Title>
            <Text className="mt-2 text-sm text-gray-500">{stat.meta}</Text>
          </div>
        ))}
      </div>
      <PinningListPage {...crudPages.deliveries} />
    </div>
  );
}
