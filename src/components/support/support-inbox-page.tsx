"use client";

import { useMemo, useState } from "react";
import { Avatar, Badge, Button, Input, Select, Text, Textarea, Title } from "rizzui";
import {
  PiCaretDownBold,
  PiChatsBold,
  PiMagnifyingGlassBold,
  PiPaperPlaneTiltBold,
  PiPaperclipBold,
  PiPlusBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";

type SupportBucket = "open" | "closed";
type SupportCategory = "unassigned" | "assigned-to-me" | "all-open" | "chat";

type ThreadEntry = {
  author: string;
  email: string;
  time: string;
  body: string;
  attachments?: Array<{ name: string; size: string }>;
};

type MessageItem = {
  id: string;
  title: string;
  summary: string;
  customer: string;
  email: string;
  supportType: "Chat" | "Email";
  bucket: SupportBucket;
  category: SupportCategory;
  markedAsRead: boolean;
  hasAttachments: boolean;
  date: string;
  priority: "Low" | "Medium" | "High";
  agent: string;
  status: "New" | "Waiting on contact" | "Waiting on us" | "Closed";
  thread: ThreadEntry[];
};

const supportNavItems = [
  { value: "unassigned" as const, label: "Unassigned", count: 88 },
  { value: "assigned-to-me" as const, label: "Assigned to me", count: 1515 },
  { value: "all-open" as const, label: "All open", count: 1603 },
  { value: "chat" as const, label: "Chat", count: 991 },
];

const messages: MessageItem[] = [
  {
    id: "SUP-1842",
    title: "Refund not reflected in wallet",
    summary: "Customer confirms the cancelled order refund still has not landed in wallet after two hours.",
    customer: "Martha Chola",
    email: "martha.chola@ntumai.test",
    supportType: "Chat",
    bucket: "open",
    category: "assigned-to-me",
    markedAsRead: false,
    hasAttachments: true,
    date: "4 min ago",
    priority: "High",
    agent: "Support lead",
    status: "Waiting on us",
    thread: [
      {
        author: "Martha Chola",
        email: "martha.chola@ntumai.test",
        time: "09:02",
        body: "I cancelled the order after the rider called, but I still have not received the refund in my wallet. The app still shows the balance unchanged.",
        attachments: [{ name: "wallet-screenshot.png", size: "340 KB" }],
      },
      {
        author: "Ntumai agent",
        email: "support@ntumai.com",
        time: "09:05",
        body: "We verified the cancellation event and escalated the wallet trace to finance operations. We are waiting for ledger confirmation before closing the case.",
      },
      {
        author: "Finance ops",
        email: "finance@ntumai.com",
        time: "09:11",
        body: "Gateway reversal is complete. Wallet ledger confirmation is still pending for this order.",
      },
    ],
  },
  {
    id: "SUP-1838",
    title: "Merchant tablet stops syncing",
    summary: "Store cannot mark orders ready, causing queue buildup on the lunchtime dispatch board.",
    customer: "QuickBite Kitchens",
    email: "ops@quickbite.test",
    supportType: "Email",
    bucket: "open",
    category: "all-open",
    markedAsRead: true,
    hasAttachments: false,
    date: "12 min ago",
    priority: "Medium",
    agent: "Partner pod",
    status: "Waiting on contact",
    thread: [
      {
        author: "QuickBite Kitchens",
        email: "ops@quickbite.test",
        time: "10:11",
        body: "Orders are arriving but the tablet does not refresh when we try to mark them ready.",
      },
      {
        author: "Ntumai agent",
        email: "support@ntumai.com",
        time: "10:14",
        body: "We linked the report to marketplace support and asked dispatch to watch the store queue.",
      },
    ],
  },
  {
    id: "SUP-1834",
    title: "Courier marked complete without handoff",
    summary: "Customer says the driver completed the trip but the parcel was not delivered to the recipient.",
    customer: "Joseph Tembo",
    email: "j.tembo@ntumai.test",
    supportType: "Chat",
    bucket: "open",
    category: "chat",
    markedAsRead: false,
    hasAttachments: true,
    date: "18 min ago",
    priority: "High",
    agent: "Resolution pod",
    status: "New",
    thread: [
      {
        author: "Joseph Tembo",
        email: "j.tembo@ntumai.test",
        time: "10:42",
        body: "The driver marked this complete but nothing was handed over at the destination. Please help urgently.",
        attachments: [{ name: "handoff-location.jpg", size: "220 KB" }],
      },
    ],
  },
  {
    id: "SUP-1807",
    title: "Closed refund follow-up",
    summary: "Customer confirmed refund was received and the issue can be closed.",
    customer: "Agnes Mumba",
    email: "agnes.mumba@ntumai.test",
    supportType: "Email",
    bucket: "closed",
    category: "unassigned",
    markedAsRead: true,
    hasAttachments: false,
    date: "1 day ago",
    priority: "Low",
    agent: "Billing queue",
    status: "Closed",
    thread: [
      {
        author: "Agnes Mumba",
        email: "agnes.mumba@ntumai.test",
        time: "Yesterday",
        body: "Refund has arrived now. Thank you.",
      },
    ],
  },
];

const sortOptions = [
  { value: "desc", label: "Newest" },
  { value: "asc", label: "Oldest" },
];

const agentOptions = [
  { value: "Support lead", label: "Support lead" },
  { value: "Partner pod", label: "Partner pod" },
  { value: "Resolution pod", label: "Resolution pod" },
  { value: "Billing queue", label: "Billing queue" },
];

const statusOptions = [
  { value: "New", label: "New" },
  { value: "Waiting on contact", label: "Waiting on contact" },
  { value: "Waiting on us", label: "Waiting on us" },
  { value: "Closed", label: "Closed" },
];

const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

export default function SupportInboxPage() {
  const [category, setCategory] = useState<SupportCategory>("unassigned");
  const [bucket, setBucket] = useState<SupportBucket>("open");
  const [sortBy, setSortBy] = useState("desc");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const visibleMessages = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = messages.filter((message) => {
      const matchesBucket = message.bucket === bucket;
      const matchesCategory = message.category === category;
      const haystack = [message.title, message.summary, message.customer, message.email].join(" ").toLowerCase();
      return matchesBucket && matchesCategory && (!needle || haystack.includes(needle));
    });

    return filtered.sort((a, b) => (sortBy === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [bucket, category, query, sortBy]);

  const activeMessage = visibleMessages[0] ?? messages[0];

  const allSelected = visibleMessages.length > 0 && visibleMessages.every((message) => selectedIds.includes(message.id));

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Support", "Inbox"]}
        eyebrow="Support Desk"
        title="Support Inbox"
        description="Template-aligned inbox workspace for support conversations, triage, and reply flow."
        action={
          <Button className="mt-4 w-full rounded-2xl @lg:mt-0 @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Create Ticket
          </Button>
        }
      />

      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <nav className="flex items-center gap-5 border-b border-gray-300">
          {supportNavItems.map((nav) => {
            const isActive = category === nav.value;
            return (
              <button
                key={nav.value}
                className={`relative flex items-center gap-2 py-2 text-sm outline-none ${
                  isActive ? "font-medium text-gray-900" : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => setCategory(nav.value)}
              >
                <span className="whitespace-nowrap">{nav.label}</span>
                <Badge size="sm" variant={isActive ? "solid" : "flat"}>{nav.count}</Badge>
                <span className={`absolute -bottom-px left-0 h-0.5 w-full ${isActive ? "bg-primary" : "bg-transparent"}`} />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="@container">
        <div className="mt-5 items-start @container @4xl:grid @4xl:grid-cols-12 @4xl:gap-7">
          <div className="@xs:col-span-12 @4xl:col-span-4">
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() =>
                    setSelectedIds(allSelected ? [] : visibleMessages.map((message) => message.id))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div className="overflow-hidden rounded border border-muted">
                  <button
                    className={`px-2.5 py-1.5 text-sm font-medium transition duration-300 ${
                      bucket === "open" ? "bg-gray-100 text-gray-900" : "text-gray-500"
                    }`}
                    onClick={() => setBucket("open")}
                  >
                    Open
                  </button>
                  <button
                    className={`px-2.5 py-1.5 text-sm font-medium transition duration-300 ${
                      bucket === "closed" ? "bg-gray-100 text-gray-900" : "text-gray-500"
                    }`}
                    onClick={() => setBucket("closed")}
                  >
                    Closed
                  </button>
                </div>
              </div>

              <Select
                size="sm"
                variant="text"
                value={sortBy}
                options={sortOptions as any}
                onChange={(option: any) => setSortBy(option?.value ?? "desc")}
                displayValue={(selected: string) => sortOptions.find((o) => o.value === selected)?.label}
                suffix={<PiCaretDownBold className="h-3 w-3" />}
                className="w-auto"
              />
            </div>

            <Input
              type="search"
              placeholder="Search conversations..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
              inputClassName="h-10"
            />

            <div className="mt-5 overflow-hidden rounded-lg border border-muted bg-white">
              {visibleMessages.map((message) => {
                const isSelected = selectedIds.includes(message.id);
                const isActive = activeMessage.id === message.id;
                return (
                  <div
                    key={message.id}
                    className={`grid cursor-pointer grid-cols-[24px_1fr] items-start gap-3 border-t border-muted p-5 ${
                      isActive ? "border-t-2 border-t-primary bg-gray-50/70" : ""
                    }`}
                    onClick={() => {
                      const index = visibleMessages.findIndex((item) => item.id === message.id);
                      if (index > -1) {
                        const reordered = [...visibleMessages];
                        const [selected] = reordered.splice(index, 1);
                        reordered.unshift(selected);
                        // no-op reorder effect through local active derivation not persisted
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(event) => {
                        event.stopPropagation();
                        setSelectedIds((current) =>
                          current.includes(message.id)
                            ? current.filter((id) => id !== message.id)
                            : [...current, message.id],
                        );
                      }}
                      className="mt-1 h-4 w-4 rounded border-gray-300"
                    />
                    <div>
                      <div className="flex items-center justify-between lg:flex-col lg:items-start 2xl:flex-row 2xl:items-center">
                        <Title as="h4" className="flex items-center">
                          <span className="text-sm font-semibold text-gray-800">{message.title}</span>
                          {message.hasAttachments ? <PiPaperclipBold className="ml-2 h-4 w-4 text-gray-500" /> : null}
                          {!message.markedAsRead ? <Badge renderAsDot className="ml-3 h-2.5 w-2.5 bg-primary" /> : null}
                        </Title>
                        <span className="text-xs text-gray-500">{message.date}</span>
                      </div>
                      <p className="mt-1 line-clamp-3 text-sm text-gray-500">{message.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden @4xl:col-span-8 @4xl:block">
            <div className="relative rounded-lg border border-muted px-5 py-5">
              <header className="flex flex-col justify-between gap-4 border-b border-muted pb-5 3xl:flex-row 3xl:items-center">
                <div className="flex flex-col items-start justify-between gap-3 xs:flex-row xs:items-center xs:gap-6 lg:justify-normal">
                  <Title as="h4" className="font-semibold">{activeMessage.title}</Title>
                  <Badge variant="outline" color="danger" size="sm">
                    Product Issue
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
                  <Select
                    variant="text"
                    value={activeMessage.agent}
                    options={agentOptions as any}
                    displayValue={(selected: string) => selected}
                    suffix={<PiCaretDownBold className="h-3 w-3" />}
                    className="w-auto"
                  />
                  <Select
                    variant="text"
                    value={activeMessage.status}
                    options={statusOptions as any}
                    displayValue={(selected: string) => selected}
                    suffix={<PiCaretDownBold className="h-3 w-3" />}
                    className="w-auto"
                  />
                  <Select
                    variant="text"
                    value={activeMessage.priority}
                    options={priorityOptions as any}
                    displayValue={(selected: string) => selected}
                    suffix={<PiCaretDownBold className="h-3 w-3" />}
                    className="w-auto"
                  />
                  <Button variant="outline" className="h-9 rounded-2xl px-3">Actions</Button>
                </div>
              </header>

              <div className="custom-scrollbar max-h-[calc(100dvh-32rem)] overflow-y-auto py-5">
                <div className="grid gap-8">
                  {activeMessage.thread.map((entry, index) => (
                    <div key={`${entry.author}-${entry.time}-${index}`}>
                      <div className="grid grid-cols-[32px_1fr] items-start gap-3 lg:gap-4 xl:grid-cols-[48px_1fr]">
                        <Avatar
                          name={entry.author}
                          initials={entry.author.slice(0, 2).toUpperCase()}
                          className="!h-8 !w-8 bg-[#70C5E0] font-medium text-white xl:!h-11 xl:!w-11"
                        />
                        <div className="-mt-1.5 lg:mt-0">
                          <div className="flex items-center justify-between">
                            <Title as="h3" className="text-sm font-medium">{entry.author}</Title>
                          </div>
                          <div className="mt-1.5 items-center gap-2 text-xs text-gray-500 lg:flex">
                            <span className="flex items-center lowercase">{entry.email}</span>
                            <span className="hidden lg:block">•</span>
                            <span>Open {entry.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-10 mt-3 grid gap-2 leading-relaxed xl:ml-16 2xl:mt-4">
                        <Text>{entry.body}</Text>
                        {entry.attachments?.length ? (
                          <div className="mt-2 grid gap-2 md:grid-cols-2 2xl:grid-cols-3">
                            {entry.attachments.map((attachment) => (
                              <div key={attachment.name} className="grid grid-cols-[40px_1fr] gap-2.5">
                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                  <PiPaperclipBold className="h-4 w-4 text-gray-500" />
                                </div>
                                <div className="text-xs">
                                  <span className="flex items-center gap-2 font-medium text-gray-700">
                                    {attachment.name}
                                    <span className="text-gray-500">({attachment.size})</span>
                                  </span>
                                  <div className="mt-2 flex items-center gap-2 text-gray-500">
                                    <button>Preview</button>
                                    <span>•</span>
                                    <button>Download</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-muted pt-5">
                <Textarea
                  placeholder="Write a reply..."
                  rows={7}
                  textareaClassName="rounded-2xl"
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-2xl px-4">
                      <PiPaperclipBold className="me-1.5 h-4 w-4" />
                      Attach
                    </Button>
                  </div>
                  <Button className="h-10 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                    <PiPaperPlaneTiltBold className="me-1.5 h-4 w-4" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
