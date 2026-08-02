import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  computeProjectRollup,
  getProject,
  projects,
  reportsForProject,
  seedReports,
} from "@/modules/dashboard/data";

export default defineTool({
  name: "get_project_rollup",
  title: "Get project roll-up",
  description:
    "Get one project plus its automatic field roll-up from linked daily reports (hours, crew, HSE flags, milestone progress, adjusted health).",
  inputSchema: {
    project: z.string().describe("Project id (e.g. p1) or project code."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ project }) => {
    const key = project.trim().toLowerCase();
    const found =
      getProject(key) ?? projects.find((p) => p.code.toLowerCase() === key);
    if (!found) throw new ToolError(`No project matching "${project}".`);

    const rollup = computeProjectRollup(found, seedReports);
    const reports = reportsForProject(found.id, seedReports);
    const payload = { project: found, rollup, linkedReports: reports };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
