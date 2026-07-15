// Shared ERP mock data + roll-up helpers.
// Daily reports are linked to projects via `projectId`, and the helpers below
// compute automatic project-level roll-ups (health delta, milestone progress,
// crew hours, HSE signals) from the report stream.

export type ProjectStatus = "on-track" | "at-risk" | "delayed" | "completed";
export type ProjectPhase = "Design" | "Procurement" | "Installation" | "Testing" | "Handover";

export type Project = {
  id: string;
  code: string;
  name: string;
  client: string;
  location: string;
  pm: string;
  status: ProjectStatus;
  phase: ProjectPhase;
  progress: number;
  health: number;
  budget: number;
  spent: number;
  start: string;
  end: string;
  crew: number;
  openSnags: number;
  openCOs: number;
  hseIncidents: number;
  nextMilestone: string;
  nextMilestoneDate: string;
};

export const phases: ProjectPhase[] = [
  "Design",
  "Procurement",
  "Installation",
  "Testing",
  "Handover",
];

export const projectStatusMeta: Record<ProjectStatus, { label: string; className: string }> = {
  "on-track": {
    label: "On Track",
    className: "bg-success/15 text-success border-success/30",
  },
  "at-risk": {
    label: "At Risk",
    className: "bg-warning/15 text-warning border-warning/40",
  },
  delayed: {
    label: "Delayed",
    className: "bg-destructive/15 text-destructive border-destructive/40",
  },
  completed: {
    label: "Completed",
    className: "bg-info/15 text-info border-info/40",
  },
};

export const projects: Project[] = [
  {
    id: "p1",
    code: "MEES-2408",
    name: "Tarkwa Substation Upgrade",
    client: "Gold Fields Ghana",
    location: "Tarkwa, Western Region",
    pm: "K. Owusu",
    status: "on-track",
    phase: "Testing",
    progress: 82,
    health: 92,
    budget: 4.2,
    spent: 3.1,
    start: "2026-01-14",
    end: "2026-09-30",
    crew: 24,
    openSnags: 6,
    openCOs: 1,
    hseIncidents: 0,
    nextMilestone: "Bay 4 energization",
    nextMilestoneDate: "2026-07-24",
  },
  {
    id: "p2",
    code: "MEES-2411",
    name: "Obuasi Mine Lighting Retrofit",
    client: "AngloGold Ashanti",
    location: "Obuasi, Ashanti Region",
    pm: "A. Boateng",
    status: "on-track",
    phase: "Installation",
    progress: 64,
    health: 78,
    budget: 1.8,
    spent: 1.1,
    start: "2026-03-02",
    end: "2026-08-15",
    crew: 12,
    openSnags: 3,
    openCOs: 0,
    hseIncidents: 1,
    nextMilestone: "Level 32 handover",
    nextMilestoneDate: "2026-07-20",
  },
  {
    id: "p3",
    code: "MEES-2415",
    name: "Takoradi Port HV Distribution",
    client: "GPHA",
    location: "Takoradi Port",
    pm: "J. Mensah",
    status: "at-risk",
    phase: "Procurement",
    progress: 38,
    health: 65,
    budget: 6.4,
    spent: 2.9,
    start: "2026-02-10",
    end: "2026-12-20",
    crew: 18,
    openSnags: 2,
    openCOs: 3,
    hseIncidents: 1,
    nextMilestone: "Transformer delivery",
    nextMilestoneDate: "2026-08-05",
  },
  {
    id: "p4",
    code: "MEES-2418",
    name: "Kumasi BRT Depot Electrification",
    client: "Ministry of Transport",
    location: "Kumasi",
    pm: "K. Owusu",
    status: "on-track",
    phase: "Installation",
    progress: 71,
    health: 88,
    budget: 3.1,
    spent: 2.0,
    start: "2026-01-20",
    end: "2026-10-10",
    crew: 16,
    openSnags: 4,
    openCOs: 2,
    hseIncidents: 0,
    nextMilestone: "Charging bay energization",
    nextMilestoneDate: "2026-07-30",
  },
  {
    id: "p5",
    code: "MEES-2422",
    name: "Ahafo Camp Wiring & Distribution",
    client: "Newmont Ahafo",
    location: "Ahafo, Brong Region",
    pm: "M. Adjei",
    status: "delayed",
    phase: "Installation",
    progress: 43,
    health: 41,
    budget: 2.6,
    spent: 1.8,
    start: "2026-03-15",
    end: "2026-08-30",
    crew: 14,
    openSnags: 11,
    openCOs: 2,
    hseIncidents: 2,
    nextMilestone: "Block C rough-in",
    nextMilestoneDate: "2026-07-18",
  },
  {
    id: "p6",
    code: "MEES-2401",
    name: "Tema Refinery Panel Refurb",
    client: "TOR",
    location: "Tema",
    pm: "F. Nyarko",
    status: "completed",
    phase: "Handover",
    progress: 100,
    health: 96,
    budget: 0.9,
    spent: 0.86,
    start: "2025-11-01",
    end: "2026-05-30",
    crew: 6,
    openSnags: 0,
    openCOs: 0,
    hseIncidents: 0,
    nextMilestone: "Final documentation",
    nextMilestoneDate: "2026-06-05",
  },
];

export type ReportStatus = "submitted" | "pending" | "flagged";

export type DailyReport = {
  id: string;
  employee: string;
  role: string;
  projectId: string;
  location: string;
  hours: number;
  progress: number; // reported task progress for the day's WBS item
  tasks: string;
  materials: string;
  incidents: string;
  status: ReportStatus;
  time: string;
  aiSummary: string;
  /** Optional milestone this shift contributed to. */
  milestone?: string;
  /** Optional percent added to the linked milestone today. */
  milestoneDelta?: number;
};

export const seedReports: DailyReport[] = [
  {
    id: "DR-2408-091",
    employee: "Kofi Asante",
    role: "Electrician",
    projectId: "p1",
    location: "5.3018°N, 1.9932°W",
    hours: 9,
    progress: 88,
    tasks: "Terminated 33kV cable joints on Bay 3. Torque-tested all lugs to 45 Nm.",
    materials: "12 x cable lugs, 3 x heat-shrink boots, 1 x insulation tape roll",
    incidents: "None",
    status: "submitted",
    time: "17:42",
    aiSummary:
      "Bay 3 cable termination completed within tolerance. On track for energization Friday. No safety incidents.",
    milestone: "Bay 4 energization",
    milestoneDelta: 8,
  },
  {
    id: "DR-2408-090",
    employee: "Ama Nyarko",
    role: "Site Supervisor",
    projectId: "p5",
    location: "6.6673°N, 2.3389°W",
    hours: 10,
    progress: 42,
    tasks: "Supervised 6 electricians on conduit installation across Block C.",
    materials: "80m conduit, 220m 2.5mm² cable, 40 x junction boxes",
    incidents: "Near-miss: loose scaffold plank on 2nd floor, secured immediately.",
    status: "flagged",
    time: "18:05",
    aiSummary:
      "Block C behind schedule by 2 days due to material shortage. Near-miss logged — recommend HSE inspection.",
    milestone: "Block C rough-in",
    milestoneDelta: 3,
  },
  {
    id: "DR-2408-089",
    employee: "John Mensah",
    role: "Technician",
    projectId: "p3",
    location: "4.8946°N, 1.7554°W",
    hours: 8,
    progress: 71,
    tasks: "Meggering of feeder cables. All readings above 500 MΩ.",
    materials: "Consumables only",
    incidents: "None",
    status: "submitted",
    time: "16:58",
    aiSummary: "All insulation resistance readings passed. Ready for commissioning tests.",
    milestone: "Transformer delivery",
    milestoneDelta: 4,
  },
  {
    id: "DR-2408-088",
    employee: "Faustina Owusu",
    role: "Artisan",
    projectId: "p4",
    location: "6.6885°N, 1.6244°W",
    hours: 9,
    progress: 90,
    tasks: "Installed 24 x LED high-bay fixtures in bay 2. Tested circuits.",
    materials: "24 x 200W LED, 60m 4mm² cable",
    incidents: "None",
    status: "submitted",
    time: "17:15",
    aiSummary: "High-bay installation ahead of plan. Bay 2 lighting ready for handover.",
    milestone: "Charging bay energization",
    milestoneDelta: 9,
  },
  {
    id: "DR-2408-087",
    employee: "Michael Adjei",
    role: "Electrician",
    projectId: "p2",
    location: "6.2027°N, 1.6708°W",
    hours: 0,
    progress: 0,
    tasks: "—",
    materials: "—",
    incidents: "—",
    status: "pending",
    time: "—",
    aiSummary: "No report submitted yet. Reminder sent at 17:30.",
  },
  {
    id: "DR-2408-086",
    employee: "Yaw Boateng",
    role: "Foreman",
    projectId: "p1",
    location: "5.3022°N, 1.9929°W",
    hours: 9,
    progress: 76,
    tasks: "Bay 4 busbar dressing and torque check. Prepared for HV megger.",
    materials: "Torque wrench calibration, 6 x insulator caps",
    incidents: "None",
    status: "submitted",
    time: "17:20",
    aiSummary: "Bay 4 preparation on plan. HV megger scheduled tomorrow.",
    milestone: "Bay 4 energization",
    milestoneDelta: 6,
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

/** Aggregated roll-up computed from linked daily reports. */
export type ProjectRollup = {
  reportsToday: number;
  submitted: number;
  flagged: number;
  pending: number;
  hoursLogged: number;
  activeCrew: number;
  hseFlags: number;
  /** Sum of milestoneDelta% attributed to the project's next milestone today. */
  milestoneProgressToday: number;
  /** Adjusted project health = base health − 3 per flag − 2 per HSE flag, clamped 0-100. */
  healthAdjusted: number;
  healthDelta: number;
};

export function computeProjectRollup(project: Project, reports: DailyReport[]): ProjectRollup {
  const linked = reports.filter((r) => r.projectId === project.id);
  const submitted = linked.filter((r) => r.status === "submitted").length;
  const flagged = linked.filter((r) => r.status === "flagged").length;
  const pending = linked.filter((r) => r.status === "pending").length;
  const hoursLogged = linked.reduce((s, r) => s + r.hours, 0);
  const activeCrew = new Set(linked.filter((r) => r.hours > 0).map((r) => r.employee)).size;
  const hseFlags = linked.filter(
    (r) => r.incidents && r.incidents !== "—" && r.incidents.toLowerCase() !== "none",
  ).length;
  const milestoneProgressToday = linked
    .filter((r) => r.milestone === project.nextMilestone)
    .reduce((s, r) => s + (r.milestoneDelta ?? 0), 0);

  const healthAdjusted = Math.max(
    0,
    Math.min(100, project.health - flagged * 3 - hseFlags * 2 + (submitted > 0 ? 1 : 0)),
  );

  return {
    reportsToday: linked.length,
    submitted,
    flagged,
    pending,
    hoursLogged,
    activeCrew,
    hseFlags,
    milestoneProgressToday,
    healthAdjusted,
    healthDelta: healthAdjusted - project.health,
  };
}

export function reportsForProject(projectId: string, reports: DailyReport[]): DailyReport[] {
  return reports.filter((r) => r.projectId === projectId);
}
