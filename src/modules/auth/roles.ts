// RBAC design for MEES ERP.
// Roles × modules × actions. Access levels:
//   full  = create, edit, approve, export
//   write = create + edit own scope (no approvals)
//   read  = view only
//   field = mobile/field capture (submit reports, GPS, photos)
//   none  = no access
//
// "scope" narrows the data a role can see (all, own projects, own team,
// assigned project, self only).

export type AccessLevel = "full" | "write" | "read" | "field" | "none";

export const accessMeta: Record<AccessLevel, { label: string; className: string }> = {
  full: { label: "Full", className: "bg-primary/15 text-primary border-primary/30" },
  write: { label: "Write", className: "bg-info/15 text-info border-info/30" },
  read: { label: "Read", className: "bg-secondary text-secondary-foreground border-border" },
  field: { label: "Field", className: "bg-accent/15 text-accent border-accent/30" },
  none: { label: "—", className: "bg-muted/40 text-muted-foreground border-border" },
};

export type RoleCategory = "Executive" | "Management" | "Engineering" | "Field" | "Support" | "System";

export type Role = {
  id: string;
  title: string;
  category: RoleCategory;
  headcount: number;
  scope: string;
  summary: string;
  approvalLimit?: string;
  keyDuties: string[];
  mfa: "required" | "recommended" | "optional";
};

export const roles: Role[] = [
  {
    id: "ceo",
    title: "CEO",
    category: "Executive",
    headcount: 1,
    scope: "All companies, all projects",
    summary: "Full read across the enterprise; approves strategic spend and board-level reporting.",
    approvalLimit: "Unlimited",
    keyDuties: ["Executive dashboards", "Final approval on tier-1 POs & COs", "Board & investor reports"],
    mfa: "required",
  },
  {
    id: "ops-manager",
    title: "Operations Manager",
    category: "Management",
    headcount: 1,
    scope: "All projects & field operations",
    summary: "Oversees portfolio delivery, HSE and cross-project resource allocation.",
    approvalLimit: "GHS 500,000",
    keyDuties: ["Approve daily-report roll-ups", "Cross-project resourcing", "HSE escalations"],
    mfa: "required",
  },
  {
    id: "project-manager",
    title: "Project Manager",
    category: "Management",
    headcount: 6,
    scope: "Assigned projects only",
    summary: "Owns budget, schedule and client relationship for assigned projects.",
    approvalLimit: "GHS 150,000",
    keyDuties: ["Approve WBS, milestones, snags", "Sign daily-report roll-ups", "Raise change orders"],
    mfa: "required",
  },
  {
    id: "electrical-engineer",
    title: "Electrical Engineer",
    category: "Engineering",
    headcount: 8,
    scope: "Assigned projects",
    summary: "Design authority, technical submittals, testing & commissioning sign-off.",
    keyDuties: ["Design & drawing register", "Approve technical submittals", "Commissioning reports"],
    mfa: "recommended",
  },
  {
    id: "site-supervisor",
    title: "Site Supervisor",
    category: "Field",
    headcount: 10,
    scope: "Assigned site / crew",
    summary: "Consolidates crew daily reports and forwards to the Project Manager.",
    keyDuties: ["Consolidate crew reports", "Log incidents & near-misses", "Request site materials"],
    mfa: "recommended",
  },
  {
    id: "procurement-officer",
    title: "Procurement & Stores Officer",
    category: "Support",
    headcount: 3,
    scope: "All suppliers & stock",
    summary: "Runs RFQs, POs, GRNs and vendor scoring.",
    approvalLimit: "GHS 25,000",
    keyDuties: ["Raise & manage POs", "Vendor onboarding & rating", "Reconcile GRNs to invoices"],
    mfa: "required",
  },
  {
    id: "finance-officer",
    title: "Finance & Administration Officer",
    category: "Support",
    headcount: 4,
    scope: "All financial data",
    summary: "GL, AR/AP, payroll, tax and admin functions.",
    approvalLimit: "GHS 50,000 (payments)",
    keyDuties: ["Approve invoices for payment", "Payroll runs", "Statutory filings"],
    mfa: "required",
  },
  {
    id: "bd-manager",
    title: "Business Development Manager",
    category: "Management",
    headcount: 2,
    scope: "CRM, tenders, pipeline",
    summary: "Owns lead-to-award pipeline and tender submissions.",
    keyDuties: ["Manage tender pipeline", "Client relationship log", "Win/loss analytics"],
    mfa: "recommended",
  },
  {
    id: "driver",
    title: "Drivers",
    category: "Field",
    headcount: 12,
    scope: "Assigned vehicle only",
    summary: "Logs trips, fuel and vehicle checks from mobile.",
    keyDuties: ["Daily vehicle checklist", "Fuel & trip log", "Report defects to Workshop"],
    mfa: "optional",
  },
  {
    id: "storekeeper",
    title: "Storekeeper",
    category: "Support",
    headcount: 3,
    scope: "Assigned store / warehouse",
    summary: "Receives, issues and stocktakes materials against POs and material requests.",
    keyDuties: ["Post GRNs & issues", "Cycle counts & stocktakes", "Flag stock-outs"],
    mfa: "recommended",
  },
  {
    id: "electrician",
    title: "Electricians",
    category: "Field",
    headcount: 40,
    scope: "Self · assigned project",
    summary: "Submits daily field reports with GPS, photos and materials used.",
    keyDuties: ["Submit daily report", "Log materials used", "Flag safety concerns"],
    mfa: "optional",
  },
  {
    id: "technician",
    title: "Technicians",
    category: "Field",
    headcount: 22,
    scope: "Self · assigned project",
    summary: "Testing, meggering and instrumentation tasks with daily field reporting.",
    keyDuties: ["Submit daily report", "Log test results", "Request calibrated tools"],
    mfa: "optional",
  },
  {
    id: "artisan",
    title: "Artisans",
    category: "Field",
    headcount: 30,
    scope: "Self · assigned project",
    summary: "Skilled trade tasks (conduiting, fabrication) with mobile daily reporting.",
    keyDuties: ["Submit daily report", "Log units produced", "Report tool shortages"],
    mfa: "optional",
  },
  {
    id: "casual",
    title: "Casual Labour",
    category: "Field",
    headcount: 60,
    scope: "Self · assigned project (attendance only)",
    summary: "Attendance clock-in/out via supervisor device; no ERP data entry.",
    keyDuties: ["Attendance capture", "Acknowledge safety briefings"],
    mfa: "optional",
  },
  {
    id: "sysadmin",
    title: "System Administrator",
    category: "System",
    headcount: 1,
    scope: "All modules (technical)",
    summary: "User provisioning, RBAC, integrations, backups and audit oversight.",
    keyDuties: ["Manage users & roles", "Monitor audit log", "Configure integrations & backups"],
    mfa: "required",
  },
];

export const modules = [
  "Executive Dashboard",
  "Daily Reports",
  "AI Insights",
  "Projects",
  "Procurement",
  "Inventory",
  "Fleet & Transport",
  "Workshop",
  "HSE",
  "Finance",
  "HR",
  "Business Development",
  "Documents",
  "Settings",
] as const;

export type ModuleName = (typeof modules)[number];

// Permission matrix — roleId → module → level.
export const matrix: Record<string, Record<ModuleName, AccessLevel>> = {
  ceo: {
    "Executive Dashboard": "full", "Daily Reports": "read", "AI Insights": "full",
    Projects: "read", Procurement: "full", Inventory: "read", "Fleet & Transport": "read",
    Workshop: "read", HSE: "full", Finance: "full", HR: "read",
    "Business Development": "full", Documents: "full", Settings: "read",
  },
  "ops-manager": {
    "Executive Dashboard": "full", "Daily Reports": "full", "AI Insights": "full",
    Projects: "full", Procurement: "full", Inventory: "full", "Fleet & Transport": "full",
    Workshop: "full", HSE: "full", Finance: "read", HR: "read",
    "Business Development": "read", Documents: "full", Settings: "read",
  },
  "project-manager": {
    "Executive Dashboard": "read", "Daily Reports": "full", "AI Insights": "read",
    Projects: "full", Procurement: "write", Inventory: "read", "Fleet & Transport": "write",
    Workshop: "read", HSE: "write", Finance: "read", HR: "read",
    "Business Development": "read", Documents: "write", Settings: "none",
  },
  "electrical-engineer": {
    "Executive Dashboard": "none", "Daily Reports": "read", "AI Insights": "read",
    Projects: "write", Procurement: "read", Inventory: "read", "Fleet & Transport": "none",
    Workshop: "read", HSE: "read", Finance: "none", HR: "none",
    "Business Development": "none", Documents: "write", Settings: "none",
  },
  "site-supervisor": {
    "Executive Dashboard": "none", "Daily Reports": "write", "AI Insights": "read",
    Projects: "read", Procurement: "field", Inventory: "field", "Fleet & Transport": "field",
    Workshop: "read", HSE: "write", Finance: "none", HR: "none",
    "Business Development": "none", Documents: "read", Settings: "none",
  },
  "procurement-officer": {
    "Executive Dashboard": "none", "Daily Reports": "read", "AI Insights": "read",
    Projects: "read", Procurement: "full", Inventory: "full", "Fleet & Transport": "read",
    Workshop: "read", HSE: "none", Finance: "read", HR: "none",
    "Business Development": "read", Documents: "write", Settings: "none",
  },
  "finance-officer": {
    "Executive Dashboard": "read", "Daily Reports": "read", "AI Insights": "read",
    Projects: "read", Procurement: "read", Inventory: "read", "Fleet & Transport": "read",
    Workshop: "read", HSE: "none", Finance: "full", HR: "write",
    "Business Development": "read", Documents: "write", Settings: "none",
  },
  "bd-manager": {
    "Executive Dashboard": "read", "Daily Reports": "none", "AI Insights": "read",
    Projects: "read", Procurement: "none", Inventory: "none", "Fleet & Transport": "none",
    Workshop: "none", HSE: "none", Finance: "read", HR: "none",
    "Business Development": "full", Documents: "write", Settings: "none",
  },
  driver: {
    "Executive Dashboard": "none", "Daily Reports": "field", "AI Insights": "none",
    Projects: "none", Procurement: "none", Inventory: "none", "Fleet & Transport": "field",
    Workshop: "field", HSE: "field", Finance: "none", HR: "none",
    "Business Development": "none", Documents: "read", Settings: "none",
  },
  storekeeper: {
    "Executive Dashboard": "none", "Daily Reports": "read", "AI Insights": "none",
    Projects: "read", Procurement: "write", Inventory: "full", "Fleet & Transport": "none",
    Workshop: "read", HSE: "none", Finance: "none", HR: "none",
    "Business Development": "none", Documents: "read", Settings: "none",
  },
  electrician: {
    "Executive Dashboard": "none", "Daily Reports": "field", "AI Insights": "none",
    Projects: "read", Procurement: "none", Inventory: "field", "Fleet & Transport": "none",
    Workshop: "field", HSE: "field", Finance: "none", HR: "none",
    "Business Development": "none", Documents: "read", Settings: "none",
  },
  technician: {
    "Executive Dashboard": "none", "Daily Reports": "field", "AI Insights": "none",
    Projects: "read", Procurement: "none", Inventory: "field", "Fleet & Transport": "none",
    Workshop: "field", HSE: "field", Finance: "none", HR: "none",
    "Business Development": "none", Documents: "read", Settings: "none",
  },
  artisan: {
    "Executive Dashboard": "none", "Daily Reports": "field", "AI Insights": "none",
    Projects: "read", Procurement: "none", Inventory: "field", "Fleet & Transport": "none",
    Workshop: "field", HSE: "field", Finance: "none", HR: "none",
    "Business Development": "none", Documents: "read", Settings: "none",
  },
  casual: {
    "Executive Dashboard": "none", "Daily Reports": "field", "AI Insights": "none",
    Projects: "none", Procurement: "none", Inventory: "none", "Fleet & Transport": "none",
    Workshop: "none", HSE: "field", Finance: "none", HR: "none",
    "Business Development": "none", Documents: "none", Settings: "none",
  },
  sysadmin: {
    "Executive Dashboard": "read", "Daily Reports": "read", "AI Insights": "read",
    Projects: "read", Procurement: "read", Inventory: "read", "Fleet & Transport": "read",
    Workshop: "read", HSE: "read", Finance: "read", HR: "read",
    "Business Development": "read", Documents: "full", Settings: "full",
  },
};

// Approval / escalation chain for a daily field report.
export const reportApprovalChain = [
  { role: "Electrician / Technician / Artisan", action: "Submit daily field report" },
  { role: "Site Supervisor", action: "Verify crew reports & consolidate" },
  { role: "Project Manager", action: "Approve project-level roll-up" },
  { role: "Operations Manager", action: "Sign-off portfolio roll-up" },
  { role: "CEO", action: "Executive visibility" },
];

// Financial approval tiers.
export const approvalTiers = [
  { tier: "Tier 1", range: "≤ GHS 25,000", approver: "Procurement & Stores Officer" },
  { tier: "Tier 2", range: "≤ GHS 50,000", approver: "Finance & Administration Officer" },
  { tier: "Tier 3", range: "≤ GHS 150,000", approver: "Project Manager" },
  { tier: "Tier 4", range: "≤ GHS 500,000", approver: "Operations Manager" },
  { tier: "Tier 5", range: "> GHS 500,000", approver: "CEO" },
];
