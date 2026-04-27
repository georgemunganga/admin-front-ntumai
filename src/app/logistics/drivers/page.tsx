import LogisticsEntityListPage from "@/components/logistics/logistics-entity-list-page";
import { crudPages } from "@/components/crud/crud-data";

export default function LogisticsDriversPage() {
  return (
    <LogisticsEntityListPage
      breadcrumb={["Home", "Logistics", "Taskers"]}
      eyebrow="Logistics Kit"
      title="Taskers"
      description="Track logistics tasker readiness, dispatch eligibility, and operator follow-up across walking, bicycle, vehicle, and truck lanes."
      actionLabel="Add Tasker"
      searchPlaceholder={crudPages.logisticsDrivers.searchPlaceholder}
      statusBadge="Supply monitored"
      countLabel="taskers"
      entityLabel="Tasker lane"
      rows={crudPages.logisticsDrivers.rows}
      stats={[
        { label: "Eligible taskers", value: "326", meta: "14 recently reactivated for live lanes" },
        { label: "Review queue", value: "22", meta: "Accounts waiting for operational or trust checks" },
        { label: "At-risk supply", value: "11", meta: "Tasker availability dipping in key zones" },
        { label: "Healthy dispatch", value: "94%", meta: "Ready-for-assignment rate remains stable" },
      ]}
    />
  );
}
