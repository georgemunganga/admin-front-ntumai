import SectionPage from "@/components/admin/section-page";
import { catalogRows } from "@/components/admin/section-data";

export default function CatalogPage() {
  return (
    <SectionPage
      eyebrow="Commerce"
      title="Catalog and pricing"
      description="Keep product curation, stock visibility, vendor quality, and campaign pricing inside one modern merchandising workspace."
      badge="Revenue surface"
      insights={[
        {
          label: "Visible SKUs",
          value: "8,420",
          detail: "Products currently exposed to the customer-facing experiences.",
        },
        {
          label: "Pending edits",
          value: "12",
          detail: "Content or pricing changes still waiting for admin approval.",
        },
        {
          label: "Stock alerts",
          value: "57",
          detail: "Items trending toward hidden or oversold states.",
        },
      ]}
      queue={[
        {
          title: "Promo sunset audit",
          meta: "Weekend campaign discounts need review before midnight cut-off.",
          status: "review",
        },
        {
          title: "Pharmacy restrictions",
          meta: "Compliance checks expanded for select items and pack sizes.",
          status: "monitoring",
        },
        {
          title: "Vendor image cleanup",
          meta: "Several hero images fail the current product-card crop standards.",
          status: "queued",
        },
      ]}
      rows={catalogRows}
    />
  );
}
