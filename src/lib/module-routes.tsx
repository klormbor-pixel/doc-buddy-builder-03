import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { PageShell, PageHeader, ModulePlaceholder } from "@/components/page-shell";

const meta = {
  "/projects": {
    title: "Project Management",
    desc: "Projects, WBS, resource planning, budgets, snag lists, change orders, milestones and quality inspections.",
    features: ["Work Breakdown Structure", "Resource planning", "Daily site reports", "Snag lists", "Change orders", "Site photos", "Quality inspections", "Risk register", "Milestones", "Project costing"],
  },
  "/procurement": {
    title: "Procurement",
    desc: "Supplier database, RFQs, quotation comparison, multi-level PO approvals, GRNs and vendor rating.",
    features: ["Supplier database", "RFQs", "Quotation comparison", "Purchase requests", "Purchase orders", "Multi-level approvals", "Goods Received Notes", "Vendor rating", "Procurement analytics"],
  },
  "/inventory": {
    title: "Inventory",
    desc: "Multi-store inventory with barcode/QR tracking, requisitions, transfers, batch and serial control.",
    features: ["Multi-store inventory", "Material requisition", "Stock transfers", "Asset register", "Equipment register", "Barcode / QR", "Batch tracking", "Serial numbers", "Low stock alerts", "Inventory valuation"],
  },
  "/fleet": {
    title: "Fleet & Transport",
    desc: "Vehicle register, GPS tracking, journey management, fuel, maintenance and licence renewals.",
    features: ["Vehicle register", "Driver management", "Journey management", "Fuel management", "GPS tracking", "Maintenance planning", "Insurance", "Licence renewals", "Daily vehicle inspection", "Fleet KPIs"],
  },
  "/workshop": {
    title: "Workshop Maintenance",
    desc: "Preventive and corrective maintenance, work orders, service history, spare parts and scheduling.",
    features: ["Preventive maintenance", "Corrective maintenance", "Work orders", "Service history", "Spare parts", "Maintenance scheduling", "Equipment availability"],
  },
  "/hse": {
    title: "Health, Safety & Environment",
    desc: "Incident reporting, risk assessments, PPE tracking, toolbox talks and compliance dashboards.",
    features: ["Incident reporting", "Near-miss reporting", "Risk assessments", "PPE tracking", "Toolbox talks", "Corrective actions", "Compliance dashboard", "Safety analytics"],
  },
  "/finance": {
    title: "Finance",
    desc: "General ledger, AP/AR, cash management, budgeting, payroll, VAT, SSNIT and financial statements.",
    features: ["General ledger", "Accounts payable", "Accounts receivable", "Cash management", "Budgeting", "Payroll", "VAT", "SSNIT", "Banking", "Project costing", "Financial statements", "Revenue forecasting"],
  },
  "/hr": {
    title: "Human Resources",
    desc: "Employee records, recruitment, contracts, leave, attendance, training and performance reviews.",
    features: ["Employee records", "Recruitment", "Contracts", "Leave", "Attendance", "Training", "Performance reviews", "Disciplinary records", "Payroll integration", "Organizational chart"],
  },
  "/business-development": {
    title: "Business Development",
    desc: "CRM, tender management, proposal pipeline, opportunity tracking and revenue forecasting.",
    features: ["CRM", "Client database", "Tender management", "Proposal management", "Sales pipeline", "Opportunity tracking", "Marketing campaigns", "Revenue forecasting"],
  },
  "/documents": {
    title: "Document Management",
    desc: "Drawings, contracts, reports, certificates and policies with version control, OCR and full-text search.",
    features: ["Drawings", "Contracts", "Technical reports", "Policies", "Certificates", "Version control", "Digital signatures", "OCR", "Workflow automation", "Full-text search"],
  },
  "/ai-insights": {
    title: "AI Insights",
    desc: "Natural-language querying, executive briefs, anomaly detection and predictive analytics across the ERP.",
    features: ["Report summarization", "Project completion prediction", "Procurement forecasting", "Cost overrun detection", "Cash flow prediction", "Safety risk identification", "Anomaly detection", "Executive report generation", "Natural-language querying"],
  },
  "/settings": {
    title: "Settings",
    desc: "Users, roles (RBAC), MFA, SSO, workflow engine, audit logs and integrations.",
    features: ["Users & roles", "RBAC", "Multi-factor auth", "Single sign-on", "Workflow engine", "Notifications", "Audit logs", "Backups", "API keys", "Integrations"],
  },
} as const;

type Slug = keyof typeof meta;

function makeRoute(slug: Slug) {
  return {
    head: () => ({
      meta: [
        { title: `${meta[slug].title} · MEES ERP` },
        { name: "description", content: meta[slug].desc },
      ],
    }),
    component: () => {
      const m = meta[slug];
      return (
        <>
          <AppHeader title={m.title} crumbs={[{ label: m.title }]} />
          <PageShell>
            <PageHeader title={m.title} description={m.desc} />
            <ModulePlaceholder title={m.title} description={m.desc} features={[...m.features]} />
          </PageShell>
        </>
      );
    },
  };
}

export const routeConfigs = {
  "/projects": makeRoute("/projects"),
  "/procurement": makeRoute("/procurement"),
  "/inventory": makeRoute("/inventory"),
  "/fleet": makeRoute("/fleet"),
  "/workshop": makeRoute("/workshop"),
  "/hse": makeRoute("/hse"),
  "/finance": makeRoute("/finance"),
  "/hr": makeRoute("/hr"),
  "/business-development": makeRoute("/business-development"),
  "/documents": makeRoute("/documents"),
  "/ai-insights": makeRoute("/ai-insights"),
  "/settings": makeRoute("/settings"),
};
