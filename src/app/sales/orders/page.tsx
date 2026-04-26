import SalesEntityListPage from "@/components/sales/sales-entity-list-page";
import { crudPages } from "@/components/crud/crud-data";

export default function SalesOrdersPage() {
  return (
    <SalesEntityListPage
      eyebrow="Sales Kit"
      title="Orders"
      description="Track commercial order flow, checkout health, and handoff issues from one sales operations list."
      actionLabel="Create Order"
      searchPlaceholder={crudPages.salesOrders.searchPlaceholder}
      statusBadge="Revenue monitored"
      countLabel="orders"
      entityLabel="Order lane"
      rows={crudPages.salesOrders.rows}
      stats={[
        { label: "Orders today", value: "1,248", meta: "214 still in active commercial flow" },
        { label: "Checkout failures", value: "19", meta: "Payment or fulfillment friction needs review" },
        { label: "High-value baskets", value: "83", meta: "Priority orders above normal order value" },
        { label: "Recovered carts", value: "41", meta: "Re-engaged orders brought back into flow" },
      ]}
    />
  );
}
