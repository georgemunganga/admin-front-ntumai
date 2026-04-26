import SectionPage from "@/components/admin/section-page";

export default function CrmRatingsReviewsPage() {
  return (
    <SectionPage
      eyebrow="Customer CRM"
      title="Ratings and reviews"
      description="Track low-rated experiences, quality complaints, and feedback moderation across riders and delivery operations."
      badge="Quality"
      insights={[
        {
          label: "Low-rated cases",
          value: "32",
          detail: "Trips and deliveries currently generating higher-severity satisfaction issues.",
        },
        {
          label: "Moderation queue",
          value: "14",
          detail: "Feedback items still awaiting quality, support, or trust-team decisions.",
        },
        {
          label: "Coaching triggers",
          value: "9",
          detail: "Ratings signals already feeding driver, vendor, or ops follow-up.",
        },
      ]}
      queue={[
        {
          title: "Driver complaint cluster",
          meta: "A set of low-rated delivery interactions needs coordinated quality review.",
          status: "monitoring",
        },
        {
          title: "Refund-linked feedback",
          meta: "Several reviews are tied to unresolved service recovery and refund decisions.",
          status: "review",
        },
        {
          title: "Moderation backlog",
          meta: "Older rating disputes are still queued behind support and trust input.",
          status: "queued",
        },
      ]}
      rows={[
        {
          primary: "Low-rated delivery lanes",
          secondary: "Recent trips and drops where satisfaction is falling below operating thresholds.",
          tertiary: "Quality desk",
          status: "monitoring",
        },
        {
          primary: "Driver complaint review",
          secondary: "Customer feedback being assessed for coaching, suspension, or support follow-up.",
          tertiary: "Fleet quality",
          status: "review",
        },
        {
          primary: "Merchant and catalog complaints",
          secondary: "Ratings signals flowing into partner, marketplace, or content interventions.",
          tertiary: "Marketplace ops",
          status: "stable",
        },
        {
          primary: "Appealed feedback cases",
          secondary: "Ratings disputes waiting on moderation or supporting evidence before closure.",
          tertiary: "Support governance",
          status: "queued",
        },
      ]}
    />
  );
}
