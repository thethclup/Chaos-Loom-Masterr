import { NextResponse } from 'next/server';

interface MCPRequest {
  action?: string;
  command?: string;
  params?: any;
  task?: string;
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Chaosoom MCP Endpoint",
    status: "active",
    description: "Active MCP server for Chaosoom Orchestrator",
    capabilities: ["chaos-management", "entropy-control", "controlled-chaos-automation"],
    tools: [
      {
        name: "get_race_status",
        description: "[PLACEHOLDER TOOL 1] Get the status of an ongoing chaos thread/race.",
        inputSchema: { type: "object", properties: { threadId: { type: "string" } } }
      },
      {
        name: "start_race",
        description: "[PLACEHOLDER TOOL 2] Start a new chaotic thread/race.",
        inputSchema: { type: "object", properties: { config: { type: "string" } } }
      },
      {
        name: "get_leaderboard",
        description: "[PLACEHOLDER TOOL 3] Retrieve the entropy leaders.",
        inputSchema: { type: "object", properties: { limit: { type: "number" } } }
      },
      {
        name: "optimize_speed",
        description: "[PLACEHOLDER TOOL 4] Optimize thread generation speed.",
        inputSchema: { type: "object", properties: { targetSpeed: { type: "number" } } }
      },
      {
        name: "get_track_info",
        description: "[PLACEHOLDER TOOL 5] Get track/loom pattern details.",
        inputSchema: { type: "object", properties: { trackId: { type: "string" } } }
      }
    ],
    prompts: [],
    resources: [],
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

export async function POST(req: Request) {
  try {
    const body: MCPRequest = await req.json();
    const { action, command, params, task } = body;

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

    return NextResponse.json({
      status: "success",
      agent: "Chaosoom Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process chaos command"
    }, { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
