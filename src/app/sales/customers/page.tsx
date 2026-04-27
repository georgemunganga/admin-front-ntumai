import SalesEntityListPage from "@/components/sales/sales-entity-list-page";
import { crudPages } from "@/components/crud/crud-data";

export default function SalesCustomersPage() {
  return (
    <SalesEntityListPage
      breadcrumb={["Home", "Sales", "Customers"]}
      eyebrow="Sales Kit"
      title="Customers"
      description="Review commercial customer segments, purchase health, and service-recovery impact across active accounts."
      actionLabel="Add Customer"
      searchPlaceholder={crudPages.salesCustomers.searchPlaceholder}
      statusBadge="Customer monitored"
      countLabel="customers"
      entityLabel="Customer lane"
      rows={crudPages.salesCustomers.rows}
      stats={[
        { label: "Active buyers", value: "18.4K", meta: "Customers ordering or checking out in the current window" },
        { label: "VIP segments", value: "47", meta: "High-value customers under retention watch" },
        { label: "Refund-heavy cohorts", value: "13", meta: "Customer groups driving above-baseline recovery cost" },
        { label: "Repeat purchase", value: "61%", meta: "Customers returning within the current cycle" },
      ]}
    />
  );
}
