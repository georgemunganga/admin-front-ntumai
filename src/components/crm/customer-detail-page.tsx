"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, Badge, Button, Text, Title } from "rizzui";
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
        title="Customer profile"
        description="Detailed profile view for mobile-app behavior, order history posture, wallet context, and support handling."
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

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <ShellCard className="overflow-hidden">
            <div className="rounded-[26px] bg-[linear-gradient(180deg,#0f2e54_0%,#113862_38%,#ffffff_38%,#ffffff_100%)] px-6 py-6">
              <div className="flex flex-col items-center text-center">
                <Avatar
                  name={customer.name}
                  size="xl"
                  rounded="full"
                  className="border-4 border-white shadow-lg"
                />
                <Title as="h2" className="mt-4 text-xl font-semibold text-white">
                  {customer.name}
                </Title>
                <Text className="mt-1 text-sm text-slate-200">{customer.segment}</Text>
                <div className="mt-3">
                  <CustomerStatus status={customer.status} />
                </div>
              </div>

              <div className="mt-8 space-y-3 rounded-[24px] bg-white p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
                <SidebarRow icon={<PiPhoneCallBold className="h-4 w-4" />} label="Phone" value={customer.phone} />
                <SidebarRow icon={<PiMapPinBold className="h-4 w-4" />} label="City" value={customer.city} />
                <SidebarRow icon={<PiWalletBold className="h-4 w-4" />} label="Wallet" value={customer.walletBalance} />
                <SidebarRow icon={<PiCreditCardBold className="h-4 w-4" />} label="Default pay" value={customer.paymentMethod} />
              </div>
            </div>
          </ShellCard>

          <ShellCard title="Customer insights" description="Fast CRM and recovery snapshot.">
            <div className="space-y-3">
              <InsightCard title="CRM owner" detail={customer.owner} />
              <InsightCard title="Last seen" detail={customer.lastOrder} />
              <InsightCard title="Joined" detail={customer.joinedAt} />
              <InsightCard title="App version" detail={customer.appVersion} />
            </div>
          </ShellCard>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_12px_36px_-24px_rgba(15,23,42,0.3)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Title as="h2" className="text-[30px] font-semibold tracking-tight text-gray-900">
                    {customer.name}
                  </Title>
                  <Badge
                    variant="flat"
                    className="rounded-2xl bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
                  >
                    {customer.id}
                  </Badge>
                </div>
                <Text className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
                  {customer.notes}
                </Text>
                <div className="mt-4 flex flex-wrap gap-2">
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
              <div className="rounded-[22px] border border-gray-200 bg-gray-50 px-4 py-3">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Mobile app account
                </Text>
                <Text className="mt-2 font-semibold text-gray-900">{customer.email}</Text>
                <Text className="mt-1 text-xs text-gray-500">Updated {customer.updatedAt}</Text>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-b border-gray-100 pb-4">
              {["Overview", "Orders", "Wallet", "Activity"].map((tab, index) => (
                <div
                  key={tab}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                    index === 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <MetricCard icon={<PiShoppingBagBold className="h-5 w-5" />} label="Total orders" value={customer.totalOrders} />
              <MetricCard icon={<PiUserCircleBold className="h-5 w-5" />} label="Completed" value={customer.completedOrders} />
              <MetricCard icon={<PiWalletBold className="h-5 w-5" />} label="Wallet balance" value={customer.walletBalance} />
              <MetricCard icon={<PiCreditCardBold className="h-5 w-5" />} label="Lifetime spend" value={customer.lifetimeSpend} />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ShellCard title="Profile overview" description="Identity, account, and address information.">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoTile label="Customer ID" value={customer.id} />
                <InfoTile label="Segment" value={customer.segment} />
                <InfoTile label="Email" value={customer.email} />
                <InfoTile label="Phone" value={customer.phone} />
                <InfoTile label="City" value={customer.city} />
                <InfoTile label="Joined at" value={customer.joinedAt} />
                <InfoTile label="Last order" value={customer.lastOrder} />
                <InfoTile label="App version" value={customer.appVersion} />
              </div>
              <div className="mt-4 rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-center gap-2">
                  <PiMapPinBold className="h-4 w-4 text-primary" />
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Primary address
                  </Text>
                </div>
                <Text className="mt-2 text-sm font-semibold text-gray-900">{customer.address}</Text>
              </div>
            </ShellCard>

            <ShellCard title="Commerce summary" description="Order, wallet, and payment posture.">
              <div className="space-y-3">
                <SummaryRow label="Completed orders" value={customer.completedOrders} />
                <SummaryRow label="Cancelled orders" value={customer.cancelledOrders} />
                <SummaryRow label="Wallet balance" value={customer.walletBalance} />
                <SummaryRow label="Default payment" value={customer.paymentMethod} />
                <SummaryRow label="Last order" value={customer.lastOrder} />
              </div>
            </ShellCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <ShellCard title="Activity timeline" description="Recent mobile app and CRM milestones.">
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

            <ShellCard title="Support and admin context" description="Shared view for CRM, support, and finance teams.">
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
                  icon={<PiCreditCardBold className="h-4 w-4" />}
                  title="Payment method"
                  detail={customer.paymentMethod}
                />
                <ContextRow
                  icon={<PiDeviceMobileCameraBold className="h-4 w-4" />}
                  title="App build"
                  detail={customer.appVersion}
                />
                <NoteCard
                  title="CRM handoff"
                  detail={`${customer.owner} owns the next recovery or proactive retention action on this account.`}
                />
              </div>
            </ShellCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-gray-100 bg-gray-50/80 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-gray-700 shadow-sm">
        {icon}
      </div>
      <div className="min-w-0">
        <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
        <Text className="truncate text-sm font-semibold text-gray-900">{value}</Text>
      </div>
    </div>
  );
}

function InsightCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{title}</Text>
      <Text className="mt-2 text-sm font-semibold text-gray-900">{detail}</Text>
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
    <div className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <Text className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </Text>
      <Title as="h4" className="mt-1 text-lg font-semibold text-gray-900">
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-gray-100 bg-gray-50/70 px-4 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-right text-sm font-semibold text-gray-900">{value}</Text>
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

  return (
    <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.queued}`}>
      {status.replace("_", " ")}
    </span>
  );
}
