"use client";

import { Badge, Text, Title } from "rizzui";
import { PiTrendDownBold, PiTrendUpBold } from "react-icons/pi";
import { useAdminSummary } from "@/repositories/admin/analytics";

export default function DashboardCrmStats() {
  const { data, isLoading, isLive } = useAdminSummary();

  // Build stat cards from live summary data
  const stats = [
    {
      title: "Total orders",
      value: isLoading ? "—" : data.orders.toLocaleString(),
      badge: isLive ? "Live" : "Cached",
      increased: true,
    },
    {
      title: "Total users",
      value: isLoading ? "—" : data.users.toLocaleString(),
      badge: isLive ? "Live" : "Cached",
      increased: true,
    },
    {
      title: "Support backlog",
      value: isLoading ? "—" : data.supportTicketsOpen.toLocaleString(),
      badge: isLive ? "Live" : "Cached",
      increased: data.supportTicketsOpen === 0,
    },
    {
      title: "Pending KYC",
      value: isLoading
        ? "—"
        : (data.pendingKyc.vendors + data.pendingKyc.taskers).toLocaleString(),
      badge: isLive ? "Live" : "Cached",
      increased:
        data.pendingKyc.vendors + data.pendingKyc.taskers === 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @4xl:grid-cols-4 3xl:gap-8">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="space-y-3 rounded-[24px] border border-gray-200 bg-white p-6 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.35)]"
        >
          <div className="flex items-center justify-between gap-3">
            <Text className="font-semibold text-gray-900">{stat.title}</Text>
            <Badge
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{
                backgroundColor: stat.increased ? "#C0F2CC" : "#FCECD6",
                color: stat.increased ? "#22973F" : "#EE6D3D",
              }}
            >
              {stat.badge}
              {stat.increased ? (
                <PiTrendUpBold className="ms-1 size-3" />
              ) : (
                <PiTrendDownBold className="ms-1 size-3" />
              )}
            </Badge>
          </div>
          <Title className="text-3xl font-normal leading-none">
            {stat.value}
          </Title>
          <div className="text-sm text-gray-500">
            {isLive
              ? "Live data from platform"
              : "Showing cached data"}
          </div>
        </div>
      ))}
    </div>
  );
}
