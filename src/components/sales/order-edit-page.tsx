"use client";

import { notFound } from "next/navigation";
import OrderFormWorkspace from "@/components/sales/order-form-workspace";
import { getSalesOrderById } from "@/repositories/admin/orders";

export default function OrderEditPage({ id }: { id: string }) {
  const order = getSalesOrderById(id);
  if (!order) notFound();

  return <OrderFormWorkspace mode="edit" order={order} />;
}
