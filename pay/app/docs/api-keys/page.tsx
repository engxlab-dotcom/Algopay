export default function ApiKeysPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">API Keys</h1>
        <p className="text-zinc-600 leading-relaxed">
          API keys are issued per integration. Each gas pool is linked to one
          API key, which scopes the pool and all agents under it.
        </p>
      </header>

      <section id="register" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Register</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/keys/register</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body flex flex-col gap-4">
            <table className="param-table">
              <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
              <tbody>
                <tr><td>name</td><td className="!font-sans !text-zinc-600">string</td><td className="!font-sans"><span className="tag tag-required">required</span></td></tr>
              </tbody>
            </table>
            <div className="code-block text-xs">
              <code>{`{ "id": "uuid", "key": "ak_live_...", "name": "prod", "createdAt": "..." }`}</code>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">List</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/keys</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body">
            <div className="code-block text-xs">
              <code>{`[{ "id": "uuid", "name": "prod", "createdAt": "..." }, ...]`}</code>
            </div>
          </div>
        </div>
      </section>

      <section id="validate" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Validate</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/keys/validate</span>
            <span className="endpoint-desc">Pass key in Authorization header</span>
            <span className="auth-badge ml-auto">API Key</span>
          </div>
          <div className="endpoint-body">
            <div className="code-block text-xs">
              <code>{`{ "valid": true, "keyId": "uuid" }`}</code>
            </div>
          </div>
        </div>
      </section>

      <section id="revoke" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Revoke</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-delete">DELETE</span>
            <span className="endpoint-path">/keys/revoke</span>
            <span className="auth-badge ml-auto">API Key</span>
          </div>
          <div className="endpoint-body">
            <div className="code-block text-xs">
              <code>{`{ "success": true }`}</code>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
