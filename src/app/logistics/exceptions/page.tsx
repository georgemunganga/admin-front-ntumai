import LogisticsEntityListPage from "@/components/logistics/logistics-entity-list-page";
import { crudPages } from "@/components/crud/crud-data";

export default function LogisticsExceptionsPage() {
  return (
    <LogisticsEntityListPage
      breadcrumb={["Home", "Logistics", "Exceptions"]}
      eyebrow="Logistics Kit"
      title="Exceptions"
      description="Handle recovery actions, delayed handoffs, and route breakage from one exception operations list."
      actionLabel="Open Exception"
      searchPlaceholder={crudPages.logisticsExceptions.searchPlaceholder}
      statusBadge="Recovery tracked"
      countLabel="exceptions"
      entityLabel="Exception lane"
      rows={crudPages.logisticsExceptions.rows}
      stats={[
        { label: "Open exceptions", value: "18", meta: "4 require immediate dispatch decisions" },
        { label: "Recovery success", value: "87%", meta: "Exception resolution within target today" },
        { label: "Failed handoffs", value: "6", meta: "Recipient-side issues still active" },
        { label: "Route overload", value: "3", meta: "Stacking issues being redistributed now" },
      ]}
    />
  );
}
