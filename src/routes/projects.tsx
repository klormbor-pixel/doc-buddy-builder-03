import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  MoreHorizontal,
  ArrowUpRight,
  FileText,
  Wrench,
  ShieldAlert,
  ClipboardList,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import {
  projects,
  phases,
  projectStatusMeta as statusMeta,
  computeProjectRollup,
  reportsForProject,
  seedReports,
  type Project,
  type ProjectStatus as Status,
  type ProjectPhase as Phase,
} from "@/lib/erp-data";

import { AppHeader } from "@/components/app-header";
import { PageShell, PageHeader } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Project Management · MEES ERP" },
      {
        name: "description",
        content:
          "Live portfolio of MEES electrical engineering projects: WBS, budgets, milestones, snag lists, change orders, and site health.",
      },
    ],
  }),
  component: ProjectsPage,
});

type Status = "on-track" | "at-risk" | "delayed" | "completed";
type Phase = "Design" | "Procurement" | "Installation" | "Testing" | "Handover";

type Project = {
  id: string;
  code: string;
  name: string;
  client: string;
  location: string;
  pm: string;
  status: Status;
  phase: Phase;
  progress: number;
  health: number;
  budget: number; // GHS millions
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

const projects: Project[] = [
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

const phases: Phase[] = ["Design", "Procurement", "Installation", "Testing", "Handover"];

const statusMeta: Record<Status, { label: string; className: string }> = {
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

function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selectedId, setSelectedId] = useState<string>(projects[0].id);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.pm.toLowerCase().includes(q)
      );
    });
  }, [query, statusFilter]);

  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  const totals = useMemo(() => {
    const active = projects.filter((p) => p.status !== "completed");
    const budget = projects.reduce((s, p) => s + p.budget, 0);
    const spent = projects.reduce((s, p) => s + p.spent, 0);
    const atRisk = projects.filter((p) => p.status === "at-risk" || p.status === "delayed").length;
    const snags = projects.reduce((s, p) => s + p.openSnags, 0);
    return { active: active.length, budget, spent, atRisk, snags };
  }, []);

  return (
    <>
      <AppHeader title="Project Management" crumbs={[{ label: "Operations" }, { label: "Projects" }]} />
      <PageShell>
        <PageHeader
          title="Projects Portfolio"
          description="Live status across all active engineering projects — schedule, cost, safety, and quality."
          actions={
            <>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Portfolio brief
              </Button>
              <NewProjectDialog />
            </>
          }
        />

        {/* KPI row */}
        <div className="kpi-grid">
          <MiniKpi label="Active Projects" value={String(totals.active)} icon={FolderKanban} tone="primary" />
          <MiniKpi
            label="Portfolio Budget"
            value={`₵ ${totals.budget.toFixed(1)}M`}
            icon={DollarSign}
            tone="info"
          />
          <MiniKpi
            label="Committed Spend"
            value={`₵ ${totals.spent.toFixed(1)}M`}
            sub={`${Math.round((totals.spent / totals.budget) * 100)}% of budget`}
            icon={TrendingUp}
            tone="accent"
          />
          <MiniKpi
            label="At Risk / Delayed"
            value={String(totals.atRisk)}
            icon={AlertTriangle}
            tone={totals.atRisk > 0 ? "warning" : "success"}
          />
          <MiniKpi label="Open Snags" value={String(totals.snags)} icon={Wrench} tone="primary" />
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search project, client, PM, code…"
              className="h-9 pl-8 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {(["all", "on-track", "at-risk", "delayed", "completed"] as const).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setStatusFilter(s)}
              >
                {s === "all" ? "All" : statusMeta[s].label}
              </Button>
            ))}
          </div>
        </div>

        {/* Split view */}
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  selectedId === p.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{p.code}</span>
                      <Badge variant="outline" className={`h-4 px-1.5 text-[10px] ${statusMeta[p.status].className}`}>
                        {statusMeta[p.status].label}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-foreground">{p.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-foreground">{p.progress}%</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.phase}</p>
                  </div>
                </div>
                <Progress value={p.progress} className="mt-2 h-1" />
                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {p.location.split(",")[0]}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {p.crew}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono">
                    ₵ {p.spent.toFixed(1)}/{p.budget.toFixed(1)}M
                  </span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No projects match your filters.
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            <ProjectDetail project={selected} />
          </div>
        </div>
      </PageShell>
    </>
  );
}

function MiniKpi({
  label,
  value,
  sub,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "accent" | "success" | "info" | "warning";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent-foreground",
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
    warning: "bg-warning/15 text-warning",
  } as const;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-1.5 font-mono text-xl font-semibold text-foreground">{value}</p>
            {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
          </div>
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${toneMap[tone]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const budgetPct = Math.round((project.spent / project.budget) * 100);
  const phaseIdx = phases.indexOf(project.phase);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">{project.code}</span>
              <Badge variant="outline" className={`h-5 px-2 text-[10px] ${statusMeta[project.status].className}`}>
                {statusMeta[project.status].label}
              </Badge>
            </div>
            <CardTitle className="mt-1 text-lg">{project.name}</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {project.client} · <MapPin className="inline h-3 w-3" /> {project.location}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Phase tracker */}
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Lifecycle</span>
            <span className="text-muted-foreground">
              {project.phase} · {project.progress}% complete
            </span>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {phases.map((ph, i) => (
              <div key={ph} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full ${
                    i < phaseIdx
                      ? "bg-success"
                      : i === phaseIdx
                        ? "bg-primary"
                        : "bg-border"
                  }`}
                />
                <p
                  className={`text-[10px] ${
                    i <= phaseIdx ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {ph}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetaBlock icon={Calendar} label="Start" value={fmt(project.start)} />
          <MetaBlock icon={Calendar} label="End" value={fmt(project.end)} />
          <MetaBlock icon={Users} label="Crew" value={String(project.crew)} />
          <MetaBlock icon={FolderKanban} label="PM" value={project.pm} />
        </div>

        {/* Budget bar */}
        <div className="rounded-md border border-border p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Budget utilisation</span>
            <span className="font-mono text-muted-foreground">
              ₵ {project.spent.toFixed(2)}M / ₵ {project.budget.toFixed(2)}M
            </span>
          </div>
          <Progress value={budgetPct} className="mt-2 h-2" />
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span
              className={
                budgetPct > (project.progress + 10)
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            >
              {budgetPct}% spent
            </span>
            <span className="text-muted-foreground">Progress {project.progress}%</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="wbs">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wbs">WBS</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="snags">
              Snags {project.openSnags > 0 && <span className="ml-1 font-mono text-[10px]">{project.openSnags}</span>}
            </TabsTrigger>
            <TabsTrigger value="changes">
              Changes {project.openCOs > 0 && <span className="ml-1 font-mono text-[10px]">{project.openCOs}</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wbs" className="mt-3">
            <WbsView project={project} />
          </TabsContent>

          <TabsContent value="milestones" className="mt-3">
            <MilestonesView project={project} />
          </TabsContent>

          <TabsContent value="snags" className="mt-3">
            <SnagsView project={project} />
          </TabsContent>

          <TabsContent value="changes" className="mt-3">
            <ChangesView project={project} />
          </TabsContent>
        </Tabs>

        {/* AI insight */}
        <div className="rounded-md border border-accent/40 bg-accent/5 p-3">
          <div className="flex items-start gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-semibold text-foreground">AI project brief</p>
              <p className="mt-1 text-foreground/90">
                {aiBrief(project)}
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Open full brief <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetaBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function WbsView({ project }: { project: Project }) {
  const wbs = [
    { code: "1.0", name: "Site mobilization", progress: 100, budget: 0.12 },
    { code: "2.0", name: "Civil & containment", progress: 92, budget: 0.4 },
    { code: "3.0", name: "Cable pulling & termination", progress: project.progress, budget: project.budget * 0.35 },
    { code: "4.0", name: "Panel installation", progress: Math.max(project.progress - 15, 0), budget: project.budget * 0.25 },
    { code: "5.0", name: "Testing & commissioning", progress: Math.max(project.progress - 40, 0), budget: project.budget * 0.15 },
    { code: "6.0", name: "Handover & documentation", progress: project.status === "completed" ? 100 : 0, budget: 0.08 },
  ];
  const chartData = wbs.map((w) => ({ name: w.code, progress: w.progress }));

  return (
    <div className="space-y-3">
      <div className="h-40 w-full rounded-md border border-border p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="progress" radius={[4, 4, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell
                  key={i}
                  fill={
                    d.progress >= 80
                      ? "var(--color-success)"
                      : d.progress >= 40
                        ? "var(--color-chart-1)"
                        : "var(--color-border)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1.5">
        {wbs.map((w) => (
          <div key={w.code} className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
            <span className="font-mono text-xs text-muted-foreground">{w.code}</span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm text-foreground">{w.name}</p>
              <Progress value={w.progress} className="mt-1 h-1" />
            </div>
            <span className="font-mono text-xs text-muted-foreground">₵ {w.budget.toFixed(2)}M</span>
            <span className="w-10 text-right font-mono text-xs font-semibold text-foreground">
              {w.progress}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestonesView({ project }: { project: Project }) {
  const milestones = [
    { name: "Kickoff & mobilization", date: project.start, status: "done" as const },
    { name: "Design approval", date: shift(project.start, 30), status: "done" as const },
    { name: "Long-lead procurement", date: shift(project.start, 60), status: project.progress > 40 ? "done" : "in-progress" as const },
    { name: project.nextMilestone, date: project.nextMilestoneDate, status: "in-progress" as const },
    { name: "Testing & commissioning", date: shift(project.end, -30), status: "planned" as const },
    { name: "Client handover", date: project.end, status: project.status === "completed" ? "done" : "planned" as const },
  ];
  return (
    <div className="space-y-2">
      {milestones.map((m, i) => {
        const Icon = m.status === "done" ? CheckCircle2 : m.status === "in-progress" ? Clock : Calendar;
        const color =
          m.status === "done"
            ? "text-success"
            : m.status === "in-progress"
              ? "text-primary"
              : "text-muted-foreground";
        return (
          <div key={i} className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
            <Icon className={`h-4 w-4 shrink-0 ${color}`} />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm text-foreground">{m.name}</p>
              <p className="text-[11px] text-muted-foreground">{fmt(m.date)}</p>
            </div>
            <Badge variant="outline" className="h-5 text-[10px] capitalize">
              {m.status.replace("-", " ")}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

function SnagsView({ project }: { project: Project }) {
  const snags = Array.from({ length: Math.min(project.openSnags, 6) }).map((_, i) => ({
    id: `SN-${(project.id.replace("p", "") + (i + 101)).padStart(4, "0")}`,
    title: [
      "Cable tray fixing loose in riser B",
      "Panel labeling missing on DB-04",
      "Earth continuity out of spec at MCC-2",
      "Conduit spacing below code — corridor C",
      "IP rating breach on outdoor JB",
      "Torque check overdue on breakers",
    ][i % 6],
    severity: (["low", "medium", "high"] as const)[i % 3],
    raisedBy: ["QA · S. Antwi", "Site Sup · J. Mensah", "Client rep"][i % 3],
  }));

  const sevColor: Record<string, string> = {
    low: "text-muted-foreground",
    medium: "text-warning",
    high: "text-destructive",
  };

  if (snags.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        <CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-success" />
        No open snags on this project.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {snags.map((s) => (
        <div key={s.id} className="flex items-start gap-3 rounded-md border border-border px-3 py-2">
          <ShieldAlert className={`mt-0.5 h-4 w-4 shrink-0 ${sevColor[s.severity]}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">{s.id}</span>
              <Badge variant="outline" className="h-4 px-1.5 text-[10px] capitalize">
                {s.severity}
              </Badge>
            </div>
            <p className="mt-0.5 truncate text-sm text-foreground">{s.title}</p>
            <p className="text-[11px] text-muted-foreground">Raised by {s.raisedBy}</p>
          </div>
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Resolve
          </Button>
        </div>
      ))}
    </div>
  );
}

function ChangesView({ project }: { project: Project }) {
  const changes = Array.from({ length: Math.max(project.openCOs, 1) }).map((_, i) => ({
    id: `CO-${(100 + i + Number(project.id.replace("p", ""))).toString()}`,
    title: [
      "Additional lighting circuits — mezzanine",
      "Upgrade cable size 2×95mm² → 2×120mm²",
      "Extra transformer bay on north side",
    ][i % 3],
    amount: (35 + i * 22) * 1000,
    status: (["pending", "approved", "pending"] as const)[i % 3],
  }));

  return (
    <div className="space-y-2">
      {changes.map((c) => (
        <div key={c.id} className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
          <FileText className="h-4 w-4 shrink-0 text-info" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">{c.id}</span>
              <Badge
                variant="outline"
                className={`h-4 px-1.5 text-[10px] capitalize ${
                  c.status === "approved"
                    ? "border-success/40 text-success"
                    : "border-warning/40 text-warning"
                }`}
              >
                {c.status}
              </Badge>
            </div>
            <p className="mt-0.5 truncate text-sm text-foreground">{c.title}</p>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            ₵ {c.amount.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function NewProjectDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Set up a project with client, location, budget, and initial team. WBS and milestones can be added after creation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name" className="text-xs">Project name</Label>
              <Input id="name" placeholder="e.g. Tema Refinery HV upgrade" />
            </div>
            <div>
              <Label htmlFor="client" className="text-xs">Client</Label>
              <Input id="client" placeholder="Client name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="loc" className="text-xs">Location</Label>
              <Input id="loc" placeholder="City, region" />
            </div>
            <div>
              <Label htmlFor="pm" className="text-xs">Project Manager</Label>
              <Select>
                <SelectTrigger id="pm"><SelectValue placeholder="Assign PM" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ko">K. Owusu</SelectItem>
                  <SelectItem value="ab">A. Boateng</SelectItem>
                  <SelectItem value="jm">J. Mensah</SelectItem>
                  <SelectItem value="ma">M. Adjei</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="start" className="text-xs">Start</Label>
              <Input id="start" type="date" />
            </div>
            <div>
              <Label htmlFor="end" className="text-xs">End</Label>
              <Input id="end" type="date" />
            </div>
            <div>
              <Label htmlFor="budget" className="text-xs">Budget (₵M)</Label>
              <Input id="budget" type="number" step="0.1" placeholder="2.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="scope" className="text-xs">Scope of work</Label>
            <Textarea id="scope" placeholder="Short description of scope and deliverables…" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Create project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function shift(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function aiBrief(p: Project): string {
  if (p.status === "delayed") {
    return `${p.name} is trending behind. Cost-to-progress delta is ${Math.round((p.spent / p.budget) * 100 - p.progress)}% — budget burn is outpacing physical completion. ${p.openSnags} open snags and ${p.hseIncidents} HSE incident(s) suggest crew supervision on ${p.location.split(",")[0]} should be reinforced this week.`;
  }
  if (p.status === "at-risk") {
    return `${p.name} is at risk primarily due to procurement latency. ${p.openCOs} pending change order(s) totalling material impact. Recommend expediting long-lead items and locking scope for the next 2 weeks.`;
  }
  if (p.status === "completed") {
    return `${p.name} closed under budget (${Math.round((1 - p.spent / p.budget) * 100)}% savings). All snags cleared. Ready for final documentation and retention release.`;
  }
  return `${p.name} is healthy: progress ${p.progress}% with budget at ${Math.round((p.spent / p.budget) * 100)}%. Next milestone "${p.nextMilestone}" on ${fmt(p.nextMilestoneDate)} is on track.`;
}
