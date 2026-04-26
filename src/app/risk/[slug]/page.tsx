import { notFound } from "next/navigation";
import ModulePage from "@/components/admin/module-page";
import { riskModulePages } from "@/components/admin/module-configs";

export default async function RiskDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = riskModulePages[slug];

  if (!config) {
    notFound();
  }

  return <ModulePage {...config} />;
}
