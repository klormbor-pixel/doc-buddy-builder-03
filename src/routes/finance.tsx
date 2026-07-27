import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/module-page";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance · MEES ERP" },
      { name: "description", content: "General ledger, AP/AR, cash management, budgeting, payroll, VAT, SSNIT and financial statements." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Finance"
      description="General ledger, AP/AR, cash management, budgeting, payroll, VAT, SSNIT and financial statements."
      features={["General ledger","Accounts payable","Accounts receivable","Cash management","Budgeting","Payroll","VAT","SSNIT","Banking","Project costing","Financial statements","Revenue forecasting"]}
    />
  ),
});
