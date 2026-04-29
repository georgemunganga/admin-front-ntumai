"use client";

import { useMemo, useState } from "react";
import { Avatar, Badge, Button, Input, Select, Text, Title } from "rizzui";
import {
  PiArrowClockwiseBold,
  PiChatsCircleDuotone,
  PiClockCountdownBold,
  PiMagnifyingGlassBold,
  PiPaperclipBold,
  PiPaperPlaneTiltBold,
  PiPlusBold,
  PiShieldCheckBold,
  PiSparkleBold,
  PiTagBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import { Modal } from "@/components/modal";

type SupportStatus =
  | "review"
  | "monitoring"
  | "at_risk"
  | "queued"
  | "live"
  | "paused";
type SupportTab = "unassigned" | "assigned" | "open" | "sla";
type SupportAction = "assign" | "escalate" | "resolve";
type ComposerMode = "reply" | "note";

type ConversationEntry = {
  kind: "message" | "event";
  author: string;
  role: string;
  time: string;
  body: string;
  agent?: boolean;
  tone?: "default" | "warning" | "success";
};

type SupportMessage = {
  id: string;
  customer: string;
  subject: string;
  summary: string;
  queue: string;
  channel: string;
  priority: "critical" | "high" | "medium" | "low";
  status: SupportStatus;
  updatedAt: string;
  tab: SupportTab;
  assignee: string;
  order: string;
  customerTier: string;
  exposure: string;
  sla: string;
  city: string;
  unread: number;
  lastSeen: string;
  trustState: string;
  tags: string[];
  linkedQueues: string[];
  history: Array<{ label: string; value: string }>;
  thread: ConversationEntry[];
};

const supportTabs: Array<{ value: SupportTab; label: string; count: number }> =
  [
    { value: "unassigned", label: "Unassigned", count: 18 },
    { value: "assigned", label: "Assigned to me", count: 42 },
    { value: "open", label: "All open", count: 96 },
    { value: "sla", label: "SLA breach", count: 7 },
  ];

const supportMessagesSeed: SupportMessage[] = [
  {
    id: "SUP-1842",
    customer: "Martha Chola",
    subject: "Refund not reflected in wallet",
    summary:
      "Customer confirms the order was cancelled but the wallet credit still has not landed after 2 hours.",
    queue: "Billing",
    channel: "In-app chat",
    priority: "high",
    status: "review",
    updatedAt: "4 min ago",
    tab: "assigned",
    assignee: "Support lead",
    order: "ORD-1042",
    customerTier: "Gold tier",
    exposure: "ZMW 255",
    sla: "27 min left",
    city: "Lusaka",
    unread: 2,
    lastSeen: "Customer opened thread 3 min ago",
    trustState: "No trust flag",
    tags: ["Refund trace", "Wallet ledger"],
    linkedQueues: ["Finance ops", "Wallet ledger"],
    history: [
      { label: "Orders this month", value: "11" },
      { label: "Previous cases", value: "2 closed" },
      { label: "Refund sensitivity", value: "Medium" },
    ],
    thread: [
      {
        kind: "event",
        author: "System",
        role: "Workflow",
        time: "08:58",
        body: "Conversation routed into Billing after cancellation webhook and wallet mismatch check.",
        tone: "success",
      },
      {
        kind: "message",
        author: "Martha Chola",
        role: "Customer",
        time: "09:02",
        body: "I cancelled the order after the rider called, but I still have not received the refund in my wallet.",
      },
      {
        kind: "message",
        author: "Ntumai agent",
        role: "Support",
        time: "09:05",
        body: "We verified the cancellation event and escalated it to finance operations. The wallet credit is being traced now.",
        agent: true,
      },
      {
        kind: "message",
        author: "Finance ops",
        role: "Finance",
        time: "09:11",
        body: "Payment gateway reversal is complete. Waiting on wallet ledger confirmation before closing.",
      },
      {
        kind: "event",
        author: "System",
        role: "SLA",
        time: "09:13",
        body: "SLA watch has 27 minutes remaining before breach.",
        tone: "warning",
      },
    ],
  },
  {
    id: "SUP-1838",
    customer: "QuickBite Kitchens",
    subject: "Merchant tablet stops syncing",
    summary:
      "Store cannot mark orders ready, causing a queue on the lunchtime dispatch board.",
    queue: "Merchant support",
    channel: "Email",
    priority: "medium",
    status: "monitoring",
    updatedAt: "12 min ago",
    tab: "open",
    assignee: "Partner pod",
    order: "MRC-7714",
    customerTier: "Merchant account",
    exposure: "12 delayed orders",
    sla: "44 min left",
    city: "Kitwe",
    unread: 0,
    lastSeen: "Merchant replied 12 min ago",
    trustState: "Operational watch",
    tags: ["Tablet sync", "Merchant blocker"],
    linkedQueues: ["Marketplace ops", "Dispatch watch"],
    history: [
      { label: "Orders impacted", value: "12" },
      { label: "Store health", value: "Amber" },
      { label: "Previous outages", value: "1 this week" },
    ],
    thread: [
      {
        kind: "event",
        author: "System",
        role: "Workflow",
        time: "10:07",
        body: "Merchant escalation linked to live dispatch congestion on the affected store.",
        tone: "default",
      },
      {
        kind: "message",
        author: "QuickBite Kitchens",
        role: "Merchant",
        time: "10:11",
        body: "Orders are arriving but the tablet does not refresh when we try to mark them ready.",
      },
      {
        kind: "message",
        author: "Ntumai agent",
        role: "Support",
        time: "10:14",
        body: "We have linked the report to marketplace support and asked dispatch to watch the affected store queue.",
        agent: true,
      },
      {
        kind: "message",
        author: "Marketplace ops",
        role: "Platform",
        time: "10:21",
        body: "A stale sync token is suspected. Merchant re-auth is being prepared if auto-recovery does not restore updates.",
      },
    ],
  },
  {
    id: "SUP-1834",
    customer: "Joseph Tembo",
    subject: "Courier marked complete without handoff",
    summary:
      "Customer says the driver completed the trip but the parcel was not delivered to the recipient.",
    queue: "Delivery disputes",
    channel: "Phone",
    priority: "critical",
    status: "at_risk",
    updatedAt: "18 min ago",
    tab: "sla",
    assignee: "Resolution pod",
    order: "DLV-6639",
    customerTier: "Priority customer",
    exposure: "ZMW 410",
    sla: "6 min left",
    city: "Ndola",
    unread: 1,
    lastSeen: "Customer called again 7 min ago",
    trustState: "Handoff evidence missing",
    tags: ["Missing handoff", "Trust review"],
    linkedQueues: ["Dispatch ops", "Trust review"],
    history: [
      { label: "Deliveries this month", value: "6" },
      { label: "Previous disputes", value: "1 open" },
      { label: "Risk posture", value: "High" },
    ],
    thread: [
      {
        kind: "event",
        author: "System",
        role: "Risk",
        time: "08:37",
        body: "Proof-of-handoff artifact was not attached to the completion event.",
        tone: "warning",
      },
      {
        kind: "message",
        author: "Joseph Tembo",
        role: "Customer",
        time: "08:42",
        body: "The trip shows delivered, but the office gate never received the parcel and the rider is no longer reachable.",
      },
      {
        kind: "message",
        author: "Ntumai agent",
        role: "Support",
        time: "08:49",
        body: "We are validating the handoff with dispatch and checking the rider trail before we confirm next steps.",
        agent: true,
      },
      {
        kind: "message",
        author: "Dispatch ops",
        role: "Dispatch",
        time: "08:56",
        body: "The rider location trail shows completion near the drop-off block, but a final proof-of-handoff image is missing.",
      },
    ],
  },
  {
    id: "SUP-1829",
    customer: "Natasha Mbewe",
    subject: "Promo code accepted then removed",
    summary:
      "Checkout accepted the campaign code, but the final receipt used the base fare and normal service fee.",
    queue: "Promotions",
    channel: "In-app chat",
    priority: "medium",
    status: "queued",
    updatedAt: "34 min ago",
    tab: "unassigned",
    assignee: "Unassigned",
    order: "ORD-9931",
    customerTier: "Silver tier",
    exposure: "ZMW 48",
    sla: "1h 08m left",
    city: "Lusaka",
    unread: 0,
    lastSeen: "Customer waiting for first reply",
    trustState: "No trust flag",
    tags: ["Promo validation", "Checkout pricing"],
    linkedQueues: ["Growth ops"],
    history: [
      { label: "Orders this month", value: "4" },
      { label: "Previous cases", value: "None" },
      { label: "Campaign overlap", value: "Possible" },
    ],
    thread: [
      {
        kind: "message",
        author: "Natasha Mbewe",
        role: "Customer",
        time: "07:58",
        body: "The app accepted the campaign code before checkout, but the receipt still charged the full delivery fee.",
      },
      {
        kind: "message",
        author: "Campaign ops",
        role: "Growth",
        time: "08:05",
        body: "The code was active for one service type only. Support should verify whether the order switched lanes during pricing.",
      },
    ],
  },
];

const queueOptions = [
  { label: "All queues", value: "all" },
  { label: "Billing", value: "Billing" },
  { label: "Merchant support", value: "Merchant support" },
  { label: "Delivery disputes", value: "Delivery disputes" },
  { label: "Promotions", value: "Promotions" },
];

const cannedReplies = [
  "We are tracing this with the responsible operations team now.",
  "Thanks. I have linked this thread to the related queue and will return with an update shortly.",
  "We have validated the issue and are confirming the final resolution path before closing.",
];

function getActionResult(action: SupportAction) {
  switch (action) {
    case "assign":
      return {
        status: "live" as SupportStatus,
        assignee: "Support lead",
        timelineRole: "System",
        label: "Conversation assigned",
      };
    case "escalate":
      return {
        status: "monitoring" as SupportStatus,
        assignee: "Specialist follow-up",
        timelineRole: "System",
        label: "Conversation escalated",
      };
    case "resolve":
    default:
      return {
        status: "paused" as SupportStatus,
        assignee: "Resolved queue",
        timelineRole: "System",
        label: "Conversation resolved",
      };
  }
}

function DecisionModal({
  item,
  action,
  note,
  setNote,
  onClose,
  onConfirm,
}: {
  item: SupportMessage;
  action: SupportAction;
  note: string;
  setNote: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const actionLabel =
    action === "assign"
      ? "Assign conversation"
      : action === "escalate"
        ? "Escalate conversation"
        : "Resolve conversation";

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7">
      <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
        {item.id}
      </Text>
      <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
        {actionLabel}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">
        Save the operator outcome for {item.subject} so the inbox thread and support queues stay aligned.
      </Text>
      <div className="mt-6">
        <Text className="mb-2 text-sm font-medium text-gray-700">
          Operator note
        </Text>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder="Add the follow-up context the next operator should see in this thread."
        />
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button
          variant="outline"
          className="h-11 rounded-2xl px-4"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
          onClick={onConfirm}
        >
          Save action
        </Button>
      </div>
    </div>
  );
}

export default function SupportInboxPage() {
  const [activeTab, setActiveTab] = useState<SupportTab>("assigned");
  const [queue, setQueue] = useState("all");
  const [query, setQuery] = useState("");
  const [draftReply, setDraftReply] = useState("");
  const [composerMode, setComposerMode] = useState<ComposerMode>("reply");
  const [decisionNote, setDecisionNote] = useState("");
  const [decision, setDecision] = useState<SupportAction | null>(null);
  const [messages, setMessages] = useState(supportMessagesSeed);
  const [selectedId, setSelectedId] = useState(
    supportMessagesSeed[0]?.id ?? "",
  );

  const visibleMessages = useMemo(() => {
    return messages.filter((message) => {
      const matchesTab = activeTab === "open" ? true : message.tab === activeTab;
      const matchesQueue = queue === "all" ? true : message.queue === queue;
      const haystack = [
        message.id,
        message.customer,
        message.subject,
        message.summary,
        message.queue,
        message.city,
      ]
        .join(" ")
        .toLowerCase();
      return (
        matchesTab &&
        matchesQueue &&
        haystack.includes(query.toLowerCase())
      );
    });
  }, [activeTab, messages, query, queue]);

  const activeMessage =
    visibleMessages.find((message) => message.id === selectedId) ??
    visibleMessages[0] ??
    null;

  const stats = useMemo(() => {
    const open = messages.length;
    const critical = messages.filter(
      (message) => message.priority === "critical",
    ).length;
    const live = messages.filter(
      (message) =>
        message.status === "review" || message.status === "at_risk",
    ).length;
    return { open, critical, live };
  }, [messages]);

  function resetFilters() {
    setActiveTab("assigned");
    setQueue("all");
    setQuery("");
  }

  function applyDecision() {
    if (!activeMessage || !decision) return;
    const result = getActionResult(decision);
    setMessages((current) =>
      current.map((message) =>
        message.id !== activeMessage.id
          ? message
          : {
              ...message,
              status: result.status,
              assignee: result.assignee,
              updatedAt: "Just now",
              unread: 0,
              thread: [
                {
                  kind: "event",
                  author: "System",
                  role: result.timelineRole,
                  time: "Just now",
                  body:
                    decisionNote ||
                    `${result.label} from the inbox workspace.`,
                  agent: true,
                  tone: "success",
                },
                ...message.thread,
              ],
            },
      ),
    );
    setDecision(null);
    setDecisionNote("");
  }

  function sendReply() {
    if (!activeMessage || !draftReply.trim()) return;
    const entry: ConversationEntry =
      composerMode === "reply"
        ? {
            kind: "message",
            author: "Ntumai agent",
            role: "Support",
            time: "Just now",
            body: draftReply.trim(),
            agent: true,
          }
        : {
            kind: "event",
            author: "Internal note",
            role: "Ops note",
            time: "Just now",
            body: draftReply.trim(),
            agent: true,
            tone: "default",
          };

    setMessages((current) =>
      current.map((message) =>
        message.id !== activeMessage.id
          ? message
          : {
              ...message,
              status: message.status === "queued" ? "review" : message.status,
              updatedAt: "Just now",
              unread: 0,
              thread: [entry, ...message.thread],
            },
      ),
    );
    setDraftReply("");
  }

  function applyCannedReply(text: string) {
    setDraftReply((current) => (current ? `${current}\n\n${text}` : text));
  }

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Support", "Inbox"]}
        eyebrow="Support Desk"
        title="Support Inbox"
        description="Shared support conversations with operational context, queue ownership, and reply handling."
        badge="Inbox"
        action={
          <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Create Ticket
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Open threads"
          value={String(stats.open)}
          change="Shared inbox"
          tone="neutral"
          detail="Conversations currently visible to support operators."
        />
        <StatCard
          label="Critical watch"
          value={String(stats.critical)}
          change="Immediate"
          tone="warning"
          detail="Threads carrying delivery or payment exposure that should not wait."
        />
        <StatCard
          label="Needs action"
          value={String(stats.live)}
          change="Review state"
          tone="warning"
          detail="Threads in review or risk states that still need operator handling."
        />
      </div>

      <div className="rounded-[26px] border border-gray-200 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.24)]">
        <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="custom-scrollbar overflow-x-auto scroll-smooth">
            <nav className="flex items-center gap-4">
              {supportTabs.map((tab) => {
                const isActive = tab.value === activeTab;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    className={`inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary"
                    }`}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_140px]">
            <Input
              type="search"
              placeholder="Search customer, subject, city, queue..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
              inputClassName="h-11"
            />
            <Select
              options={queueOptions}
              value={queue}
              onChange={(option: any) => setQueue(option?.value ?? "all")}
              selectClassName="rounded-2xl"
            />
            <Button
              variant="outline"
              className="h-11 rounded-2xl px-4"
              onClick={resetFilters}
            >
              <PiArrowClockwiseBold className="me-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="border-r border-gray-100">
            {visibleMessages.length ? (
              visibleMessages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => setSelectedId(message.id)}
                  className={`grid w-full grid-cols-[auto_1fr_auto] gap-3 border-t border-gray-100 px-5 py-4 text-left first:border-t-0 ${
                    activeMessage?.id === message.id
                      ? "bg-primary/5"
                      : "bg-white hover:bg-gray-50/70"
                  }`}
                >
                  <div className="relative">
                    <Avatar name={message.customer} size="md" rounded="full" />
                    {message.unread ? (
                      <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-dark px-1 text-[10px] font-semibold text-white">
                        {message.unread}
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Title
                        as="h4"
                        className="truncate text-sm font-semibold text-gray-900"
                      >
                        {message.subject}
                      </Title>
                      {message.priority === "critical" ? (
                        <PiWarningCircleBold className="h-4 w-4 shrink-0 text-red-dark" />
                      ) : null}
                    </div>
                    <Text className="mt-1 text-xs font-medium text-gray-500">
                      {message.customer} · {message.queue}
                    </Text>
                    <Text className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {message.summary}
                    </Text>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge status={message.status} />
                      <Badge
                        variant="flat"
                        className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600"
                      >
                        {message.channel}
                      </Badge>
                    </div>
                  </div>
                  <Text className="text-xs text-gray-500">{message.updatedAt}</Text>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <Text className="text-sm font-medium text-gray-900">
                  No conversations match this filter.
                </Text>
                <Text className="mt-2 text-sm text-gray-500">
                  Adjust the tab, queue, or search terms to reopen the inbox
                  list.
                </Text>
              </div>
            )}
          </div>

          <div className="min-w-0">
            {activeMessage ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
                  <div>
                    <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                      {activeMessage.id}
                    </Text>
                    <Title
                      as="h3"
                      className="mt-2 text-xl font-semibold text-gray-900"
                    >
                      {activeMessage.subject}
                    </Title>
                    <Text className="mt-2 text-sm text-gray-500">
                      {activeMessage.customer} · {activeMessage.channel} ·{" "}
                      {activeMessage.city} · Updated {activeMessage.updatedAt}
                    </Text>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="flat"
                      className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary"
                    >
                      {activeMessage.queue}
                    </Badge>
                    <StatusBadge status={activeMessage.status} />
                  </div>
                </div>

                <div className="grid gap-6 px-6 py-6 2xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="min-w-0 space-y-5">
                    <div className="rounded-2xl bg-gray-50 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <PiChatsCircleDuotone className="h-5 w-5 text-primary" />
                          <Title
                            as="h4"
                            className="text-sm font-semibold text-gray-900"
                          >
                            Conversation summary
                          </Title>
                        </div>
                        <Text className="text-xs uppercase tracking-[0.16em] text-gray-400">
                          {activeMessage.lastSeen}
                        </Text>
                      </div>
                      <Text className="mt-3 text-sm leading-7 text-gray-600">
                        {activeMessage.summary}
                      </Text>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {activeMessage.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="flat"
                            className="rounded-full bg-secondary/20 px-2.5 py-1 text-[11px] text-secondary-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                        <Title as="h4" className="text-sm font-semibold text-gray-900">
                          Thread
                        </Title>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="flat"
                            className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600"
                          >
                            {activeMessage.thread.filter((entry) => entry.kind === "message").length} messages
                          </Badge>
                          <Badge
                            variant="flat"
                            className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] text-primary"
                          >
                            {activeMessage.linkedQueues.length} linked teams
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-5 space-y-4">
                        {activeMessage.thread.map((entry, index) =>
                          entry.kind === "event" ? (
                            <ThreadEvent
                              key={`${entry.author}-${entry.time}-${index}`}
                              role={entry.role}
                              time={entry.time}
                              body={entry.body}
                              tone={entry.tone}
                            />
                          ) : (
                            <SupportReply
                              key={`${entry.author}-${entry.time}-${index}`}
                              author={entry.author}
                              role={entry.role}
                              time={entry.time}
                              body={entry.body}
                              agent={entry.agent}
                            />
                          ),
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Title as="h4" className="text-sm font-semibold text-gray-900">
                          Compose
                        </Title>
                        <div className="flex rounded-2xl bg-gray-100 p-1">
                          <button
                            type="button"
                            onClick={() => setComposerMode("reply")}
                            className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                              composerMode === "reply"
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-500"
                            }`}
                          >
                            Customer reply
                          </button>
                          <button
                            type="button"
                            onClick={() => setComposerMode("note")}
                            className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                              composerMode === "note"
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-500"
                            }`}
                          >
                            Internal note
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                        >
                          <PiPaperclipBold className="h-4 w-4" />
                          Attachment
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                        >
                          <PiTagBold className="h-4 w-4" />
                          Link order note
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                        >
                          <PiShieldCheckBold className="h-4 w-4" />
                          Trust flag
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {cannedReplies.map((reply) => (
                          <button
                            key={reply}
                            type="button"
                            onClick={() => applyCannedReply(reply)}
                            className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary"
                          >
                            <PiSparkleBold className="h-3.5 w-3.5" />
                            {reply}
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={draftReply}
                        onChange={(event) => setDraftReply(event.target.value)}
                        rows={4}
                        className="mt-4 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                        placeholder={
                          composerMode === "reply"
                            ? "Write the next customer-facing support update."
                            : "Write an internal operator note that stays inside admin."
                        }
                      />
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <Text className="text-sm text-gray-500">
                          {composerMode === "reply"
                            ? "This posts a customer-visible support reply into the active conversation."
                            : "This adds an internal note event for other operators."}
                        </Text>
                        <Button
                          className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
                          onClick={sendReply}
                        >
                          <PiPaperPlaneTiltBold className="me-2 h-4 w-4" />
                          {composerMode === "reply" ? "Send Reply" : "Save Note"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SupportMetaCard
                      title="Ticket details"
                      items={[
                        ["Queue", activeMessage.queue],
                        ["Channel", activeMessage.channel],
                        ["Priority", activeMessage.priority],
                        ["Assignee", activeMessage.assignee],
                      ]}
                    />
                    <SupportMetaCard
                      title="Operational context"
                      items={[
                        ["Order", activeMessage.order],
                        ["Customer value", activeMessage.customerTier],
                        ["Exposure", activeMessage.exposure],
                        ["SLA", activeMessage.sla],
                      ]}
                    />
                    <ProfileCard
                      title="Customer context"
                      customer={activeMessage.customer}
                      trustState={activeMessage.trustState}
                      history={activeMessage.history}
                    />
                    <LinkedQueuesCard queues={activeMessage.linkedQueues} />
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                      <Title as="h4" className="text-sm font-semibold text-gray-900">
                        Operator actions
                      </Title>
                      <div className="mt-4 space-y-3">
                        <Button
                          className="h-11 w-full rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
                          onClick={() => setDecision("assign")}
                        >
                          Assign
                        </Button>
                        <Button
                          className="h-11 w-full rounded-2xl bg-secondary px-4 text-secondary-foreground hover:bg-secondary/90"
                          onClick={() => setDecision("escalate")}
                        >
                          Escalate
                        </Button>
                        <Button
                          className="h-11 w-full rounded-2xl bg-red-dark px-4 text-white hover:bg-red-dark/90"
                          onClick={() => setDecision("resolve")}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center px-6">
                <div className="max-w-sm text-center">
                  <Title as="h3" className="text-lg font-semibold text-gray-900">
                    No active thread selected
                  </Title>
                  <Text className="mt-2 text-sm leading-6 text-gray-500">
                    Pick a conversation from the inbox list to inspect the
                    thread, metadata, and operator actions.
                  </Text>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {decision && activeMessage ? (
        <Modal
          isOpen
          onClose={() => setDecision(null)}
          containerClassName="max-w-xl"
        >
          <DecisionModal
            item={activeMessage}
            action={decision}
            note={decisionNote}
            setNote={setDecisionNote}
            onClose={() => setDecision(null)}
            onConfirm={applyDecision}
          />
        </Modal>
      ) : null}
    </div>
  );
}

function SupportReply({
  author,
  role,
  time,
  body,
  agent = false,
}: {
  author: string;
  role: string;
  time: string;
  body: string;
  agent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        agent ? "border-primary/20 bg-primary/5" : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <Text className="text-sm font-semibold text-gray-900">{author}</Text>
          <Text className="mt-0.5 text-xs uppercase tracking-[0.16em] text-gray-400">
            {role}
          </Text>
        </div>
        <Text className="text-xs text-gray-500">{time}</Text>
      </div>
      <Text className="mt-2 text-sm leading-7 text-gray-600">{body}</Text>
    </div>
  );
}

function ThreadEvent({
  role,
  time,
  body,
  tone = "default",
}: {
  role: string;
  time: string;
  body: string;
  tone?: "default" | "warning" | "success";
}) {
  const toneClass = {
    default: "border-gray-200 bg-gray-50 text-gray-600",
    warning: "border-secondary/30 bg-secondary/10 text-secondary-foreground",
    success: "border-primary/20 bg-primary/8 text-primary",
  };

  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${toneClass[tone]}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text className="text-xs font-semibold uppercase tracking-[0.18em]">
          {role}
        </Text>
        <Text className="text-xs">{time}</Text>
      </div>
      <Text className="mt-2 text-sm leading-6">{body}</Text>
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

function ProfileCard({
  title,
  customer,
  trustState,
  history,
}: {
  title: string;
  customer: string;
  trustState: string;
  history: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <Title as="h4" className="text-sm font-semibold text-gray-900">
        {title}
      </Title>
      <div className="mt-4 flex items-center gap-3">
        <Avatar name={customer} size="lg" rounded="full" />
        <div>
          <Text className="font-semibold text-gray-900">{customer}</Text>
          <Text className="mt-1 text-sm text-gray-500">{trustState}</Text>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {history.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-4 py-3"
          >
            <Text className="text-sm text-gray-500">{item.label}</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {item.value}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkedQueuesCard({ queues }: { queues: string[] }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <PiClockCountdownBold className="h-4 w-4 text-primary" />
        <Title as="h4" className="text-sm font-semibold text-gray-900">
          Linked teams
        </Title>
      </div>
      <div className="mt-4 space-y-3">
        {queues.map((queue) => (
          <div
            key={queue}
            className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
          >
            <Text className="text-sm font-medium text-gray-900">{queue}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
