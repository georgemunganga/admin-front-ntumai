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
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import { useDrawer } from "@/app/shared/drawer-views/use-drawer";
import { useAdminActionGuard } from "@/components/auth/use-admin-action-guard";
import { routes } from "@/config/routes";
import { Modal } from "@/components/modal";

type ReviewStatus = "review" | "queued" | "monitoring" | "live" | "paused" | "at_risk";
type DocumentType = "national_id" | "license" | "insurance" | "inspection" | "selfie";
type RiskLevel = "low" | "medium" | "high";
type DecisionAction = "approve" | "changes" | "suspend";

type TaskerDocumentCase = {
  id: string;
  tasker: string;
  city: string;
  mode: "walking" | "bicycle" | "motorbike" | "truck";
  documentType: DocumentType;
  status: ReviewStatus;
  riskLevel: RiskLevel;
  owner: string;
  age: string;
  expiresAt: string;
  issue: string;
  phone: string;
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

const documentLabels: Record<DocumentType, string> = {
  national_id: "National ID",
  license: "Driver permit",
  insurance: "Insurance",
  inspection: "Vehicle inspection",
  selfie: "Face match / selfie",
};

const modeLabels: Record<TaskerDocumentCase["mode"], string> = {
  walking: "Walking",
  bicycle: "Bicycle",
  motorbike: "Motorbike",
  truck: "Truck",
};

const tabs = [
  { value: "all", label: "All reviews" },
  { value: "license", label: "Licenses" },
  { value: "insurance", label: "Insurance" },
  { value: "inspection", label: "Inspections" },
  { value: "national_id", label: "Identity" },
  { value: "selfie", label: "Face match" },
] as const;

const casesSeed: TaskerDocumentCase[] = [
  {
    id: "DOC-1842",
    tasker: "Ruth Mulenga",
    city: "Ndola",
    mode: "truck",
    documentType: "insurance",
    status: "monitoring",
    riskLevel: "high",
    owner: "Compliance desk",
    age: "54m",
    expiresAt: "12 days left",
    issue: "Insurance is valid but nearing expiry and policy scan is partially cropped.",
    phone: "+260 978 118 221",
    checkpoints: [
      { label: "Policy holder match", status: "live", detail: "Name matches tasker commercial profile." },
      { label: "Coverage validity", status: "monitoring", detail: "Coverage still active but nearing renewal threshold." },
      { label: "Image quality", status: "review", detail: "Bottom-right policy section is cropped." },
      { label: "Commercial asset tie", status: "queued", detail: "Truck registration cross-check pending." },
    ],
    timeline: [
      { label: "Document uploaded", detail: "Insurance renewal file received from tasker app.", time: "08:14" },
      { label: "Auto-expiry watch", detail: "Document entered high-urgency renewal lane.", time: "08:19" },
      { label: "Manual review opened", detail: "Compliance agent needs to validate cropped section.", time: "08:42" },
    ],
    notes: [
      "High-value supply mode. Avoid suspension unless no corrected upload arrives.",
      "If approved, create a renewal reminder 7 days before expiry.",
    ],
    links: [
      { label: "Application queue", href: routes.fleet.driverApplications },
      { label: "Taskers", href: routes.logistics.taskers },
    ],
  },
  {
    id: "DOC-1837",
    tasker: "Natasha Chinyama",
    city: "Kitwe",
    mode: "bicycle",
    documentType: "national_id",
    status: "review",
    riskLevel: "medium",
    owner: "Identity review",
    age: "1h 32m",
    expiresAt: "No expiry",
    issue: "ID back image is blurred, preventing clear address and issuing authority verification.",
    phone: "+260 969 002 180",
    checkpoints: [
      { label: "Front image", status: "live", detail: "Readable and matches profile name." },
      { label: "Back image", status: "review", detail: "Image is soft and text is unreadable." },
      { label: "Face match", status: "live", detail: "Selfie confidence is acceptable." },
      { label: "Address proof linkage", status: "queued", detail: "Blocked until ID back is re-uploaded." },
    ],
    timeline: [
      { label: "ID uploaded", detail: "Identity packet sent from onboarding flow.", time: "07:33" },
      { label: "Image quality flag", detail: "Auto-check found unreadable reverse-side text.", time: "07:40" },
      { label: "Awaiting reviewer", detail: "Manual decision required before resubmission notice.", time: "07:51" },
    ],
    notes: ["Likely resubmission case, not a rejection case."],
    links: [
      { label: "Application queue", href: routes.fleet.driverApplications },
      { label: "Support inbox", href: routes.supportDesk.inbox },
    ],
  },
  {
    id: "DOC-1824",
    tasker: "Mwaka Bwalya",
    city: "Lusaka",
    mode: "motorbike",
    documentType: "inspection",
    status: "queued",
    riskLevel: "medium",
    owner: "Road readiness",
    age: "2h 06m",
    expiresAt: "5 days left",
    issue: "The motorbike inspection certificate is valid but the latest upload does not include the official stamp clearly.",
    phone: "+260 977 410 233",
    checkpoints: [
      { label: "Certificate period", status: "live", detail: "Dates still valid." },
      { label: "Official stamp", status: "review", detail: "Stamp is not clearly legible." },
      { label: "Plate match", status: "live", detail: "Plate number matches stored vehicle." },
      { label: "Asset readiness", status: "queued", detail: "Cannot close road-readiness until stamp is confirmed." },
    ],
    timeline: [
      { label: "Upload refreshed", detail: "Tasker sent a new inspection certificate image.", time: "06:52" },
      { label: "Quality exception", detail: "Stamp area still unclear after OCR pass.", time: "07:05" },
      { label: "Queued for manual read", detail: "Moved to road-readiness queue.", time: "07:15" },
    ],
    notes: ["If approved, application can stay in final approval lane."],
    links: [
      { label: "Application queue", href: routes.fleet.driverApplications },
      { label: "Taskers", href: routes.logistics.taskers },
    ],
  },
  {
    id: "DOC-1818",
    tasker: "Brian Zulu",
    city: "Lusaka",
    mode: "walking",
    documentType: "selfie",
    status: "at_risk",
    riskLevel: "high",
    owner: "Risk review",
    age: "3h 21m",
    expiresAt: "No expiry",
    issue: "Face match confidence dropped below policy threshold after resubmission.",
    phone: "+260 971 550 908",
    checkpoints: [
      { label: "Selfie clarity", status: "live", detail: "Image quality itself is acceptable." },
      { label: "Face match confidence", status: "at_risk", detail: "System confidence is below threshold." },
      { label: "Duplicate identity check", status: "monitoring", detail: "Linked to another risky application cluster." },
      { label: "Activation safety", status: "paused", detail: "Activation must remain blocked." },
    ],
    timeline: [
      { label: "Resubmission received", detail: "New selfie uploaded from mobile flow.", time: "05:10" },
      { label: "Risk model alert", detail: "Confidence and duplicate concerns escalated.", time: "05:18" },
      { label: "Manual risk review", detail: "Awaiting identity decision.", time: "05:29" },
    ],
    notes: ["Do not convert this to a normal compliance resubmission without risk sign-off."],
    links: [
      { label: "Safety compliance", href: routes.risk.compliance },
      { label: "Support escalations", href: routes.supportDesk.escalations },
    ],
  },
  {
    id: "DOC-1802",
    tasker: "Agnes Mumba",
    city: "Kabwe",
    mode: "motorbike",
    documentType: "license",
    status: "review",
    riskLevel: "low",
    owner: "License desk",
    age: "4h 02m",
    expiresAt: "9 months left",
    issue: "Permit is valid, but the latest image has a glare across the issue-date strip.",
    phone: "+260 963 404 802",
    checkpoints: [
      { label: "Name match", status: "live", detail: "Matches stored identity." },
      { label: "Expiry date", status: "live", detail: "Well within validity window." },
      { label: "Issue-date strip", status: "review", detail: "Glare obscures part of printed strip." },
      { label: "Class validity", status: "live", detail: "Motorbike class is correct." },
    ],
    timeline: [
      { label: "Permit uploaded", detail: "License packet entered compliance queue.", time: "04:06" },
      { label: "Visual quality exception", detail: "Glare detected by review tool.", time: "04:19" },
      { label: "Manual lane assigned", detail: "Compliance agent must validate the strip.", time: "04:24" },
    ],
    notes: ["Low-friction approval if the issue-date strip is readable enough on zoom."],
    links: [
      { label: "Application queue", href: routes.fleet.driverApplications },
      { label: "Taskers", href: routes.logistics.taskers },
    ],
  },
];

function DocumentDecisionModal({
  item,
  action,
  onClose,
  onSubmit,
}: {
  item: TaskerDocumentCase;
  action: DecisionAction;
  onClose: () => void;
  onSubmit: (payload: { reasonCode: string; note: string }) => void;
}) {
  const [reasonCode, setReasonCode] = useState(
    action === "approve" ? "document_verified" : action === "changes" ? "reupload_required" : "suspend_pending_compliance",
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
      <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
        {item.id}
      </Text>
      <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
        {action === "approve" ? "Approve document review" : action === "changes" ? "Request re-upload" : "Suspend for compliance"}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">
        Record the compliance outcome for {item.tasker}&apos;s {documentLabels[item.documentType].toLowerCase()} case so the next operator has a clear trail.
      </Text>

      <div className="mt-6 space-y-4">
        <Select
          label="Reason code"
          options={[
            { label: "Document verified", value: "document_verified" },
            { label: "Re-upload required", value: "reupload_required" },
            { label: "Image quality issue", value: "image_quality_issue" },
            { label: "Expiry risk hold", value: "expiry_risk_hold" },
            { label: "Suspend pending compliance", value: "suspend_pending_compliance" },
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
            placeholder="Add the review outcome, risk context, or exact correction request."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={onClose}>
          Cancel
        </Button>
        <Button className={`h-11 rounded-2xl px-4 ${tone}`} onClick={() => onSubmit({ reasonCode, note })}>
          {action === "approve" ? "Confirm approval" : action === "changes" ? "Send re-upload request" : "Confirm suspension"}
        </Button>
      </div>
    </div>
  );
}

function TaskerDocumentDrawer({
  item,
  onApplyDecision,
}: {
  item: TaskerDocumentCase;
  onApplyDecision: (id: string, action: DecisionAction, reasonCode: string, note: string) => Promise<void> | void;
}) {
  const { closeDrawer } = useDrawer();
  const { guardAction } = useAdminActionGuard();
  const [decision, setDecision] = useState<DecisionAction | null>(null);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-100 px-6 py-5">
        <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.id}</Text>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <Title as="h3" className="text-xl font-semibold text-gray-900">
              {item.tasker}
            </Title>
            <Text className="mt-2 text-sm text-gray-500">
              {item.city} · {modeLabels[item.mode]} · {documentLabels[item.documentType]} · {item.expiresAt}
            </Text>
          </div>
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoTile label="Risk level" value={item.riskLevel.toUpperCase()} />
          <InfoTile label="Queue owner" value={item.owner} />
          <InfoTile label="Review age" value={item.age} />
          <InfoTile label="Phone" value={item.phone} />
        </div>

        <section className="rounded-3xl border border-gray-200 bg-gray-50/70 p-5">
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Review issue
          </Title>
          <Text className="mt-3 text-sm leading-6 text-gray-600">{item.issue}</Text>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Related workflow
          </Title>
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
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Compliance checkpoints
          </Title>
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
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Timeline
          </Title>
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
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Internal notes
          </Title>
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
            onClick={() => guardAction("write", () => setDecision("suspend"))}
          >
            Suspend
          </Button>
          <Button
            className="h-11 rounded-2xl bg-secondary px-4 text-secondary-foreground hover:bg-secondary/90"
            onClick={() => guardAction("write", () => setDecision("changes"))}
          >
            Request re-upload
          </Button>
          <Button
            className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
            onClick={() => guardAction("write", () => setDecision("approve"))}
          >
            Approve
          </Button>
        </div>
      </div>

      <Modal isOpen={decision !== null} onClose={() => setDecision(null)} size="md" rounded="lg">
        {decision ? (
          <DocumentDecisionModal
            item={item}
            action={decision}
            onClose={() => setDecision(null)}
            onSubmit={async ({ reasonCode, note }) => {
              await onApplyDecision(item.id, decision, reasonCode, note);
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

export default function TaskerDocumentQueuePage() {
  const { openDrawer } = useDrawer();
  const { guardAction } = useAdminActionGuard();
  const [cases, setCases] = useState(casesSeed);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("all");
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");

  const visibleCases = useMemo(() => {
    return cases.filter((item) => {
      const matchesType = activeTab === "all" ? true : item.documentType === activeTab;
      const matchesOwner = ownerFilter === "all" ? true : item.owner === ownerFilter;
      const haystack = [
        item.id,
        item.tasker,
        item.city,
        item.owner,
        item.issue,
        documentLabels[item.documentType],
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
      backlog: cases.filter((item) => item.status === "review" || item.status === "queued").length,
      expiring: cases.filter((item) => item.expiresAt.includes("days left")).length,
      highRisk: cases.filter((item) => item.riskLevel === "high").length,
    }),
    [cases],
  );

  async function applyDecision(id: string, action: DecisionAction, reasonCode: string, note: string) {
    await guardAction(
      "write",
      async () => {
        setCases((current) =>
          current.map((entry) => {
            if (entry.id !== id) return entry;
            if (action === "approve") {
              return {
                ...entry,
                status: "live",
                owner: "Compliance cleared",
                issue: "Document review completed and cleared for active use.",
                notes: [`Approved: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                timeline: [
                  { label: "Document approved", detail: note || `Approved with reason code ${reasonCode}.`, time: "Now" },
                  ...entry.timeline,
                ],
              };
            }
            if (action === "changes") {
              return {
                ...entry,
                status: "review",
                owner: "Waiting on tasker",
                issue: "A corrected document upload is required before compliance can close this case.",
                notes: [`Re-upload requested: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                timeline: [
                  { label: "Re-upload requested", detail: note || `Requested with reason code ${reasonCode}.`, time: "Now" },
                  ...entry.timeline,
                ],
              };
            }
            return {
              ...entry,
              status: "paused",
              owner: "Compliance hold",
              issue: "Tasker account should remain blocked until this compliance case is resolved.",
              notes: [`Suspended: ${reasonCode}. ${note}`.trim(), ...entry.notes],
              timeline: [
                { label: "Compliance suspension applied", detail: note || `Suspended with reason code ${reasonCode}.`, time: "Now" },
                ...entry.timeline,
              ],
            };
          }),
        );
      },
      "Your staff role can view tasker documents, but it cannot change document review outcomes.",
    );
  }

  const openCase = (item: TaskerDocumentCase) => {
    openDrawer({
      placement: "right",
      containerClassName: "w-full max-w-[620px] bg-white p-0",
      view: (
        <TaskerDocumentDrawer
          item={item}
          onApplyDecision={applyDecision}
        />
      ),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Fleet", "Tasker Documents"]}
        eyebrow="Compliance Ops"
        title="Tasker document queue"
        description="Identity, permit, inspection, and expiry-sensitive compliance reviews for active and onboarding taskers."
        badge="Queue"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Review backlog"
          value={String(counts.backlog)}
          change="Waiting for operator touch"
          tone="neutral"
          detail="Document cases still open in compliance or fleet review queues."
        />
        <StatCard
          label="Expiry-sensitive cases"
          value={String(counts.expiring)}
          change="Renewal pressure"
          tone="warning"
          detail="Documents that could block active supply if no follow-up happens soon."
        />
        <StatCard
          label="High-risk reviews"
          value={String(counts.highRisk)}
          change="Needs careful handling"
          tone="warning"
          detail="Identity or compliance cases that should not be cleared with normal queue logic."
        />
      </div>

      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <nav className="flex items-center gap-5 border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            const count = tab.value === "all" ? cases.length : cases.filter((item) => item.documentType === tab.value).length;
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

      <ShellCard title="Document review queue" description="Clear usable documents, request re-uploads, or hold risky compliance cases.">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              type="search"
              placeholder="Search tasker, document, issue, city, or owner"
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
          <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={() => setCases(casesSeed)}>
            <PiArrowClockwiseBold className="me-2 h-4 w-4" />
            Reset demo state
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table variant="modern" className="min-w-[1100px]">
            <Table.Header>
              <Table.Row>
                <Table.Head className="bg-gray-100">Tasker</Table.Head>
                <Table.Head className="bg-gray-100">Document lane</Table.Head>
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
                        name={item.tasker}
                        initials={item.tasker
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                        className="bg-primary/10 text-primary"
                      />
                      <div>
                        <Text className="font-semibold text-gray-900">{item.tasker}</Text>
                        <Text className="mt-1 text-sm text-gray-500">
                          {item.id} · {item.city} · {modeLabels[item.mode]}
                        </Text>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <Text className="font-medium text-gray-900">{documentLabels[item.documentType]}</Text>
                      <Text className="mt-1 text-sm text-gray-500">{item.expiresAt}</Text>
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
                          openCase(item);
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
