import SectionPage from "@/components/admin/section-page";

const insights = [
  {
    label: "Live services",
    value: "6",
    detail: "Operational service classes currently exposed across customer and merchant flows.",
  },
  {
    label: "Vehicle rules",
    value: "12",
    detail: "Eligibility and fit checks attached to service types for dispatch and compliance.",
  },
  {
    label: "Pilot lanes",
    value: "2",
    detail: "New service variants being staged for rollout in selected neighborhoods.",
  },
];

const queue = [
  {
    title: "Bike express review",
    meta: "Vehicle eligibility and ETA promises need final approval before launch.",
    status: "review",
  },
  {
    title: "Corporate errand fit",
    meta: "Dispatch constraints are being checked for larger scheduled dropoff workloads.",
    status: "monitoring",
  },
  {
    title: "Cold-chain variant",
    meta: "A higher-governance service type is queued behind packaging and compliance checks.",
    status: "queued",
  },
];

const rows = [
  {
    primary: "Standard delivery",
    secondary: "Baseline lane with broad driver eligibility and normal service promises.",
    tertiary: "Core ops",
    status: "stable",
  },
  {
    primary: "Bike express",
    secondary: "Fast urban delivery class with tight ETA and route suitability requirements.",
    tertiary: "Service design",
    status: "review",
  },
  {
    primary: "Corporate bookings",
    secondary: "Scheduled, account-linked service flow with higher operational control needs.",
    tertiary: "B2B logistics",
    status: "monitoring",
  },
  {
    primary: "Special handling lanes",
    secondary: "Restricted or fragile goods flows gated by vehicle and compliance rules.",
    tertiary: "Compliance logistics",
    status: "queued",
  },
];

export default function LogisticsServiceTypesPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Logistics", "Service Types"]}
      eyebrow="Logistics Kit"
      title="Service Types"
      description="Manage delivery service classes, vehicle fit, and eligibility rules across the operations stack."
      badge="Service"
      insights={insights}
      queue={queue}
      rows={rows}
    />
  );
}
