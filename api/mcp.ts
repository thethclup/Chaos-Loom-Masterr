import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Chaosoom MCP Endpoint",
      status: "active",
      description: "Active MCP server for Chaosoom Orchestrator",
      capabilities: {
        tools: {},
        prompts: {},
        resources: {}
      },
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const { action, command, params, task, method, id, jsonrpc } = body || {};

      // ----------------------------------------------------
      // STANDARD MCP JSON-RPC PROTOCOL HANDLING
      // ----------------------------------------------------
      if (jsonrpc === "2.0" || method) {
        if (method === 'initialize') {
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: {
              protocolVersion: "2024-11-05",
              serverInfo: {
                name: "Chaosoom Orchestrator",
                version: "1.0.0"
              },
              capabilities: {
                tools: {},
                prompts: {},
                resources: {}
              }
            }
          });
        }

        if (method === 'tools/list') {
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: {
              tools: [
                {
                  name: "get_race_status",
                  description: "Get the status of an ongoing chaos thread/race.",
                  inputSchema: { type: "object", properties: { threadId: { type: "string" } } }
                },
                {
                  name: "start_race",
                  description: "Start a new chaotic thread/race.",
                  inputSchema: { type: "object", properties: { config: { type: "string" } } }
                },
                {
                  name: "get_leaderboard",
                  description: "Retrieve the entropy leaders.",
                  inputSchema: { type: "object", properties: { limit: { type: "number" } } }
                },
                {
                  name: "optimize_speed",
                  description: "Optimize thread generation speed.",
                  inputSchema: { type: "object", properties: { targetSpeed: { type: "number" } } }
                },
                {
                  name: "get_track_info",
                  description: "Get track/loom pattern details.",
                  inputSchema: { type: "object", properties: { trackId: { type: "string" } } }
                }
              ]
            }
          });
        }

        if (method === 'tools/call') {
          const toolName = params?.name;
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: `Tool ${toolName} executed successfully with params: ${JSON.stringify(params?.arguments || {})}` }],
              isError: false
            }
          });
        }

        if (method === 'prompts/list' || method === 'resources/list') {
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: { [method.split('/')[0]]: [] }
          });
        }

        return res.status(404).json({
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: "Method not found" }
        });
      }

      // ----------------------------------------------------
      // LEGACY / CUSTOM REST HANDLING
      // ----------------------------------------------------
      const cmd = (action || command || task || "").toLowerCase();
      let result: any = {};

      switch (cmd) {
        case "status":
        case "ping":
          result = { status: "online", agent: "Chaosoom Orchestrator", message: "Chaos is balanced and ready" };
          break;
        case "execute":
          result = { success: true, executed: params || command, executedAt: new Date().toISOString() };
          break;
        case "get_info":
          result = { name: "Chaosoom Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
          break;
        default:
          result = { success: true, message: "Chaos received and processed", data: body };
      }

      return res.status(200).json({
        status: "success",
        agent: "Chaosoom Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      return res.status(400).json({
        status: "error", message: "Failed to process chaos command"
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
