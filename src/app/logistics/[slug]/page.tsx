import { notFound } from "next/navigation";
import ModulePage from "@/components/admin/module-page";
import { logisticsExtraPages } from "@/components/admin/module-configs";

export default async function LogisticsExtraPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = logisticsExtraPages[slug];

  if (!config) {
    notFound();
  }

  return <ModulePage {...config} breadcrumb={["Home", "Logistics", config.title]} />;
}
