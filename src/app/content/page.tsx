import SectionPage from "@/components/admin/section-page";
import { contentRows } from "@/components/admin/section-data";

export default function ContentPage() {
  return (
    <SectionPage
      eyebrow="Growth"
      title="Content and campaigns"
      description="Set up the merchandising and lifecycle marketing surface around banners, campaigns, promos, and communication blocks."
      badge="Engagement"
      insights={[
        {
          label: "Active promos",
          value: "14",
          detail: "Campaigns currently visible in app, web, or outbound channels.",
        },
        {
          label: "Draft assets",
          value: "27",
          detail: "Creative pieces waiting for copy, review, or final publishing.",
        },
        {
          label: "Segments in use",
          value: "8",
          detail: "Audience groups currently targeted by push or on-platform placements.",
        },
      ]}
      queue={[
        {
          title: "Hero banner approval",
          meta: "Weekend campaign visuals are ready but not yet signed off.",
          status: "review",
        },
        {
          title: "App store refresh",
          meta: "Acquisition surfaces need new product screenshots after the next release.",
          status: "monitoring",
        },
        {
          title: "Vendor spotlight publish",
          meta: "Partner campaign assets are queued behind final copy edits.",
          status: "queued",
        },
      ]}
      rows={contentRows}
    />
  );
}
