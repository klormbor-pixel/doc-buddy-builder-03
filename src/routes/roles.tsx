import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  Users,
  KeyRound,
  Lock,
  ArrowRight,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { PageShell, PageHeader } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  roles,
  modules,
  matrix,
  accessMeta,
  reportApprovalChain,
  approvalTiers,
  type Role,
  type RoleCategory,
} from "@/lib/erp-roles";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "Roles & Access · MEES ERP" },
      {
        name: "description",
        content:
          "Role-based access design for MEES ERP — 15 roles across executive, management, engineering, field and support, with a full module permission matrix.",
      },
    ],
  }),
  component: RolesPage,
});

const categoryMeta: Record<RoleCategory, { label: string; className: string }> = {
  Executive: { label: "Executive", className: "bg-primary/15 text-primary border-primary/30" },
  Management: { label: "Management", className: "bg-info/15 text-info border-info/30" },
  Engineering: { label: "Engineering", className: "bg-accent/15 text-accent border-accent/30" },
  Field: { label: "Field", className: "bg-warning/15 text-warning border-warning/40" },
  Support: { label: "Support", className: "bg-secondary text-secondary-foreground border-border" },
  System: { label: "System", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

function RolesPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(roles[0].id);

  const filtered = roles.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.category.toLowerCase().includes(query.toLowerCase()),
  );
  const selected = roles.find((r) => r.id === selectedId) ?? roles[0];
  const totalPeople = roles.reduce((s, r) => s + r.headcount, 0);
  const mfaRequired = roles.filter((r) => r.mfa === "required").length;

  return (
    <>
      <AppHeader title="Roles & Access" crumbs={[{ label: "Settings" }, { label: "Roles & Access" }]} />
      <PageShell>
        <PageHeader
          title="Roles & Access Control"
          description="RBAC design covering all 15 MEES roles, module-level permissions, MFA policy and approval escalation."
          actions={
            <>
              <Button variant="outline" size="sm">
                <KeyRound className="mr-2 h-4 w-4" /> Export policy
              </Button>
              <Button size="sm">
                <Users className="mr-2 h-4 w-4" /> Invite user
              </Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard icon={<Users className="h-4 w-4" />} label="Defined roles" value={String(roles.length)} sub="across 6 categories" />
          <KpiCard icon={<ShieldCheck className="h-4 w-4" />} label="Modelled headcount" value={String(totalPeople)} sub="employees + casuals" />
          <KpiCard icon={<Lock className="h-4 w-4" />} label="MFA required" value={`${mfaRequired}/${roles.length}`} sub="high-trust roles" />
          <KpiCard icon={<KeyRound className="h-4 w-4" />} label="Approval tiers" value={String(approvalTiers.length)} sub="financial escalation" />
        </div>

        <Tabs defaultValue="roles" className="mt-6">
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="matrix">Permission matrix</TabsTrigger>
            <TabsTrigger value="approvals">Approval chains</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
              <Card>
                <CardHeader className="pb-3">
                  <Input
                    placeholder="Search roles…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-9"
                  />
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="flex flex-col">
                      {filtered.map((r) => {
                        const active = r.id === selectedId;
                        return (
                          <button
                            key={r.id}
                            onClick={() => setSelectedId(r.id)}
                            className={cn(
                              "flex items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent/5",
                              active && "bg-accent/10 border-l-2 border-l-primary",
                            )}
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
                              {initials(r.title)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="truncate text-sm font-medium text-foreground">{r.title}</span>
                                <span className="text-xs text-muted-foreground">×{r.headcount}</span>
                              </div>
                              <div className="mt-1 flex items-center gap-1.5">
                                <Badge variant="outline" className={cn("text-[10px]", categoryMeta[r.category].className)}>
                                  {categoryMeta[r.category].label}
                                </Badge>
                                {r.mfa === "required" && (
                                  <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/30">
                                    MFA
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <RoleDetail role={selected} />
            </div>
          </TabsContent>

          <TabsContent value="matrix" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Module × role permission matrix</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Legend:
                  {(["full", "write", "read", "field", "none"] as const).map((lvl) => (
                    <Badge key={lvl} variant="outline" className={cn("ml-2 text-[10px]", accessMeta[lvl].className)}>
                      {accessMeta[lvl].label}
                    </Badge>
                  ))}
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="sticky left-0 z-10 bg-muted/40 px-3 py-2 text-left font-semibold text-foreground">
                          Module
                        </th>
                        {roles.map((r) => (
                          <th
                            key={r.id}
                            className="px-2 py-2 text-left font-medium text-muted-foreground whitespace-nowrap"
                            title={r.title}
                          >
                            <div className="max-w-[90px] truncate">{r.title}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((m) => (
                        <tr key={m} className="border-b border-border hover:bg-accent/5">
                          <td className="sticky left-0 z-10 bg-background px-3 py-2 font-medium text-foreground whitespace-nowrap">
                            {m}
                          </td>
                          {roles.map((r) => {
                            const lvl = matrix[r.id][m];
                            return (
                              <td key={r.id} className="px-2 py-1.5">
                                <span
                                  className={cn(
                                    "inline-flex h-6 min-w-[46px] items-center justify-center rounded border px-2 text-[10px] font-medium",
                                    accessMeta[lvl].className,
                                  )}
                                >
                                  {accessMeta[lvl].label}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Daily report escalation chain</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Field capture rolls up automatically from crew → site → project → operations → executive.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reportApprovalChain.map((step, i) => (
                    <div key={step.role} className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{step.role}</div>
                        <div className="text-xs text-muted-foreground">{step.action}</div>
                      </div>
                      {i < reportApprovalChain.length - 1 && (
                        <ArrowRight className="mt-2 h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Financial approval tiers</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Purchase orders and payments escalate by amount. Each tier requires the tier below to have approved.
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {approvalTiers.map((t) => (
                    <div
                      key={t.tier}
                      className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px]">
                          {t.tier}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">{t.range}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{t.approver}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PageShell>
    </>
  );
}

function RoleDetail({ role }: { role: Role }) {
  const perms = matrix[role.id];
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{role.title}</CardTitle>
              <Badge variant="outline" className={cn("text-[10px]", categoryMeta[role.category].className)}>
                {categoryMeta[role.category].label}
              </Badge>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{role.summary}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-foreground">{role.headcount}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Headcount</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <MetaBlock label="Data scope" value={role.scope} />
          <MetaBlock label="Approval limit" value={role.approvalLimit ?? "—"} />
          <MetaBlock
            label="MFA policy"
            value={role.mfa === "required" ? "Required" : role.mfa === "recommended" ? "Recommended" : "Optional"}
            tone={role.mfa === "required" ? "destructive" : role.mfa === "recommended" ? "warning" : "muted"}
          />
        </div>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Key duties in ERP
          </h4>
          <ul className="space-y-1.5">
            {role.keyDuties.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Module access
          </h4>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {modules.map((m) => {
              const lvl = perms[m];
              return (
                <div
                  key={m}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    {lvl === "none" ? (
                      <Circle className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    )}
                    <span className="text-sm text-foreground">{m}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px]", accessMeta[lvl].className)}>
                    {accessMeta[lvl].label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KpiCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        </div>
        <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}

function MetaBlock({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "muted" | "destructive" | "warning";
}) {
  const toneCls =
    tone === "destructive"
      ? "text-destructive"
      : tone === "warning"
        ? "text-warning"
        : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-sm font-medium", toneCls)}>{value}</div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
