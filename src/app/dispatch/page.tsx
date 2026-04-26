"use client";

import { Box } from "rizzui/box";
import { Text, Title } from "rizzui";
import DashboardCrmStats from "@/components/dashboard/crm-stats";
import DashboardProjectStats from "@/components/dashboard/project-stats";
import {
  DashboardActivities,
  DashboardClientList,
  DashboardOverallProgress,
  DashboardProjectStatistics,
  DashboardRecentActivities,
  DashboardSummary,
} from "@/components/dashboard/project-widgets";

export default function DispatchPage() {
  return (
    <Box className="@container/pd space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span className="inline-flex items-center gap-2">
            <span>Home</span>
            <span>/</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span>Dispatch</span>
          </span>
        </div>
        <Title as="h1" className="text-2xl font-semibold">
          Dispatch
        </Title>
        <Text className="max-w-3xl text-sm leading-7 text-gray-500">
          Monitor live bookings, supply pressure, and operator intervention lanes from the dispatch desk.
        </Text>
      </div>

      <DashboardCrmStats />
      <DashboardProjectStats className="mb-6 3xl:mb-8" />

      <Box className="grid grid-flow-row grid-cols-1 gap-6 @3xl/pd:grid-cols-12 3xl:gap-8">
        <DashboardProjectStatistics className="@3xl/pd:col-span-full @7xl/pd:col-span-8" />
        <DashboardOverallProgress className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
        <DashboardActivities className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
        <DashboardClientList className="@3xl/pd:col-span-full @7xl/pd:col-span-4" />
        <DashboardSummary className="@3xl/pd:col-span-full @7xl/pd:col-span-8" />
        <DashboardRecentActivities className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
      </Box>
    </Box>
  );
}
