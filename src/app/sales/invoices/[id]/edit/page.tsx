import InvoiceEditPage from "@/components/sales/invoice-edit-page";

export default async function SalesInvoiceEditRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvoiceEditPage id={id} />;
}
