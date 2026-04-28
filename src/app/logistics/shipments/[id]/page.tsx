import ShipmentDetailPage from "@/components/logistics/shipment-detail-page";

export default async function LogisticsShipmentDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipmentDetailPage id={id} />;
}
