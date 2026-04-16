export default function AuthPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Authentication</h1>
        <p className="text-zinc-600 leading-relaxed">
          OAuth 2.0 via GitHub or Google. The callback exchanges the code for a
          JWT and a refresh token stored in an{" "}
          <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">HttpOnly</code>{" "}
          cookie.
        </p>
      </header>

      <section id="github" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">GitHub OAuth</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/auth/github</span>
            <span className="endpoint-desc">Redirect to GitHub consent screen</span>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/auth/github/callback</span>
            <span className="endpoint-desc">GitHub redirects here after consent</span>
          </div>
          <div className="endpoint-body">
            <p className="text-sm text-zinc-600 mb-3">Returns JWT and sets refresh cookie.</p>
            <div className="code-block text-xs">
              <code>{`{
  "token": "eyJhbG...",
  "user": { "id": "...", "email": "..." }
}`}</code>
            </div>
          </div>
        </div>
      </section>

      <section id="google" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Google OAuth</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/auth/google</span>
            <span className="endpoint-desc">Redirect to Google consent screen</span>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/auth/google/callback</span>
            <span className="endpoint-desc">Google redirects here after consent</span>
          </div>
        </div>
      </section>

      <section id="refresh" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Token management</h2>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/auth/refresh</span>
            <span className="endpoint-desc">Exchange refresh token for new JWT</span>
          </div>
          <div className="endpoint-body">
            <p className="text-sm text-zinc-500 mb-2">Reads refresh token from cookie automatically.</p>
            <div className="code-block text-xs">
              <code>{`{ "token": "eyJhbG..." }`}</code>
            </div>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-post">POST</span>
            <span className="endpoint-path">/auth/logout</span>
            <span className="endpoint-desc">Clear refresh cookie</span>
          </div>
        </div>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method method-get">GET</span>
            <span className="endpoint-path">/auth/me</span>
            <span className="endpoint-desc">Return current user</span>
            <span className="auth-badge ml-auto">JWT</span>
          </div>
          <div className="endpoint-body">
            <div className="code-block text-xs">
              <code>{`{ "id": "uuid", "email": "you@example.com", "provider": "github" }`}</code>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
