import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/module-page";

export const Route = createFileRoute("/hr")({
  head: () => ({
    meta: [
      { title: "Human Resources · MEES ERP" },
      { name: "description", content: "Employee records, recruitment, contracts, leave, attendance, training and performance reviews." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Human Resources"
      description="Employee records, recruitment, contracts, leave, attendance, training and performance reviews."
      features={["Employee records","Recruitment","Contracts","Leave","Attendance","Training","Performance reviews","Disciplinary records","Payroll integration","Organizational chart"]}
    />
  ),
});
