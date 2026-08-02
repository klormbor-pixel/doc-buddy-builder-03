import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProjects from "./tools/list-projects";
import getProjectRollup from "./tools/get-project-rollup";
import listDailyReports from "./tools/list-daily-reports";
import getRoleAccess from "./tools/get-role-access";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "mees-erp",
  title: "MEES ERP",
  version: "0.1.0",
  instructions:
    "Read-only tools over the MEES ERP demo dataset for Maudal Electrical Engineering Services. Use `list_projects` and `get_project_rollup` for portfolio and field roll-up data, `list_daily_reports` for site reports, and `get_role_access` for the role/permission model.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProjects, getProjectRollup, listDailyReports, getRoleAccess],
});

