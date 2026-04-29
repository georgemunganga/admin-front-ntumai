import LogisticsTrackingDetailPage from "@/components/logistics/logistics-tracking-detail-page";

export default async function LogisticsTrackingDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LogisticsTrackingDetailPage id={id} />;
}
