"use client";

import { Box } from "rizzui/box";
import PageIntro from "@/components/admin/page-intro";
import DashboardCrmStats from "@/components/dashboard/crm-stats";
import DashboardProjectStats from "@/components/dashboard/project-stats";
import {
  DashboardActivities,
  DashboardClientList,
  DashboardOverallProgress,
  DashboardProjectStatistics,
  DashboardSummary,
  DashboardTaskList,
} from "@/components/dashboard/project-widgets";

export default function FleetPage() {
  return (
    <Box className="@container/pd space-y-6">
      <PageIntro
        breadcrumb={["Home", "Fleet"]}
        title="Fleet"
        description="Manage driver onboarding, document readiness, vehicle health, and supply performance from the fleet desk."
      />

      <DashboardCrmStats />
      <DashboardProjectStats className="mb-6 3xl:mb-8" />

      <Box className="grid grid-flow-row grid-cols-1 gap-6 @3xl/pd:grid-cols-12 3xl:gap-8">
        <DashboardProjectStatistics className="@3xl/pd:col-span-full @7xl/pd:col-span-8" />
        <DashboardOverallProgress className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
        <DashboardActivities className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
        <DashboardClientList className="@3xl/pd:col-span-full @7xl/pd:col-span-4" />
        <DashboardSummary className="@3xl/pd:col-span-full @7xl/pd:col-span-8" />
        <DashboardTaskList className="@3xl/pd:col-span-6 @7xl/pd:col-span-4" />
      </Box>
    </Box>
  );
}
