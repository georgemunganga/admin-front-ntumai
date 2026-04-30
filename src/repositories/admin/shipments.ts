"use client";

import { logisticsShipments, type LogisticsShipment } from "@/components/logistics/shipment-data";

export function listLogisticsShipments(): LogisticsShipment[] {
  return logisticsShipments;
}

export function getLogisticsShipmentById(id: string): LogisticsShipment | undefined {
  return logisticsShipments.find((shipment) => shipment.id === id);
}

export function listShipmentLanes(): string[] {
  return Array.from(new Set(logisticsShipments.map((shipment) => shipment.lane)));
}
