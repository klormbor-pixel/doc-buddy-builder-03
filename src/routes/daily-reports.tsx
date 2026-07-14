import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/daily-reports")({
  head: () => ({
    meta: [
      { title: "Daily Reports · MEES ERP" },
      {
        name: "description",
        content:
          "Digital daily reporting from site to CEO. Tasks, hours, materials, HSE, photos, GPS and AI summaries roll up the MEES hierarchy.",
      },
    ],
  }),
  component: DailyReportsPage,
});

type Status = "submitted" | "pending" | "flagged";

type Report = {
  id: string;
  employee: string;
  role: string;
  project: string;
  location: string;
  hours: number;
  progress: number;
  tasks: string;
  materials: string;
  incidents: string;
  status: Status;
  time: string;
  aiSummary: string;
};

const seedReports: Report[] = [
  {
    id: "DR-2408-091",
    employee: "Kofi Asante",
    role: "Electrician",
    project: "Tarkwa Substation",
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
  },
  {
    id: "DR-2408-090",
    employee: "Ama Nyarko",
    role: "Site Supervisor",
    project: "Ahafo Camp Wiring",
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
  },
  {
    id: "DR-2408-089",
    employee: "John Mensah",
    role: "Technician",
    project: "Takoradi Port HV",
    location: "4.8946°N, 1.7554°W",
    hours: 8,
    progress: 71,
    tasks: "Meggering of feeder cables. All readings above 500 MΩ.",
    materials: "Consumables only",
    incidents: "None",
    status: "submitted",
    time: "16:58",
    aiSummary: "All insulation resistance readings passed. Ready for commissioning tests.",
  },
  {
    id: "DR-2408-088",
    employee: "Faustina Owusu",
    role: "Artisan",
    project: "Kumasi BRT Depot",
    location: "6.6885°N, 1.6244°W",
    hours: 9,
    progress: 90,
    tasks: "Installed 24 x LED high-bay fixtures in bay 2. Tested circuits.",
    materials: "24 x 200W LED, 60m 4mm² cable",
    incidents: "None",
    status: "submitted",
    time: "17:15",
    aiSummary: "High-bay installation ahead of plan. Bay 2 lighting ready for handover.",
  },
  {
    id: "DR-2408-087",
    employee: "Michael Adjei",
    role: "Electrician",
    project: "Obuasi Mine Lighting",
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
];

const statusMeta: Record<Status, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
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
  const [reports, setReports] = useState(seedReports);
  const [tab, setTab] = useState<"all" | Status>("all");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Report | null>(seedReports[0]);

  const filtered = useMemo(
    () => (tab === "all" ? reports : reports.filter((r) => r.status === tab)),
    [reports, tab],
  );

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
      <AppHeader title="Daily Reports" crumbs={[{ label: "Overview" }, { label: "Daily Reports" }]} />
      <PageShell>
        <PageHeader
          title="Daily Reporting System"
          description="Every employee submits a digital daily report. Reports roll up: Employee → Supervisor → PM → Ops → CEO."
          actions={
            <>
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
                    toast.success("Daily report submitted", {
                      description: `Rolled up to Site Supervisor · ${r.project}`,
                    });
                  }}
                />
              </Dialog>
            </>
          }
        />

        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          {[
            { label: "Today's submissions", value: `${counts.submitted}/${counts.all}`, tone: "text-success" },
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
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {r.project} · {r.time}
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
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {selected && <ReportDetail r={selected} />}
          </div>
        </div>
      </PageShell>
    </>
  );
}

function ReportDetail({ r }: { r: Report }) {
  const meta = statusMeta[r.status];
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
              <span className="font-mono">{r.id}</span> · {r.project} · Submitted {r.time}
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
              { role: "Proj. Manager", name: "K. Owusu", done: r.status === "submitted" },
              { role: "Ops Manager", name: "K. Asare", done: false },
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
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
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

function Chip({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

function NewReportDialog({ onSubmit }: { onSubmit: (r: Report) => void }) {
  const [project, setProject] = useState("Tarkwa Substation");
  const [hours, setHours] = useState("8");
  const [progress, setProgress] = useState("70");
  const [tasks, setTasks] = useState("");
  const [materials, setMaterials] = useState("");
  const [incidents, setIncidents] = useState("None");

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Submit daily report</DialogTitle>
        <DialogDescription>
          Auto-tagged with your GPS, photos, voice note and digital signature.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label className="text-xs">Project</Label>
          <Select value={project} onValueChange={setProject}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "Tarkwa Substation",
                "Obuasi Mine Lighting",
                "Takoradi Port HV",
                "Kumasi BRT Depot",
                "Ahafo Camp Wiring",
              ].map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            onSubmit({
              id: `DR-${Math.floor(Math.random() * 900000) + 100000}`,
              employee: "Kwame Asare",
              role: "Operations Manager",
              project,
              location: "5.5502°N, 0.2174°W",
              hours: Number(hours) || 0,
              progress: Number(progress) || 0,
              tasks: tasks || "—",
              materials: materials || "—",
              incidents: incidents || "None",
              status: incidents && incidents.toLowerCase() !== "none" ? "flagged" : "submitted",
              time: now.toTimeString().slice(0, 5),
              aiSummary:
                "Report auto-summarized by MEES AI: within plan, no critical exceptions detected.",
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
