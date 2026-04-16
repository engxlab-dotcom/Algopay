export default function DocsPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Algopay API
        </h1>
        <p className="text-zinc-600 leading-relaxed">
          Algopay is an agent-native payment infrastructure on Algorand. AI
          agents initiate USDC payments on-chain with gas sponsored by a
          pre-funded LogicSig account — the paying agent never needs ALGO.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Base URL</h2>
        <div className="code-block">
          <code>https://api.algopay.xyz/api</code>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Authentication</h2>
        <p className="text-sm text-zinc-600">
          All routes except <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">/auth/*</code> require a JWT Bearer token obtained from the OAuth flow.
        </p>
        <div className="code-block">
          <code>{`Authorization: Bearer <jwt_token>`}</code>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Routes</h2>
        <table className="param-table">
          <thead>
            <tr>
              <th>Prefix</th>
              <th>Resource</th>
              <th>Auth</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["/auth", "OAuth login, token refresh, user identity", "No"],
              ["/keys", "API key registration and validation", "JWT"],
              ["/gas-pool", "USDC gas pool management", "JWT"],
              ["/agents", "Agent creation and spend limits", "JWT"],
              ["/payments", "Payment initiation and settlement", "JWT"],
              ["/webhooks", "Webhook registration and delivery", "JWT"],
              ["/audit", "Audit log retrieval", "JWT"],
            ].map(([prefix, desc, auth]) => (
              <tr key={prefix}>
                <td>{prefix}</td>
                <td className="!font-sans !text-zinc-600">{desc}</td>
                <td className="!font-sans">
                  {auth === "JWT" ? (
                    <span className="auth-badge">JWT</span>
                  ) : (
                    <span className="text-xs text-zinc-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Payment flow</h2>
        <div className="code-block text-xs">
          <code>{`1. POST /keys/register          → get apiKeyId
2. POST /gas-pool               → create pool (link apiKeyId, fund USDC)
3. POST /agents                 → create agent (link poolId, set daily limit)
4. POST /payments               → initiate (status = pending)
5. POST /payments/:id/process   → submit on-chain atomic group
                                  txn[0] lsig  fee=5000 (gas sponsor)
                                  txn[1] xfer  USDC → PaymentProcessor
                                  txn[2] appl  processPayment()
                                → status = settled, webhook fired`}</code>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Errors</h2>
        <table className="param-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["400", "Validation error or business rule violation"],
              ["401", "Missing or invalid JWT"],
              ["404", "Resource not found"],
              ["500", "Unexpected server error"],
            ].map(([code, desc]) => (
              <tr key={code}>
                <td>{code}</td>
                <td className="!font-sans !text-zinc-600">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="code-block text-xs">
          <code>{`{ "error": "Agent daily limit exceeded" }`}</code>
        </div>
      </section>
    </article>
  );
}
