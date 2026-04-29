"use client";

import Link from "next/link";
import { Badge, Button, Text, Title } from "rizzui";
import { PiArrowRightBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { marketplaceVendors } from "@/components/marketplace/vendor-data";
import { routes } from "@/config/routes";

const marketplaceStats = [
  { label: "Live vendors", value: "84", meta: "stores currently visible in marketplace" },
  { label: "Active products", value: "2,148", meta: "catalog items under current assortment" },
  { label: "Flagged listings", value: "29", meta: "need compliance or catalog action" },
];

const moduleLinks = [
  {
    label: "Products",
    href: routes.marketplace.products,
    note: "Browse catalog items and open create, detail, or edit flows.",
  },
  {
    label: "Vendors",
    href: routes.marketplace.vendors,
    note: "Manage live store records, plans, payouts, and readiness.",
  },
  {
    label: "Vendor applications",
    href: routes.marketplace.vendorApplications,
    note: "Review onboarding submissions and activation decisions.",
  },
  {
    label: "Categories",
    href: routes.marketplace.categories,
    note: "Control catalog taxonomy and merchandising grouping.",
  },
];

function VendorState({ status }: { status: string }) {
  const tones: Record<string, string> = {
    live: "bg-primary/10 text-primary",
    stable: "bg-emerald-50 text-emerald-700",
    review: "bg-amber-50 text-amber-700",
    monitoring: "bg-sky-50 text-sky-700",
    queued: "bg-gray-100 text-gray-700",
    at_risk: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.queued}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function MarketplaceDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace"]}
        eyebrow="Commerce"
        title="Marketplace Operations"
        description="Vendors, products, applications, and catalog control."
      />

      <div className="grid gap-5 md:grid-cols-3">
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

      <div className="grid gap-6 2xl:grid-cols-[1.05fr_1.25fr]">
        <ShellCard title="Work areas" description="Open the module that matches the marketplace staff job.">
          <div className="space-y-4">
            {moduleLinks.map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Title as="h4" className="text-base font-semibold text-gray-900">
                      {item.label}
                    </Title>
                    <Text className="mt-2 text-sm text-gray-500">{item.note}</Text>
                  </div>
                  <Link href={item.href}>
                    <Button variant="outline" className="h-10 rounded-2xl px-4">
                      Open
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Vendor watch list" description="Stores needing direct operational or marketplace visibility.">
          <div className="space-y-4">
            {marketplaceVendors.map((vendor) => (
              <div key={vendor.id} className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Title as="h4" className="text-base font-semibold text-gray-900">
                        {vendor.name}
                      </Title>
                      <VendorState status={vendor.status} />
                      <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                        {vendor.subscriptionPlan}
                      </Badge>
                    </div>
                    <div className="grid gap-3 text-sm text-gray-500 md:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Categories</Text>
                        <Text className="mt-1 font-medium text-gray-900">{vendor.categories.join(", ")}</Text>
                      </div>
                      <div>
                        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Payout</Text>
                        <Text className="mt-1 font-medium text-gray-900">{vendor.payoutMethod}</Text>
                      </div>
                      <div>
                        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Visibility</Text>
                        <Text className="mt-1 font-medium text-gray-900">{vendor.visibility}</Text>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={routes.marketplace.vendorDetails(vendor.slug)}>
                      <Button variant="outline" className="h-10 rounded-2xl px-4">
                        Vendor
                      </Button>
                    </Link>
                    <Link href={routes.marketplace.products}>
                      <Button className="h-10 rounded-2xl bg-primary px-4 text-white hover:bg-primary-dark">
                        Products
                        <PiArrowRightBold className="ms-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
