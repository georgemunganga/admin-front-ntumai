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
          className="space-y-3 rounded-lg border border-muted p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <Text className="font-semibold text-gray-900">{stat.title}</Text>
            <Badge
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
          <div className="text-gray-400">
            vs last cycle:{" "}
            <strong className="text-gray-900">{stat.lastMonth}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
