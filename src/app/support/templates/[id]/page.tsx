import SupportTemplateDetailPage from "@/components/support/support-template-detail-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SupportTemplateDetailPage id={id} />;
}
