"use client";

import { Box } from "rizzui/box";
import DashboardCrmStats from "@/components/dashboard/crm-stats";
import DashboardProjectStats from "@/components/dashboard/project-stats";
import {
  DashboardActiveTasks,
  DashboardActivities,
  DashboardClientList,
  DashboardOverallProgress,
  DashboardProjectStatistics,
  DashboardRecentActivities,
  DashboardSummary,
  DashboardTaskList,
} from "@/components/dashboard/project-widgets";

export default function Home() {
  return (
    <Box className="@container/pd space-y-6">
      <DashboardCrmStats />
      <DashboardProjectStats className="mb-6 3xl:mb-8" />
      <Box className="grid grid-flow-row grid-cols-1 gap-6 @3xl/pd:grid-cols-12 3xl:gap-8">
        <DashboardProjectStatistics className="@3xl/pd:col-span-full @7xl/pd:col-span-8" />
        <DashboardOverallProgress className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
        <DashboardActivities className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
        <DashboardClientList className="@3xl/pd:col-span-full @7xl/pd:col-span-4" />
        <DashboardActiveTasks className="@3xl/pd:col-span-full @7xl/pd:col-span-8" />
        <DashboardSummary className="@3xl/pd:col-span-full @7xl/pd:col-span-8" />
        <DashboardTaskList className="@3xl/pd:col-span-6 @7xl/pd:col-span-4 @7xl/pd:col-start-9 @7xl/pd:col-end-13 @7xl/pd:row-start-2 @7xl/pd:row-end-4" />
        <DashboardRecentActivities className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
      </Box>
    </Box>
  );
}
