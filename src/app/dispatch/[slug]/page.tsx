import { notFound } from "next/navigation";
import ModulePage from "@/components/admin/module-page";
import { dispatchModulePages } from "@/components/admin/module-configs";

export default async function DispatchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = dispatchModulePages[slug];

  if (!config) {
    notFound();
  }

  return <ModulePage {...config} />;
}
