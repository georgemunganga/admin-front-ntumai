"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Text, Title } from "rizzui";
import {
  PiArrowLeftBold,
  PiCreditCardBold,
  PiDeviceMobileCameraBold,
  PiMapPinBold,
  PiNotePencilBold,
  PiPhoneCallBold,
  PiShoppingBagBold,
  PiUserCircleBold,
  PiWalletBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { getCustomerProfile } from "@/components/crm/customer-data";
import { routes } from "@/config/routes";

export default function CustomerDetailPage({ id }: { id: string }) {
  const customer = getCustomerProfile(id);
  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "CRM", "Customers", customer.id]}
        eyebrow="Customer CRM"
        title={customer.name}
        description="Customer profile aligned to the Ntumai mobile app journey, support visibility, and commerce behavior."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.crm.customers}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiNotePencilBold className="me-1.5 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary/10 text-primary">
                  <PiUserCircleBold className="h-9 w-9" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Title as="h2" className="text-2xl font-semibold text-gray-900">
                      {customer.name}
                    </Title>
                    <CustomerStatus status={customer.status} />
                  </div>
                  <Text className="mt-2 text-sm text-gray-500">{customer.notes}</Text>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {customer.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="flat"
                        className="rounded-2xl bg-secondary/20 px-3 py-1 text-secondary-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  CRM owner
                </Text>
                <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
                  {customer.owner}
                </Title>
                <Text className="mt-1 text-xs text-gray-500">Updated {customer.updatedAt}</Text>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <MetricCard icon={<PiShoppingBagBold className="h-5 w-5" />} label="Total orders" value={customer.totalOrders} />
              <MetricCard icon={<PiWalletBold className="h-5 w-5" />} label="Wallet balance" value={customer.walletBalance} />
              <MetricCard icon={<PiCreditCardBold className="h-5 w-5" />} label="Lifetime spend" value={customer.lifetimeSpend} />
              <MetricCard icon={<PiDeviceMobileCameraBold className="h-5 w-5" />} label="App version" value={customer.appVersion} />
            </div>
          </div>

          <ShellCard title="Profile overview" description="Identity, address, and mobile app context.">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoTile label="Customer ID" value={customer.id} />
              <InfoTile label="Segment" value={customer.segment} />
              <InfoTile label="Email" value={customer.email} />
              <InfoTile label="Phone" value={customer.phone} />
              <InfoTile label="City" value={customer.city} />
              <InfoTile label="Joined at" value={customer.joinedAt} />
              <InfoTile label="Last order" value={customer.lastOrder} />
              <InfoTile label="Payment method" value={customer.paymentMethod} />
            </div>
            <div className="mt-4 rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center gap-2">
                <PiMapPinBold className="h-4 w-4 text-primary" />
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Address
                </Text>
              </div>
              <Text className="mt-2 text-sm font-semibold text-gray-900">{customer.address}</Text>
            </div>
          </ShellCard>

          <ShellCard title="Customer activity" description="Recent mobile app and CRM milestones.">
            <div className="space-y-4">
              {customer.timeline.map((item, index) => (
                <TimelineRow
                  key={`${item.label}-${item.time}`}
                  label={item.label}
                  detail={item.detail}
                  time={item.time}
                  isLast={index === customer.timeline.length - 1}
                />
              ))}
            </div>
          </ShellCard>
        </div>

        <div className="space-y-6">
          <ShellCard title="Commerce summary" description="How this customer behaves across orders and payments.">
            <div className="space-y-3">
              <SidebarStat label="Completed orders" value={customer.completedOrders} />
              <SidebarStat label="Cancelled orders" value={customer.cancelledOrders} />
              <SidebarStat label="Wallet balance" value={customer.walletBalance} />
              <SidebarStat label="Default payment" value={customer.paymentMethod} />
            </div>
          </ShellCard>

          <ShellCard title="Support context" description="What support and retention teams should know quickly.">
            <div className="space-y-4">
              <ContextRow
                icon={<PiPhoneCallBold className="h-4 w-4" />}
                title="Primary contact"
                detail={customer.phone}
              />
              <ContextRow
                icon={<PiWalletBold className="h-4 w-4" />}
                title="Wallet state"
                detail={customer.walletBalance}
              />
              <ContextRow
                icon={<PiShoppingBagBold className="h-4 w-4" />}
                title="Order posture"
                detail={`${customer.totalOrders} total orders · ${customer.lastOrder}`}
              />
            </div>
          </ShellCard>

          <ShellCard title="Admin notes" description="Quick Ntumai operator readout.">
            <div className="space-y-3">
              <NoteCard
                title="Mobile app alignment"
                detail="This profile is shaped around the customer app account, payment path, and recent order behavior."
              />
              <NoteCard
                title="CRM ownership"
                detail={`${customer.owner} is the current owner of any proactive follow-up or recovery action.`}
              />
              <NoteCard
                title="Support handoff"
                detail="Use this page as the shared customer context when support, finance, or growth all need the same account view."
              />
            </div>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <Text className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </Text>
      <Title as="h4" className="mt-1 text-base font-semibold text-gray-900">
        {value}
      </Title>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
        {value}
      </Title>
    </div>
  );
}

function TimelineRow({
  label,
  detail,
  time,
  isLast,
}: {
  label: string;
  detail: string;
  time: string;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex w-6 flex-col items-center">
        <span className="mt-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-primary" />
        {!isLast ? <span className="mt-2 w-px flex-1 bg-gray-200" /> : null}
      </div>
      <div className="flex-1 rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Text className="font-semibold text-gray-900">{label}</Text>
            <Text className="mt-1 text-sm leading-6 text-gray-500">{detail}</Text>
          </div>
          <Text className="text-xs text-gray-500">{time}</Text>
        </div>
      </div>
    </div>
  );
}

function SidebarStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-gray-100 bg-gray-50/70 px-4 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900">{value}</Text>
    </div>
  );
}

function ContextRow({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex gap-3 rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-gray-700 shadow-sm">
        {icon}
      </div>
      <div>
        <Text className="text-sm font-semibold text-gray-900">{title}</Text>
        <Text className="mt-1 text-sm text-gray-500">{detail}</Text>
      </div>
    </div>
  );
}

function NoteCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="font-semibold text-gray-900">{title}</Text>
      <Text className="mt-1 text-sm leading-6 text-gray-500">{detail}</Text>
    </div>
  );
}

function CustomerStatus({ status }: { status: string }) {
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
