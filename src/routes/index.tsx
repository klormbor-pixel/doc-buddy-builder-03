import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FolderKanban,
  Truck,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { PageShell, PageHeader } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard · MEES ERP" },
      {
        name: "description",
        content:
          "Real-time company performance for MEES: revenue, cash position, active projects, fleet, HSE and AI-generated executive summary.",
      },
    ],
  }),
  component: DashboardPage,
});

const revenueSeries = [
  { m: "Jan", revenue: 1.8, cost: 1.2 },
  { m: "Feb", revenue: 2.1, cost: 1.4 },
  { m: "Mar", revenue: 2.4, cost: 1.5 },
  { m: "Apr", revenue: 2.2, cost: 1.6 },
  { m: "May", revenue: 2.8, cost: 1.7 },
  { m: "Jun", revenue: 3.1, cost: 1.9 },
  { m: "Jul", revenue: 3.4, cost: 2.0 },
  { m: "Aug", revenue: 3.2, cost: 2.1 },
  { m: "Sep", revenue: 3.6, cost: 2.2 },
];

const projectHealth = [
  { name: "Tarkwa Substation", health: 92 },
  { name: "Obuasi Mine Lighting", health: 78 },
  { name: "Takoradi Port HV", health: 65 },
  { name: "Kumasi BRT Depot", health: 88 },
  { name: "Ahafo Camp Wiring", health: 41 },
];

function KpiCard({
  label,
  value,
  delta,
  positive,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "accent" | "success" | "info";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent-foreground",
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
  } as const;
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
          </div>
          <div className={`flex h-9 w-9 items-center justify-center rounded-md ${toneMap[tone]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs">
          {positive ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span className={positive ? "text-success" : "text-destructive"}>{delta}</span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  return (
    <>
      <AppHeader title="Executive Dashboard" crumbs={[{ label: "Overview" }]} />
      <PageShell>
        <PageHeader
          title="Good afternoon, Stephen"
          description="Company performance across all operations, updated 3 minutes ago."
          actions={
            <>
              <Button variant="outline" size="sm">
                Export PDF
              </Button>
              <Button size="sm" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Ask MEES AI
              </Button>
            </>
          }
        />

        <div className="kpi-grid">
          <KpiCard
            label="Revenue MTD"
            value="₵ 3.6M"
            delta="+12.4%"
            positive
            icon={DollarSign}
            tone="primary"
          />
          <KpiCard
            label="Cash Position"
            value="₵ 8.2M"
            delta="+4.1%"
            positive
            icon={DollarSign}
            tone="success"
          />
          <KpiCard
            label="Active Projects"
            value="27"
            delta="+3"
            positive
            icon={FolderKanban}
            tone="info"
          />
          <KpiCard
            label="Fleet Utilization"
            value="84%"
            delta="-2.1%"
            positive={false}
            icon={Truck}
            tone="accent"
          />
          <KpiCard
            label="HSE Incidents (30d)"
            value="1"
            delta="-2"
            positive
            icon={ShieldAlert}
            tone="success"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">Revenue vs Cost</CardTitle>
                <p className="text-xs text-muted-foreground">Millions of GHS, trailing 9 months</p>
              </div>
              <Badge variant="secondary" className="font-mono text-[10px]">
                YTD
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="cost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="m" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#rev)" />
                    <Area type="monotone" dataKey="cost" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#cost)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/40 bg-gradient-to-br from-card to-accent/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <CardTitle className="text-sm">AI Executive Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-foreground/90">
                Revenue is trending <span className="font-semibold text-success">+12.4%</span> MoM,
                driven primarily by the Tarkwa Substation and Kumasi BRT projects nearing
                energization milestones.
              </p>
              <div className="rounded-md border border-warning/40 bg-warning/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-warning-foreground">
                      Risk detected
                    </p>
                    <p className="mt-1 text-xs text-foreground/90">
                      Ahafo Camp Wiring is 19 days behind schedule with material shortages
                      reported in 4 of last 5 daily reports.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-info/40 bg-info/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-info">
                  Recommendation
                </p>
                <p className="mt-1 text-xs text-foreground/90">
                  Expedite PO #4821 (12mm armoured cable, 4 drums) and reassign 2 electricians
                  from Takoradi to Ahafo for 5 days.
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                Open full brief <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Project Health Index</CardTitle>
              <p className="text-xs text-muted-foreground">Composite of schedule, cost, safety, and quality</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectHealth} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
                    <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={140}
                      tick={{ fontSize: 11, fill: "var(--color-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="health" radius={[0, 4, 4, 0]}>
                      {projectHealth.map((p, i) => (
                        <Cell
                          key={i}
                          fill={
                            p.health >= 80
                              ? "var(--color-success)"
                              : p.health >= 60
                                ? "var(--color-chart-1)"
                                : "var(--color-destructive)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Daily Report Roll-up</CardTitle>
              <p className="text-xs text-muted-foreground">Today's submissions across the hierarchy</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { role: "Electricians & Technicians", done: 42, total: 47, tone: "success" },
                { role: "Site Supervisors", done: 8, total: 9, tone: "success" },
                { role: "Project Managers", done: 5, total: 6, tone: "primary" },
                { role: "Operations Manager", done: 1, total: 1, tone: "primary" },
              ].map((row) => {
                const pct = Math.round((row.done / row.total) * 100);
                return (
                  <div key={row.role}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{row.role}</span>
                      <span className="font-mono text-muted-foreground">
                        {row.done}/{row.total}
                      </span>
                    </div>
                    <Progress value={pct} className="mt-1.5 h-1.5" />
                  </div>
                );
              })}
              <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs">
                <Clock className="h-3.5 w-3.5 text-warning" />
                <span className="text-foreground">5 outstanding · cutoff 18:00</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { icon: CheckCircle2, tone: "text-success", text: "GRN #2314 approved for PO Steel Cable Drums (₵ 84,200)", time: "18m ago" },
                { icon: AlertTriangle, tone: "text-warning", text: "Near-miss reported at Takoradi Port — Site Supervisor J. Mensah", time: "1h ago" },
                { icon: CheckCircle2, tone: "text-success", text: "Milestone: Tarkwa Substation Bay 3 energized", time: "2h ago" },
                { icon: Clock, tone: "text-info", text: "Leave request approved: 3 days, F. Owusu (Fleet)", time: "4h ago" },
                { icon: AlertTriangle, tone: "text-destructive", text: "Vehicle GR-4421-24 overdue for service (2,100 km past)", time: "6h ago" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <a.icon className={`mt-0.5 h-4 w-4 shrink-0 ${a.tone}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground">{a.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Approvals Queue</CardTitle>
              <p className="text-xs text-muted-foreground">Waiting on you</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: "Purchase Order", ref: "PO-4831", amount: "₵ 128,400", who: "Procurement · A. Boateng" },
                { type: "Change Order", ref: "CO-119", amount: "₵ 42,000", who: "Kumasi BRT · PM K. Owusu" },
                { type: "Leave Request", ref: "LR-882", amount: "5 days", who: "M. Adjei · Site Supervisor" },
                { type: "Expense Claim", ref: "EX-2201", amount: "₵ 3,150", who: "F. Nyarko · Electrician" },
              ].map((item) => (
                <div
                  key={item.ref}
                  className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{item.type}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{item.ref}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.who}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-foreground">{item.amount}</span>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </>
  );
}
