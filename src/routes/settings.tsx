import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · MEES ERP" },
      { name: "description", content: "Users, roles (RBAC), MFA, SSO, workflow engine, audit logs and integrations." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Settings"
      description="Users, roles (RBAC), MFA, SSO, workflow engine, audit logs and integrations."
      features={["Users \u0026 roles","RBAC","Multi-factor auth","Single sign-on","Workflow engine","Notifications","Audit logs","Backups","API keys","Integrations"]}
    />
  ),
});
