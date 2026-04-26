"use client";

import { Badge, Text, Title } from "rizzui";
import PageHeader from "@/components/admin/page-header";

const marketplaceStats = [
  { label: "Active products", value: "2,148", meta: "Across 162 vendors" },
  { label: "Live vendors", value: "84", meta: "12 need catalog review" },
  { label: "Low-stock items", value: "57", meta: "Merchants alerted" },
  { label: "Pending category changes", value: "14", meta: "Awaiting ops approval" },
];

const productSpotlights = [
  { name: "Fresh produce", count: "612 SKUs", note: "Best conversion this week" },
  { name: "Pharmacy essentials", count: "188 SKUs", note: "Compliance review active" },
  { name: "Quick meals", count: "403 SKUs", note: "Strong evening demand" },
];

const vendorActions = [
  { name: "Green Basket Market", task: "Approve new category mapping", status: "Review" },
  { name: "CityCare Pharmacy", task: "Resolve restricted listing flags", status: "Compliance" },
  { name: "QuickBite Kitchens", task: "Refresh image set for lunch menu", status: "Content" },
];

export default function MarketplaceDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Marketplace Kit"
        title="Marketplace Control"
        description="Manage products, vendor quality, and category operations across the Ntumai marketplace."
      />

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {marketplaceStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <Text className="text-sm text-gray-500">{stat.label}</Text>
            <Title as="h3" className="mt-3 text-[28px] font-semibold tracking-tight">
              {stat.value}
            </Title>
            <Text className="mt-2 text-sm text-gray-500">{stat.meta}</Text>
          </div>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.25fr_1fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Product lanes
              </Text>
              <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
                Demand and catalog focus
              </Title>
            </div>
            <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
              Marketplace live
            </Badge>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {productSpotlights.map((item) => (
              <div key={item.name} className="rounded-2xl bg-gray-50 p-5">
                <Title as="h4" className="text-base font-semibold text-gray-900">
                  {item.name}
                </Title>
                <Text className="mt-2 text-sm text-gray-500">{item.count}</Text>
                <Text className="mt-4 text-sm text-gray-500">{item.note}</Text>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Vendor actions
          </Text>
          <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
            Queue needing attention
          </Title>
          <div className="mt-6 space-y-4">
            {vendorActions.map((item) => (
              <div key={item.name} className="rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between gap-3">
                  <Title as="h4" className="text-base font-semibold text-gray-900">
                    {item.name}
                  </Title>
                  <Badge variant="flat" className="rounded-2xl bg-white px-3 py-1 text-gray-700">
                    {item.status}
                  </Badge>
                </div>
                <Text className="mt-2 text-sm text-gray-500">{item.task}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
