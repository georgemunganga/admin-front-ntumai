"use client";

import { salesOrders, type SalesOrder } from "@/components/sales/order-data";

export function listSalesOrders(): SalesOrder[] {
  return salesOrders;
}

export function getSalesOrderById(id: string): SalesOrder | undefined {
  return salesOrders.find((order) => order.id === id || order.slug === id);
}
