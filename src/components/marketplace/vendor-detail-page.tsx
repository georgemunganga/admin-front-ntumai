"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Text, Title } from "rizzui";
import {
  PiArrowLeftBold,
  PiClockBold,
  PiCreditCardBold,
  PiNotePencilBold,
  PiStorefrontBold,
  PiTruckBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import GuardedLink from "@/components/auth/guarded-link";
import ShellCard from "@/components/admin/shell-card";
import {
  getMarketplaceVendorBySlug,
  useAdminVendorDetail,
} from "@/repositories/admin/vendors";

export default function VendorDetailPage({ slug }: { slug: string }) {
  const fallback = getMarketplaceVendorBySlug(slug);
  const { data: liveVendor, isLoading, error } = useAdminVendorDetail(slug);
  const vendor = liveVendor ?? fallback;

  if (!vendor && !isLoading) notFound();
  if (!vendor) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        Loading vendor...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Vendors", vendor.id]}
        eyebrow="Marketplace Kit"
        title={vendor.name}
        description={vendor.description}
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/marketplace/vendors">
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <GuardedLink href={`/marketplace/vendors/${vendor.slug}/edit`} requirement="write">
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiNotePencilBold className="me-1.5 h-4 w-4" />
                Edit Vendor
              </Button>
            </GuardedLink>
          </div>
        }
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <ShellCard title="Partner summary" description="Core vendor details.">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoTile label="Vendor ID" value={vendor.id} />
            <InfoTile label="Segment" value={vendor.segment} />
            <InfoTile label="City" value={vendor.city} />
            <InfoTile label="Store type" value={vendor.storeType} icon={<PiStorefrontBold className="h-4 w-4 text-primary" />} />
            <InfoTile label="Fulfillment" value={vendor.fulfillment} icon={<PiTruckBold className="h-4 w-4 text-primary" />} />
            <InfoTile label="Payout schedule" value={vendor.payoutSchedule} />
            <InfoTile label="Payout method" value={vendor.payoutMethod} icon={<PiCreditCardBold className="h-4 w-4 text-primary" />} />
            <InfoTile label="Business hours" value={vendor.businessHours} icon={<PiClockBold className="h-4 w-4 text-primary" />} />
          </div>

          <div className="mt-5 rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Context</Text>
            <Text className="mt-2 text-sm leading-6 text-gray-600">{vendor.context}</Text>
          </div>
        </ShellCard>

        <ShellCard title="Status" description="Visibility and operations.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Marketplace state</Text>
              <div className="mt-3 flex items-center gap-3">
                <VendorStatus status={vendor.status} />
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  {vendor.visibility}
                </Badge>
              </div>
            </div>
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Owner</Text>
              <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
                {vendor.owner}
              </Title>
              <Text className="mt-1 text-xs leading-5 text-gray-500">Updated {vendor.updatedAt}</Text>
            </div>
            <div className="flex flex-wrap gap-2">
              {vendor.tags.map((tag) => (
                <Badge key={tag} variant="flat" className="rounded-2xl bg-secondary/20 px-3 py-1 text-secondary-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Subscription plan</Text>
              <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
                {vendor.subscriptionPlan}
              </Title>
              <Text className="mt-1 text-xs leading-5 text-gray-500">Vendor finance and billing context</Text>
            </div>
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Vendor metrics" description="Current partner performance.">
          <div className="grid gap-4 md:grid-cols-2">
            {vendor.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{metric.label}</Text>
                <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
                  {metric.value}
                </Title>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Recent activity" description="Latest marketplace actions.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Categories</Text>
              <div className="mt-3 flex flex-wrap gap-2">
                {vendor.categories.map((category) => (
                  <Badge key={category} variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            {vendor.timeline.map((item) => (
              <div key={`${item.label}-${item.time}`} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{item.label}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{item.detail}</Text>
                  </div>
                  <Text className="text-xs text-gray-500">{item.time}</Text>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function InfoTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      </div>
      <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
        {value}
      </Title>
    </div>
  );
}

function VendorStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    live: "bg-primary/10 text-primary",
    stable: "bg-emerald-50 text-emerald-700",
    review: "bg-amber-50 text-amber-700",
    monitoring: "bg-sky-50 text-sky-700",
    queued: "bg-gray-100 text-gray-700",
    at_risk: "bg-red-50 text-red-700",
  };

  return <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.queued}`}>{status.replace("_", " ")}</span>;
}
