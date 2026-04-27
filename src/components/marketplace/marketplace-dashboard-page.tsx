"use client";

import { Avatar, Badge, Button, Input, Text, Title } from "rizzui";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";

const marketplaceStats = [
  { label: "Live vendors", value: "84", meta: "12 awaiting activation review" },
  { label: "Active products", value: "2,148", meta: "Across food, grocery, pharmacy, and retail" },
  { label: "Flagged listings", value: "29", meta: "Compliance, stock, or pricing issues open" },
  { label: "Ratings under watch", value: "17", meta: "Merchant quality cases needing follow-up" },
];

const merchantCards = [
  { name: "QuickBite Kitchens", lane: "Prepared Food", status: "Live", metric: "412 SKUs", note: "Peak lunch demand" },
  { name: "Green Basket Market", lane: "Grocery", status: "Review", metric: "286 SKUs", note: "Category remap pending" },
  { name: "CityCare Pharmacy", lane: "Pharmacy", status: "Compliance", metric: "191 SKUs", note: "Restricted items under review" },
  { name: "HomeBox Supplies", lane: "Retail", status: "Live", metric: "154 SKUs", note: "Stable fulfillment quality" },
  { name: "FreshHub", lane: "Grocery", status: "Live", metric: "338 SKUs", note: "Strong repeat basket rate" },
  { name: "Urban Wash & Fold", lane: "Services", status: "Pilot", metric: "26 packages", note: "New city rollout" },
  { name: "MobiTech Express", lane: "Electronics", status: "Review", metric: "97 SKUs", note: "Image cleanup required" },
  { name: "Mama T's Pantry", lane: "Specialty Food", status: "Live", metric: "118 SKUs", note: "High evening conversion" },
];

const statusClasses: Record<string, string> = {
  Live: "bg-primary/10 text-primary",
  Review: "bg-amber-100 text-amber-700",
  Compliance: "bg-rose-100 text-rose-700",
  Pilot: "bg-sky-100 text-sky-700",
};

export default function MarketplaceDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace"]}
        eyebrow="Commerce"
        title="Marketplace operations"
        description="Manage vendors, assortments, and merchandising quality across the Ntumai marketplace."
      />

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
        {marketplaceStats.map((stat) => (
          <ShellCard key={stat.label} className="space-y-2 p-5">
            <Text className="text-sm text-gray-500">{stat.label}</Text>
            <Title as="h3" className="text-[28px] font-semibold tracking-tight text-gray-900">
              {stat.value}
            </Title>
            <Text className="text-sm text-gray-500">{stat.meta}</Text>
          </ShellCard>
        ))}
      </div>

      <ShellCard
        title="Merchant accounts"
        action={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search merchants..."
              prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
              className="min-w-[220px]"
              inputClassName="h-10 rounded-2xl"
            />
            <Button className="h-10 rounded-2xl bg-primary px-4 text-white hover:bg-primary-dark">
              Add Merchant
            </Button>
          </div>
        }
      >
        <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {merchantCards.map((merchant) => (
            <div key={merchant.name} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={merchant.name} size="lg" rounded="lg" />
                  <div>
                    <Title as="h4" className="text-base font-semibold text-gray-900">
                      {merchant.name}
                    </Title>
                    <Text className="text-sm text-gray-500">{merchant.lane}</Text>
                  </div>
                </div>
                <Badge
                  variant="flat"
                  className={`rounded-2xl px-2.5 py-1 text-xs font-medium ${statusClasses[merchant.status]}`}
                >
                  {merchant.status}
                </Badge>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-gray-50 px-4 py-3">
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Catalog volume
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-gray-900">{merchant.metric}</Text>
                </div>
                <Text className="text-sm leading-6 text-gray-500">{merchant.note}</Text>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <Button variant="outline" className="h-10 flex-1 rounded-2xl border-gray-200">
                  View
                </Button>
                <Button className="h-10 flex-1 rounded-2xl bg-primary text-white hover:bg-primary-dark">
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ShellCard>
    </div>
  );
}
