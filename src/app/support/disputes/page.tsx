import ModulePage from "@/components/admin/module-page";

export default function SupportDisputesPage() {
  return (
    <ModulePage
      eyebrow="Support CRM"
      title="Disputes"
      description="Handle fare complaints, refund approvals, and driver-rider dispute workflows."
      sections={[
        {
          title: "Dispute Types",
          description: "Common support disputes handled by back-office teams.",
          items: ["Fare Complaints", "Refund Requests", "Driver Complaints", "Lost Items"],
        },
        {
          title: "Resolution Flow",
          description: "Typical stages in dispute handling.",
          items: ["Triage", "Evidence Review", "Approval", "SLA Tracking"],
        },
      ]}
    />
  );
}
