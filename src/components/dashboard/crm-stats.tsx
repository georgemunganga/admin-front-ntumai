"use client";

import { Badge, Text, Title } from "rizzui";
import { PiTrendDownBold, PiTrendUpBold } from "react-icons/pi";
import { crmStats } from "@/components/dashboard/dashboard-data";

export default function DashboardCrmStats() {
  return (
    <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @4xl:grid-cols-4 3xl:gap-8">
      {crmStats.map((stat) => (
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
              <span className="pe-1">{stat.percentage}%</span>
              {stat.increased ? (
                <PiTrendUpBold className="size-3" />
              ) : (
                <PiTrendDownBold className="size-3" />
              )}
            </Badge>
          </div>
          <Title className="text-3xl font-normal leading-none">
            {stat.value}
          </Title>
          <div className="text-gray-500">
            vs last cycle:{" "}
            <strong className="text-gray-900">{stat.lastMonth}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
