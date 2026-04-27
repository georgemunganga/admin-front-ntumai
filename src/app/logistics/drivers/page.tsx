import LogisticsEntityListPage from "@/components/logistics/logistics-entity-list-page";
import { crudPages } from "@/components/crud/crud-data";

export default function LogisticsDriversPage() {
  return (
    <LogisticsEntityListPage
      breadcrumb={["Home", "Logistics", "Drivers"]}
      eyebrow="Logistics Kit"
      title="Drivers"
      description="Track logistics supply readiness, dispatch eligibility, and operator follow-up from one driver list."
      actionLabel="Add Driver"
      searchPlaceholder={crudPages.logisticsDrivers.searchPlaceholder}
      statusBadge="Supply monitored"
      countLabel="drivers"
      entityLabel="Driver lane"
      rows={crudPages.logisticsDrivers.rows}
      stats={[
        { label: "Eligible drivers", value: "326", meta: "14 recently reactivated for live lanes" },
        { label: "Review queue", value: "22", meta: "Accounts waiting for operational or trust checks" },
        { label: "At-risk supply", value: "11", meta: "Driver availability dipping in key zones" },
        { label: "Healthy dispatch", value: "94%", meta: "Ready-for-assignment rate remains stable" },
      ]}
    />
  );
}
