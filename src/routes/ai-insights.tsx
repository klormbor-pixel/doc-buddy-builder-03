import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/ai-insights")({
  head: () => ({
    meta: [
      { title: "AI Insights · MEES ERP" },
      { name: "description", content: "Natural-language querying, executive briefs, anomaly detection and predictive analytics across the ERP." },
    ],
  }),
  component: () => (
    <ModulePage
      title="AI Insights"
      description="Natural-language querying, executive briefs, anomaly detection and predictive analytics across the ERP."
      features={["Report summarization","Project completion prediction","Procurement forecasting","Cost overrun detection","Cash flow prediction","Safety risk identification","Anomaly detection","Executive report generation","Natural-language querying"]}
    />
  ),
});
