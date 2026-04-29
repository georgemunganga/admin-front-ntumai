"use client";

import { notFound } from "next/navigation";
import ShipmentFormWorkspace from "@/components/logistics/shipment-form-workspace";
import { getLogisticsShipment } from "@/components/logistics/shipment-data";

export default function ShipmentEditPage({ id }: { id: string }) {
  const shipment = getLogisticsShipment(id);
  if (!shipment) notFound();

  return <ShipmentFormWorkspace mode="edit" shipment={shipment} />;
}
