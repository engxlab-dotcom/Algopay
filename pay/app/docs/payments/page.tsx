export default function PaymentsPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Payments</h1>
        <p className="text-zinc-600 leading-relaxed">
          Payments are two-step: <strong>initiate</strong> records the intent
          in the database, <strong>process</strong> submits the atomic group to
          Algorand and waits for confirmation. The two-step design lets you
          decouple validation from on-chain submission.
        </p>
      </header>

      <section id="initiate" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Initiate</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/payments</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body flex flex-col gap-4">
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th></th></tr></thead>
              <tbody>
                <tr><td>invoiceId</td><td className="!font-sans !text-zinc-600">string</td><td className="!font-sans"><span className="tag tag-required">required</span> — unique per payment</td></tr>
                <tr><td>agentId</td><td className="!font-sans !text-zinc-600">string (uuid)</td><td className="!font-sans"><span className="tag tag-required">required</span></td></tr>
                <tr><td>poolId</td><td className="!font-sans !text-zinc-600">string (uuid)</td><td className="!font-sans"><span className="tag tag-required">required</span></td></tr>
                <tr><td>merchantId</td><td className="!font-sans !text-zinc-600">string</td><td className="!font-sans"><span className="tag tag-required">required</span> — registered in MerchantRegistry</td></tr>
                <tr><td>amountUsdCents</td><td className="!font-sans !text-zinc-600">integer</td><td className="!font-sans"><span className="tag tag-required">required</span> — e.g. 100 = $1.00</td></tr>
                <tr><td>network</td><td className="!font-sans !text-zinc-600">"mainnet" | "testnet"</td><td className="!font-sans"><span className="tag tag-optional">optional</span> — default: testnet</td></tr>
              </tbody>
            </table>
            <div className="code-block text-xs">
              <code>{`// 201 Created
{
  "id": "uuid",
  "invoiceId": "inv-001",
  "status": "pending",
  "amountUsdCents": 100,
  "network": "testnet",
  "gasSponsored": true
}`}</code>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Process</h2>
        <p className="text-sm text-zinc-500">
          Submits the 3-transaction atomic group to Algorand. Blocks until
          confirmed (≈4 seconds on testnet). On success, status becomes{" "}
          <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">settled</code>{" "}
          and the configured webhook fires.
        </p>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/payments/:paymentId/process</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body">
            <div className="code-block text-xs">
              <code>{`{
  "id": "uuid",
  "status": "settled",
  "algoTxnId": "JYHEQ...",
  "blockRound": 62111040,
  "confirmedAt": "2026-04-05T03:54:38Z",
  "gasFeeAlgo": "0.005",
  "gasSponsored": true
}`}</code>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          <strong>Gas sponsorship:</strong> The LogicSig account pays all 5 transaction fees (5000 microALGO). The paying agent's ALGO balance is never touched.
        </div>
      </section>

      <section id="query" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Query</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/payments/:paymentId</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/payments/invoice/:invoiceId</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/payments</span>
            <span className="endpoint-desc">All payments for authenticated user</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body">
            <table className="param-table">
              <thead><tr><th>Query param</th><th>Values</th></tr></thead>
              <tbody>
                <tr><td>status</td><td className="!font-sans !text-zinc-600">pending · processing · settled · failed</td></tr>
                <tr><td>limit</td><td className="!font-sans !text-zinc-600">default 20</td></tr>
                <tr><td>offset</td><td className="!font-sans !text-zinc-600">default 0</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/payments/agent/:agentId</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Payment statuses</h2>
        <table className="param-table">
          <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
          <tbody>
            {[
              ["pending", "Created, awaiting process call"],
              ["processing", "On-chain submission in progress"],
              ["settled", "Confirmed on Algorand"],
              ["failed", "Submission failed — see timeline for reason"],
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
