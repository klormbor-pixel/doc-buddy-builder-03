import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/hse")({
  head: () => ({
    meta: [
      { title: "Health, Safety & Environment · MEES ERP" },
      { name: "description", content: "Incident reporting, risk assessments, PPE tracking, toolbox talks and compliance dashboards." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Health, Safety & Environment"
      description="Incident reporting, risk assessments, PPE tracking, toolbox talks and compliance dashboards."
      features={["Incident reporting","Near-miss reporting","Risk assessments","PPE tracking","Toolbox talks","Corrective actions","Compliance dashboard","Safety analytics"]}
    />
  ),
});
