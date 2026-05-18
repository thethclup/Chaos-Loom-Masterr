# Chaos Loom Master

**Chaos Loom Master** is a wild, visually spectacular, and deeply satisfying chaotic weaving web game built with a mobile-first approach. 

> You are the **Chaos Loom Master**, controlling a volatile cosmic loom that weaves threads of pure chaos. Your goal is to create the most beautiful, complex, and unstable patterns possible, triggering massive chain reactions before the loom inevitably collapses.

## Features

- **Chaos Physics**: Drag and fling chaotic threads across a dynamic, ever-shifting loom. Threads bounce, split, twist, merge, and mutate.
- **Entropy Combos**: Long, complex patterns create exponential score multipliers and visual madness.
- **Loom Instability**: The more chaos you create, the more unstable the loom becomes—risk versus reward.
- **On-chain Integrations (Base Mainnet)**: 
  - Record the Greatest Chaos Loom on-chain (SIWE signature integration).
  - Interact with ERC-8004 Trustless Agents for auto-weaving.
  - Send ERC-8021 attributed transactions.

## Technologies

- Next.js 14 (App Router) & React
- Tailwind CSS
- Canvas API
- Framer Motion
- Wagmi, Viem, Siwe (Base Network Integration)

## Chaosoom Orchestrator / ERC-8004 Agent

This project includes the **Chaosoom Orchestrator** integration, an AI agent specialized in chaos management, entropy control, and pattern emergence.

- **AI Agent Registry**: Handled via `.well-known/agent-card.json`.
- **API Endpoints**:
  - `/api/mcp` - Model Context Protocol (MCP) server endpoints for chaos coordination and executing remote commands.
  - `/api/agent` - Agent info endpoint detailing ERC-8004 capabilities and state.

## MCP Connection Guide

The **Chaosoom Orchestrator** uses the **Model Context Protocol (MCP)** to communicate with standard MCP clients and AI systems.

To connect an AI client to this Orchestrator:
1. Provide the main MCP endpoint url: `https://[YOUR_DEPLOYED_URL]/api/mcp`
2. The MCP interface will return available configuration details and standard AI tools (e.g. `get_race_status`, `start_race`, `optimize_speed`).
3. Send POST requests to execute chaotic commands securely.

*Note: All endpoints are secured and configured with necessary CORS policies.*

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Create a `.env` file based on `.env.example`.
   *(Never commit sensitive keys or wallet info to version control!)*

3. Start the local server:
   ```bash
   npm run dev
   ```

4. Build for Production:
   ```bash
   npm run build
   npm start
   ```

### Wallet Integrations

The game uses standard EVM wallet interactions (built using Wagmi) connected to **Base** (Chain ID: 8453). Make sure you have an EVM-compatible wallet extension installed to record scores on-chain.

---
*Created as part of the Chaos Loom Master universe.*
