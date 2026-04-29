"use client";

import { notFound } from "next/navigation";
import OrderFormWorkspace from "@/components/sales/order-form-workspace";
import { getSalesOrder } from "@/components/sales/order-data";

export default function OrderEditPage({ id }: { id: string }) {
  const order = getSalesOrder(id);
  if (!order) notFound();

  return <OrderFormWorkspace mode="edit" order={order} />;
}
