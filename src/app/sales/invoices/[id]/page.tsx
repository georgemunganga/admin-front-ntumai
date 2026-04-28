import InvoiceDetailPage from "@/components/sales/invoice-detail-page";

export default async function SalesInvoiceDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvoiceDetailPage id={id} />;
}
