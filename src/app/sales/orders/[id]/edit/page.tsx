import OrderEditPage from "@/components/sales/order-edit-page";

export default async function SalesOrderEditRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderEditPage id={id} />;
}
