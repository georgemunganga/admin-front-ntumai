import SectionPage from "@/components/admin/section-page";

export default function PlatformSettingsPage() {
  return (
    <SectionPage
      eyebrow="Platform"
      title="Platform settings"
      description="Manage core operating rules, region-level behavior, and product-wide configuration across the ERP stack."
      badge="Settings"
      insights={[
        {
          label: "Config domains",
          value: "12",
          detail: "Major settings groups governing markets, payments, support, and trip or delivery policy.",
        },
        {
          label: "Pending changes",
          value: "7",
          detail: "Configuration edits still waiting on validation or cross-team approval.",
        },
        {
          label: "Market variants",
          value: "3",
          detail: "Region-specific overrides applied to currencies, rules, or service availability.",
        },
      ]}
      queue={[
        {
          title: "Cancellation policy update",
          meta: "A core operating-rule change is being reviewed before it touches refund automation.",
          status: "review",
        },
        {
          title: "Regional pricing sync",
          meta: "One market still needs settings alignment after logistics and finance updates.",
          status: "monitoring",
        },
        {
          title: "Gateway fallback config",
          meta: "A new payment failover rule set is queued behind platform and finance signoff.",
          status: "queued",
        },
      ]}
      rows={[
        {
          primary: "Market and city controls",
          secondary: "Regional settings covering service availability, currencies, and localized behavior.",
          tertiary: "Operations strategy",
          status: "stable",
        },
        {
          primary: "Policy and rule settings",
          secondary: "Cancellation, refund, support, and trust rules shaping core user journeys.",
          tertiary: "Policy admin",
          status: "review",
        },
        {
          primary: "Provider configuration",
          secondary: "Payment, messaging, and mapping settings monitored for runtime safety.",
          tertiary: "Platform ops",
          status: "monitoring",
        },
        {
          primary: "Change queue",
          secondary: "Configuration edits still staged behind approval, testing, or release windows.",
          tertiary: "Change management",
          status: "queued",
        },
      ]}
    />
  );
}
