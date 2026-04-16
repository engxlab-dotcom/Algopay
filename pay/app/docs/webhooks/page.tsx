export default function WebhooksPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Webhooks</h1>
        <p className="text-zinc-600 leading-relaxed">
          Algopay sends signed POST requests to your endpoint when key events
          occur. Each delivery includes an{" "}
          <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">X-Algopay-Signature</code>{" "}
          header for verification.
        </p>
      </header>

      <section id="register" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Register</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/webhooks</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body flex flex-col gap-4">
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th></th></tr></thead>
              <tbody>
                <tr><td>url</td><td className="!font-sans !text-zinc-600">string (url)</td><td className="!font-sans"><span className="tag tag-required">required</span></td></tr>
                <tr><td>events</td><td className="!font-sans !text-zinc-600">string[]</td><td className="!font-sans"><span className="tag tag-required">required</span> — at least one event</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/webhooks</span>
            <span className="endpoint-desc">List all registered webhooks</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-patch">PATCH</span>
            <span className="endpoint-path">/webhooks/:webhookId</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body">
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th></th></tr></thead>
              <tbody>
                <tr><td>url</td><td className="!font-sans !text-zinc-600">string</td><td className="!font-sans"><span className="tag tag-optional">optional</span></td></tr>
                <tr><td>events</td><td className="!font-sans !text-zinc-600">string[]</td><td className="!font-sans"><span className="tag tag-optional">optional</span></td></tr>
                <tr><td>active</td><td className="!font-sans !text-zinc-600">boolean</td><td className="!font-sans"><span className="tag tag-optional">optional</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-delete">DELETE</span>
            <span className="endpoint-path">/webhooks/:webhookId</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/webhooks/:webhookId/rotate-secret</span>
            <span className="endpoint-desc">Issue a new signing secret</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
        </div>
      </section>

      <section id="events" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Events</h2>
        <table className="param-table">
          <thead><tr><th>Event</th><th>Fired when</th></tr></thead>
          <tbody>
            {[
              ["payment_settled", "On-chain group confirmed"],
              ["payment_failed", "Submission failed or reverted"],
              ["pool_low", "Pool balance drops below alertThresholdUsdc"],
            ].map(([e, d]) => (
              <tr key={e}><td>{e}</td><td className="!font-sans !text-zinc-600">{d}</td></tr>
            ))}
          </tbody>
        </table>

        <div className="code-block text-xs">
          <code>{`// payment_settled payload
{
  "event": "payment_settled",
  "payment_id": "uuid",
  "invoice_id": "inv-001",
  "txn_id": "JYHEQ...",
  "amount_usdc": "1000000",
  "finality_ms": 4200,
  "gas_sponsored": true
}`}</code>
        </div>
      </section>

      <section id="deliveries" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Deliveries</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/webhooks/:webhookId/deliveries</span>
            <span className="endpoint-desc">Delivery history with status codes</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/webhooks/deliveries/:deliveryId/retry</span>
            <span className="endpoint-desc">Re-send a failed delivery</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Signature verification</h2>
        <div className="code-block text-xs">
          <code>{`import crypto from 'crypto'

function verify(secret, rawBody, signature) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  )
}`}</code>
        </div>
      </section>
    </article>
  );
}
