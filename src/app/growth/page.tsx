import SectionPage from "@/components/admin/section-page";
import { growthRows } from "@/components/admin/section-data";

export default function GrowthPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Growth"]}
      eyebrow="Growth"
      title="Growth and engagement"
      description="Promotions, messaging, and incentives."
      badge="Growth"
      insights={[
        {
          label: "Live campaigns",
          value: "18",
          detail: "Promo and incentive programs running now.",
        },
        {
          label: "Targeted audiences",
          value: "11",
          detail: "Audience groups in active use.",
        },
        {
          label: "Messages queued",
          value: "26",
          detail: "Messages waiting for send windows or approval.",
        },
      ]}
      queue={[
        {
          title: "Weekend promo launch",
          meta: "City-specific discount campaign waiting on clearance.",
          status: "review",
        },
        {
          title: "Peak-hour incentive tuning",
          meta: "Tasker reward thresholds need adjustment.",
          status: "monitoring",
        },
        {
          title: "Referral abuse safeguards",
          meta: "Repeat accounts being filtered before the next bonus cycle.",
          status: "queued",
        },
      ]}
      rows={growthRows}
    />
  );
}
