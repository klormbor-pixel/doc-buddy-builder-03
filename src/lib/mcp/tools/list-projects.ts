import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { projects } from "@/modules/dashboard/data";

export default defineTool({
  name: "list_projects",
  title: "List projects",
  description:
    "List MEES ERP demo projects with code, client, phase, status, progress, budget and next milestone.",
  inputSchema: {
    status: z
      .enum(["on-track", "at-risk", "delayed", "completed"])
      .optional()
      .describe("Optional status filter."),
    search: z.string().optional().describe("Optional text match on name, code or client."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status, search }) => {
    const q = search?.trim().toLowerCase();
    const rows = projects.filter(
      (p) =>
        (!status || p.status === status) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q)),
    );
    return {
      content: [{ type: "text" as const, text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, projects: rows },
    };
  },
});
