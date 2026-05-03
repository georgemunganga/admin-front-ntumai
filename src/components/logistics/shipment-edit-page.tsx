"use client";

import { notFound } from "next/navigation";
import ShipmentFormWorkspace from "@/components/logistics/shipment-form-workspace";
import {
  getLogisticsShipmentById,
  useLogisticsShipment,
} from "@/repositories/admin/shipments";

export default function ShipmentEditPage({ id }: { id: string }) {
  const fallback = getLogisticsShipmentById(id);
  const { data: liveShipment, isLoading } = useLogisticsShipment(id);
  const shipment = liveShipment ?? fallback;
  if (!shipment && !isLoading) notFound();
  if (!shipment) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        Loading shipment...
      </div>
    );
  }

  return <ShipmentFormWorkspace mode="edit" shipment={shipment} />;
}
