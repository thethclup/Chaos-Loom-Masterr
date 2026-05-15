// src/api/mcp.ts
import { NextRequest, NextResponse } from 'next/server';

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
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
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
    });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process chaos command"
    }, { status: 400 });
  }
}
