import ShipmentEditPage from "@/components/logistics/shipment-edit-page";

export default async function LogisticsShipmentEditRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipmentEditPage id={id} />;
}
