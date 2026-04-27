import SectionPage from "@/components/admin/section-page";

export default function PlatformSettingsPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Platform", "Settings"]}
      eyebrow="Platform"
      title="Platform settings"
      description="Operating rules and product configuration."
      badge="Settings"
      insights={[
        {
          label: "Config domains",
          value: "12",
          detail: "Settings groups for markets, payments, and policy.",
        },
        {
          label: "Pending changes",
          value: "7",
          detail: "Configuration edits waiting on approval.",
        },
        {
          label: "Market variants",
          value: "3",
          detail: "Region-specific overrides in use.",
        },
      ]}
      queue={[
        {
          title: "Cancellation policy update",
          meta: "Operating-rule change under review.",
          status: "review",
        },
        {
          title: "Regional pricing sync",
          meta: "One market still needs settings alignment.",
          status: "monitoring",
        },
        {
          title: "Gateway fallback config",
          meta: "Payment failover rules waiting on signoff.",
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
