import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Project Management · MEES ERP" },
      { name: "description", content: "Projects, WBS, resource planning, budgets, snag lists, change orders and milestones." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Project Management"
      description="Projects, WBS, resource planning, budgets, snag lists, change orders and milestones."
      features={["Work Breakdown Structure","Resource planning","Daily site reports","Snag lists","Change orders","Site photos","Quality inspections","Risk register","Milestones","Project costing"]}
    />
  ),
});
