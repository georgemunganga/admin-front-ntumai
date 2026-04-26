import { notFound } from "next/navigation";
import ModulePage from "@/components/admin/module-page";
import { growthModulePages } from "@/components/admin/module-configs";

export default async function GrowthDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = growthModulePages[slug];

  if (!config) {
    notFound();
  }

  return <ModulePage {...config} />;
}
