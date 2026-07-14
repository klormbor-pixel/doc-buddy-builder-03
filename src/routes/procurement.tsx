import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/procurement")({
  head: () => ({
    meta: [
      { title: "Procurement · MEES ERP" },
      { name: "description", content: "Supplier database, RFQs, multi-level PO approvals, GRNs and vendor rating." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Procurement"
      description="Supplier database, RFQs, multi-level PO approvals, GRNs and vendor rating."
      features={["Supplier database","RFQs","Quotation comparison","Purchase requests","Purchase orders","Multi-level approvals","Goods Received Notes","Vendor rating","Procurement analytics"]}
    />
  ),
});
