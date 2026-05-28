import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // Add CORS headers for MCP
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    next();
  });

  // API Route: /api/mcp
  app.get("/api/mcp", (req, res) => {
    res.json({
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
      ],
      prompts: [],
      resources: [],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const { action, command, params, task, method, id, jsonrpc } = body;

      // ----------------------------------------------------
      // STANDARD MCP JSON-RPC PROTOCOL HANDLING
      // ----------------------------------------------------
      if (jsonrpc === "2.0" || method) {
        if (method === 'initialize') {
          return res.json({
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
          return res.json({
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
          return res.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: `Tool ${toolName} executed successfully with params: ${JSON.stringify(params?.arguments || {})}` }],
              isError: false
            }
          });
        }

        if (method === 'prompts/list' || method === 'resources/list') {
          return res.json({
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
          result = { 
            status: "online", 
            agent: "Chaosoom Orchestrator",
            message: "Chaos is balanced and ready" 
          };
          break;

        case "execute":
          result = {
            success: true,
            executed: params || command,
            executedAt: new Date().toISOString(),
            message: "Chaos command successfully unleashed"
          };
          break;

        case "get_info":
          result = {
            name: "Chaosoom Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Chaos received and processed",
            data: body
          };
      }

      res.json({
        status: "success",
        agent: "Chaosoom Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process chaos command"
      });
    }
  });

  // API Route: /api/agent
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Chaosoom Orchestrator",
      description: "Master of controlled chaos and entropy",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Chaosoom",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
