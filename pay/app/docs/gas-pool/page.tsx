export default function GasPoolPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Gas Pools</h1>
        <p className="text-zinc-600 leading-relaxed">
          A gas pool holds USDC that agents spend on payments. The pool is
          linked to an API key and tracks balance, daily cap, and status
          ({" "}<code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">healthy</code>,{" "}
          <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">low</code>,{" "}
          <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">critical</code>,{" "}
          <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">empty</code>).
        </p>
      </header>

      <section id="create" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Create</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/gas-pool</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body flex flex-col gap-4">
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th></th></tr></thead>
              <tbody>
                <tr><td>apiKeyId</td><td className="!font-sans !text-zinc-600">string (uuid)</td><td className="!font-sans"><span className="tag tag-required">required</span></td></tr>
                <tr><td>dailyCapCents</td><td className="!font-sans !text-zinc-600">integer</td><td className="!font-sans"><span className="tag tag-required">required</span> — 0 = no cap</td></tr>
                <tr><td>alertThresholdUsdc</td><td className="!font-sans !text-zinc-600">string (integer)</td><td className="!font-sans"><span className="tag tag-required">required</span> — microUSDC string</td></tr>
              </tbody>
            </table>
            <div className="code-block text-xs">
              <code>{`POST /gas-pool
{
  "apiKeyId": "uuid",
  "dailyCapCents": 10000,
  "alertThresholdUsdc": "5000000"
}`}</code>
            </div>
          </div>
        </div>
      </section>

      <section id="balance" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Balance</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/gas-pool/:apiKeyId/balance</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body">
            <div className="code-block text-xs">
              <code>{`{
  "id": "uuid",
  "balanceUsdc": "50000000",
  "status": "healthy",
  "dailyCapCents": 10000
}`}</code>
            </div>
          </div>
        </div>
      </section>

      <section id="topup" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Top Up</h2>
        <p className="text-sm text-zinc-500">
          Send USDC on-chain to the PaymentProcessor address first, then record
          the txnId here to credit the pool.
        </p>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/gas-pool/:apiKeyId/topup</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body flex flex-col gap-4">
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th></th></tr></thead>
              <tbody>
                <tr><td>amountUsdc</td><td className="!font-sans !text-zinc-600">string (integer)</td><td className="!font-sans"><span className="tag tag-required">required</span></td></tr>
                <tr><td>txnId</td><td className="!font-sans !text-zinc-600">string</td><td className="!font-sans"><span className="tag tag-required">required</span> — Algorand txn ID</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-patch">PATCH</span>
            <span className="endpoint-path">/gas-pool/:apiKeyId/settings</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body">
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th></th></tr></thead>
              <tbody>
                <tr><td>dailyCapCents</td><td className="!font-sans !text-zinc-600">integer</td><td className="!font-sans"><span className="tag tag-optional">optional</span></td></tr>
                <tr><td>alertThresholdUsdc</td><td className="!font-sans !text-zinc-600">string (integer)</td><td className="!font-sans"><span className="tag tag-optional">optional</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </article>
  );
}
