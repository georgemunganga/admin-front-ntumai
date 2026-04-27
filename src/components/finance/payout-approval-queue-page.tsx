"use client";

import { useMemo, useState } from "react";
import { Avatar, Badge, Button, Input, Select, Table, Text, Title } from "rizzui";
import {
  PiArrowClockwiseBold,
  PiCaretRightBold,
  PiMagnifyingGlassBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import { useDrawer } from "@/app/shared/drawer-views/use-drawer";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import { Modal } from "@/components/modal";

type ReviewStatus = "review" | "queued" | "monitoring" | "live" | "paused" | "at_risk";
type PayoutTarget = "tasker" | "vendor";
type DecisionAction = "approve" | "hold" | "reject";

type PayoutCase = {
  id: string;
  reference: string;
  targetType: PayoutTarget;
  accountName: string;
  city: string;
  status: ReviewStatus;
  amount: string;
  destination: string;
  owner: string;
  age: string;
  issue: string;
  sourceSummary: string;
  riskFlags: string[];
  timeline: Array<{
    label: string;
    detail: string;
    time: string;
  }>;
  notes: string[];
};

const targetLabels: Record<PayoutTarget, string> = {
  tasker: "Tasker payout",
  vendor: "Vendor settlement",
};

const tabs = [
  { value: "all", label: "All approvals" },
  { value: "tasker", label: "Taskers" },
  { value: "vendor", label: "Vendors" },
] as const;

const seed: PayoutCase[] = [
  {
    id: "PAY-3204",
    reference: "SET-88014",
    targetType: "tasker",
    accountName: "Moses Banda",
    city: "Lusaka",
    status: "review",
    amount: "ZMW 3,420",
    destination: "Airtel Money ••• 4102",
    owner: "Finance approvals",
    age: "14m",
    issue: "Weekly tasker payout is ready, but one incentive adjustment landed after the first settlement draft.",
    sourceSummary: "42 completed deliveries, 3 tips, 1 incentive adjustment",
    riskFlags: ["Incentive adjustment late"],
    timeline: [
      { label: "Payout request grouped", detail: "Weekly earnings bundle entered settlement batch.", time: "09:02" },
      { label: "Adjustment applied", detail: "Incentive delta landed after draft generation.", time: "09:08" },
      { label: "Approval hold opened", detail: "Finance should confirm the final payout amount.", time: "09:11" },
    ],
    notes: ["Likely approvable after confirming adjustment math against completed work."],
  },
  {
    id: "PAY-3198",
    reference: "SET-87986",
    targetType: "vendor",
    accountName: "Green Basket Market",
    city: "Kitwe",
    status: "monitoring",
    amount: "ZMW 12,880",
    destination: "Bank transfer ••• 9124",
    owner: "Settlements desk",
    age: "26m",
    issue: "Vendor settlement batch has a mismatch between order returns and the net payout figure.",
    sourceSummary: "178 marketplace orders, 6 returns, 2 refunds pending reconciliation",
    riskFlags: ["Return mismatch", "Refund still pending"],
    timeline: [
      { label: "Batch created", detail: "Vendor settlement window closed and batch generated.", time: "08:18" },
      { label: "Reconciliation drift", detail: "Returns figure did not match net payout output.", time: "08:26" },
      { label: "Manual review opened", detail: "Settlement should stay on hold until reconciliation closes.", time: "08:34" },
    ],
    notes: ["Do not release until refunds and returns agree with the final net amount."],
  },
  {
    id: "PAY-3189",
    reference: "SET-87921",
    targetType: "tasker",
    accountName: "Ruth Mwape",
    city: "Ndola",
    status: "at_risk",
    amount: "ZMW 5,160",
    destination: "MTN Money ••• 1182",
    owner: "Risk finance review",
    age: "41m",
    issue: "Payout destination changed within 24 hours of settlement and the account has an unresolved identity review flag.",
    sourceSummary: "Commercial-mode tasker payout with recent destination update",
    riskFlags: ["Recent destination change", "Identity review open"],
    timeline: [
      { label: "Payout request created", detail: "Settlement request created for weekly batch.", time: "07:46" },
      { label: "Destination changed", detail: "Wallet payout account updated after batch creation.", time: "07:58" },
      { label: "Risk hold applied", detail: "Finance and risk should review before release.", time: "08:05" },
    ],
    notes: ["This should not be approved with the normal one-click path."],
  },
  {
    id: "PAY-3174",
    reference: "SET-87880",
    targetType: "vendor",
    accountName: "QuickBite Express",
    city: "Lusaka",
    status: "queued",
    amount: "ZMW 8,940",
    destination: "Bank transfer ••• 5510",
    owner: "Treasury release",
    age: "53m",
    issue: "Settlement is clean, but treasury has not yet released the transfer window for this merchant cycle.",
    sourceSummary: "94 completed orders, no open refund or return mismatch",
    riskFlags: ["Treasury window pending"],
    timeline: [
      { label: "Merchant settlement ready", detail: "Reconciliation completed with no finance issues.", time: "07:04" },
      { label: "Queued for treasury", detail: "Waiting on bank release window.", time: "07:18" },
    ],
    notes: ["Healthy batch. This is mostly a release-control case."],
  },
  {
    id: "PAY-3168",
    reference: "SET-87842",
    targetType: "tasker",
    accountName: "Natasha Chinyama",
    city: "Kitwe",
    status: "paused",
    amount: "ZMW 1,840",
    destination: "Airtel Money ••• 2180",
    owner: "Compliance hold",
    age: "1h 12m",
    issue: "Payout is paused because the tasker still has an unresolved KYC resubmission tied to the same legal identity.",
    sourceSummary: "17 completed deliveries, no incentive issue, compliance dependency open",
    riskFlags: ["KYC resubmission open"],
    timeline: [
      { label: "Batch generated", detail: "Tasker settlement prepared normally.", time: "06:22" },
      { label: "Compliance dependency found", detail: "KYC resubmission status blocked automatic release.", time: "06:33" },
      { label: "Payout paused", detail: "Finance should wait for compliance resolution.", time: "06:40" },
    ],
    notes: ["Release should remain blocked unless compliance explicitly clears it."],
  },
];

function PayoutDecisionModal({
  item,
  action,
  onClose,
  onSubmit,
}: {
  item: PayoutCase;
  action: DecisionAction;
  onClose: () => void;
  onSubmit: (payload: { reasonCode: string; note: string }) => void;
}) {
  const [reasonCode, setReasonCode] = useState(
    action === "approve" ? "approved_for_release" : action === "hold" ? "manual_hold" : "rejected_for_now",
  );
  const [note, setNote] = useState("");

  const tone =
    action === "approve"
      ? "bg-primary text-white hover:bg-primary/90"
      : action === "hold"
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        : "bg-red-dark text-white hover:bg-red-dark/90";

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7">
      <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.id}</Text>
      <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
        {action === "approve" ? "Approve payout" : action === "hold" ? "Place payout on hold" : "Reject payout"}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">
        Record the finance decision for {item.reference} so treasury, support, and risk all see the same settlement trail.
      </Text>

      <div className="mt-6 space-y-4">
        <Select
          label="Reason code"
          options={[
            { label: "Approved for release", value: "approved_for_release" },
            { label: "Manual hold", value: "manual_hold" },
            { label: "Risk review required", value: "risk_review_required" },
            { label: "Reconciliation mismatch", value: "reconciliation_mismatch" },
            { label: "Rejected for now", value: "rejected_for_now" },
          ]}
          value={reasonCode}
          onChange={(option: any) => setReasonCode(option?.value ?? "")}
          selectClassName="rounded-2xl"
        />
        <div>
          <Text className="mb-2 text-sm font-medium text-gray-700">Operator note</Text>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="Add the release, hold, or rejection context that the next finance operator will need."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={onClose}>
          Cancel
        </Button>
        <Button className={`h-11 rounded-2xl px-4 ${tone}`} onClick={() => onSubmit({ reasonCode, note })}>
          {action === "approve" ? "Confirm approval" : action === "hold" ? "Confirm hold" : "Confirm rejection"}
        </Button>
      </div>
    </div>
  );
}

function PayoutDrawer({
  item,
  onApplyDecision,
}: {
  item: PayoutCase;
  onApplyDecision: (id: string, action: DecisionAction, reasonCode: string, note: string) => void;
}) {
  const { closeDrawer } = useDrawer();
  const [decision, setDecision] = useState<DecisionAction | null>(null);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-100 px-6 py-5">
        <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.id}</Text>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <Title as="h3" className="text-xl font-semibold text-gray-900">{item.reference}</Title>
            <Text className="mt-2 text-sm text-gray-500">
              {targetLabels[item.targetType]} · {item.accountName} · {item.city}
            </Text>
          </div>
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoTile label="Amount" value={item.amount} />
          <InfoTile label="Destination" value={item.destination} />
          <InfoTile label="Queue owner" value={item.owner} />
          <InfoTile label="Review age" value={item.age} />
        </div>

        <section className="rounded-3xl border border-gray-200 bg-gray-50/70 p-5">
          <Title as="h4" className="text-sm font-semibold text-gray-900">Current issue</Title>
          <Text className="mt-3 text-sm leading-6 text-gray-600">{item.issue}</Text>
          <Text className="mt-3 text-sm font-medium text-gray-700">{item.sourceSummary}</Text>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.riskFlags.map((flag) => (
              <Badge key={flag} variant="flat" className="rounded-2xl bg-red-lighter/70 px-3 py-1.5 text-red-dark">
                {flag}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">Timeline</Title>
          <div className="mt-4 space-y-3">
            {item.timeline.map((entry) => (
              <div key={`${entry.label}-${entry.time}`} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{entry.label}</Text>
                    <Text className="mt-1 text-sm leading-6 text-gray-500">{entry.detail}</Text>
                  </div>
                  <Text className="text-xs font-medium text-gray-500">{entry.time}</Text>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">Internal notes</Title>
          <div className="mt-4 space-y-3">
            {item.notes.map((note) => (
              <div key={note} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <Text className="text-sm leading-6 text-gray-600">{note}</Text>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-gray-100 px-6 py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button
            variant="outline"
            className="h-11 rounded-2xl border-red-200 px-4 text-red-dark hover:border-red-dark hover:bg-red-lighter/50"
            onClick={() => setDecision("reject")}
          >
            Reject
          </Button>
          <Button
            className="h-11 rounded-2xl bg-secondary px-4 text-secondary-foreground hover:bg-secondary/90"
            onClick={() => setDecision("hold")}
          >
            Hold
          </Button>
          <Button
            className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
            onClick={() => setDecision("approve")}
          >
            Approve
          </Button>
        </div>
      </div>

      <Modal isOpen={decision !== null} onClose={() => setDecision(null)} size="md" rounded="lg">
        {decision ? (
          <PayoutDecisionModal
            item={item}
            action={decision}
            onClose={() => setDecision(null)}
            onSubmit={({ reasonCode, note }) => {
              onApplyDecision(item.id, decision, reasonCode, note);
              setDecision(null);
              closeDrawer();
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
      <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{label}</Text>
      <Text className="mt-2 font-semibold text-gray-900">{value}</Text>
    </div>
  );
}

export default function PayoutApprovalQueuePage() {
  const { openDrawer } = useDrawer();
  const [cases, setCases] = useState(seed);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("all");
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");

  const visibleCases = useMemo(() => {
    return cases.filter((item) => {
      const matchesType = activeTab === "all" ? true : item.targetType === activeTab;
      const matchesOwner = ownerFilter === "all" ? true : item.owner === ownerFilter;
      const haystack = [
        item.id,
        item.reference,
        item.accountName,
        item.city,
        item.issue,
        item.destination,
        item.owner,
        item.sourceSummary,
      ]
        .join(" ")
        .toLowerCase();
      return matchesType && matchesOwner && haystack.includes(query.toLowerCase());
    });
  }, [activeTab, cases, ownerFilter, query]);

  const ownerOptions = useMemo(() => {
    const owners = Array.from(new Set(cases.map((item) => item.owner)));
    return [{ label: "All owners", value: "all" }, ...owners.map((owner) => ({ label: owner, value: owner }))];
  }, [cases]);

  const counts = useMemo(
    () => ({
      pending: cases.filter((item) => item.status === "review" || item.status === "queued").length,
      risky: cases.filter((item) => item.status === "at_risk" || item.status === "paused").length,
      ready: cases.filter((item) => item.status === "review" && item.riskFlags.length === 1 && item.riskFlags[0] === "Treasury window pending").length,
    }),
    [cases],
  );

  const openCase = (item: PayoutCase) => {
    openDrawer({
      placement: "right",
      containerClassName: "w-full max-w-[620px] bg-white p-0",
      view: (
        <PayoutDrawer
          item={item}
          onApplyDecision={(id, action, reasonCode, note) => {
            setCases((current) =>
              current.map((entry) => {
                if (entry.id !== id) return entry;
                if (action === "approve") {
                  return {
                    ...entry,
                    status: "live",
                    owner: "Treasury released",
                    issue: "Payout approved and ready for release or transfer execution.",
                    notes: [`Approved: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                    timeline: [
                      { label: "Payout approved", detail: note || `Approved with reason code ${reasonCode}.`, time: "Now" },
                      ...entry.timeline,
                    ],
                  };
                }
                if (action === "hold") {
                  return {
                    ...entry,
                    status: "monitoring",
                    owner: "Manual finance hold",
                    issue: "Payout remains open but is now waiting on manual finance follow-up.",
                    notes: [`Held: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                    timeline: [
                      { label: "Payout hold placed", detail: note || `Held with reason code ${reasonCode}.`, time: "Now" },
                      ...entry.timeline,
                    ],
                  };
                }
                return {
                  ...entry,
                  status: "paused",
                  owner: "Rejected by finance",
                  issue: "Payout should not proceed until a new compliant settlement path is prepared.",
                  notes: [`Rejected: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                  timeline: [
                    { label: "Payout rejected", detail: note || `Rejected with reason code ${reasonCode}.`, time: "Now" },
                    ...entry.timeline,
                  ],
                };
              }),
            );
          }}
        />
      ),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Payouts"]}
        eyebrow="Finance Ops"
        title="Payout approval queue"
        description="Handle tasker payouts and vendor settlements as reviewed finance cases, not static settlement summaries."
        badge="Queue"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Pending approvals"
          value={String(counts.pending)}
          change="Finance action needed"
          tone="neutral"
          detail="Payout cases still waiting for approval, hold, or rejection decisions."
        />
        <StatCard
          label="Risk or blocked"
          value={String(counts.risky)}
          change="Needs care"
          tone="warning"
          detail="Cases with compliance, reconciliation, or destination risks that should not flow normally."
        />
        <StatCard
          label="Simple release cases"
          value={String(counts.ready)}
          change="Low-friction"
          tone="positive"
          detail="Batches that appear operationally healthy and may be released quickly."
        />
      </div>

      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <nav className="flex items-center gap-5 border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            const count = tab.value === "all" ? cases.length : cases.filter((item) => item.targetType === tab.value).length;
            return (
              <button
                key={tab.value}
                className="relative flex items-center gap-2 py-2 text-sm outline-none"
                onClick={() => setActiveTab(tab.value)}
              >
                <span className={isActive ? "font-medium text-gray-900" : "text-gray-500 hover:text-gray-800"}>
                  {tab.label}
                </span>
                <Badge size="sm" variant={isActive ? "solid" : "flat"}>
                  {count}
                </Badge>
                <span className={`absolute -bottom-px left-0 h-0.5 w-full ${isActive ? "bg-primary" : "bg-transparent"}`} />
              </button>
            );
          })}
        </nav>
      </div>

      <ShellCard title="Settlement approval queue" description="Queue-first payout handling with review context, risk visibility, and controlled finance actions.">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              type="search"
              placeholder="Search payout, account, destination, issue, or owner"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
              inputClassName="h-11"
            />
            <Select
              options={ownerOptions}
              value={ownerFilter}
              onChange={(option: any) => setOwnerFilter(option?.value ?? "all")}
              className="min-w-[220px]"
              selectClassName="h-11 rounded-2xl"
            />
          </div>
          <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={() => setCases(seed)}>
            <PiArrowClockwiseBold className="me-2 h-4 w-4" />
            Reset demo state
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table variant="modern" className="min-w-[1120px]">
            <Table.Header>
              <Table.Row>
                <Table.Head className="bg-gray-100">Reference</Table.Head>
                <Table.Head className="bg-gray-100">Payout type</Table.Head>
                <Table.Head className="bg-gray-100">Issue</Table.Head>
                <Table.Head className="bg-gray-100">Owner</Table.Head>
                <Table.Head className="bg-gray-100">Age</Table.Head>
                <Table.Head className="bg-gray-100">Status</Table.Head>
                <Table.Head className="bg-gray-100 text-right">Action</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleCases.map((item) => (
                <Table.Row key={item.id} className="cursor-pointer" onClick={() => openCase(item)}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={item.reference}
                        initials={item.reference.slice(0, 2)}
                        className="bg-primary/10 text-primary"
                      />
                      <div>
                        <Text className="font-semibold text-gray-900">{item.reference}</Text>
                        <Text className="mt-1 text-sm text-gray-500">
                          {item.id} · {item.accountName} · {item.city}
                        </Text>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <Text className="font-medium text-gray-900">{targetLabels[item.targetType]}</Text>
                      <Text className="mt-1 text-sm text-gray-500">{item.amount}</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-start gap-2">
                      <PiWarningCircleBold className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground" />
                      <Text className="text-sm leading-6 text-gray-600">{item.issue}</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="font-medium text-gray-900">{item.owner}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="font-medium text-gray-900">{item.age}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={item.status} />
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <Button
                      variant="text"
                      className="h-auto p-0 text-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        openCase(item);
                      }}
                    >
                      Review
                      <PiCaretRightBold className="ms-1 h-4 w-4" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </ShellCard>
    </div>
  );
}
