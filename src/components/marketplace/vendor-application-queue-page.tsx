"use client";

import Link from "next/link";
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
import { routes } from "@/config/routes";
import { Modal } from "@/components/modal";

type ReviewStatus = "review" | "queued" | "monitoring" | "live" | "paused" | "at_risk";
type BusinessType = "restaurant" | "grocery" | "pharmacy" | "retail" | "services";
type ReviewStage = "intake" | "kyc" | "store_setup" | "catalog_ready" | "final_launch" | "resubmission";
type DecisionAction = "approve" | "changes" | "reject";

type VendorApplication = {
  id: string;
  businessName: string;
  ownerName: string;
  city: string;
  businessType: BusinessType;
  stage: ReviewStage;
  status: ReviewStatus;
  owner: string;
  age: string;
  submittedAt: string;
  phone: string;
  issue: string;
  blockers: string[];
  tags: string[];
  checkpoints: Array<{
    label: string;
    status: ReviewStatus;
    detail: string;
  }>;
  timeline: Array<{
    label: string;
    detail: string;
    time: string;
  }>;
  notes: string[];
  links: Array<{
    label: string;
    href: string;
  }>;
};

const stageLabels: Record<ReviewStage, string> = {
  intake: "Intake review",
  kyc: "KYC review",
  store_setup: "Store setup",
  catalog_ready: "Catalog ready",
  final_launch: "Final launch",
  resubmission: "Resubmission",
};

const businessLabels: Record<BusinessType, string> = {
  restaurant: "Restaurant",
  grocery: "Grocery",
  pharmacy: "Pharmacy",
  retail: "Retail",
  services: "Services",
};

const tabs = [
  { value: "all", label: "All applications" },
  { value: "intake", label: "Intake" },
  { value: "kyc", label: "KYC" },
  { value: "store_setup", label: "Store setup" },
  { value: "catalog_ready", label: "Catalog" },
  { value: "final_launch", label: "Final launch" },
  { value: "resubmission", label: "Resubmissions" },
] as const;

const seed: VendorApplication[] = [
  {
    id: "VND-24012",
    businessName: "QuickBite Express",
    ownerName: "Martha Chola",
    city: "Lusaka",
    businessType: "restaurant",
    stage: "final_launch",
    status: "review",
    owner: "Marketplace launch",
    age: "1h 18m",
    submittedAt: "Today, 08:44",
    phone: "+260 977 450 210",
    issue: "KYC and store setup are complete. Final launch needs menu quality confirmation and service hours sign-off.",
    blockers: ["Launch sign-off pending"],
    tags: ["Ready to launch", "Restaurant"],
    checkpoints: [
      { label: "Business KYC", status: "live", detail: "Owner identity and business registration accepted." },
      { label: "Store profile", status: "live", detail: "Logo, banner, and trading info uploaded." },
      { label: "Catalog quality", status: "review", detail: "Two hero images still need final merchandising review." },
      { label: "Service hours", status: "live", detail: "Opening schedule configured and valid." },
    ],
    timeline: [
      { label: "Application submitted", detail: "Vendor onboarding wizard completed.", time: "08:44" },
      { label: "KYC approved", detail: "Compliance cleared registration pack.", time: "09:10" },
      { label: "Store created", detail: "Provisioning and catalog import completed.", time: "09:37" },
      { label: "Waiting launch sign-off", detail: "Marketplace launch team should clear the last merchandising checks.", time: "09:58" },
    ],
    notes: ["Strong candidate for same-day launch."],
    links: [
      { label: "Vendor record", href: routes.marketplace.vendorDetails("VND-2398") },
      { label: "Products", href: routes.marketplace.products },
    ],
  },
  {
    id: "VND-24003",
    businessName: "CityCare Pharmacy",
    ownerName: "Brian Zulu",
    city: "Ndola",
    businessType: "pharmacy",
    stage: "kyc",
    status: "at_risk",
    owner: "Compliance desk",
    age: "2h 42m",
    submittedAt: "Today, 07:12",
    phone: "+260 971 550 908",
    issue: "Restricted-goods merchant. Pharmacy license upload is incomplete and the supervising pharmacist details are missing.",
    blockers: ["License incomplete", "Responsible pharmacist not listed"],
    tags: ["Restricted category", "High scrutiny"],
    checkpoints: [
      { label: "Owner identity", status: "live", detail: "Primary identity cleared." },
      { label: "Business registration", status: "review", detail: "Company registration readable but not yet signed off." },
      { label: "Pharmacy license", status: "at_risk", detail: "Uploaded scan is missing one page." },
      { label: "Responsible contact", status: "queued", detail: "Supervising pharmacist details not filled in onboarding data." },
    ],
    timeline: [
      { label: "Application submitted", detail: "Restricted merchant application created.", time: "07:12" },
      { label: "Category escalation", detail: "Pharmacy category moved into compliance lane.", time: "07:22" },
      { label: "Missing license pages", detail: "Document packet failed completeness check.", time: "07:41" },
    ],
    notes: ["Do not move this to standard launch flow until restricted-goods checks are closed."],
    links: [
      { label: "Vendor record", href: routes.marketplace.vendorDetails("VND-2394") },
      { label: "Safety compliance", href: routes.risk.compliance },
      { label: "Support escalations", href: routes.supportDesk.escalations },
    ],
  },
  {
    id: "VND-23996",
    businessName: "Green Basket Market",
    ownerName: "Natasha Chinyama",
    city: "Kitwe",
    businessType: "grocery",
    stage: "catalog_ready",
    status: "queued",
    owner: "Catalog ops",
    age: "4h 11m",
    submittedAt: "Today, 05:58",
    phone: "+260 969 002 180",
    issue: "Catalog import succeeded, but 18 products are missing category assignments and 6 items have no primary image.",
    blockers: ["Category cleanup", "Image gaps"],
    tags: ["Bulk catalog import", "Needs cleanup"],
    checkpoints: [
      { label: "Business KYC", status: "live", detail: "All core registration checks passed." },
      { label: "Store provisioning", status: "live", detail: "Store shell created successfully." },
      { label: "Catalog taxonomy", status: "review", detail: "Several products are uncategorized." },
      { label: "Image completeness", status: "queued", detail: "Missing hero images on some products." },
    ],
    timeline: [
      { label: "Store created", detail: "Merchant store and owner account linked.", time: "06:21" },
      { label: "Bulk import completed", detail: "Catalog sync finished from spreadsheet upload.", time: "06:49" },
      { label: "Catalog cleanup opened", detail: "Marketplace ops queue now owns product readiness.", time: "07:02" },
    ],
    notes: ["This should stay in catalog lane, not reopen compliance work."],
    links: [
      { label: "Vendor record", href: routes.marketplace.vendorDetails("VND-2401") },
      { label: "Categories", href: routes.marketplace.categories },
      { label: "Products", href: routes.marketplace.products },
    ],
  },
  {
    id: "VND-23988",
    businessName: "HomeBox Supplies",
    ownerName: "Agnes Mumba",
    city: "Kabwe",
    businessType: "retail",
    stage: "store_setup",
    status: "monitoring",
    owner: "Provisioning desk",
    age: "6h 08m",
    submittedAt: "Yesterday, 16:04",
    phone: "+260 963 404 802",
    issue: "Store record exists, but delivery radius, pickup hours, and payout profile are not fully configured.",
    blockers: ["Delivery radius missing", "Payout profile incomplete"],
    tags: ["Provisioning hold"],
    checkpoints: [
      { label: "Business KYC", status: "live", detail: "Business and owner documents approved." },
      { label: "Store shell", status: "live", detail: "Provisioned successfully." },
      { label: "Operations setup", status: "monitoring", detail: "Core service settings not fully completed." },
      { label: "Payout profile", status: "queued", detail: "Settlement destination still missing." },
    ],
    timeline: [
      { label: "KYC approved", detail: "Compliance closed business checks.", time: "16:28" },
      { label: "Store created", detail: "Provisioning desk opened store-setup case.", time: "17:02" },
      { label: "Config gaps found", detail: "Missing service radius and settlement details.", time: "17:18" },
    ],
    notes: ["Good launch candidate after ops settings are filled."],
    links: [
      { label: "Vendor record", href: routes.marketplace.vendorDetails("VND-2388") },
      { label: "Payouts", href: routes.sales.payouts },
      { label: "Zones", href: routes.logistics.zones },
    ],
  },
  {
    id: "VND-23970",
    businessName: "FastFix Services",
    ownerName: "Ruth Mulenga",
    city: "Lusaka",
    businessType: "services",
    stage: "resubmission",
    status: "paused",
    owner: "Vendor follow-up",
    age: "1d",
    submittedAt: "Yesterday, 10:15",
    phone: "+260 978 118 221",
    issue: "Resubmission requested because the business registration name does not match the payout account owner name.",
    blockers: ["Name mismatch", "Awaiting corrected payout profile"],
    tags: ["Resubmission", "Finance dependency"],
    checkpoints: [
      { label: "Owner identity", status: "live", detail: "Primary owner identity is valid." },
      { label: "Business registration", status: "review", detail: "Business record name conflicts with payout profile." },
      { label: "Payout profile", status: "paused", detail: "Launch should stay blocked until name alignment is fixed." },
      { label: "Store launch", status: "queued", detail: "Cannot continue until finance identity mismatch closes." },
    ],
    timeline: [
      { label: "Application submitted", detail: "Service merchant onboarding completed.", time: "10:15" },
      { label: "Finance mismatch", detail: "Payout owner name did not match business record.", time: "10:42" },
      { label: "Resubmission requested", detail: "Merchant must correct payout owner or business record.", time: "11:06" },
    ],
    notes: ["Keep this in follow-up lane until corrected legal entity data arrives."],
    links: [
      { label: "Payouts", href: routes.sales.payouts },
      { label: "Vendor list", href: routes.marketplace.vendors },
    ],
  },
];

function VendorDecisionModal({
  item,
  action,
  onClose,
  onSubmit,
}: {
  item: VendorApplication;
  action: DecisionAction;
  onClose: () => void;
  onSubmit: (payload: { reasonCode: string; note: string }) => void;
}) {
  const [reasonCode, setReasonCode] = useState(
    action === "approve" ? "launch_ready" : action === "changes" ? "merchant_changes_required" : "compliance_rejection",
  );
  const [note, setNote] = useState("");

  const tone =
    action === "approve"
      ? "bg-primary text-white hover:bg-primary/90"
      : action === "changes"
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        : "bg-red-dark text-white hover:bg-red-dark/90";

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7">
      <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.id}</Text>
      <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
        {action === "approve" ? "Approve vendor application" : action === "changes" ? "Request merchant changes" : "Reject vendor application"}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">
        Record the review outcome for {item.businessName} so Marketplace Ops, Compliance, and Support can all read the same decision trail.
      </Text>

      <div className="mt-6 space-y-4">
        <Select
          label="Reason code"
          options={[
            { label: "Launch ready", value: "launch_ready" },
            { label: "Merchant changes required", value: "merchant_changes_required" },
            { label: "Restricted category hold", value: "restricted_category_hold" },
            { label: "Provisioning gap", value: "provisioning_gap" },
            { label: "Compliance rejection", value: "compliance_rejection" },
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
            placeholder="Add the launch, compliance, or provisioning context that the next team will need."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={onClose}>
          Cancel
        </Button>
        <Button className={`h-11 rounded-2xl px-4 ${tone}`} onClick={() => onSubmit({ reasonCode, note })}>
          {action === "approve" ? "Confirm approval" : action === "changes" ? "Send change request" : "Confirm rejection"}
        </Button>
      </div>
    </div>
  );
}

function VendorApplicationDrawer({
  item,
  onApplyDecision,
}: {
  item: VendorApplication;
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
            <Title as="h3" className="text-xl font-semibold text-gray-900">{item.businessName}</Title>
            <Text className="mt-2 text-sm text-gray-500">
              {item.ownerName} · {item.city} · {businessLabels[item.businessType]} · Submitted {item.submittedAt}
            </Text>
          </div>
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoTile label="Stage" value={stageLabels[item.stage]} />
          <InfoTile label="Queue owner" value={item.owner} />
          <InfoTile label="Review age" value={item.age} />
          <InfoTile label="Phone" value={item.phone} />
        </div>

        <section className="rounded-3xl border border-gray-200 bg-gray-50/70 p-5">
          <Title as="h4" className="text-sm font-semibold text-gray-900">Current issue</Title>
          <Text className="mt-3 text-sm leading-6 text-gray-600">{item.issue}</Text>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.blockers.map((blocker) => (
              <Badge key={blocker} variant="flat" className="rounded-2xl bg-red-lighter/70 px-3 py-1.5 text-red-dark">
                {blocker}
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">Related workflow</Title>
          <div className="mt-4 flex flex-wrap gap-3">
            {item.links.map((link) => (
              <Link key={link.label} href={link.href}>
                <Button variant="outline" className="h-10 rounded-2xl px-4">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">Review checkpoints</Title>
          <div className="mt-4 space-y-3">
            {item.checkpoints.map((checkpoint) => (
              <div key={checkpoint.label} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{checkpoint.label}</Text>
                    <Text className="mt-1 text-sm leading-6 text-gray-500">{checkpoint.detail}</Text>
                  </div>
                  <StatusBadge status={checkpoint.status} />
                </div>
              </div>
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
            onClick={() => setDecision("changes")}
          >
            Request changes
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
          <VendorDecisionModal
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

export default function VendorApplicationQueuePage() {
  const { openDrawer } = useDrawer();
  const [applications, setApplications] = useState(seed);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("all");
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");

  const visibleApplications = useMemo(() => {
    return applications.filter((item) => {
      const matchesStage = activeTab === "all" ? true : item.stage === activeTab;
      const matchesOwner = ownerFilter === "all" ? true : item.owner === ownerFilter;
      const haystack = [
        item.id,
        item.businessName,
        item.ownerName,
        item.city,
        item.owner,
        item.issue,
        item.blockers.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return matchesStage && matchesOwner && haystack.includes(query.toLowerCase());
    });
  }, [activeTab, applications, ownerFilter, query]);

  const ownerOptions = useMemo(() => {
    const owners = Array.from(new Set(applications.map((item) => item.owner)));
    return [{ label: "All owners", value: "all" }, ...owners.map((owner) => ({ label: owner, value: owner }))];
  }, [applications]);

  const counts = useMemo(
    () => ({
      pending: applications.filter((item) => item.status === "queued" || item.status === "review").length,
      ready: applications.filter((item) => item.stage === "final_launch" && item.status === "review").length,
      risky: applications.filter((item) => item.status === "at_risk" || item.status === "paused").length,
    }),
    [applications],
  );

  const openApplication = (item: VendorApplication) => {
    openDrawer({
      placement: "right",
      containerClassName: "w-full max-w-[620px] bg-white p-0",
      view: (
        <VendorApplicationDrawer
          item={item}
          onApplyDecision={(id, action, reasonCode, note) => {
            setApplications((current) =>
              current.map((entry) => {
                if (entry.id !== id) return entry;
                if (action === "approve") {
                  return {
                    ...entry,
                    status: "live",
                    stage: "final_launch",
                    owner: "Marketplace launched",
                    issue: "Application approved and ready for merchant launch or immediate go-live.",
                    blockers: ["Launch complete"],
                    tags: [...entry.tags.filter((tag) => tag !== "Ready to launch"), "Launched"],
                    notes: [`Approved: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                    timeline: [
                      { label: "Application approved", detail: note || `Approved with reason code ${reasonCode}.`, time: "Now" },
                      ...entry.timeline,
                    ],
                  };
                }
                if (action === "changes") {
                  return {
                    ...entry,
                    stage: "resubmission",
                    status: "review",
                    owner: "Merchant follow-up",
                    issue: "Merchant changes are required before the application can return to launch flow.",
                    blockers: ["Waiting on merchant resubmission"],
                    notes: [`Changes requested: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                    timeline: [
                      { label: "Changes requested", detail: note || `Requested with reason code ${reasonCode}.`, time: "Now" },
                      ...entry.timeline,
                    ],
                  };
                }
                return {
                  ...entry,
                  status: "paused",
                  owner: "Compliance closed",
                  issue: "Application rejected and removed from launch flow until a new compliant submission is made.",
                  blockers: ["Application rejected"],
                  notes: [`Rejected: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                  timeline: [
                    { label: "Application rejected", detail: note || `Rejected with reason code ${reasonCode}.`, time: "Now" },
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
        breadcrumb={["Home", "Marketplace", "Vendor Applications"]}
        eyebrow="Marketplace Ops"
        title="Vendor application queue"
        description="Launch, compliance, catalog, and payout setup reviews for incoming merchant partners."
        badge="Queue"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Pending reviews"
          value={String(counts.pending)}
          change="Work queue open"
          tone="neutral"
          detail="Vendor applications still waiting for launch, compliance, or provisioning review."
        />
        <StatCard
          label="Ready for launch"
          value={String(counts.ready)}
          change="Can clear today"
          tone="positive"
          detail="Applications close to launch that only need a final Marketplace Ops decision."
        />
        <StatCard
          label="Risk or hold cases"
          value={String(counts.risky)}
          change="Needs careful handling"
          tone="warning"
          detail="Restricted, rejected, or blocked applications that should not move with the normal launch flow."
        />
      </div>

      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <nav className="flex items-center gap-5 border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            const count = tab.value === "all" ? applications.length : applications.filter((item) => item.stage === tab.value).length;
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

      <ShellCard title="Merchant onboarding queue" description="Triage launch readiness, compliance blockers, and provisioning gaps.">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              type="search"
              placeholder="Search business, owner, city, issue, or owner queue"
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
          <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={() => setApplications(seed)}>
            <PiArrowClockwiseBold className="me-2 h-4 w-4" />
            Reset demo state
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table variant="modern" className="min-w-[1120px]">
            <Table.Header>
              <Table.Row>
                <Table.Head className="bg-gray-100">Merchant</Table.Head>
                <Table.Head className="bg-gray-100">Stage</Table.Head>
                <Table.Head className="bg-gray-100">Issue</Table.Head>
                <Table.Head className="bg-gray-100">Owner</Table.Head>
                <Table.Head className="bg-gray-100">Age</Table.Head>
                <Table.Head className="bg-gray-100">Status</Table.Head>
                <Table.Head className="bg-gray-100 text-right">Action</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleApplications.map((item) => (
                <Table.Row key={item.id} className="cursor-pointer" onClick={() => openApplication(item)}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={item.businessName}
                        initials={item.businessName
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                        className="bg-primary/10 text-primary"
                      />
                      <div>
                        <Text className="font-semibold text-gray-900">{item.businessName}</Text>
                        <Text className="mt-1 text-sm text-gray-500">
                          {item.id} · {item.ownerName} · {item.city} · {businessLabels[item.businessType]}
                        </Text>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <Text className="font-medium text-gray-900">{stageLabels[item.stage]}</Text>
                      <Text className="mt-1 text-sm text-gray-500">{item.submittedAt}</Text>
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
                    <div className="flex flex-col items-end gap-2">
                      <Link
                        href={item.links[0].href}
                        className="text-xs font-semibold text-gray-500 transition hover:text-primary"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {item.links[0].label}
                      </Link>
                      <Button
                        variant="text"
                        className="h-auto p-0 text-primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          openApplication(item);
                        }}
                      >
                        Review
                        <PiCaretRightBold className="ms-1 h-4 w-4" />
                      </Button>
                    </div>
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
