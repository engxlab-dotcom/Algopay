# Algopay

USDC payment infrastructure on Algorand — built for AI agents and businesses. Gas-sponsored transactions, merchant registry, agent-based spending controls, and webhook delivery on every settlement.

---

## Live

| | URL |
|---|---|
| Dashboard | https://algopay-opal.vercel.app |
| API | https://algopay-production-cc90.up.railway.app |
| Health | https://algopay-production-cc90.up.railway.app/health |
| Docs | https://algopay-opal.vercel.app/docs |

---

## On-Chain (Algorand Testnet)

| Contract | App ID | Address |
|---|---|---|
| Payment Processor | `758127303` | `VHNVP2CDHDN5LIFEGVDN5IDWSR6HJYOW7LLA36HVPK2KNQ7VKDWEPINCC4` |
| Merchant Registry | `758127299` | — |
| Deployer | — | `XWHZXYU5LAXCMEMUE6E3LAQTTPG3PIGHDVX5HYGBPIQWI4XER2AY2K3WY4` |

Network: **Algorand Testnet**
Asset: **USDC** (testnet asset ID wired in backend)

---

## Features

### Gas Sponsorship
Every payment transaction is signed and fee-covered by the deployer account via a LogicSig gas pool. Users pay zero ALGO fees — the platform absorbs them.

### Merchant Registry
Merchants are registered on-chain by their `merchantRef`. When a payment settles, USDC is routed to the merchant's Algorand address via the Payment Processor contract.

### Agent-Based Spending Controls
Each API key has a gas pool. Within a pool you create agents — each agent has a daily USDC spending limit. Limits auto-reset every 24h. Agents can be suspended instantly.

### Payment Lifecycle
Every payment moves through: `pending → processing → settled` (or `failed`). Each state transition is recorded in a JSON timeline with timestamps and on-chain details.

### Webhook Delivery
Register HTTPS webhook endpoints for `payment_settled`, `payment_failed`, and `pool_low` events. Each delivery is logged with HTTP status, retries, and payload.

### Audit Log
Every key action (API key created, pool topped up, agent suspended, payment settled) is logged with user ID, IP, and request ID.

### Wallet Connect
Dashboard supports Pera and Defly wallets (Algorand testnet + mainnet). Connected address shows live ALGO and USDC balances.

---

## SDK

```bash
npm install algopay-stack
```

```ts
import { Algopay } from 'algopay-stack'

const client = new Algopay({
  apiKey: 'ak_live_...',
  baseUrl: 'https://algopay-production-cc90.up.railway.app/api/v1',
  network: 'testnet',
})

// initiate and settle a payment
const payment = await client.payments.initiate({
  invoiceId: 'inv-001',
  agentId: '<agent-uuid>',
  poolId: '<pool-uuid>',
  merchantId: 'acme-001',
  amountUsdCents: 500,
  network: 'testnet',
})

await client.payments.process(payment.id)
```

### SDK Modules

**`client.payments`**
- `initiate(params)` — create a pending payment record
- `process(paymentId)` — submit on-chain and settle
- `get(paymentId)` — fetch by ID
- `getByInvoice(invoiceId)` — fetch by invoice ID
- `list(params?)` — list with optional status filter
- `listByAgent(agentId)` — list payments for a specific agent

**`client.agents`**
- `create(params)` — register a new agent with daily limit
- `list()` — list all agents for the API key
- `listByPool(poolId)` — list agents under a specific pool
- `getStatus(agentId)` — get agent status and spend
- `update(agentId, params)` — update name, limit, whitelist
- `suspend(agentId)` — immediately suspend an agent

**`client.gasPool`**
- `create(params)` — create a gas pool linked to an API key
- `getBalance(apiKeyId)` — get current USDC balance and status
- `topUp(apiKeyId, params)` — credit the pool with a verified txnId
- `updateSettings(apiKeyId, params)` — update daily cap and alert threshold

**`client.webhooks`**
- `register(params)` — subscribe to events with a secret
- `list()` — list all registered webhooks
- `delete(webhookId)` — remove a webhook
- `rotateSecret(webhookId)` — rotate the signing secret

---

## API

Base URL: `https://algopay-production-cc90.up.railway.app/api/v1`

All endpoints except `/auth/*` require `Authorization: Bearer <token>` or an `x-api-key` header.

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/google` | OAuth with Google |
| `POST` | `/auth/github` | OAuth with GitHub |
| `POST` | `/auth/refresh` | Refresh access token (cookie) |
| `POST` | `/auth/logout` | Revoke refresh token |
| `GET` | `/auth/me` | Get current user |
| `GET` | `/keys` | List API keys |
| `POST` | `/keys` | Create API key |
| `DELETE` | `/keys/:id` | Revoke API key |
| `GET` | `/gas-pool` | List gas pools |
| `POST` | `/gas-pool` | Create gas pool |
| `GET` | `/gas-pool/:apiKeyId/balance` | Get pool balance |
| `POST` | `/gas-pool/:apiKeyId/topup` | Top up pool |
| `PATCH` | `/gas-pool/:apiKeyId/settings` | Update pool settings |
| `GET` | `/agents` | List agents |
| `POST` | `/agents` | Create agent |
| `GET` | `/agents/:agentId` | Get agent status |
| `PATCH` | `/agents/:agentId` | Update agent |
| `POST` | `/agents/:agentId/suspend` | Suspend agent |
| `GET` | `/payments` | List payments |
| `POST` | `/payments` | Initiate payment |
| `POST` | `/payments/:id/process` | Process and settle |
| `GET` | `/payments/:id` | Get payment |
| `GET` | `/payments/invoice/:invoiceId` | Get by invoice ID |
| `GET` | `/merchants` | List merchants |
| `POST` | `/merchants` | Register merchant |
| `DELETE` | `/merchants/:id` | Remove merchant |
| `GET` | `/webhooks` | List webhooks |
| `POST` | `/webhooks` | Register webhook |
| `DELETE` | `/webhooks/:id` | Delete webhook |
| `POST` | `/webhooks/:id/rotate-secret` | Rotate secret |
| `GET` | `/audit` | Get audit log |

---

## Dashboard

Login at https://algopay-opal.vercel.app with Google or GitHub.

Once logged in:

- **API Keys** — create keys scoped to mainnet or testnet
- **Gas Pools** — create a pool per key, top up with USDC, set daily caps and alert thresholds
- **Agents** — create agents with daily spend limits and vendor whitelist hashes
- **Payments** — view all payments, filter by status, click any row for full timeline. Use "New Payment" to initiate and settle a payment directly from the dashboard
- **Merchants** — register Algorand addresses as payment recipients
- **Webhooks** — subscribe to settlement and failure events
- **Audit Log** — full action history

---

## Auth

OAuth via Google and GitHub. Tokens are `httpOnly` cookies (refresh token) + in-memory access tokens. No credentials are stored client-side.

Refresh token lifetime: 30 days. Access token lifetime: 15 minutes.
