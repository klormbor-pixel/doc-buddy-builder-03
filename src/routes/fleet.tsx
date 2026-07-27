import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/module-page";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet & Transport · MEES ERP" },
      { name: "description", content: "Vehicle register, GPS tracking, journey management, fuel, maintenance and licence renewals." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Fleet & Transport"
      description="Vehicle register, GPS tracking, journey management, fuel, maintenance and licence renewals."
      features={["Vehicle register","Driver management","Journey management","Fuel management","GPS tracking","Maintenance planning","Insurance","Licence renewals","Daily vehicle inspection","Fleet KPIs"]}
    />
  ),
});
