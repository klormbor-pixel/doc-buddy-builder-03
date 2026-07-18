import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ClipboardList,
  Plus,
  MapPin,
  Camera,
  Mic,
  PenLine,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FolderKanban,
  TrendingUp,
  ArrowUpRight,
  Target,
} from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { PageShell, PageHeader } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  computeProjectRollup,
  getProject,
  projects,
  projectStatusMeta,
  seedReports,
  type DailyReport,
  type ReportStatus,
} from "@/lib/erp-data";

export const Route = createFileRoute("/daily-reports")({
  head: () => ({
    meta: [
      { title: "Daily Reports · MEES ERP" },
      {
        name: "description",
        content:
          "Digital daily reporting linked to projects. Hours, materials, HSE, photos, GPS and AI summaries roll up into project health and milestone progress.",
      },
    ],
  }),
  component: DailyReportsPage,
});

const statusMeta: Record<
  ReportStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  submitted: {
    label: "Submitted",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-border",
    icon: Clock,
  },
  flagged: {
    label: "Flagged",
    className: "bg-warning/15 text-warning-foreground border-warning/40",
    icon: AlertTriangle,
  },
};

function DailyReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>(seedReports);
  const [tab, setTab] = useState<"all" | ReportStatus>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DailyReport | null>(seedReports[0]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (tab !== "all" && r.status !== tab) return false;
      if (projectFilter !== "all" && r.projectId !== projectFilter) return false;
      return true;
    });
  }, [reports, tab, projectFilter]);

  const counts = useMemo(
    () => ({
      all: reports.length,
      submitted: reports.filter((r) => r.status === "submitted").length,
      flagged: reports.filter((r) => r.status === "flagged").length,
      pending: reports.filter((r) => r.status === "pending").length,
    }),
    [reports],
  );

  return (
    <>
      <AppHeader
        title="Daily Reports"
        crumbs={[{ label: "Overview" }, { label: "Daily Reports" }]}
      />
      <PageShell>
        <PageHeader
          title="Daily Reporting System"
          description="Every report is linked to a project. Hours, HSE flags and milestone progress roll up automatically to project health."
          actions={
            <>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="h-8 w-[200px] text-xs">
                  <FolderKanban className="mr-1.5 h-3.5 w-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.code} · {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    New daily report
                  </Button>
                </DialogTrigger>
                <NewReportDialog
                  onSubmit={(r) => {
                    setReports((prev) => [r, ...prev]);
                    setSelected(r);
                    setOpen(false);
                    const p = getProject(r.projectId);
                    toast.success("Daily report submitted", {
                      description: `Rolled up to ${p?.code ?? "project"} · ${p?.name ?? ""}`,
                    });
                  }}
                />
              </Dialog>
            </>
          }
        />

        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          {[
            {
              label: "Today's submissions",
              value: `${counts.submitted}/${counts.all}`,
              tone: "text-success",
            },
            { label: "Flagged for review", value: counts.flagged, tone: "text-warning" },
            { label: "Outstanding", value: counts.pending, tone: "text-muted-foreground" },
            { label: "Compliance rate", value: "89%", tone: "text-primary" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className={`mt-1.5 font-mono text-xl font-semibold ${s.tone}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardList className="h-4 w-4" />
                  Submissions
                </CardTitle>
              </div>
              <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-2">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="submitted">Done</TabsTrigger>
                  <TabsTrigger value="flagged">Flagged</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {filtered.map((r) => {
                  const meta = statusMeta[r.status];
                  const Icon = meta.icon;
                  const active = selected?.id === r.id;
                  const project = getProject(r.projectId);
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(r)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60 ${
                          active ? "bg-secondary" : ""
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {r.employee
                            .split(" ")
                            .map((s) => s[0])
                            .join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground">
                              {r.employee}
                            </p>
                            <span className="text-[11px] text-muted-foreground">· {r.role}</span>
                          </div>
                          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                            <span className="font-mono text-[10px]">{project?.code}</span>
                            <span className="truncate">{project?.name}</span>
                            <span>· {r.time}</span>
                          </p>
                        </div>
                        <Badge variant="outline" className={`gap-1 border ${meta.className}`}>
                          <Icon className="h-3 w-3" />
                          <span className="text-[10px]">{meta.label}</span>
                        </Badge>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="p-6 text-center text-sm text-muted-foreground">
                    No reports match your filters.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-4">{selected && <ReportDetail r={selected} reports={reports} />}</div>
        </div>
      </PageShell>
    </>
  );
}

function ReportDetail({ r, reports }: { r: DailyReport; reports: DailyReport[] }) {
  const meta = statusMeta[r.status];
  const project = getProject(r.projectId);
  const rollup = project ? computeProjectRollup(project, reports) : null;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{r.employee}</CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {r.role}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-mono">{r.id}</span> · Submitted {r.time}
            </p>
          </div>
          <Badge variant="outline" className={meta.className}>
            {meta.label}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Metric label="Hours worked" value={`${r.hours}h`} />
          <Metric label="Task progress" value={`${r.progress}%`} progress={r.progress} />
          <Metric label="GPS" value={r.location} mono />
        </CardContent>
      </Card>

      {project && (
        <Card className="border-primary/30 bg-primary/[0.03]">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {project.code}
                  </span>
                  <Badge
                    variant="outline"
                    className={`h-4 px-1.5 text-[10px] ${projectStatusMeta[project.status].className}`}
                  >
                    {projectStatusMeta[project.status].label}
                  </Badge>
                </div>
                <CardTitle className="mt-1 text-sm">{project.name}</CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  {project.client} · PM {project.pm}
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                <Link to="/projects">
                  Open project
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {r.milestone && (
              <div className="rounded-md border border-border bg-background p-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <Target className="h-3.5 w-3.5 text-accent-foreground" />
                    Milestone contribution
                  </span>
                  <span className="font-mono text-success">
                    +{r.milestoneDelta ?? 0}%
                  </span>
                </div>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">
                  → {r.milestone}
                </p>
              </div>
            )}
            {rollup && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <RollupStat
                  label="Health"
                  value={`${rollup.healthAdjusted}`}
                  delta={rollup.healthDelta}
                />
                <RollupStat label="Hours logged" value={`${rollup.hoursLogged}h`} />
                <RollupStat
                  label="Flags today"
                  value={String(rollup.flagged + rollup.hseFlags)}
                  tone={rollup.flagged + rollup.hseFlags > 0 ? "warn" : "ok"}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-accent/40 bg-gradient-to-br from-card to-accent/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <CardTitle className="text-sm">AI Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/90">{r.aiSummary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Report Contents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Field label="Tasks completed">{r.tasks}</Field>
          <Field label="Materials used">{r.materials}</Field>
          <Field label="Safety / incidents">{r.incidents}</Field>

          <div className="flex flex-wrap gap-2 pt-2">
            <Chip icon={Camera}>3 photos</Chip>
            <Chip icon={Mic}>1 voice note (0:34)</Chip>
            <Chip icon={PenLine}>Signed</Chip>
            <Chip icon={MapPin}>GPS verified</Chip>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Roll-up chain</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-2 sm:grid-cols-5">
            {[
              { role: "Employee", name: r.employee, done: true },
              { role: "Supervisor", name: "A. Nyarko", done: true },
              {
                role: "Proj. Manager",
                name: project?.pm ?? "—",
                done: r.status === "submitted",
              },
              { role: "Ops Manager", name: "S. Klormbor", done: false },
              { role: "CEO", name: "Dr. Maudal", done: false },
            ].map((step, i) => (
              <li
                key={i}
                className={`rounded-md border p-2.5 ${
                  step.done ? "border-success/40 bg-success/10" : "border-border bg-secondary/40"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {step.role}
                </p>
                <p className="mt-0.5 truncate text-xs font-medium text-foreground">{step.name}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}

function RollupStat({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta?: number;
  tone?: "ok" | "warn";
}) {
  const deltaColor =
    delta === undefined
      ? ""
      : delta > 0
        ? "text-success"
        : delta < 0
          ? "text-destructive"
          : "text-muted-foreground";
  return (
    <div className="rounded-md border border-border bg-background p-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-0.5 font-mono text-sm font-semibold ${
          tone === "warn" ? "text-warning" : "text-foreground"
        }`}
      >
        {value}
      </p>
      {delta !== undefined && (
        <p className={`mt-0.5 inline-flex items-center gap-0.5 text-[10px] ${deltaColor}`}>
          <TrendingUp className="h-2.5 w-2.5" />
          {delta > 0 ? "+" : ""}
          {delta}
        </p>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  progress,
  mono,
}: {
  label: string;
  value: string;
  progress?: number;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-sm font-semibold text-foreground ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
      {progress !== undefined && <Progress value={progress} className="mt-1.5 h-1.5" />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-foreground/90">{children}</p>
    </div>
  );
}

function Chip({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

function NewReportDialog({ onSubmit }: { onSubmit: (r: DailyReport) => void }) {
  const [projectId, setProjectId] = useState(projects[0].id);
  const [hours, setHours] = useState("8");
  const [progress, setProgress] = useState("70");
  const [tasks, setTasks] = useState("");
  const [materials, setMaterials] = useState("");
  const [incidents, setIncidents] = useState("None");
  const [milestoneDelta, setMilestoneDelta] = useState("5");

  const project = getProject(projectId);

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Submit daily report</DialogTitle>
        <DialogDescription>
          Linked to a project. Auto-tagged with GPS, photos, voice note and digital signature.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label className="text-xs">Project</Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.code} · {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {project && (
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Next milestone: <span className="font-medium text-foreground">{project.nextMilestone}</span>
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs">Hours worked</Label>
          <Input
            className="mt-1.5"
            type="number"
            min={0}
            max={24}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs">Progress %</Label>
          <Input
            className="mt-1.5"
            type="number"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <Label className="text-xs">Milestone contribution (%)</Label>
          <Input
            className="mt-1.5"
            type="number"
            min={0}
            max={100}
            value={milestoneDelta}
            onChange={(e) => setMilestoneDelta(e.target.value)}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Rolls up to <span className="font-medium">{project?.nextMilestone}</span>.
          </p>
        </div>

        <div className="sm:col-span-2">
          <Label className="text-xs">Tasks completed</Label>
          <Textarea
            className="mt-1.5"
            placeholder="Describe what was completed today…"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            rows={3}
          />
        </div>

        <div className="sm:col-span-2">
          <Label className="text-xs">Materials used</Label>
          <Textarea
            className="mt-1.5"
            placeholder="Quantities, item codes…"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            rows={2}
          />
        </div>

        <div className="sm:col-span-2">
          <Label className="text-xs">Safety incidents / near-miss</Label>
          <Input
            className="mt-1.5"
            value={incidents}
            onChange={(e) => setIncidents(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 flex flex-wrap gap-2">
          <Chip icon={MapPin}>GPS captured</Chip>
          <Chip icon={Camera}>Attach photos</Chip>
          <Chip icon={Mic}>Voice note</Chip>
          <Chip icon={PenLine}>Digital signature</Chip>
        </div>
      </div>

      <DialogFooter>
        <Button
          className="gap-1.5"
          onClick={() => {
            const now = new Date();
            const flagged = incidents && incidents.toLowerCase() !== "none";
            onSubmit({
              id: `DR-${Math.floor(Math.random() * 900000) + 100000}`,
              employee: "Stephen Klormbor",
              role: "Operations Manager",
              projectId,
              location: "5.5502°N, 0.2174°W",
              hours: Number(hours) || 0,
              progress: Number(progress) || 0,
              tasks: tasks || "—",
              materials: materials || "—",
              incidents: incidents || "None",
              status: flagged ? "flagged" : "submitted",
              time: now.toTimeString().slice(0, 5),
              aiSummary:
                "Report auto-summarized by MEES AI: within plan, no critical exceptions detected.",
              milestone: project?.nextMilestone,
              milestoneDelta: Number(milestoneDelta) || 0,
            });
          }}
        >
          <PenLine className="h-3.5 w-3.5" />
          Sign & submit
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
