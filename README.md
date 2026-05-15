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

- React + Vite 
- Tailwind CSS
- Canvas API
- Framer Motion
- Wagmi, Viem, Siwe (Base Network Integration)
- Full-stack Express backend 

## Chaosoom Orchestrator / ERC-8004 Agent

This project also includes the **Chaosoom Orchestrator** integration:
- `public/.well-known/agent-card.json`: ERC-8004 AI Agent Registry.
- API Endpoints (`/api/mcp`, `/api/agent`): MCP server endpoints for chaos coordination.

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Create a `.env` file based on `.env.example`.
   *(Never commit sensitive keys to your version control!)*

3. Start the local server:
   ```bash
   npm run dev
   ```

4. Production Build:
   ```bash
   npm run build
   npm start
   ```

### Wallet Integrations

The game uses standard EVM wallet interactions (built using Wagmi) connected to **Base**. 
Make sure you have an EVM-compatible wallet extension (like MetaMask, Coinbase Wallet, or Rabby) installed if you wish to record scores on-chain or use the 'Say GM' functionality.

---
*Created as part of the Chaos Loom Master universe.*
