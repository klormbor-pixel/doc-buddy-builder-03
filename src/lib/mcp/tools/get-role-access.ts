import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { approvalTiers, matrix, reportApprovalChain, roles } from "@/modules/auth/roles";

export default defineTool({
  name: "get_role_access",
  title: "Get role access",
  description:
    "Look up the MEES ERP role model: role definitions, headcount, MFA policy and the module-by-module permission matrix. Omit `role` to get every role plus the approval tiers and daily-report escalation chain.",
  inputSchema: {
    role: z.string().optional().describe("Role id or title, e.g. 'ceo' or 'Site Supervisor'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ role }) => {
    if (!role) {
      const payload = { roles, matrix, approvalTiers, reportApprovalChain };
      return {
        content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload,
      };
    }
    const key = role.trim().toLowerCase();
    const found = roles.find((r) => r.id.toLowerCase() === key || r.title.toLowerCase() === key);
    if (!found) throw new ToolError(`No role matching "${role}".`);
    const payload = { role: found, access: matrix[found.id] ?? null };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
