import SectionPage from "@/components/admin/section-page";
import { growthRows } from "@/components/admin/section-data";

export default function GrowthPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Growth"]}
      eyebrow="Growth"
      title="Growth and engagement"
      description="Coordinate promotions, lifecycle messaging, and supply-demand incentive programs across the platform."
      badge="Growth"
      insights={[
        {
          label: "Live campaigns",
          value: "18",
          detail: "Promo and incentive programs currently active across rider and driver segments.",
        },
        {
          label: "Targeted audiences",
          value: "11",
          detail: "Audience groups actively used for retention, referral, and win-back flows.",
        },
        {
          label: "Messages queued",
          value: "26",
          detail: "Push, SMS, and in-app notices waiting for publish windows or approvals.",
        },
      ]}
      queue={[
        {
          title: "Weekend promo launch",
          meta: "A city-specific discount campaign is staged but still waiting for final pricing clearance.",
          status: "review",
        },
        {
          title: "Peak-hour incentive tuning",
          meta: "Driver reward thresholds need adjustment after the latest supply forecast.",
          status: "monitoring",
        },
        {
          title: "Referral abuse safeguards",
          meta: "A set of repeat accounts is being filtered before the next bonus cycle goes live.",
          status: "queued",
        },
      ]}
      rows={growthRows}
    />
  );
}
