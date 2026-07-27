import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/module-page";

export const Route = createFileRoute("/business-development")({
  head: () => ({
    meta: [
      { title: "Business Development · MEES ERP" },
      { name: "description", content: "CRM, tender management, proposal pipeline, opportunity tracking and revenue forecasting." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Business Development"
      description="CRM, tender management, proposal pipeline, opportunity tracking and revenue forecasting."
      features={["CRM","Client database","Tender management","Proposal management","Sales pipeline","Opportunity tracking","Marketing campaigns","Revenue forecasting"]}
    />
  ),
});
