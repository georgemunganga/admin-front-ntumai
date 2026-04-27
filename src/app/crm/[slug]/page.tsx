import { notFound } from "next/navigation";
import ModulePage from "@/components/admin/module-page";
import { crmModulePages } from "@/components/admin/module-configs";

export default async function CrmDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = crmModulePages[slug];

  if (!config) {
    notFound();
  }

  return <ModulePage {...config} breadcrumb={["Home", "CRM", config.title]} />;
}
