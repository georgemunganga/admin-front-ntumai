import SectionPage from "@/components/admin/section-page";

const insights = [
  {
    label: "Active zones",
    value: "18",
    detail: "Service areas currently open for dispatch, delivery, or scheduled lane planning.",
  },
  {
    label: "Restricted areas",
    value: "5",
    detail: "Safety, policy, or low-service corridors currently under tighter controls.",
  },
  {
    label: "Expansion queue",
    value: "3",
    detail: "New neighborhoods staged for rollout after supply and pricing checks complete.",
  },
];

const queue = [
  {
    title: "Airport rule refresh",
    meta: "Pickup lane rules need timing and surcharge updates before the next shift block.",
    status: "review",
  },
  {
    title: "Night safety geofence",
    meta: "Two suburbs remain under temporary routing restrictions after incident review.",
    status: "monitoring",
  },
  {
    title: "Expansion rollout",
    meta: "A new fulfillment zone is queued pending final dispatch coverage confirmation.",
    status: "queued",
  },
];

const rows = [
  {
    primary: "Core delivery zones",
    secondary: "High-volume service areas with stable courier coverage and normal lane rules.",
    tertiary: "Operations strategy",
    status: "stable",
  },
  {
    primary: "Restricted delivery corridors",
    secondary: "Neighborhoods with time windows, safety gating, or pickup/dropoff constraints.",
    tertiary: "Risk operations",
    status: "monitoring",
  },
  {
    primary: "Airport and station geofences",
    secondary: "Transport hubs with custom queue logic, fees, and pickup behavior.",
    tertiary: "Dispatch policy",
    status: "review",
  },
  {
    primary: "Expansion-ready suburbs",
    secondary: "New service areas staged for launch after supply, ETA, and pricing checks.",
    tertiary: "Market growth",
    status: "queued",
  },
];

export default function LogisticsZonesGeofencingPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Logistics", "Zones & Geofencing"]}
      eyebrow="Logistics Kit"
      title="Zones and Geofencing"
      description="Control service boundaries, restricted areas, and expansion-ready lanes across the delivery network."
      badge="Geo"
      insights={insights}
      queue={queue}
      rows={rows}
    />
  );
}
