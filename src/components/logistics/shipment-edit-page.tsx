"use client";

import { notFound } from "next/navigation";
import ShipmentFormWorkspace from "@/components/logistics/shipment-form-workspace";
import { getLogisticsShipmentById } from "@/repositories/admin/shipments";

export default function ShipmentEditPage({ id }: { id: string }) {
  const shipment = getLogisticsShipmentById(id);
  if (!shipment) notFound();

  return <ShipmentFormWorkspace mode="edit" shipment={shipment} />;
}
