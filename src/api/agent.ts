// src/api/agent.ts
import { NextResponse } from 'next/server';

/**
 * Chaosoom Orchestrator - Agent Info Endpoint
 * 
 * Bu endpoint, agent'in temel kimlik ve durum bilgilerini sağlar.
 * ERC-8004 uyumlu keşif, A2A ve platform entegrasyonları için kullanılır.
 */

export async function GET() {
  return NextResponse.json({
    name: "Chaosoom Orchestrator",
    description: "Master of controlled chaos and entropy",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Chaosoom",
    version: "1.0.0",
    type: "ERC-8004 Agent",
    lastUpdated: new Date().toISOString()
  });
}
