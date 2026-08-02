import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getProject, seedReports } from "@/modules/dashboard/data";

export default defineTool({
  name: "list_daily_reports",
  title: "List daily reports",
  description:
    "List MEES ERP demo daily field reports with employee, role, hours, tasks, incidents, AI summary and the project each is linked to.",
  inputSchema: {
    projectId: z.string().optional().describe("Filter by project id (e.g. p1)."),
    status: z
      .enum(["submitted", "pending", "flagged"])
      .optional()
      .describe("Filter by report status."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ projectId, status }) => {
    const rows = seedReports
      .filter((r) => (!projectId || r.projectId === projectId) && (!status || r.status === status))
      .map((r) => ({ ...r, projectName: getProject(r.projectId)?.name ?? null }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, reports: rows },
    };
  },
});
