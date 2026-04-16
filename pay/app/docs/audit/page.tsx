export default function AuditPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Audit Logs</h1>
        <p className="text-zinc-600 leading-relaxed">
          Every significant action (payment initiation, settlement, agent
          suspension) is written to an immutable audit log scoped to the
          authenticated user.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">List logs</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/audit</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body flex flex-col gap-4">
            <table className="param-table">
              <thead><tr><th>Query param</th><th>Default</th></tr></thead>
              <tbody>
                <tr><td>limit</td><td className="!font-sans !text-zinc-600">50</td></tr>
                <tr><td>offset</td><td className="!font-sans !text-zinc-600">0</td></tr>
              </tbody>
            </table>
            <div className="code-block text-xs">
              <code>{`[
  {
    "id": "uuid",
    "action": "payment_settled",
    "metadata": {
      "paymentId": "uuid",
      "invoiceId": "inv-001",
      "amountUsdCents": 100
    },
    "createdAt": "2026-04-05T03:54:38Z"
  }
]`}</code>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Logged actions</h2>
        <table className="param-table">
          <thead><tr><th>Action</th><th>Trigger</th></tr></thead>
          <tbody>
            {[
              ["payment_settled", "On-chain confirmation received"],
              ["payment_failed", "Submission error"],
              ["agent_suspended", "POST /agents/:id/suspend"],
              ["pool_topped_up", "POST /gas-pool/:id/topup"],
              ["webhook_registered", "POST /webhooks"],
              ["api_key_revoked", "DELETE /keys/revoke"],
            ].map(([a, t]) => (
              <tr key={a}>
                <td>{a}</td>
                <td className="!font-sans !text-zinc-600">{t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
}
