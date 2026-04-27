"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Input, Text, Title } from "rizzui";
import {
  PiArrowClockwiseBold,
  PiChatsCircleDuotone,
  PiMagnifyingGlassBold,
  PiPlusBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import StatusBadge from "@/components/admin/status-badge";

type SupportMessage = {
  id: string;
  customer: string;
  subject: string;
  summary: string;
  queue: string;
  channel: string;
  priority: string;
  status: string;
  updatedAt: string;
  tab: string;
};

const supportTabs = [
  { value: "unassigned", label: "Unassigned", count: 18 },
  { value: "assigned", label: "Assigned to me", count: 42 },
  { value: "open", label: "All open", count: 96 },
  { value: "sla", label: "SLA breach", count: 7 },
];

const supportMessages: SupportMessage[] = [
  {
    id: "SUP-1842",
    customer: "Martha Chola",
    subject: "Refund not reflected in wallet",
    summary: "Customer confirms the order was cancelled but the wallet credit still has not landed after 2 hours.",
    queue: "Billing",
    channel: "In-app chat",
    priority: "high",
    status: "review",
    updatedAt: "4 min ago",
    tab: "assigned",
  },
  {
    id: "SUP-1838",
    customer: "QuickBite Kitchens",
    subject: "Merchant tablet stops syncing",
    summary: "Store cannot mark orders ready, causing a queue on the lunchtime dispatch board.",
    queue: "Merchant support",
    channel: "Email",
    priority: "medium",
    status: "monitoring",
    updatedAt: "12 min ago",
    tab: "open",
  },
  {
    id: "SUP-1834",
    customer: "Joseph Tembo",
    subject: "Courier marked complete without handoff",
    summary: "Customer says the driver completed the trip but the parcel was not delivered to the recipient.",
    queue: "Delivery disputes",
    channel: "Phone",
    priority: "critical",
    status: "at_risk",
    updatedAt: "18 min ago",
    tab: "sla",
  },
  {
    id: "SUP-1829",
    customer: "Natasha Mbewe",
    subject: "Promo code accepted then removed",
    summary: "Checkout accepted the campaign code, but the final receipt used the base fare and normal service fee.",
    queue: "Promotions",
    channel: "In-app chat",
    priority: "medium",
    status: "queued",
    updatedAt: "34 min ago",
    tab: "unassigned",
  },
];

export default function SupportInboxPage() {
  const [activeTab, setActiveTab] = useState(supportTabs[0].value);
  const [query, setQuery] = useState("");

  const visibleMessages = useMemo(() => {
    return supportMessages.filter((message) => {
      const matchesTab =
        activeTab === "open" ? true : message.tab === activeTab;
      const haystack = [
        message.customer,
        message.subject,
        message.summary,
        message.queue,
      ]
        .join(" ")
        .toLowerCase();
      return matchesTab && haystack.includes(query.toLowerCase());
    });
  }, [activeTab, query]);

  const activeMessage = visibleMessages[0] ?? supportMessages[0];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Support", "Inbox"]}
        eyebrow="Support Desk"
        title="Support Inbox"
        description="Shared support conversations."
        action={
          <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Create Ticket
          </Button>
        }
      />

      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <nav className="flex items-center gap-5 border-b border-gray-200">
          {supportTabs.map((tab) => {
            const isActive = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                className="relative flex items-center gap-2 py-2 text-sm outline-none"
                onClick={() => setActiveTab(tab.value)}
              >
                <span
                  className={
                    isActive
                      ? "font-medium text-gray-900"
                      : "text-gray-500 hover:text-gray-800"
                  }
                >
                  {tab.label}
                </span>
                <Badge size="sm" variant={isActive ? "solid" : "flat"}>
                  {tab.count}
                </Badge>
                <span
                  className={`absolute -bottom-px left-0 h-0.5 w-full ${
                    isActive ? "bg-primary" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="@container">
        <div className="grid gap-6 @4xl:grid-cols-12">
          <div className="@4xl:col-span-4">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <Input
                    type="search"
                    placeholder="Search messages"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
                    inputClassName="h-10"
                  />
                  <Button variant="outline" className="h-10 w-10 rounded-2xl p-0">
                    <PiArrowClockwiseBold className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                {visibleMessages.map((message) => (
                  <button
                    key={message.id}
                    className={`grid w-full grid-cols-[1fr_auto] gap-3 border-t border-gray-100 px-5 py-4 text-left first:border-t-0 ${
                      activeMessage.id === message.id ? "bg-primary/5" : "bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Title as="h4" className="text-sm font-semibold text-gray-900">
                          {message.subject}
                        </Title>
                        {message.priority === "critical" ? (
                          <PiWarningCircleBold className="h-4 w-4 text-red-dark" />
                        ) : null}
                      </div>
                      <Text className="mt-1 text-xs font-medium text-gray-500">
                        {message.customer} · {message.queue}
                      </Text>
                      <Text className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {message.summary}
                      </Text>
                    </div>
                    <Text className="text-xs text-gray-500">{message.updatedAt}</Text>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="@4xl:col-span-8">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                    {activeMessage.id}
                  </Text>
                  <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
                    {activeMessage.subject}
                  </Title>
                  <Text className="mt-2 text-sm text-gray-500">
                    {activeMessage.customer} · {activeMessage.channel} · Updated{" "}
                    {activeMessage.updatedAt}
                  </Text>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                    {activeMessage.queue}
                  </Badge>
                  <StatusBadge status={activeMessage.status} />
                </div>
              </div>

              <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="space-y-5">
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <div className="flex items-center gap-2">
                      <PiChatsCircleDuotone className="h-5 w-5 text-primary" />
                      <Title as="h4" className="text-sm font-semibold text-gray-900">
                        Conversation
                      </Title>
                    </div>
                    <Text className="mt-3 text-sm leading-7 text-gray-600">
                      {activeMessage.summary}
                    </Text>
                  </div>
                  <div className="space-y-4">
                    <SupportReply
                      label="Customer"
                      time="09:02"
                      body="I cancelled the order after the rider called, but I still have not received the refund in my wallet."
                    />
                    <SupportReply
                      label="Ntumai agent"
                      time="09:05"
                      body="We verified the cancellation event and escalated it to finance operations. The wallet credit is being traced now."
                      agent
                    />
                    <SupportReply
                      label="Finance ops"
                      time="09:11"
                      body="Payment gateway reversal is complete. Waiting on wallet ledger confirmation before closing."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <SupportMetaCard
                    title="Ticket details"
                    items={[
                      ["Queue", activeMessage.queue],
                      ["Channel", activeMessage.channel],
                      ["Priority", activeMessage.priority],
                      ["Assignee", "Support lead"],
                    ]}
                  />
                  <SupportMetaCard
                    title="Operational context"
                    items={[
                      ["Order", "ORD-1042"],
                      ["Customer value", "Gold tier"],
                      ["Exposure", "ZMW 255"],
                      ["SLA", "27 min left"],
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportReply({
  label,
  time,
  body,
  agent = false,
}: {
  label: string;
  time: string;
  body: string;
  agent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${agent ? "border-primary/20 bg-primary/5" : "border-gray-100 bg-white"}`}>
      <div className="flex items-center justify-between gap-3">
        <Text className="text-sm font-semibold text-gray-900">{label}</Text>
        <Text className="text-xs text-gray-500">{time}</Text>
      </div>
      <Text className="mt-2 text-sm leading-7 text-gray-600">{body}</Text>
    </div>
  );
}

function SupportMetaCard({
  title,
  items,
}: {
  title: string;
  items: Array<[string, string]>;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <Title as="h4" className="text-sm font-semibold text-gray-900">
        {title}
      </Title>
      <div className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <Text className="text-sm text-gray-500">{label}</Text>
            <Text className="text-right text-sm font-medium text-gray-900">
              {value}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
