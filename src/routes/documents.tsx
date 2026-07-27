import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/module-page";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Management · MEES ERP" },
      { name: "description", content: "Drawings, contracts, reports and certificates with version control, OCR and full-text search." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Document Management"
      description="Drawings, contracts, reports and certificates with version control, OCR and full-text search."
      features={["Drawings","Contracts","Technical reports","Policies","Certificates","Version control","Digital signatures","OCR","Workflow automation","Full-text search"]}
    />
  ),
});
