import { NextResponse } from 'next/server';

// Force dynamic rendering to prevent 404 caching on Vercel App Router
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
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
  }, {
    headers: getCorsHeaders()
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ----------------------------------------------------
    // STANDARD MCP JSON-RPC PROTOCOL HANDLING
    // This fixes "no tools found" errors.
    // ----------------------------------------------------
    const { method, params, id, jsonrpc } = body;

    if (jsonrpc === "2.0" || method) {
      if (method === 'initialize') {
        return NextResponse.json({
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
        }, { headers: getCorsHeaders() });
      }

      if (method === 'tools/list') {
        return NextResponse.json({
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
        }, { headers: getCorsHeaders() });
      }

      if (method === 'tools/call') {
        const toolName = params?.name;
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: `Tool ${toolName} executed successfully with params: ${JSON.stringify(params?.arguments || {})}` }],
            isError: false
          }
        }, { headers: getCorsHeaders() });
      }

      if (method === 'prompts/list' || method === 'resources/list') {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: { [method.split('/')[0]]: [] }
        }, { headers: getCorsHeaders() });
      }

      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: "Method not found" }
      }, { status: 404, headers: getCorsHeaders() });
    }

    // ----------------------------------------------------
    // LEGACY / CUSTOM REST HANDLING
    // ----------------------------------------------------
    const cmd = (body.action || body.command || body.task || "").toLowerCase();
    let result: any = {};

    switch (cmd) {
      case "status":
      case "ping":
        result = { status: "online", agent: "Chaosoom Orchestrator", message: "Chaos is balanced and ready" };
        break;
      case "execute":
        result = { success: true, executed: body.params || body.command, executedAt: new Date().toISOString() };
        break;
      case "get_info":
        result = { name: "Chaosoom Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
        break;
      default:
        result = { success: true, message: "Chaos received and processed", data: body };
    }

    return NextResponse.json({
      status: "success",
      agent: "Chaosoom Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, { headers: getCorsHeaders() });

  } catch (error) {
    return NextResponse.json({
      status: "error", message: "Failed to process chaos command"
    }, { status: 400, headers: getCorsHeaders() });
  }
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders() });
}

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
