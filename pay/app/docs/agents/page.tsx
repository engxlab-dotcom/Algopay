export default function AgentsPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Agents</h1>
        <p className="text-zinc-600 leading-relaxed">
          An agent is a named spending identity linked to a gas pool. It has a
          daily USDC spend limit and can be suspended independently of other
          agents on the same pool.
        </p>
      </header>

      <section id="create" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Create</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/agents</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body flex flex-col gap-4">
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th></th></tr></thead>
              <tbody>
                <tr><td>poolId</td><td className="!font-sans !text-zinc-600">string (uuid)</td><td className="!font-sans"><span className="tag tag-required">required</span></td></tr>
                <tr><td>name</td><td className="!font-sans !text-zinc-600">string</td><td className="!font-sans"><span className="tag tag-required">required</span></td></tr>
                <tr><td>algoAddress</td><td className="!font-sans !text-zinc-600">string</td><td className="!font-sans"><span className="tag tag-required">required</span> — Algorand address</td></tr>
                <tr><td>dailyLimitCents</td><td className="!font-sans !text-zinc-600">integer</td><td className="!font-sans"><span className="tag tag-required">required</span></td></tr>
                <tr><td>vendorWhitelistHash</td><td className="!font-sans !text-zinc-600">string</td><td className="!font-sans"><span className="tag tag-required">required</span> — SHA-256 of allowed merchants</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="list" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">List</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/agents</span>
            <span className="endpoint-desc">All agents for authenticated user</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body">
            <table className="param-table">
              <thead><tr><th>Query param</th><th>Default</th></tr></thead>
              <tbody>
                <tr><td>limit</td><td className="!font-sans !text-zinc-600">20</td></tr>
                <tr><td>offset</td><td className="!font-sans !text-zinc-600">0</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/agents/pool/:poolId</span>
            <span className="endpoint-desc">Agents for a specific pool</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/agents/:agentId</span>
            <span className="endpoint-desc">Single agent with status and daily spend</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body">
            <div className="code-block text-xs">
              <code>{`{
  "id": "uuid",
  "name": "my-agent",
  "status": "active",
  "dailyLimitCents": 5000,
  "dailySpentCents": 1200,
  "lastResetAt": "2026-04-05T00:00:00Z"
}`}</code>
            </div>
          </div>
        </div>
      </section>

      <section id="update" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Update / Suspend</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-patch">PATCH</span>
            <span className="endpoint-path">/agents/:agentId</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body">
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th></th></tr></thead>
              <tbody>
                <tr><td>name</td><td className="!font-sans !text-zinc-600">string</td><td className="!font-sans"><span className="tag tag-optional">optional</span></td></tr>
                <tr><td>dailyLimitCents</td><td className="!font-sans !text-zinc-600">integer</td><td className="!font-sans"><span className="tag tag-optional">optional</span></td></tr>
                <tr><td>vendorWhitelistHash</td><td className="!font-sans !text-zinc-600">string</td><td className="!font-sans"><span className="tag tag-optional">optional</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/agents/:agentId/suspend</span>
            <span className="endpoint-desc">Set status = suspended, blocks new payments</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Agent statuses</h2>
        <table className="param-table">
          <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
          <tbody>
            {[
              ["active", "Normal operation"],
              ["limit_reached", "Daily cap hit — resets at midnight UTC"],
              ["suspended", "Manually suspended — no payments until reactivated"],
            ].map(([s, d]) => (
              <tr key={s}>
                <td>{s}</td>
                <td className="!font-sans !text-zinc-600">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
}
