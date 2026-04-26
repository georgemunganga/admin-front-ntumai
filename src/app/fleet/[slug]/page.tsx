import { notFound } from "next/navigation";
import ModulePage from "@/components/admin/module-page";
import { fleetModulePages } from "@/components/admin/module-configs";

export default async function FleetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = fleetModulePages[slug];

  if (!config) {
    notFound();
  }

  return <ModulePage {...config} />;
}
