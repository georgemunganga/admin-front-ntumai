"use client";

import dynamic from "next/dynamic";
import DataSourceState from "@/components/admin/data-source-state";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { dispatchEntities } from "@/components/dispatch/live-map.data";
import { useAdminLiveDispatch } from "@/repositories/admin/dispatch";
import { Text } from "rizzui";

const LiveDispatchMap = dynamic(
  () => import("@/components/dispatch/live-dispatch-map"),
  {
    ssr: false,
    loading: () => (
      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <div className="h-4 w-40 rounded-full bg-gray-200" />
          <div className="mt-3 h-3 w-64 rounded-full bg-gray-100" />
        </div>
        <div className="h-[72vh] min-h-[620px] max-h-[860px] animate-pulse bg-gray-100" />
      </div>
    ),
  },
);

export default function DispatchLiveMapPage() {
  const {
    entities: liveEntities,
    loading,
    error,
    refreshedAt,
    refresh,
  } = useAdminLiveDispatch();
  const staticVendors = dispatchEntities.filter((entity) => entity.kind === "vendor").length;
  const staticAlerts = dispatchEntities.filter((entity) => entity.kind === "alert").length;
  const supervisionRows = liveEntities.map((entity) => ({
    primary: entity.label,
    secondary: `${entity.orderRef} · ${entity.customer} → ${entity.vendor}`,
    tertiary: entity.city,
    status: <StatusBadge status={entity.status === "ASSIGNED" ? "live" : entity.status === "PICKED_UP" ? "monitoring" : "review"} />,
  }));

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Dispatch", "Live Map"]}
        eyebrow="Operations"
        title="Live map"
        description="Track live taskers, marketplace locations, and dispatch alerts from one map surface."
        badge="Realtime"
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Taskers online"
            value={String(liveEntities.length)}
            change={loading ? "Syncing live feed" : "Live registry"}
            tone="positive"
            detail="Active taskers currently visible from the live dispatch registry."
          />
          <StatCard
            label="Marketplace pins"
            value={String(staticVendors)}
            change="Marketplace watch"
            tone="warning"
            detail="Vendor locations currently contributing live order demand."
          />
          <StatCard
            label="Dispatch alerts"
            value={String(staticAlerts)}
            change="Needs eyes"
            tone="warning"
            detail="Trips with movement, ETA, or handoff signals needing staff attention."
          />
        </div>

        <LiveDispatchMap
          liveEntities={liveEntities}
          refreshedAt={refreshedAt}
          onRefresh={refresh}
        />

        <ShellCard
          title="Live supervision feed"
          description="Working set from the current live dispatch registry."
        >
          <div className="mb-4 flex justify-end">
            <DataSourceState isLoading={loading} isLive={Boolean(liveEntities.length) && !error} error={error} />
          </div>
          <DataTable
            rows={supervisionRows}
            columns={[
              { key: "primary", label: "Tasker" },
              { key: "secondary", label: "Context" },
              { key: "tertiary", label: "Zone" },
              { key: "status", label: "Status", className: "md:justify-self-end" },
            ]}
          />
          {!loading && !supervisionRows.length ? (
            <Text className="mt-4 text-sm text-gray-500">
              No live dispatch entities are available yet.
            </Text>
          ) : null}
        </ShellCard>
      </div>
    </div>
  );
}
