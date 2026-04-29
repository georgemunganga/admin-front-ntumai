import SupportTemplateFormPage from "@/components/support/support-template-form-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SupportTemplateFormPage mode="edit" id={id} />;
}
