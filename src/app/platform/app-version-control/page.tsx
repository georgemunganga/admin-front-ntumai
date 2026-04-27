import SectionPage from "@/components/admin/section-page";

export default function PlatformAppVersionControlPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Platform", "App Version Control"]}
      eyebrow="Platform"
      title="App version control"
      description="Manage minimum supported versions, staged rollout gates, and feature readiness across app releases."
      badge="Release"
      insights={[
        {
          label: "Live app tracks",
          value: "4",
          detail: "Client release lines currently supported across customer and driver applications.",
        },
        {
          label: "Force-update gates",
          value: "2",
          detail: "Version thresholds prepared for mandatory upgrade enforcement.",
        },
        {
          label: "Staged rollouts",
          value: "5",
          detail: "Feature or version launches being phased through controlled audiences.",
        },
      ]}
      queue={[
        {
          title: "Minimum version review",
          meta: "One older client line still needs validation before a hard update can be enforced.",
          status: "review",
        },
        {
          title: "Driver app rollout watch",
          meta: "A staged release is being monitored for stability before wider exposure.",
          status: "monitoring",
        },
        {
          title: "Feature toggle pack",
          meta: "Several version-gated features are queued behind release approval.",
          status: "queued",
        },
      ]}
      rows={[
        {
          primary: "Customer app release lanes",
          secondary: "Version tracks tied to rider availability, feature gates, and forced update policy.",
          tertiary: "Release ops",
          status: "stable",
        },
        {
          primary: "Driver app enforcement",
          secondary: "Supply-side clients still being checked for compliance with new runtime requirements.",
          tertiary: "Mobile ops",
          status: "review",
        },
        {
          primary: "Version-gated features",
          secondary: "Capabilities staged behind app-version thresholds and rollout controls.",
          tertiary: "Platform release",
          status: "monitoring",
        },
        {
          primary: "Legacy client sunset",
          secondary: "Older builds queued for deprecation after upgrade coverage reaches target.",
          tertiary: "Lifecycle management",
          status: "queued",
        },
      ]}
    />
  );
}
