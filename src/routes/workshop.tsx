import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/module-page";

export const Route = createFileRoute("/workshop")({
  head: () => ({
    meta: [
      { title: "Workshop Maintenance · MEES ERP" },
      { name: "description", content: "Preventive and corrective maintenance, work orders, service history, spare parts and scheduling." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Workshop Maintenance"
      description="Preventive and corrective maintenance, work orders, service history, spare parts and scheduling."
      features={["Preventive maintenance","Corrective maintenance","Work orders","Service history","Spare parts","Maintenance scheduling","Equipment availability"]}
    />
  ),
});
