import CustomerDetailPage from "@/components/crm/customer-detail-page";

export default async function CrmCustomerDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CustomerDetailPage id={id} />;
}
