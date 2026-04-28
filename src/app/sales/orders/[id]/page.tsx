import OrderDetailPage from "@/components/sales/order-detail-page";

export default async function SalesOrderDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailPage id={id} />;
}
