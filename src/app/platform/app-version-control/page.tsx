import SectionPage from "@/components/admin/section-page";

export default function PlatformAppVersionControlPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Platform", "App Version Control"]}
      eyebrow="Platform"
      title="App version control"
      description="App versions, rollouts, and feature gates."
      badge="Release"
      insights={[
        {
          label: "Live app tracks",
          value: "4",
          detail: "Supported client release lines.",
        },
        {
          label: "Force-update gates",
          value: "2",
          detail: "Version thresholds for forced upgrades.",
        },
        {
          label: "Staged rollouts",
          value: "5",
          detail: "Launches phased through controlled audiences.",
        },
      ]}
      queue={[
        {
          title: "Minimum version review",
          meta: "Older client line still needs validation.",
          status: "review",
        },
        {
          title: "Driver app rollout watch",
          meta: "Staged release under stability watch.",
          status: "monitoring",
        },
        {
          title: "Feature toggle pack",
          meta: "Version-gated features waiting on approval.",
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
