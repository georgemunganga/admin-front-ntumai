import SectionPage from "@/components/admin/section-page";

const insights = [
  {
    label: "Pricing models",
    value: "9",
    detail: "Fare and fee rule sets currently active across zones, service classes, and time windows.",
  },
  {
    label: "Commission rules",
    value: "4",
    detail: "Revenue-share structures governing partner, courier, and platform economics.",
  },
  {
    label: "Promo overrides",
    value: "7",
    detail: "Temporary pricing exceptions applied for growth campaigns or lane recovery.",
  },
];

const queue = [
  {
    title: "Peak-hour surcharge review",
    meta: "City-center pricing needs recalibration after sustained dispatch pressure this week.",
    status: "review",
  },
  {
    title: "Courier earnings floor",
    meta: "Commission and payout economics are being monitored in two low-density zones.",
    status: "monitoring",
  },
  {
    title: "Merchant fee rollout",
    meta: "A new partner pricing model is queued behind finance signoff and support prep.",
    status: "queued",
  },
];

const rows = [
  {
    primary: "City base pricing",
    secondary: "Default fare rules governing distance, time, and minimum-fee behavior.",
    tertiary: "Revenue ops",
    status: "stable",
  },
  {
    primary: "Peak-demand overrides",
    secondary: "Temporary surcharge and fee controls used during congestion or supply shortages.",
    tertiary: "Dispatch economics",
    status: "review",
  },
  {
    primary: "Partner commission bands",
    secondary: "Commercial rules shaping vendor, courier, and platform revenue allocation.",
    tertiary: "Commercial finance",
    status: "monitoring",
  },
  {
    primary: "Recovery discount lanes",
    secondary: "Promo-backed pricing used to restore demand or service trust in weaker markets.",
    tertiary: "Growth finance",
    status: "queued",
  },
];

export default function LogisticsPricingCommissionPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Logistics", "Pricing & Commission"]}
      eyebrow="Logistics Kit"
      title="Pricing and Commission"
      description="Configure operational pricing, fee overrides, and revenue-share rules for the delivery network."
      badge="Commercial"
      insights={insights}
      queue={queue}
      rows={rows}
    />
  );
}
